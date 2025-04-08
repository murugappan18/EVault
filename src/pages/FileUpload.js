import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { pinFileToIPFS } from "../pinata_config";
import Navbar from "../components/Navbar";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import FileUploader from "../components/FileUploader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileUpload = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [txHash, setTxHash] = useState("");

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI);

  const toastCall = (type, message) => {
    type === "success"
      ? toast.success(message, {
          position: "top-center",
        })
      : toast.error(message, {
          position: "bottom-center",
        });
  };

  const deriveKeyFromEmail = async (email, salt) => {
    const encoder = new TextEncoder();

    // 1. Create base key from email
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(email),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    // 2. Derive 256-bit raw key
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      256 // bits
    );

    // Log the key for debug (hex)
    // const rawKey = await crypto.subtle.exportKey("raw", derivedBits);
    // const keyArray = new Uint8Array(rawKey);
    // const keyHex = [...keyArray].map(b => b.toString(16).padStart(2, "0")).join("");

    // 3. Import as AES-GCM usable key
    return await crypto.subtle.importKey(
      "raw",
      derivedBits,
      { name: "AES-GCM" },
      false, // ← this is not allowed if you want to export key then change to true
      ["encrypt", "decrypt"]
    );
  };

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000; // 32K chunks to prevent stack overflow

    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(
        null,
        bytes.subarray(i, i + chunkSize)
      );
    }

    return btoa(binary);
  }

  const encryptFile = async (file, email) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const saltString = JSON.parse(
      localStorage.getItem(`userProfile-${user.uid}`)
    ).salt;
    const salt = Uint8Array.from(atob(saltString), (c) => c.charCodeAt(0));
    const cryptoKey = await deriveKeyFromEmail(email, salt);
    const fileBuffer = await file.arrayBuffer();

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      fileBuffer
    );

    const encryptedBase64 = arrayBufferToBase64(encrypted);
    const encryptedBlob = new Blob([encryptedBase64], { type: "text/plain" });

    return { encryptedBlob, iv };
  };

  const handleSubmission = async () => {
    try {
      if (!selectedFile) {
        toastCall("error", "No file selected!");
        return;
      }

      // 🔐 Encrypt the file
      const { encryptedBlob, iv } = await encryptFile(selectedFile, user.email);

      const response = await pinFileToIPFS(encryptedBlob);
      const cid = response.data["cid"];

      if (
        response.data["is_duplicate"] &&
        response.data["is_duplicate"] === true
      ) {
        toastCall("error", "File already Uploaded to IPFS!");
        setIpfsHash(cid);
        setTimeout(() => {
          setIpfsHash(null);
        }, 3000);
        return;
      }

      if (response && cid) {
        toastCall("success", "File is Stored to IPFS Successfully!");
        setIpfsHash(cid);

        await storeHashOnBlockchain(cid, iv);
      } else {
        toastCall("error", "Failed to get IPFS Hash from Pinata response");
      }
    } catch (error) {
      toastCall("error", `File upload failed: ${error}`);
    }
  };

  const storeHashOnBlockchain = async (hash, iv) => {
    try {
      if (!window.ethereum) {
        toastCall("error", "MetaMask is not installed!");
        return;
      }

      // Connect to Ethereum provider (MetaMask)
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access
      const signer = await provider.getSigner();

      // Create a contract instance
      const contract = new Contract(contractAddress, contractABI, signer);

      // Send the transaction to store the IPFS hash on the blockchain
      const tx = await contract.setIPFSHash(hash);

      toastCall("success", "CID Stored to Blockchain Successfully!");

      if (user && selectedFile && tx.hash) {
        await addDoc(collection(db, "Users", user.uid, "files"), {
          filename: selectedFile.name || "Untitiled File",
          filetype:
            selectedFile.name.split(".").pop() ||
            selectedFile.type.split("/").pop() ||
            "Unknown",
          filesize: selectedFile.size || "Unkwown",
          txhash: tx.hash,
          iv: btoa(String.fromCharCode(...iv)),
          uploadedAt: new Date(),
        });
      } else {
        throw new Error("Error in Storing Data to Firebase");
      }

      setTxHash(tx.hash);

      await tx.wait();
    } catch (error) {
      if (
        error.message.includes(
          "MetaMask Tx Signature: User denied transaction signature."
        )
      ) {
        toastCall("error", "Transaction rejected by user!");
      } else {
        toastCall("error", `Failed: ${error.message}`);
      }
    } finally {
      setTimeout(() => {
        setTxHash(null);
        setIpfsHash(null);
      }, 3000);
    }
  };

  return (
    <>
      <Navbar user={user} />
      <ToastContainer />
      <div className="app-container">
        <div className="upload-section">
          <label className="form-label">Choose File</label>
          <FileUploader setFile={setSelectedFile} />
          <button onClick={handleSubmission} className="submit-button">
            Submit
          </button>
          {ipfsHash && (
            <div className="result-section">
              <p>
                <strong>IPFS Hash:</strong> {ipfsHash}
              </p>
            </div>
          )}
          {txHash && (
            <div className="result-section">
              <p>
                <strong>TX Hash:</strong> {txHash}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUpload;

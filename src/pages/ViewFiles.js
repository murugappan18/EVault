import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { BrowserProvider, Interface } from "ethers";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI);

const ViewFiles = ({ user }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [decryptLoading, setDecryptLoading] = useState(false);

  const retrieveCidFromTxHash = useCallback(async (txHash) => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask is not installed!");
        return "";
      }
      const provider = new BrowserProvider(window.ethereum);
      const tx = await provider.getTransaction(txHash);
      if (!tx) {
        toast.error("Transaction Not Found!");
        return "";
      }
      const iface = new Interface(contractABI);
      const decoded = iface.decodeFunctionData("setIPFSHash", tx.data);
      return decoded[0];
    } catch (error) {
      toast.error(`Failed to Retrieve CID: ${error}`);
      return "";
    }
  }, []);

  // Helper: Derive AES-GCM key from user's email
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

    // Log key for debug (hex)
    // const keyArray = new Uint8Array(derivedBits);
    // const keyHex = [...keyArray].map((b) => b.toString(16).padStart(2, "0")).join("");
    // console.log("Derived Key when decryption (Hex):", keyHex);

    // 3. Import as AES-GCM usable key
    return await crypto.subtle.importKey(
      "raw",
      derivedBits,
      { name: "AES-GCM" },
      false, // ← this is not allowed if you want to export key then change to true
      ["encrypt", "decrypt"]
    );
  };

  // Helper: Decrypt the encrypted file
  const decryptFile = async (encryptedBuffer, key, iv) => {
    try {
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        encryptedBuffer
      );

      return decrypted;
  }
  catch(err) {
    console.error("Inside decrypt file function: ", err);
  }
  };

  // Helper: Trigger file download
  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const fetchFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const userFilesRef = collection(db, "Users", user.uid, "files");
      const snapshot = await getDocs(userFilesRef);
      let filesData = [];
      for (let doc of snapshot.docs) {
        let file = doc.data();
        const cid = await retrieveCidFromTxHash(file.txhash);
        filesData.push({ ...file, cid });
      }
      setFiles(filesData);
    } catch (error) {
      toast.error("Failed to load files!");
    } finally {
      setIsLoading(false);
    }
  }, [user, retrieveCidFromTxHash]);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user, fetchFiles]);

  const downloadFile = async (file) => {
    try {
      setDecryptLoading(true);
      const response = await fetch(
        `https://maroon-written-snake-594.mypinata.cloud/ipfs/${file.cid}`
      );
      const encryptedText = await response.text();
      const encryptedBuffer = base64ToArrayBuffer(encryptedText);
      const iv = Uint8Array.from(atob(file.iv), (c) => c.charCodeAt(0));
      const saltString = JSON.parse(
        localStorage.getItem(`userProfile-${user.uid}`)
      ).salt;
      const salt = Uint8Array.from(atob(saltString), (c) => c.charCodeAt(0));

      const key = await deriveKeyFromEmail(user.email, salt); // derives key from email

      const decryptedData = await decryptFile(encryptedBuffer, key, iv);

      const blob = new Blob([decryptedData], {
        type: "application/octet-stream",
      });

      setDecryptLoading(false);

      downloadBlob(blob, file.filename);
    } catch (error) {
      toast.error("Decryption or download failed!");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar user={user} />
      <ToastContainer />
      <div className="viewfiles-container">
        <h2 className="viewfiles-title">Your Uploaded Files</h2>
        {isLoading ? (
          <Loader />
        ) : files.length === 0 ? (
          <h4 className="viewfiles-no-files">No files found!</h4>
        ) : (
          <div className="viewfiles-grid">
            {files.map((file, index) => (
              <div key={index} className="viewfiles-card">
                <p className="viewfiles-filename">{file.filename}</p>
                <p className="viewfiles-filesize">
                  Size: {file.filesize} bytes
                </p>
                <p className="viewfiles-filetype">Type: {file.filetype}</p>
                <p className="viewfiles-uploaded-at">
                  Uploaded At: {file.uploadedAt.toDate().toLocaleString()}
                </p>
                {file.cid ? (
                  <button
                    className="viewfiles-link"
                    onClick={() => downloadFile(file)}
                  >
                    Download File
                  </button>
                ) : (
                  <p className="viewfiles-error">Files not found!</p>
                )}
                {
                  decryptLoading && (
                    <p>File Decrypting...</p>
                  )
                }
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewFiles;
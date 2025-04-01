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
    type==="success" ?
    toast.success(message, {
      position: "top-center",
    }) :
    toast.error(message, {
      position: "bottom-center",
    });
  };

  const handleSubmission = async () => {
    try {
      if (!selectedFile) {
        toastCall("error", "No file selected!");
        return;
      }

      const response = await pinFileToIPFS(selectedFile);
      const cid = response.data["cid"];
      
      if(response.data["is_duplicate"] && response.data["is_duplicate"] === true) {
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

        await storeHashOnBlockchain(cid);
      } 
      else {
        toastCall("error", "Failed to get IPFS Hash from Pinata response");
      }
    } 
    catch (error) {
      toastCall("error", `File upload failed: ${error}`);
    }
  };

  const storeHashOnBlockchain = async (hash) => {
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
          filename: selectedFile.name || "Unkwown",
          filetype: selectedFile.name.split('.').pop() || selectedFile.type.split('/').pop() || "Unknown",
          filesize: selectedFile.size || "Unkwown",
          txhash: tx.hash,
          uploadedAt: new Date()
        });
      }
      else {
        throw new Error("Error in Storing Data to Firebase");
      }

      setTxHash(tx.hash);

      await tx.wait();
    } 
    catch (error) {
      if (error.message.includes("MetaMask Tx Signature: User denied transaction signature.")) {
        toastCall("error", "Transaction rejected by user!");
      }
      else {
        toastCall("error", `Failed: ${error.message}`);
      }
    }
    finally {
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
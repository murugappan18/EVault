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

  const retrieveCidFromTxHash = useCallback( async (txHash) => {
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
    } 
    catch (error) {
      toast.error(`Failed to Retrieve CID: ${error}`);
      return "";
    }
  }, []);

  const fetchFiles = useCallback( async () => {
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
    } 
    catch (error) {
      toast.error("Failed to load files!");
    } 
    finally {
      setIsLoading(false);
    }
  }, [user, retrieveCidFromTxHash]);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user, fetchFiles]);

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
                  <a
                    href={`https://maroon-written-snake-594.mypinata.cloud/ipfs/${file.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="viewfiles-link"
                  >
                    View File
                  </a>
                ) : (
                  <p className="viewfiles-error">Files not found!</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewFiles;
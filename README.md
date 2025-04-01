# EVault - Decentralized File Storage

EVault is a decentralized file storage application that leverages blockchain technology to securely store and manage files. The application uses a combination of **Ethereum blockchain**, **IPFS (Pinata)**, **Firebase**, and **local blockchain environments (Ganache and Remix)** for seamless decentralized file management.

## Prerequisites
Before running this project, ensure you have the following installed on your system:

- **Node.js and npm** (for running the React frontend)
- **MetaMask** (for Ethereum wallet integration)
- **Remix IDE** (for deploying smart contracts)
- **Ganache** (for a local blockchain environment)
- **Firebase** (for user authentication and file transaction storage)
- **Pinata IPFS** (for decentralized file storage)

## Setting Up the Local Blockchain Environment

1. **Ganache Setup:**
   - Download and install Ganache from the official website.
   - Create a new workspace and start it.
   - Copy one of the **private keys** from Ganache and import it into MetaMask to receive 100 ETH for testing.

2. **Remix IDE:**
   - Visit [Remix IDE](https://remix.ethereum.org/).
   - Connect MetaMask to Remix IDE.
   - Upload the `EVault.sol` file to Remix.
   - Compile the Solidity code.
   - Deploy the smart contract using MetaMask with the Ganache local network.
   - After deployment, copy the **Contract Address** and **ABI** from Remix.
   - Store the contract address and abi in the `.env` file as:
   ```env
   REACT_APP_CONTRACT_ADDRESS = your_contract_address
   REACT_APP_CONTRACT_ABI = your_contract_abi
   ```

## Setting Up Pinata IPFS

1. Go to [Pinata](https://pinata.cloud/) and create an account.
2. Get your **JWT Token** from the API settings.
3. Store the JWT token in the `.env` file as:
   ```env
   REACT_APP_PINATA_JWT=your_jwt_token
   ```

## Setting Up Firebase

1. Create a new project on [Firebase](https://firebase.google.com/).
2. Set up **Authentication** and **Firestore Database**.
3. Get the **Firebase configuration** and update the `.env` file as follows:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

## Cloning and Running the Project

1. Clone the repository from GitHub:
   ```bash
   git clone https://github.com/murugappan18/EVault.git
   cd EVault
   ```

2. Install the required packages:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Accessing the Application

- Open your browser and go to `http://localhost:3000`.
- Register or log in to the application.
- Upload files to the decentralized storage and view their transaction details.

## Demonstration

A demo video of the application interface is available in the repository to help you understand the flow and functionality.
[Watch Demo Video](https://drive.google.com/file/d/1PUoD5Qs__7HTUjOp6uR5i3otZ5VspFn-/view)

## Note

Due to the use of a local blockchain environment (Ganache), the application cannot be deployed to a public server. You need to run it locally following the above steps.
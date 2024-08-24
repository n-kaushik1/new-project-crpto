"use client";  // This line tells Next.js that this is a Client Component
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState(null);
  const [showFullAddress, setShowFullAddress] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install it to connect your wallet.');
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Instantiate provider with Infura
        const provider = new ethers.InfuraProvider('homestead', process.env.NEXT_PUBLIC_INFURA_PROJECT_ID);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);

        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance));
      } else {
        setError('MetaMask is not detected. Please ensure it is installed and enabled.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
    }
  };

  // Function to truncate the wallet address
  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to toggle the display of the full address
  const toggleAddress = () => {
    setShowFullAddress(!showFullAddress);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-extrabold mb-8 tracking-tight text-center">
        Connect to Your Wallet
      </h1>
      <button
        onClick={connectWallet}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        Connect Wallet
      </button>
      {walletAddress && (
        <div className="mt-12 p-6 bg-gray-800 rounded-2xl shadow-xl text-center transition-opacity duration-300 ease-in-out">
          <div className="text-xl font-medium mb-4 flex items-center justify-center">
            <span className="mr-2">🔑</span>
            <span>Wallet Address:</span>
            <span className="ml-2">
              {showFullAddress ? walletAddress : truncateAddress(walletAddress)}
            </span>
            <button
              onClick={toggleAddress}
              className="ml-4 text-blue-400 hover:text-blue-600 text-sm underline"
            >
              {showFullAddress ? 'Hide' : 'Show Full Address'}
            </button>
          </div>
          <hr></hr><br></br>
          <div className="text-xl font-medium flex items-center justify-center">
            <span className="mr-2">💰</span>
            <span>Balance:</span>
            <span className="ml-2">{balance === '0' ? '0 ETH' : balance} ETH</span>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-12 p-4 bg-red-800 rounded-lg shadow-md text-center">
          <p className="text-lg">Error: {error}</p>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';


const Account = () => {
    const history = useHistory();
    if (!localStorage.getItem('auth_token')) {
        history.push('/login');
        swal("Warning", "Login to Access Cart Page", "error");
    }
    const [provider, setProvider] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [network, setNetwork] = useState(null);
    const [balance, setBalance] = useState('');
    const [isConnected, setIsConnected] = useState(false); // State untuk mengontrol status koneksi

    useEffect(() => {
        // Load previous connection status from local storage on component mount
        const storedIsConnected = localStorage.getItem('isConnected');
        if (storedIsConnected === 'true') {
            setIsConnected(true);
            connectToMetaMask(); // Automatically connect to MetaMask if previously connected
        }
    }, []);

    useEffect(() => {
        if (provider && accounts.length > 0 && network) {
            // Get account balance
            provider.getBalance(accounts[0]).then(balance => {
                setBalance(ethers.utils.formatEther(balance));
            });
        }
    }, [provider, accounts, network]);

    const connectToMetaMask = () => {
        if (window.ethereum) {
            window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then(accounts => {
                    setAccounts(accounts);
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    setProvider(provider);

                    provider.getNetwork().then(network => {
                        setNetwork(network);
                    });

                    setIsConnected(true); // Update state and store in local storage
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            console.error("Please install MetaMask to use this dApp.");
        }
    };

    const handleConnectToMetaMask = () => {
        // Check if MetaMask is installed
        if (window.ethereum) {
            // Request access to the user's MetaMask account
            window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then(accounts => {
                    setAccounts(accounts);

                    // Set up provider and configure Binance Smart Chain Testnet
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    setProvider(provider);

                    // Get network information
                    provider.getNetwork().then(network => {
                        setNetwork(network);
                    });

                    // Set the status of the connection
                    setIsConnected(true);
                    localStorage.setItem('isConnected', 'true');
                    localStorage.setItem('address', accounts[0]);

                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            console.error("Please install MetaMask to use this dApp.");
        }
    };

    const [destinationAddress, setDestinationAddress] = useState('');
    const [amountToSend, setAmountToSend] = useState('');

    const handleDestinationAddressChange = (event) => {
        setDestinationAddress(event.target.value);
    };

    const handleAmountChange = (event) => {
        setAmountToSend(event.target.value);
    };

    const handleSendBNB = () => {
        // Convert amount from BNB to wei
        const amountInWei = ethers.utils.parseEther(amountToSend);

        // Send BNB to destination address
        provider.getSigner().sendTransaction({
            to: destinationAddress,
            value: amountInWei,
        })
            .then((transaction) => {
                console.log('Transaction sent:', transaction);
                // You can display a success message to the user here
            })
            .catch((error) => {
                console.error('Error sending transaction:', error);
                // You can display an error message to the user here
            });
    };

    return (
        <div>
            {!isConnected ? (
                <button onClick={handleConnectToMetaMask}>Connect to MetaMask</button>
            ) : network && ( // Tambahkan pengecekan jika network tidak null
                <div>
                    <p>Connected to Metamask!</p>
                    <p>Account: {accounts[0]}</p>
                    <p>Network: {network.name}</p> {/* pastikan network tidak null */}
                    <p>Balance: {balance} BNB</p>
                    <div>
                        <h3>Send BNB</h3>
                        <input
                            type="text"
                            value={destinationAddress}
                            onChange={handleDestinationAddressChange}
                            placeholder="Destination Address"
                        />
                        <input
                            type="text"
                            value={amountToSend}
                            onChange={handleAmountChange}
                            placeholder="Amount (BNB)"
                        />
                        <button onClick={handleSendBNB}>Send BNB</button>
                    </div>
                </div>
            )}
        </div>);
};

export default Account;

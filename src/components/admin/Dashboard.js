import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function Dashboard() {
    const privateKey = '55423735bfb86342aa0d6e78ae197693a7cd34df550017c298312252f3e7f098'; // Penting
    const [balance, setBalance] = useState(null);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amountToSend, setAmountToSend] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        // Fungsi untuk mendapatkan saldo BNB menggunakan private key
        const getBnbBalance = async () => {
            try {
                // Inisialisasi sebuah provider untuk Binance Smart Chain testnet
                const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-2-s1.binance.org:8545');

                // Mendapatkan wallet dari private key
                const wallet = new ethers.Wallet(privateKey, provider);

                // Mendapatkan saldo BNB menggunakan alamat akun
                const balance = await provider.getBalance(wallet.address);

                // Konversi saldo dari BigNumber ke Ether
                const balanceBnb = ethers.utils.formatEther(balance);

                // Mendapatkan alamat akun
                setAddress(wallet.address);

                setBalance(balanceBnb);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        getBnbBalance();
    }, []);

    const handleSendBnb = async () => {
        try {
            // Inisialisasi sebuah provider untuk Binance Smart Chain testnet
            const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-2-s1.binance.org:8545');

            // Mendapatkan wallet dari private key
            const wallet = new ethers.Wallet(privateKey, provider);

            // Mengirim BNB ke alamat penerima
            const transaction = await wallet.sendTransaction({
                to: recipientAddress,
                value: ethers.utils.parseEther(amountToSend),
            });

            // Menunggu konfirmasi transaksi dan mendapatkan hash transaksi
            const receipt = await transaction.wait();
            setTransactionHash(receipt.transactionHash);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Saldo BNB Testnet</h1>
            {balance !== null ? (
                <>
                    <p>Alamat Akun: {address}</p>
                    <p>Saldo BNB: {balance} BNB</p>
                    <div>
                        <h2>Kirim BNB</h2>
                        <input
                            type="text"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            placeholder="Alamat Penerima"
                        />
                        <input
                            type="text"
                            value={amountToSend}
                            onChange={(e) => setAmountToSend(e.target.value)}
                            placeholder="Jumlah BNB"
                        />
                        <button onClick={handleSendBnb}>Kirim</button>
                        {transactionHash && <p>Transaksi berhasil! Hash Transaksi: {transactionHash}</p>}
                    </div>
                </>
            ) : (
                <p>Tunggu, sedang memuat saldo...</p>
            )}
        </div>
    );
};

export default Dashboard;

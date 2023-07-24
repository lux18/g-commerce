import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import numeral from "numeral";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import bnblogo from '../../assets/frontend/img/bnblogo.png';
import { ethers } from 'ethers';
import LoadingTx from "./loadingTx/LoadingTx";


function Checkout() {
    const [isTransactionPending, setTransactionPending] = useState(false);
    const [provider, setProvider] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [network, setNetwork] = useState(null);
    const [isConnected, setIsConnected] = useState(false); // State untuk mengontrol status koneksi

    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [loadingtx, setLoadingTx] = useState(false);
    const [cart, setCart] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [bnbToUsdtRate, setBnbToUsdtRate] = useState(0);
    const [error, setError] = useState([]);
    const [checkoutInput, setCheckoutInput] = useState({
        name: '',
        phone: '',
        email: '',
        country: '',
        full_address: '',
        city: '',

    });

    const [balance, setBalance] = useState(null);
    const testnetAddress = localStorage.getItem('address');
    const apiUrl = `https://api-testnet.bscscan.com/api?module=account&action=balance&address=${testnetAddress}&tag=latest`;
    const apiUrlBnbToUsdt = "https://data.binance.com/api/v3/ticker/price?symbols=%5B%22BNBUSDT%22%5D";

    if (!localStorage.getItem('auth_token')) {
        history.push('/login');
        swal("Warning", "Login to Access Cart Page", "error");
    }

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

    useEffect(() => {
        fetchBalance();
        fetchBnbToUsdtRate();

    }, []);

    const fetchBalance = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === "1") {
                // Mengkonversi nilai balance dari wei ke BNB
                const balanceInBnb = parseInt(data.result) / 10 ** 18;
                setBalance(balanceInBnb);
            } else {
                console.log("Gagal mendapatkan saldo BNB");
            }
        } catch (error) {
            console.error("Terjadi kesalahan dalam mengambil data:", error);
        }
    };

    const fetchBnbToUsdtRate = async () => {
        try {
            const response = await fetch(apiUrlBnbToUsdt);
            const data = await response.json();
            setBnbToUsdtRate(parseFloat(data[0].price));
        } catch (error) {
            console.error("Terjadi kesalahan dalam mengambil data:", error);
        }
    };

    const bnbtoidr = () => {
        if (balance !== null) {
            return balance * bnbToUsdtRate * 15000;
        }
        return 0;
    };

    const idrtobnbm = grandTotal / 15000 / bnbToUsdtRate;
    const idrtobnb = idrtobnbm.toFixed(4);


    useEffect(() => {

        let isMounted = true;
        axios.get(`/api/cart`).then(res => {
            if (isMounted) {
                if (res.data.status === 200) {
                    setCart(res.data.cart);
                    setLoading(false);

                }
                else if (res.data.status === 401) {
                    history.push('/');
                    swal("Warning", res.data.message, "error")
                }
            }

        });

        return () => {
            isMounted = false
        };

    }, [history]);

    useEffect(() => {
        const total = calculateTotalCartPrice(cart);
        setGrandTotal(total);
    }, [cart]);

    const calculateTotalCartPrice = (cart) => {
        let total = 0;
        cart.forEach(item => {
            total += item.product.selling_price * item.product_qyt;
        });
        return total;
    };


    const handleInput = (e) => {
        e.persist();
        setCheckoutInput({ ...checkoutInput, [e.target.name]: e.target.value });
    }
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



    const submitOrder = async (e) => {
        e.preventDefault();
        const data = {
            name: checkoutInput.name,
            phone: checkoutInput.phone,
            email: checkoutInput.email,
            country: checkoutInput.country,
            full_address: checkoutInput.full_address,
            city: checkoutInput.city,
        }

        // Hitung total biaya pesanan dalam IDR
        const totalOrderInIdr = grandTotal;

        // Konversi total biaya pesanan dari IDR ke BNB menggunakan kurs saat ini
        const totalOrderInBnb = (totalOrderInIdr / 15000 / bnbToUsdtRate).toString();


        if (balance !== null && balance >= parseFloat(totalOrderInBnb)) {
            try {
                // Set isLoading ke true saat permintaan API sedang berlangsung
                setLoading(true);
                // Kirim transaksi BNB ke alamat tujuan
                const amountInWei = ethers.utils.parseEther(totalOrderInBnb);
                const transaction = await provider.getSigner().sendTransaction({
                    to: '0xA5e45C5645a8015c8b19Cfc14017C591be8942b7',
                    value: amountInWei,
                });

                console.log('Transaction sent:', transaction);
                // Tampilkan pesan sukses atau lakukan tindakan lain jika transaksi berhasil



                // Kirim permintaan untuk menambahkan pesanan
                const orderResponse = await axios.post('/api/place-order', data);

                if (orderResponse.data.status === 200) {
                    // Jika permintaan API berhasil, lakukan tindakan lain seperti pindah ke halaman lain atau menampilkan pesan sukses
                    swal("Order Placed Successfully", orderResponse.data.message, "success");
                    setError([]);
                    history.push('/thankyou');
                } else if (orderResponse.data.status === 422) {
                    swal("All Field are Mandatory", "", "error");
                    setError(orderResponse.data.errors);
                }
            } catch (error) {
                console.error('Error sending transaction:', error);
                swal("Transaction Failed", "An error occurred while sending the transaction.", "error");
            } finally {
                setLoading(false); // Transaksi selesai, set isLoading kembali ke false
            }
        } else {
            swal("Insufficient Balance", "", "error");
        }
    };

    const formattedBalance = balance !== null ? parseFloat(balance).toFixed(4) : null;

    if (loading) {
        return <h4>Loading</h4>
    }

    var checkout_HTML = '';
    if (cart.length > 0) {
        checkout_HTML =
            <div>
                <div className="card cardCheckout px-3 py-2 mb-3">
                    <span className="d-flex align-items-center">
                        <img className="me-3" src={bnblogo} style={{ width: '40px' }} />
                        <div>
                            <p style={{ fontSize: '14px' }}>Balance</p>
                            {balance !== null ? (
                                <p className="d-flex" style={{ fontWeight: '600' }}>{formattedBalance}<p className="ms-1">BNB</p><p className="ms-1">/ {numeral(bnbtoidr()).format('0,0')} IDR</p></p>
                            ) : (
                                <p>Mengambil saldo...</p>
                            )} </div>
                    </span>
                </div>

                <div className="row">
                    <div className="col-md-6 my-2">
                        <div className="boxCheckout">
                            {cart.map((item, idx) => {
                                return (
                                    <div key={idx} className="card cardCheckout px-3 py-2 mb-3">
                                        <div className="d-flex align-items-end">
                                            <img src={`http://localhost:8000/${item.product.image}`} style={{ width: '60px', height: '60px' }} />
                                            <div className="ms-3" style={{ width: '100%' }} >
                                                <p style={{ fontWeight: '500' }} className="px-1 mb-1 mt-2">{item.product.name}</p>
                                                <div className="mb-0 table table-borderless"  >
                                                    <thead >
                                                        <tr>
                                                            <th style={{ width: '120px', fontSize: '10px', opacity: '70%', backgroundColor: '#fccecd' }} className="p-1 px-2 ">Price</th>
                                                            <th style={{ width: '50px', fontSize: '10px', opacity: '70%', backgroundColor: '#fccecd' }} className="text-center p-1 px-2">Qyt</th>
                                                            <th style={{ width: '140px', fontSize: '10px', opacity: '70%', backgroundColor: '#fccecd' }} className="p-1 px-2 ">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ fontSize: '10px', backgroundColor: '#fccecd' }} className="p-1 px-2 ">Rp {numeral(item.product.selling_price).format('0,0')}</td>
                                                            <td style={{ fontSize: '10px', backgroundColor: '#fccecd' }} className="text-center p-1 px-2">{item.product_qyt}</td>
                                                            <td style={{ fontSize: '10px', backgroundColor: '#fccecd', fontWeight: '500' }} className="p-1 px-2">Rp {numeral(item.product.selling_price * item.product_qyt).format('0,0')}</td>
                                                        </tr>
                                                    </tbody>
                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                )
                            })}


                        </div>
                        <div className="card cardCheckout p-3 ">
                            <span className="d-flex">
                                <p style={{ fontSize: '18px', fontWeight: '500' }}>Grand Total</p>
                                <div className="d-block ms-auto">
                                    <p style={{ fontSize: '18px', fontWeight: '500', float: 'right' }}> {numeral(grandTotal).format('0,0')} IDR</p><br />
                                    <p className="mt-1" style={{ fontSize: '18px', fontWeight: '500', float: 'right' }}> {idrtobnb} BNB</p>

                                </div>
                            </span>
                        </div>
                        <br />
                    </div>
                    <div className="col-md-6  my-2">
                        <div className="card cardCheckout p-3">
                            <div className="row">
                                <div className="col-sm-6 my-2">
                                    <div className="form-group">
                                        <label className="labelCheckout">Recipient Name</label>
                                        <input style={{ fontSize: '14px' }} type="text" name="name" onChange={handleInput} value={checkoutInput.name} className="form-control" />
                                        <small className="text-danger">{error.name}</small>
                                    </div>
                                </div>
                                <div className="col-sm-6 my-2">
                                    <div className="form-group">
                                        <label className="labelCheckout">Phone Number</label>
                                        <input style={{ fontSize: '14px' }} type="text" name="phone" onChange={handleInput} value={checkoutInput.phone} className="form-control" />
                                        <small className="text-danger">{error.phone}</small>

                                    </div>
                                </div>

                                <div className="col-sm-6 my-2">
                                    <div className="form-group">
                                        <label className="labelCheckout">Email Address</label>
                                        <input style={{ fontSize: '14px' }} type="text" name="email" onChange={handleInput} value={checkoutInput.email} className="form-control" />
                                        <small className="text-danger">{error.email}</small>

                                    </div>
                                </div>
                                <div className="col-sm-6 my-2">
                                    <div className="form-group">
                                        <label className="labelCheckout">Country</label>
                                        <input style={{ fontSize: '14px' }} type="text" name="country" onChange={handleInput} value={checkoutInput.country} className="form-control" />
                                        <small className="text-danger">{error.country}</small>

                                    </div>
                                </div>

                                <div className="col-sm-6 my-2">
                                    <div className="form-group">
                                        <label className="labelCheckout">Full Address</label>
                                        <textarea style={{ fontSize: '14px' }} type="text" name="full_address" onChange={handleInput} value={checkoutInput.full_address} className="form-control" />
                                        <small className="text-danger">{error.full_address}</small>

                                    </div>
                                </div>
                                <div className="col-sm-6 my-2">
                                    <div className="form-group">
                                        <label className="labelCheckout">City</label>
                                        <input style={{ fontSize: '14px' }} type="text" name="city" onChange={handleInput} value={checkoutInput.city} className="form-control" />
                                        <small className="text-danger">{error.city}</small>

                                    </div>
                                </div>

                            </div>
                            <br />
                            <button
                                type="button"
                                onClick={submitOrder}
                                className="btn btn-sm btn-primary"
                                disabled={isTransactionPending}>Continue
                            </button>

                        </div>

                    </div>
                </div>

            </div>
    } else {
        checkout_HTML =
            <div>
                <h4>Shopping Cart is Empty</h4>
            </div>

    }

    return (
        <div className="container">
            <br />
            {loadingtx ? (
                <LoadingTx /> // Tampilkan halaman loading jika isLoading true
            ) : (
                checkout_HTML
            )}
        </div>
    );
}

export default Checkout;
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import numeral from "numeral";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


function Cart() {


    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);

    if (!localStorage.getItem('auth_token')) {
        history.push('/login');
        swal("Warning", "Login to Access Cart Page", "error");
    }

    useEffect(() => {

        let isMounted = true;
        axios.get(`/api/cart`).then(res => {
            if (isMounted) {
                if (res.data.status === 200) {
                    setCart(res.data.cart);
                    setLoading(false);
                    const total = calculateTotalCartPrice(res.data.cart);
                    setGrandTotal(total);
                    // const filteredCart = res.data.cart.filter(item => item.product.qyt > 0);
                    // setCart(filteredCart);
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


    const handleDecrement = (cart_id) => {
        setCart(cart =>
            cart.map((item) =>
                cart_id === item.id ? { ...item, product_qyt: Math.max(item.product_qyt - 1, 0) } : item
            )
        );
        updateCartQuantity(cart_id, "dec");
    };
    const handleIncrement = (cart_id) => {
        const cartItem = cart.find(item => item.id === cart_id);
        if (cartItem && cartItem.product_qyt < cartItem.product.qyt) {
            setCart(cart =>
                cart.map((item) =>
                    cart_id === item.id ? { ...item, product_qyt: Math.min(item.product_qyt + 1, item.product.qyt) } : item
                )
            );
            updateCartQuantity(cart_id, "inc");
        }
    };

    function updateCartQuantity(cart_id, scope) {
        axios.put(`/api/cart-updatequantity/${cart_id}/${scope}`).then(res => {
            if (res.data.status === 200) {
            }
        })
    }



    const deleteCartItem = (e, cart_id) => {
        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Removing";

        axios.delete(`/api/delete-cartitem/${cart_id}`).then(res => {
            if (res.data.status === 200) {
                swal("Success", res.data.message, "success");
                // thisClicked.closest("span").remove();
                const updatedCart = cart.filter(item => item.id !== cart_id);
                setCart(updatedCart);
                const updatedTotal = calculateTotalCartPrice(updatedCart);
                setGrandTotal(updatedTotal);

            } else if (res.data.status === 404) {
                swal("Success", res.data.message, "success");
                thisClicked.innerText = 'Remove';

            }
        });
    }



    const calculateTotalCartPrice = (cart) => {
        let total = 0;
        cart.forEach(item => {
            total += item.product.selling_price * item.product_qyt;
        });
        return total;
    };

    if (loading) {
        return (<div className="py-3">
            <div className="container">
                <br />
                <Skeleton animation="wave" className="cartCard" />
                <Skeleton animation="wave" className="cartCard my-4" />
                <Skeleton animation="wave" className="cartCard" />
            </div>
        </div>

        )
    }

    var cartHTML = '';

    if (cart.length > 0) {

        cartHTML = <div>
            {
                cart.map((item, index) => {
                    return (
                        <span key={index} className="card cartCard p-3 mb-4">
                            <div className="row align-items-center ">
                                <div className="col-sm-12 col-md-3 col-lg-3 ">
                                    <img className="cartProdImg mx-auto d-block" src={`http://localhost:8000/${item.product.image}`} />
                                </div>
                                <div className="col-sm-12 col-md-5 col-lg-5 colM">
                                    <h6 style={{ color: '#CF4476', fontWeight: '400' }}>{item.product.brand}</h6>
                                    <h5 style={{ color: '#CF4476' }} className="mt-1">{item.product.name}</h5>
                                    <h6 style={{ color: '#CF4476' }} className="mt-1">Rp {numeral(item.product.selling_price * item.product_qyt).format('0,0')}</h6>

                                    <div className="mt-0">
                                        <label style={{ fontSize: '11px', opacity: '80%' }}>Description</label> <br />
                                        <input className="cartDes px-2 py-1" type="text" placeholder="Exam : Color blue, Size XL" />
                                    </div>

                                </div>
                                <div className="col-sm-12 col-md-4 col-lg-4 my-2 d-flex colM">
                                    <div className="mx-auto rQytDel">
                                        <div>
                                            <label className="d-flex ms-2" style={{ color: 'green', fontSize: '12px', fontWeight: '500' }}>Stock : <p className="ms-1">{item.product.qyt}</p></label>
                                            <div className="input-group" style={{ width: '200px' }}>
                                                <button type="button" onClick={() => handleDecrement(item.id)} className="input-group-text" style={{ height: '30px' }}>-</button>
                                                <div className="form-control text-center" style={{ height: '30px', fontSize: '12px' }}> {item.product_qyt}</div>
                                                <button type="button" onClick={() => handleIncrement(item.id)} className="input-group-text " style={{ height: '30px' }}>+</button>
                                            </div>
                                        </div>
                                        <div className="align-items-center mt-4">
                                            <button onClick={(e) => deleteCartItem(e, item.id)} className="btn btn-sm btnOrder">Delete</button>
                                            <input className="checkBoxCart" type="checkbox" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </span>

                    )
                })

            }
        </div>
    } else {
        return (
            <h1>No item</h1>
        )
    }

    return (

        <div>
            <br />
            <div className="py-3">
                <div className="container">
                    {cartHTML}
                    <br />
                    <div className="card cartCard p-3" style={{ height: '100%', width: '250px', backgroundColor: '#478ebe' }}>
                        <p className="text-white">Grand Total :</p>
                        <h4 className="text-white mt-1">Rp {numeral(grandTotal).format('0,0')}</h4>
                        <hr style={{ color: 'white' }} className="m-0 my-2" />
                        <Link to="/checkout" className="btn btn-sm btnCout mt-1">Checkout</Link>

                    </div>

                </div>
            </div>

        </div >

    )
}

export default Cart;
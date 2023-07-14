import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { Link, useHistory } from "react-router-dom";
import numeral from "numeral";
import starIcon from '../../../assets/frontend/img/starIcon.png';

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";



function ProductDetail(props) {

    const history = useHistory();
    const [loading, setloading] = useState(true);
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const productCount = product.length;

    useEffect(() => {

        let isMounted = true;
        const category_slug = props.match.params.category;
        const product_slug = props.match.params.product;
        axios.get(`/api/viewproductdetail/${category_slug}/${product_slug}`).then(res => {
            if (isMounted) {
                if (res.data.status === 200) {
                    const productData = res.data.product;
                    const formattedSellingPrice = `Rp ${numeral(productData.selling_price).format("0,0")}`;
                    const formattedOriginalPrice = `Rp ${numeral(productData.original_price).format("0,0")}`;
                    productData.selling_price = formattedSellingPrice;
                    productData.original_price = formattedOriginalPrice;
                    setProduct(productData); setloading(false);

                }
                else if (res.data.status === 404) {
                    history.push('/collections');
                    swal("Warning", res.data.message, "error")
                }
            }

        });

        return () => {
            isMounted = false
        };

    }, [props.match.params.category, props.match.params.product, history]);

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prevCount => prevCount - 1);

        }
    }
    const handleIncrement = () => {
        if (quantity < product.qyt) {
            setQuantity(prevCount => prevCount + 1);
        }
    }

    const submitAddtocart = (e) => {
        e.preventDefault();
        const data = {
            product_id: product.id,
            product_qyt: quantity,
        }
        axios.post(`api/add-to-cart`, data).then(res => {
            if (res.data.status === 201) {
                swal("Success", res.data.message, "success");
            } else if (res.data.status === 409) {
                swal("Warning", res.data.message, "warning");
            } else if (res.data.status === 401) {
                swal("Warning", res.data.message, "warning");
            }
            else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
            }

        });

    }


    if (loading) {
        return (
            <div>
                <div className="py-3">
                    <div className="container">
                        <br />
                        <div className="row">
                            <div className="col-lg-4 col-md-12 my-2">
                                <Skeleton animation="wave" className="imgProd" />
                                <Skeleton style={{ height: '85px' }} animation="wave" className="imgProd mt-3" />


                            </div>
                            <div className="col-lg-8 col-md-12 my-2" >
                                <Skeleton animation="wave" className="cardProd" />
                            </div>

                        </div>

                    </div>
                </div>
            </div>)
    } else {
        var avail_stock = '';
        if (product.qyt > 0) {
            avail_stock =
                <div className="mt-auto">
                    <label className="d-flex" style={{ color: 'green', fontSize: '12px', fontWeight: '500' }}>Stock : <p className="ms-1">{product.qyt}</p></label>
                    <div className="input-group" style={{ width: '200px' }}>
                        <button type="button" onClick={handleDecrement} className="input-group-text" style={{ height: '30px' }}>-</button>
                        <div className="form-control text-center" style={{ height: '30px', fontSize: '12px' }}> {quantity}</div>
                        <button type="button" onClick={handleIncrement} className="input-group-text " style={{ height: '30px' }}>+</button>
                    </div>
                    <button onClick={submitAddtocart} type="button" className="btn btn-sm btnCo mt-3">Add to Cart</button>
                </div>
        } else {
            avail_stock = <div>
                <label>Out of Stock</label>
            </div>

        }


    }
    return (
        <div>
            <br />
            <div className="py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-12 my-2">
                            <img className="mx-auto d-flex imgProd" style={{ borderRadius: '10px' }} src={`http://localhost:8000/${product.image}`} />
                            <span className="d-flex" style={{ marginTop: '15px' }}>
                                <p className="d-flex ms-auto me-5" style={{ color: '#CF4476', fontSize: '16px', fontWeight: '500' }}>Sold :<p className="ms-1">0</p></p>
                                <span className="d-flex me-auto">
                                    <img className="m-auto me-1 ms-5" src={starIcon} style={{ width: '16px', height: '16px' }} alt="" />
                                    <p style={{ color: '#CF4476', fontSize: '16px', fontWeight: '500' }}>0/0</p>
                                </span>
                            </span>
                            <button className="btn btn-sm btnWl mt-2 mx-auto d-block">Add to Wishlist</button>
                            <br />
                        </div>
                        <div className="col-lg-8 col-md-12 my-2" >
                            <div className="card p-4 cardProd">
                                <span className="d-flex mb-2" style={{ alignItems: 'center' }}>
                                    <h3 style={{ color: '#CF4476' }}>{product.name}</h3>
                                    <p className="prodBrand px-3 ms-auto">{product.brand}</p>
                                </span>
                                <p style={{ color: '#CF4476' }} className="my-2 prodDes">{product.description}</p>
                                <h3 className="mt-2">{product.selling_price}</h3>
                                <p className="mt-1" style={{ textDecoration: 'line-through', color: 'rgb(202, 113, 113)' }}>{product.original_price}</p>

                                {avail_stock}

                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div >

    )

}

export default ProductDetail;
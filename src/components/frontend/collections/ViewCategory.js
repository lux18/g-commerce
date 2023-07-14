import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import numeral from "numeral";

// import required modules
import { FreeMode, Autoplay, Pagination, Navigation } from "swiper";
import "../../../assets/admin/css/swiper.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import starIcon from "../../../assets/frontend/img/starIcon.png";
import iklan from "../../../assets/frontend/img/iklan.jpeg";
import cart from "../../../assets/frontend/img/cartLogo.png";
import filterP from "../../../assets/frontend/img/filter.png";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ViewCategory() {
    const [category, setCategory] = useState([]);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSwiper, setShowSwiper] = useState(true);
    const productCount = product.length;


    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            axios.get(`/api/allproducts`).then((res) => {
                if (res.data.status === 200) {
                    const formattedProducts = res.data.products.map((prod) => ({
                        ...prod,
                        original_price: `Rp ${numeral(prod.original_price).format("0,0")}`,
                        selling_price: `Rp ${numeral(prod.selling_price).format("0,0")}`,
                    }));
                    setProduct(formattedProducts);
                    setLoading(false);
                }
            });

            axios.get(`/api/getCategory`).then((res) => {
                if (res.data.status === 200) {
                    setCategory(res.data.category);
                    setLoading(false);
                }
            });
        }
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredProducts = product.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setShowSwiper(event.target.value === "");
    };

    const resultsList = filteredProducts.map((item, idx) => (
        <div key={idx} className="card bShadow cardProduct" style={{ border: "none" }}>
            <Link to={`/collections/${item.category.slug}/${item.slug}`}>
                <img
                    src={`http://localhost:8000/${item.image}`}
                    style={{ borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }}
                    className="w-100"
                    alt=""
                />
            </Link>
            <Link style={{ textDecoration: "none", color: "black" }} to={`/collections/${item.category.slug}/${item.slug}`}>
                <div className="px-3 py-2 text-start">
                    <p style={{ fontWeight: "600", color: "#CF4476", fontSize: "18px", lineHeight: "22px", marginTop: "2px" }}>
                        {item.brand}
                    </p>
                    <p
                        style={{
                            color: "#CF4476",
                            marginTop: "2px",
                            fontSize: "14px",
                            lineHeight: "20px",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                        }}
                    >
                        {item.name}
                    </p>
                    <p style={{ fontWeight: "600", marginTop: "4px", fontSize: "16px" }}>{item.selling_price}</p>
                    <p style={{ opacity: "60%", fontSize: "12px", lineHeight: "16px", textDecoration: "line-through" }}>
                        {item.original_price}
                    </p>

                    <span className="d-flex" style={{ marginTop: "6px" }}>
                        <p className="d-flex me-auto" style={{ color: "#CF4476", fontSize: "12px" }}>
                            Sold :
                            <p className="ms-1">0</p>
                        </p>

                        <span className="d-flex">
                            <img className="m-auto me-1" src={starIcon} style={{ width: "12px", height: "12px" }} alt="" />
                            <p style={{ color: "#CF4476", fontSize: "12px" }}>0/0</p>
                        </span>
                    </span>
                </div>
            </Link>
        </div>
    ));

    if (loading) {
        return (
            <div className="container">
                <br />

                <span className="d-flex align-items-center">
                    <input
                        className="inputSearch px-4"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search Products"
                    />
                    <img className="ms-2" src={filterP} style={{ height: "40px" }} />
                    <Link className="ms-auto" to={`/cart`}>
                        <img src={cart} style={{ height: "40px" }} />
                    </Link>
                </span>

                <Skeleton animation="wave" className="mt-3" style={{ borderRadius: "10px" }} height={200} />
                <br />
                <div className="gridCardP" style={{ border: "none" }}>
                    <Skeleton animation="wave" className="cardLoading" />
                    <Skeleton animation="wave" className="cardLoading" />
                    <Skeleton animation="wave" className="cardLoading" />
                    <Skeleton animation="wave" className="cardLoading" />
                    <Skeleton animation="wave" className="cardLoading" />
                    <Skeleton animation="wave" className="cardLoading" />
                    <Skeleton animation="wave" className="cardLoading" />
                    <Skeleton animation="wave" className="cardLoading" />
                    <Skeleton animation="wave" className="cardLoading" />
                    <Skeleton animation="wave" className="cardLoading" />
                </div>
            </div>
        );
    } else {
        var allProduct = "";
        if (productCount) {
            allProduct = product.map((item, idx) => {

                return (
                    <div key={idx} className="card bShadow cardProduct" style={{ border: "none" }}>
                        <Link to={`/collections/${item.category.slug}/${item.slug}`}>
                            <img
                                src={`http://localhost:8000/${item.image}`}
                                style={{ borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }}
                                className="w-100"
                                alt=""

                            />
                        </Link>
                        <Link style={{ textDecoration: "none", color: "black" }} to={`/collections/${item.category.slug}/${item.slug}`}>
                            <div className="px-3 py-2 text-start">
                                <p style={{ fontWeight: "600", color: "#CF4476", fontSize: "18px", lineHeight: "22px", marginTop: "2px" }}>
                                    {item.brand}
                                </p>
                                <p
                                    style={{
                                        color: "#CF4476",
                                        marginTop: "2px",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                    }}
                                >
                                    {item.name}
                                </p>
                                <p style={{ fontWeight: "600", marginTop: "4px", fontSize: "16px" }}>{item.selling_price}</p>
                                <p style={{ opacity: "60%", fontSize: "12px", lineHeight: "16px", textDecoration: "line-through" }}>
                                    {item.original_price}
                                </p>

                                <span className="d-flex" style={{ marginTop: "6px" }}>
                                    <p className="d-flex me-auto" style={{ color: "#CF4476", fontSize: "12px" }}>
                                        Sold :
                                        <p className="ms-1">0</p>
                                    </p>

                                    <span className="d-flex">
                                        <img className="m-auto me-1" src={starIcon} style={{ width: "12px", height: "12px" }} alt="" />
                                        <p style={{ color: "#CF4476", fontSize: "12px" }}>0/0</p>
                                    </span>
                                </span>
                            </div>
                        </Link>
                    </div>
                );
            });
        } else {
            allProduct = (
                <div className="col-md-12">
                    <h4>No Product Available</h4>
                </div>
            );
        }
    }

    return (
        <div className="container">
            <br />

            <span className="d-flex align-items-center">
                <input
                    className="inputSearch px-4"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search Products"
                />
                <img className="ms-2" src={filterP} style={{ height: "40px" }} />

                <Link className="ms-auto" to={`/cart`}>
                    <img src={cart} style={{ height: "40px" }} />
                </Link>
            </span>

            {showSwiper && (
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                >
                    <SwiperSlide className="py-3" style={{ backgroundColor: "transparent" }}>
                        <div className="newsP">
                            <img className="newI" src={iklan} />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className="py-3" style={{ backgroundColor: "transparent" }}>
                        <div className="newsP">
                            <img className="newI" src={iklan} />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className="py-3" style={{ backgroundColor: "transparent" }}>
                        <div className="newsP">
                            <img className="newI" src={iklan} />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className="py-3" style={{ backgroundColor: "transparent" }}>
                        <div className="newsP">
                            <img className="newI" src={iklan} />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className="py-3" style={{ backgroundColor: "transparent" }}>
                        <div className="newsP">
                            <img className="newI" src={iklan} />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className="py-3" style={{ backgroundColor: "transparent" }}>
                        <div className="newsP">
                            <img className="newI" src={iklan} />
                        </div>
                    </SwiperSlide>
                </Swiper>
            )}

            <div className="py-3">
                <div>
                    {searchQuery !== "" && resultsList.length > 0 ? (
                        <div>
                            <h3 className="mb-3">Search Results:</h3>
                            <div className="gridCardP">{resultsList}</div>
                        </div>
                    ) : (
                        searchQuery !== "" && (
                            <div>
                                <br />
                                <h3 className="mb-2">Search Results:</h3>
                                <p>No results found.</p>
                            </div>
                        )
                    )}
                </div>
                {showSwiper && <div className="gridCardP">{allProduct}</div>}
            </div>
        </div>
    );
}

export default ViewCategory;

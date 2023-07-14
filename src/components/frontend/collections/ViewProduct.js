import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { Link, useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";
import '../../../assets/admin/css/swiper.css';
import "swiper/css";
import "swiper/css/pagination";


function ViewProduct(props) {
    const history = useHistory;
    const [loading, setloading] = useState(true);
    const [product, setProduct] = useState([]);
    const [category, setCategory] = useState([]);

    const productCount = product.length;

    useEffect(() => {

        let isMounted = true;

        const product_slug = props.match.params.slug;
        axios.get(`/api/fetchproducts/${product_slug}`).then(res => {
            if (isMounted) {
                if (res.data.status === 200) {
                    setProduct(res.data.product_data.product);
                    setCategory(res.data.product_data.category);
                    setloading(false);

                } else if (res.data.status === 400) {
                    swal("Warning", res.data.message, "warning")

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

    }, [props.match.params.slug, history]);

    if (loading) {
        return (
            <h4>Loading Product</h4>
        )
    } else {
        var showProductList = '';
        if (productCount) {
            showProductList = product.map((item, idx) => {
                return (
                    <SwiperSlide key={idx}>
                        <div className="card">
                            <Link to={`/collections/${item.category.slug}/${item.slug}`}>
                                <img src={`http://localhost:8000/${item.image}`} style={{ borderRadius: '10px' }} className="w-100 p-2" alt="" />
                            </Link>
                            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/collections/${item.category.slug}/${item.slug}`}>
                                <h5 style={{}}>{item.brand}</h5>
                                <h6 style={{ lineHeight: '21px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{item.name}</h6>
                                <p>0/0</p>
                                <p>{item.original_price}</p>
                                <h5>{item.selling_price}</h5>
                            </Link>
                        </div>
                    </SwiperSlide>
                )
            });
        } else {
            showProductList =
                <div className="col-md-12">
                    <h4>No Product Available for {category.name}</h4>
                </div>
        }
    }


    return (
        <div>
            <div className="py-3 bg-warning">
                <div className="container">
                    <h6>Collcetions / {category.name}</h6>
                </div>
            </div>

            <div className="py-3">
                <div className="container">
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={30}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                    >
                        {showProductList}
                        <br />
                    </Swiper>

                </div>
            </div>

            <div>

            </div>

        </div>
    )
}



export default ViewProduct;
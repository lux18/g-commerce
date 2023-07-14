import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";

function AddProduct() {


    const [categorylist, setCategorylist] = useState([]);
    const [productInput, setProduct] = useState({
        category_id: '',
        slug: '',
        name: '',
        description: '',

        meta_title: '',
        meta_keyword: '',
        meta_descrip: '',

        selling_price: '',
        original_price: '',
        qyt: '',
        brand: '',
        featured: '',
        popular: '',
        status: '',

    });

    const [pricture, setPicture] = useState([]);
    const [errorlist, setError] = useState([]);

    const handleInput = (e) => {
        e.persist();
        setProduct({ ...productInput, [e.target.name]: e.target.value });
    }
    const handleImage = (e) => {
        setPicture({ image: e.target.files[0] });
    }



    useEffect(() => {
        axios.get(`/api/all-category`).then(res => {
            if (res.data.status === 200) {
                setCategorylist(res.data.category);
            }
        });

    }, []);

    const submitProduct = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', pricture.image);
        formData.append('category_id', productInput.category_id);
        formData.append('slug', productInput.slug);
        formData.append('name', productInput.name);
        formData.append('description', productInput.description);

        formData.append('meta_title', productInput.meta_title);
        formData.append('meta_keyword', productInput.meta_keyword);
        formData.append('meta_descrip', productInput.meta_descrip);

        formData.append('brand', productInput.brand);
        formData.append('selling_price', productInput.selling_price);
        formData.append('original_price', productInput.original_price);
        formData.append('qyt', productInput.qyt);

        formData.append('featured', productInput.featured);
        formData.append('popular', productInput.popular);
        formData.append('status', productInput.status);


        let axiosConfig = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": "*",
            }
        };
        axios.post(`/api/store-product`, formData, axiosConfig).then(res => {
            if (res.data.status === 200) {
                swal("Success", res.data.message, "success");
                setProduct({
                    ...productInput,
                    category_id: '',
                    slug: '',
                    name: '',
                    description: '',

                    meta_title: '',
                    meta_keyword: '',
                    meta_descrip: '',

                    selling_price: '',
                    original_price: '',
                    qyt: '',
                    brand: '',
                    featured: '',
                    popular: '',
                    status: '',

                });
                setError([]);

            } else if (res.data.status === 422) {
                swal("All Fields are mandatory", "", "error");
                setError(res.data.errors);
            }
        });
    }

    return (
        <div className="container px-4">
            <div className="card">
                <div className="card-header">
                    <h4>Add Product
                        <Link to="/admin/view-product" className='btn btn-primary btn-sm float-end'>View Product</Link>
                    </h4>
                    <div className="card-body">
                        <form onSubmit={submitProduct} encType="multipart/form-data">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Home</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="seotags-tab" data-bs-toggle="tab" data-bs-target="#seotags-tab-pane" type="button" role="tab" aria-controls="seotags-tab-pane" aria-selected="false">SEO Tags</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="otherdetails-tab" data-bs-toggle="tab" data-bs-target="#otherdetails-tab-pane" type="button" role="tab" aria-controls="otherdetails-tab-pane" aria-selected="false">Other Details</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade card-body border show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab">
                                    <div className="form-group mb-3">
                                        <label>Select Category</label>
                                        <select name="category_id" onChange={handleInput} value={productInput.category_id} className="form-control" id="">
                                            <option>Select Category</option>
                                            {
                                                categorylist.map((item) => {
                                                    return (<option value={item.id} key={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <small className="text-danger">{errorlist.category_id}</small>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Slug</label>
                                        <input type="text" onChange={handleInput} value={productInput.slug} name="slug" className="form-control" />
                                        <small className="text-danger">{errorlist.slug}</small>

                                    </div>

                                    <div className="form-group mb-3">
                                        <label>Name</label>
                                        <input type="text" onChange={handleInput} value={productInput.name} name="name" className="form-control" />
                                        <small className="text-danger">{errorlist.name}</small>

                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Description</label>
                                        <input type="text" onChange={handleInput} value={productInput.description} name="description" className="form-control" />
                                    </div>
                                </div>
                                <div className="tab-pane fade card-body border" id="seotags-tab-pane" role="tabpanel" aria-labelledby="seotags-tab">
                                    <div className="form-group mb-3">
                                        <label>Meta Title</label>
                                        <input type="text" onChange={handleInput} value={productInput.meta_title} name="meta_title" className="form-control" />
                                        <small className="text-danger">{errorlist.meta_title}</small>

                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Meta Keyword</label>
                                        <input type="text" onChange={handleInput} value={productInput.meta_keyword} name="meta_keyword" className="form-control" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Meta Description</label>
                                        <input type="text" onChange={handleInput} value={productInput.meta_descrip} name="meta_descrip" className="form-control" />
                                    </div>
                                </div>
                                <div className="tab-pane fade card-body border" id="otherdetails-tab-pane" role="tabpanel" aria-labelledby="otherdetails-tab">
                                    <div className="row">
                                        <div className="col-md-4 form-group mb-3">
                                            <label>Selling Price</label>
                                            <input type="text" name="selling_price" onChange={handleInput} value={productInput.selling_price} className="form-control" />
                                            <small className="text-danger">{errorlist.selling_price}</small>

                                        </div>
                                        <div className="col-md-4 form-group mb-3">
                                            <label>Original Price</label>
                                            <input type="text" name="original_price" onChange={handleInput} value={productInput.original_price} className="form-control" />
                                            <small className="text-danger">{errorlist.original_price}</small>

                                        </div>
                                        <div className="col-md-4 form-group mb-3">
                                            <label>Quantity</label>
                                            <input type="text" name="qyt" onChange={handleInput} value={productInput.qyt} className="form-control" />
                                            <small className="text-danger">{errorlist.qyt}</small>

                                        </div>
                                        <div className="col-md-4 form-group mb-3">
                                            <label>Brand</label>
                                            <input type="text" name="brand" onChange={handleInput} value={productInput.brand} className="form-control" />
                                            <small className="text-danger">{errorlist.brand}</small>

                                        </div>
                                        <div className="col-md-4 form-group mb-3">
                                            <label>Image</label>
                                            <input type="file" name="image" onChange={handleImage} className="form-control" />
                                            <small className="text-danger">{errorlist.image}</small>

                                        </div>
                                        <div className="col-md-4 form-group mb-3">
                                            <label>Featured (checked=show)</label>
                                            <input type="checkbox" name="featured" onChange={handleInput} value={productInput.featured} className="w-50 h-50" />
                                        </div>
                                        <div className="col-md-4 form-group mb-3">
                                            <label>Popular (checked=show)</label>
                                            <input type="checkbox" name="popular" onChange={handleInput} value={productInput.popular} className="w-50 h-50" />
                                        </div>
                                        <div className="col-md-4 form-group mb-3">
                                            <label>Status (checked=hidden)</label>
                                            <input type="checkbox" name="status" onChange={handleInput} value={productInput.status} className="w-50 h-50" />
                                        </div>



                                    </div>
                                </div>

                            </div>
                            <button type="submit" className="btn btn-primary px-4 mt-2"> Submit</button>
                        </form>

                    </div>

                </div>
            </div>
        </div>

    )
}

export default AddProduct;
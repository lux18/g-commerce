import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";


function EditCategory(props) {

    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const [categoryInput, setCategory] = useState({
        status: '',
        slug: '',
        name: '',
        description: '',

        meta_title: '',
        meta_keyword: '',
        meta_descrip: '',

    });
    const [error, setError] = useState([]);
    const [picture, setPicture] = useState([]);


    const handleInput = (e) => {
        e.persist();
        setCategory({ ...categoryInput, [e.target.name]: e.target.value });
    }
    const handleImage = (e) => {
        setPicture({ image: e.target.files[0] });
    }


    useEffect(() => {
        const category_id = props.match.params.id;

        axios.get(`/api/edit-category/${category_id}`).then(res => {

            if (res.data.status === 200) {
                setCategory(res.data.category);


            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
                history.push('/admin/view-category')
            }
            setLoading(false);
        })
    }, [props.match.params.id, history]);



    const updateCategory = (e) => {
        e.preventDefault();
        const category_id = props.match.params.id;

        const formData = new FormData();
        formData.append('image', picture.image);
        formData.append('meta_keyword', categoryInput.meta_keyword);
        formData.append('meta_title', categoryInput.meta_title);
        formData.append('meta_descrip', categoryInput.meta_descrip);
        formData.append('slug', categoryInput.slug);
        formData.append('name', categoryInput.name);
        formData.append('description', categoryInput.description);
        formData.append('status', categoryInput.status);

        // console.log(categoryInput)


        let axiosConfig = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": "*",
            }
        };


        axios.post(`/api/update-category/${category_id}`, formData, axiosConfig).then(res => {
            if (res.data.status === 200) {
                swal("Success", res.data.message, "success");
                setError([]);
            } else if (res.data.status === 422) {
                swal("All fields are mandatory", "", "error");
                setError(res.data.errors)
            } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
                history.push('admin/view-category')

            }
        });
    }


    if (loading) {
        return <h4>Loading Category</h4>
    };




    return (

        <div className="container px-4">
            <div className="card">
                <div className="card-header">
                    <h4>View Category
                        <Link to="/admin/view-category" className="btn btn-primary btn-sm float-end">Back</Link>
                    </h4>

                </div>
                <form onSubmit={updateCategory} encType="multipart/form-data">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Home</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="seo-tags-tab" data-bs-toggle="tab" data-bs-target="#seo-tags-tab-pane" type="button" role="tab" aria-controls="seo-tags-tab-pane" aria-selected="false">SEO Tags</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane p-3 card-body border fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" >
                            <div className="form-group mb-3">
                                <label>Slug</label>
                                <input type="text" name="slug" onChange={handleInput} value={categoryInput.slug} className="form-control" />
                                <small className="text-danger">{error.slug}</small>
                            </div>
                            <div className="form-group mb-3">
                                <label>Name</label>
                                <input type="text" name="name" onChange={handleInput} value={categoryInput.name} className="form-control" />
                                <small className="text-danger">{error.name}</small>

                            </div>
                            <div className="form-group mb-3">
                                <label>Description</label>
                                <textarea name="description" onChange={handleInput} value={categoryInput.description} className="form-control"></textarea>
                            </div>
                            <div className="form-group mb-3">
                                <label>Status</label>
                                <input type="checkbox" name="status" onChange={handleInput} value={categoryInput.status} /> Status 0=show / 1 = Hidden
                            </div>

                        </div>
                        <div className="tab-pane p-3 card-body border fade" id="seo-tags-tab-pane" role="tabpanel" aria-labelledby="seo-tags-tab" >
                            <div className="form-group mb-3">
                                <label>Meta Title</label>
                                <input type="text" name="meta_title" onChange={handleInput} value={categoryInput.meta_title} className="form-control" />
                                <small className="text-danger">{error.meta_title}</small>

                            </div>
                            <div className="form-group mb-3">
                                <label>Meta Keyword</label>
                                <textarea name="meta_keyword" onChange={handleInput} value={categoryInput.meta_keyword} className="form-control"></textarea>
                            </div>
                            <div className="form-group mb-3">
                                <label>Meta Description</label>
                                <textarea name="meta_descrip" onChange={handleInput} value={categoryInput.meta_descrip} className="form-control"></textarea>
                            </div>
                            <div className="col-md-4 form-group mb-3">
                                <label>Image</label>
                                <input type="file" name="image" onChange={handleImage} className="form-control" />
                                <small className="text-danger">{error.image}</small>

                            </div>


                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary px-4 float-end">Update</button>
                </form>

            </div>
        </div>

    );
}
export default EditCategory;
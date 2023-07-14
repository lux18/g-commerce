import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";


function ViewProduct() {

    const [viewProduct, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axios.get(`/api/view-product`).then(res => {
            if (res.data.status === 200) {
                setProduct(res.data.products);
                setLoading(false)
            }
        });

    }, []);

    var display_Productdata = "";

    if (loading) {
        return <h4>View Products Loading</h4>
    } else {
        var Prodsatus = '';
        display_Productdata = viewProduct.map((item) => {
            if (item.status == '0') {
                Prodsatus = 'Show';
            } else if (item.status == '1') {
                Prodsatus = 'Hidden';

            }
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.category.name}</td>
                    <td>{item.name}</td>
                    <td>{item.selling_price}</td>
                    <td><img src={`http://localhost:8000/${item.image}`} width="50px" alt={item.name} /></td>
                    <td><Link to={`edit-product/${item.id}`} className="btn btn-success btn-sm">Edit</Link></td>
                    <td>{Prodsatus}</td>

                </tr>
            )
        });
    }

    return (
        <div className="card px-4">
            <div className="card-header">
                <h4>View Product
                    <Link to="/admin/add-product" className="btn btn-success btn-sm float-end">Add Product</Link>
                </h4>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category Name</th>
                                <th>Product Name</th>
                                <th>Selling Price</th>
                                <th>Image</th>
                                <th>Edit</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {display_Productdata}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default ViewProduct;
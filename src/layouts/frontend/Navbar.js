import axios from "axios";
import React from "react";
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import gcIcon from '../../assets/frontend/img/gc_logo.svg';



function Navbar() {
    const history = useHistory();
    const logoutSubmit = (e) => {
        e.preventDefault();

        axios.post(`api/logout`).then(res => {
            if (res.data.status === 200) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_name');
                swal("Success", res.data.message, "success");
                history.push('/');
            }

        });
    }

    var AuthButtons = '';
    if (!localStorage.getItem('auth_token')) {
        AuthButtons = (
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link style={{ fontWeight: '600' }} className="nav-link" to="/login">Login</Link>
                </li>

            </ul>
        );
    } else {
        AuthButtons = (
            <li className="nav-item">
                <div type="button" style={{ fontWeight: '600' }} onClick={logoutSubmit} className="nav-link">Logout</div>
            </li>

        );
    }

    return (
        <nav className="navbar navbar-expand-lg sticky-top">
            <div className="container">
                <Link className="navbar-brand" to="/"><img className="me-2" src={gcIcon} style={{ width: '30px' }} />G-Commerce</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link style={{ fontWeight: '600' }} className="nav-link" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link style={{ fontWeight: '600' }} className="nav-link" aria-current="page" to="/about">About</Link>
                        </li>

                        <li className="nav-item">
                            <Link style={{ fontWeight: '600' }} className="nav-link" to="/collections">Collection</Link>
                        </li>

                        <li className="nav-item">
                            <Link style={{ fontWeight: '600' }} className="nav-link" to="/cart">Cart</Link>
                        </li>

                        {AuthButtons}



                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
import React, { useState } from "react";
import Navbar from "../../../layouts/frontend/Navbar";
import axios from "axios";
import swal from 'sweetalert';
import { useHistory, Link } from 'react-router-dom';


function Login() {
    const history = useHistory();
    const [loginInput, setLogin] = useState({
        email: '',
        password: '',
        error_list: [],

    })

    const handleInput = (e) => {
        e.persist();
        setLogin({ ...loginInput, [e.target.name]: e.target.value });
    }

    const loginSubmit = (e) => {
        e.preventDefault();

        const data = {
            email: loginInput.email,
            password: loginInput.password,

        }
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`api/login`, data).then(res => {
                if (res.data.status === 200) {
                    localStorage.setItem('auth_token', res.data.token);
                    localStorage.setItem('auth_name', res.data.username);
                    swal("Success", res.data.message, "success");
                    if (res.data.role
                        === 'admin') {
                        history.push('/admin/dashboard');

                    } else {
                        history.push('/');

                    }

                }
                else if (res.data.status === 401) {

                    swal("Warning", res.data.message, "warning");

                }
                else { setLogin({ ...loginInput, error_list: res.data.validation_errors }) };
            })
        });
    }


    return (
        <div >
            <div className="container py-5" style={{ height: '90vh' }}>
                <div className="row justify-content-center">
                    <div className="col-md-6 ">
                        <br /><br />
                        <div className="card p-4 cardLogin">
                            <h2 className="text-center" style={{ fontWeight: '600', color: '#CF4476' }}>Sign In</h2>
                            <br />
                            <div>
                                <form onSubmit={loginSubmit}>
                                    <div className="form-group mb-4">
                                        <input type="text" name="email" onChange={handleInput} value={loginInput.email} placeholder="Email" className="form-control inputCa py-2" />
                                        <i style={{ fontSize: '12px', color: 'red', opacity: '70%' }}>{loginInput.error_list.email}</i>
                                    </div>
                                    <div className="form-group mb-4">
                                        <input type="password" name="password" onChange={handleInput} value={loginInput.password} placeholder="Password" className="py-2 form-control inputCa" />
                                        <i style={{ fontSize: '12px', color: 'red', opacity: '70%' }}>{loginInput.error_list.password}</i>
                                    </div>
                                    <br />
                                    <div className="form-group mb-4">
                                        <button className="btn btn-primary bauth" style={{ backgroundColor: '#CF4476' }} type="submit">Sign In</button>
                                    </div>
                                    <p style={{ fontSize: '12px', opacity: '70%' }} className="mb-1 text-center">Don't have an account?</p>
                                    <div className="form-group text-center">
                                        <Link style={{ fontSize: '20px', fontWeight: '500', textDecoration: 'none', backgroundColor: 'transparent', color: '#CF4476' }} to="/register">Create Account</Link>
                                    </div>


                                </form>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
import React, { useState } from "react";
import Navbar from "../../../layouts/frontend/Navbar";
import axios from "axios";
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import '../../../assets/admin/css/swiper.css';

function Register() {
    const history = useHistory();
    const [registerInput, setRegister] = useState({
        name: '',
        email: '',
        password: '',
        error_list: [],
    });

    const handleInput = (e) => {
        e.persist();
        setRegister({ ...registerInput, [e.target.name]: e.target.value });
    }

    const registerSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: registerInput.name,
            email: registerInput.email,
            password: registerInput.password,

        }
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/register`, data).then(res => {
                if (res.data.status === 200) {
                    localStorage.setItem('auth_token', res.data.token);
                    localStorage.setItem('auth_name', res.data.username);
                    swal("Success", res.data.message, "success");
                    history.push('/');

                }
                else {
                    setRegister({ ...registerInput, error_list: res.data.validation_errors });
                }

            });
        });

    }

    return (
        <div>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 ">
                        <br /><br />
                        <div className="card p-4 cardR">
                            <h4 className="text-center" style={{ fontWeight: '600', color: '#CF4476' }}>Create Account</h4>
                            <br />
                            <div>
                                <form onSubmit={registerSubmit} action="">
                                    <div className="form-group mb-4">
                                        <input type="text" name="name" onChange={handleInput} value={registerInput.name} className="form-control inputCa" placeholder="Full Name" />
                                        <i className="text-danger" style={{ fontSize: '10px' }}>{registerInput.error_list.name}</i>
                                    </div>
                                    <div className="form-group mb-4">
                                        <input type="text" name="email" onChange={handleInput} value={registerInput.email} className="form-control inputCa" placeholder="Email" />
                                        <i className="text-danger" style={{ fontSize: '10px' }}>{registerInput.error_list.email}</i>
                                    </div>

                                    <div className="form-group mb-4">
                                        <input type="password" name="password" onChange={handleInput} value={registerInput.password} className="form-control inputCa" placeholder="Password" />
                                        <i className="text-danger" style={{ fontSize: '10px' }}>{registerInput.error_list.password}</i>
                                    </div>

                                    <div className="form-group mb-4">
                                        <input type="password" name="confirmpassword" className="form-control inputCa" placeholder="Confirm Password" />
                                        <i className="text-danger" style={{ fontSize: '10px' }}>{registerInput.error_list.password}</i>
                                    </div>
                                    <br />
                                    <div className="form-group mb-4">
                                        <button className="btn btn-primary btnCacc mx-auto d-block" type="submit">Create</button>
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

export default Register;
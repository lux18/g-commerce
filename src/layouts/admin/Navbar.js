import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="sb-top nav navbar navbar-expand navbar-dark bg-dark">
            <Link className="navbar-brand ps-3" style={{ color: 'white', zIndex: '1' }} to="/admin">Start Bootstrap</Link>
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" to="#!"><i className="fas fa-bars"></i></button>
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
            </form>
        </nav>
    )
}

export default Navbar;
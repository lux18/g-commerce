import React from "react";
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Switch, Route, Redirect } from 'react-router-dom'

import '../../assets/admin/css/styles.css';
import '../../assets/admin/js/scripts';

import routes from "../../routes/routes";

const MasterLayout = () => {
    return (
        <div className="sb-nav-fixed">
            <Navbar></Navbar>
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <Sidebar></Sidebar>
                </div>
                <div id="layoutSidenav_content">
                    <main>
                        <Switch>
                            {routes.map((route, idx) => {
                                return (
                                    route.component && (
                                        <Route
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={(props) => (
                                                <route.component {...props}></route.component>
                                            )}
                                        ></Route>
                                    )
                                )
                            })}

                            <Redirect from="admin" to="/admin/view-product"></Redirect>
                        </Switch>
                    </main>
                    <Footer></Footer>
                </div>
            </div>

        </div>
    )
}

export default MasterLayout;
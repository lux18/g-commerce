import React from "react";
import { Switch, Route } from 'react-router-dom'
import Navbar from "../../layouts/frontend/Navbar";
import publicroutesList from '../../routes/Publicroutelist';

const FrontendLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div>
                <Switch>
                    {publicroutesList.map((routedata, idx) => {
                        return (
                            routedata.component && (
                                <Route
                                    key={idx}
                                    path={routedata.path}
                                    exact={routedata.exact}
                                    name={routedata.name}
                                    render={(props) => (
                                        <routedata.component {...props}></routedata.component>
                                    )}
                                ></Route>
                            )
                        )
                    })}

                </Switch>
            </div>
        </div>

    )
}

export default FrontendLayout;
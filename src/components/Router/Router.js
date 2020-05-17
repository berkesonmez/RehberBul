import React, { Component } from "react";

import PropTypes from "prop-types";

import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";

import HomePage from "../HomePage";
import AdminPage from "../AdminPage";
import UserPage from "../UserPage";
import NotFoundPage from "../NotFoundPage";
import Search from "../Search";
// import PostPage from "../PostPage/PostPage";

class Router extends Component {
    render() {
        // Properties
        const { user, roles, bar } = this.props;

        // Functions
        const { openSnackbar } = this.props;

        return (
            <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
                {bar}
                <Switch>
                    <Route path="/" exact>
                        <HomePage user={user} openSnackbar={openSnackbar} />
                    </Route>

                    <Route path="/admin">
                        {user && roles.includes("admin") ? (
                            <AdminPage />
                        ) : (
                            <Redirect to="/" />
                        )}
                    </Route>

                    <Route path="/search">
                        <Search user={user} />
                    </Route>

                    <Route path="/user/:userId">
                        {user ? <UserPage user={user} /> : <Redirect to="/" />}
                    </Route>

                    {/* <Route path="/post/:postId">
                        <PostPage user={user} />
                    </Route> */}

                    <Route
                        path="/(wp-admin|wp-login.php)"
                        component={() => {
                            window.location.href =
                                "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                            return null;
                        }}
                    />

                    <Route>
                        <NotFoundPage />
                    </Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

Router.propTypes = {
    // Properties
    user: PropTypes.object,
    roles: PropTypes.array.isRequired,
    bar: PropTypes.element,

    // Functions
    openSnackbar: PropTypes.func.isRequired,
};

export default Router;

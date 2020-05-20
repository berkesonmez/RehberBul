import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";

import { auth, database } from "../../firebase";

import authentication from "../../services/authentication";

import Categories from "../Categories";
import Cities from "../Cities";
// import { ReactComponent as CabinIllustration } from "../../illustrations/cabin.svg";

import { makeStyles } from "@material-ui/core/styles";
import WelcomePage from "../WelcomePage";
import Loader from "../Loader";

// import { responsiveFontSizes } from "@material-ui/core";

const HomePage = (props) => {
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    const useStyles = makeStyles({
        root: {
            margin: "1em",
            "padding-right": "1em",
            "padding-left": "1em",

            //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            //   border: 0,
            //   borderRadius: 3,
            //   boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            //   color: 'white',
            //   height: 48,
            //   padding: '0 30px',
        },
    });
    const classes = useStyles();
    useEffect(() => {
        signInWithEmailLink();
        // fetch(
        //     "https://source.unsplash.com/collection/4928529&orientation=landscape"
        // )
        //     .then((res) => {
        //         setBgUrl({
        //             isLoaded: true,
        //             url: res.url,
        //         });
        //     })
        //     .catch((error) =>
        //         setBgUrl({
        //             isLoaded: true,
        //             error,
        //         })
        //     );
        database.ref("categories/").on("value", (snapshot) => {
            const categories = snapshot.val();
            const newState = [];
            for (let category in categories) {
                newState.push(categories[category]);
            }
            setCategories(newState);
            setLoading(false);
        });
        database.ref("cities/").on("value", (snapshot) => {
            const cities = snapshot.val();
            const newState = [];
            for (let city in cities) {
                newState.push(cities[city]);
            }
            setCities(newState);
            setLoading(false);
        });
    }, []);

    const { user } = props;
    const signInWithEmailLink = () => {
        const { user } = props;

        if (user) {
            return;
        }

        const emailLink = window.location.href;

        if (!emailLink) {
            return;
        }

        if (auth.isSignInWithEmailLink(emailLink)) {
            let emailAddress = localStorage.getItem("emailAddress");

            if (!emailAddress) {
                this.props.history.push("/");

                return;
            }

            authentication
                .signInWithEmailLink(emailAddress, emailLink)
                .then((value) => {
                    const user = value.user;
                    const displayName = user.displayName;
                    const emailAddress = user.email;

                    this.props.openSnackbar(
                        `${displayName || emailAddress} olarak giriş yapıldı`
                    );
                })
                .catch((reason) => {
                    const code = reason.code;
                    const message = reason.message;

                    switch (code) {
                        case "auth/expired-action-code":
                        case "auth/invalid-email":
                        case "auth/user-disabled":
                            this.props.openSnackbar(message);
                            break;

                        default:
                            this.props.openSnackbar(message);
                            return;
                    }
                })
                .finally(() => {
                    this.props.history.push("/");
                });
        }
    };

    // const LoadImage = () => {
    //     if (user) {
    //         if (bgUrl.isLoaded) {
    //             return (
    //                 <>
    //                     <EmptyState
    //                         size="large"
    //                         title="Ana Sayfa"
    //                         image={<img alt="landscape" src={bgUrl.url} />}
    //                     />
    //                     {/* <EmptyState title={"Hello Stranger"} /> */}
    //                     {/* <h1>Hello Stranger</h1> */}
    //                 </>
    //             );
    //         } else {
    //             return <EmptyState image={<CircularProgress />} />;
    //         }
    //     } else {
    //         return (
    //             <EmptyState
    //                 image={<InsertBlockIllustration />}
    //                 title="Rehber Bul"
    //                 description="Planladığınız geziler için rehber bulabileceğiniz web uygulaması"
    //             />
    //         );
    //     }
    // };

    if (loading) {
        return <Loader />;
    }
    if (!loading) {
        return (
            <>
                {/* <LoadImage /> */}
                <div className={classes.root}>
                    <h1>Kategoriler</h1>
                    <Categories categories={categories} />
                    <h1>Şehirler</h1>
                    <Cities cities={cities} />
                </div>
            </>
        );
    }
    return <h1>Test</h1>;
};

HomePage.propTypes = {
    user: PropTypes.object,
};

export default withRouter(HomePage);

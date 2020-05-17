import React, { useState, useEffect } from "react";

import { useParams, Link } from "react-router-dom";

import { Grid, Fab, Box } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { Refresh as RefreshIcon, Home as HomeIcon } from "@material-ui/icons";

import { firestore } from "../../firebase";

import EmptyState from "../EmptyState";

import Loader from "../Loader";
import UserCard from "../UserCard";

import { ReactComponent as ErrorIllustration } from "../../illustrations/error.svg";
import { ReactComponent as NoDataIllustration } from "../../illustrations/no-data.svg";

const useStyles = makeStyles({
    grid: {
        margin: 0,
        width: "100%",
    },
});

function UserPage(props) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const { userId } = useParams();
    const classes = useStyles();

    useEffect(() => {
        return firestore
            .collection("users")
            .doc(userId)
            .onSnapshot(
                (snapshot) => {
                    setLoading(false);
                    setUser(snapshot.data());
                },
                (error) => {
                    setLoading(false);
                    setError(error);
                }
            );
    }, [userId]);

    if (error) {
        return (
            <EmptyState
                image={<ErrorIllustration />}
                title="Kullanıcı bulunamadı"
                description="Something went wrong when trying to retrieve the requested user"
                button={
                    <Fab
                        variant="extended"
                        color="primary"
                        onClick={() => window.location.reload()}
                    >
                        <Box clone mr={1}>
                            <RefreshIcon />
                        </Box>
                        Retry
                    </Fab>
                }
            />
        );
    }

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return (
            <EmptyState
                image={<NoDataIllustration />}
                title="Böyle bir kullanıcı yok"
                description="İstenilen kullanıcı bulunamadı"
                button={
                    <Fab
                        variant="extended"
                        color="primary"
                        component={Link}
                        to="/"
                    >
                        <Box clone mr={1}>
                            <HomeIcon />
                        </Box>
                        Ana Sayfa
                    </Fab>
                }
            />
        );
    }

    return (
        <Grid
            className={classes.grid}
            container
            alignItems="center"
            // justify="center"
            spacing={1}
        >
            <Grid item md={6}>
                <UserCard user={user} userData={props.user} />
            </Grid>
            <Grid item xs={6} alignItems="center">
                <h1 justify="center">{user.firstName}'nin gönderileri</h1>
            </Grid>
        </Grid>
    );
}

export default UserPage;

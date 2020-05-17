import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { auth, database } from "../../firebase";
import { withRouter } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import CategoryIcon from "@material-ui/icons/Category";
import DateRangeIcon from "@material-ui/icons/DateRange";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
// import Categories from "../Categories";

import { Link } from "react-router-dom";
import PostPage from "../PostPage";
import Loader from "../Loader";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const useStyles = makeStyles((theme) => ({
    root: {
        "margin-top": "0.5em",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        "& > *": {
            margin: theme.spacing(0.5),
        },
    },
}));

function Search(props) {
    const [query, setQuery] = useState();
    const [params, setParams] = useState();
    const [returnedValues, setReturnedValues] = useState([]);

    const [loading, setLoading] = useState(true);
    const [headerString, setHeaderString] = useState("");

    const [noResult, setNoResult] = React.useState(false);
    // const [categories, setCategories] = useState([]);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();

    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const classes = useStyles();

    // const handleClick = () => {
    //     console.info("You clicked the Chip.");
    // };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setLoading(true);
        const query = new URLSearchParams(props.location.search);
        let paramObj = {};
        for (var value of query.keys()) {
            paramObj[value] = query.get(value);
        }
        // console.log(paramObj);
        // console.log(Object.keys(paramObj));
        // console.log(Object.values(paramObj));
        // console.log(paramObj[Object.keys(paramObj)]);
        setParams(paramObj);
        const keys = Object.keys(paramObj);
        const queryParam = keys[0];
        let queryId = paramObj[Object.keys(paramObj)];
        let queryType = "";
        let queryStr = "";
        let headerStr = "";
        switch (queryParam) {
            case "c":
                queryType = "tCategoryId";
                queryStr = "category";
                headerStr += "kategorisi için sonuçlar";
                break;
            case "l":
                queryType = "tCityId";
                queryStr = "city";
                headerStr += "şehiri için sonuçlar";
                break;
            case "q":
                queryType = "city";
                queryStr = "city";
                headerStr += "şehri için sonuçlar";
                break;
            case "uid":
                queryType = "ownerId";
                queryStr = "fname";
                headerStr += "kullanıcısı için sonuçlar";
                break;
            default:
                break;
        }
        // console.log(queryId);
        // console.log(queryType);

        setQuery(paramObj[Object.keys(paramObj)]);
        // console.log(paramObj.l.length);
        // database.ref("tours").on("value", (snapshot) => {
        //     const categories = snapshot.val();
        //     const newState = [];
        //     for (let category in categories) {
        //         newState.push(categories[category]);
        //     }
        //     setCategories(newState);
        // });
        const tours = [];
        database
            .ref("tours")
            .orderByChild(queryType)
            .equalTo(queryId)
            .on("value", function (dataSnapshot) {
                if (dataSnapshot.exists()) {
                    dataSnapshot.forEach((childSnapshot) => {
                        const childKey = childSnapshot.key;
                        const childData = childSnapshot.val();
                        tours.push({ childKey: childKey, ...childData });
                        // console.log({ childKey: childKey, ...childData });
                        console.log(dataSnapshot.val());
                        setHeaderString(childData[queryStr] + " " + headerStr);
                    });
                    setLoading(false);
                } else {
                    console.log("Sonuç yok");
                    setLoading(false);
                    setNoResult(true);
                }
            });
        setReturnedValues(tours);
    }, [props, database]);
    if (loading) {
        return <Loader />;
    }
    if (noResult) {
        return (
            <NotFoundPage
                title="Aradığınız içeriğe ulaşılamamaktadır"
                subtitle="Erişmeye çalıştığınız içerik mevcut değil"
            />
        );
    }
    return (
        <>
            <div style={{ padding: 20 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <h1 className={classes.root}>{headerString}</h1>
                    </Grid>
                    {/* <form className={classes.root} noValidate autoComplete="off">
                    <div>
                        <TextField id="standard-basic" label="Standard" />
                        <TextField
                            id="filled-basic"
                            label="Filled"
                            variant="filled"
                        />
                        <TextField
                            id="outlined-basic"
                            label="Outlined"
                            variant="outlined"
                        />
                    </div>
                </form> */}
                    {/* <Dialog
                        // fullScreen={fullScreen}
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                            {"Use Google's location service?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Let Google help apps determine location. This
                                means sending anonymous location data to Google,
                                even when no apps are running.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                autoFocus
                                onClick={handleClose}
                                color="primary"
                            >
                                Disagree
                            </Button>
                            <Button
                                onClick={handleClose}
                                color="primary"
                                autoFocus
                            >
                                Agree
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Grid item xs={12} md={12}>
                        <div className={classes.root}>
                            <Chip
                                avatar={<CategoryIcon />}
                                label="Kategoriler"
                                onClick={handleClickOpen}
                            />
                            <Chip
                                avatar={<DateRangeIcon />}
                                label="Tarih Aralığı"
                                onClick={handleClickOpen}
                            />
                        </div>
                    </Grid> */}

                    {returnedValues.map((value, id) => {
                        return (
                            <Grid
                                item
                                xl={2}
                                md={3}
                                sm={6}
                                xs={12}
                                key={value.childKey}
                            >
                                <PostPage
                                    key={value.childKey}
                                    postId={value.childKey}
                                    user={props.user}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
            {/* <Grid container spacing={1}>
                    <Categories categories={categories} />
                </Grid> */}
        </>
    );
}

export default withRouter(Search);

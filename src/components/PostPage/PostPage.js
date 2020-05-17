import React, { useEffect, useState } from "react";

import { database } from "../../firebase";
import { useParams, Link } from "react-router-dom";
import Loader from "../Loader";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PhoneIcon from "@material-ui/icons/Phone";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import TranslateIcon from "@material-ui/icons/Translate";
import GroupIcon from "@material-ui/icons/Group";
import ClassIcon from "@material-ui/icons/Class";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function PostCard(props) {
    // let { postId } = useParams();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState([]);
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const useStyles = makeStyles((theme) => ({
        root: {
            maxWidth: 345,
        },
        media: {
            height: 0,
            paddingTop: "56.25%", // 16:9
        },
        expand: {
            transform: "rotate(0deg)",
            marginLeft: "auto",
            transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: "rotate(180deg)",
        },
        avatar: {
            backgroundColor: red[500],
        },
    }));

    const classes = useStyles();

    useEffect(() => {
        console.log(props.postId);
        console.log("Postpage props", props);
        database
            .ref("tours/" + props.postId)
            // .orderByChild(queryType)
            // .equalTo(postId)
            .on("value", (snapshot) => {
                const categories = snapshot.val();
                setPost(categories);
                setLoading(false);

                // const newState = [];
                // for (let category in categories) {
                //     newState.push(categories[category]);
                // }
                // console.log(newState);
                console.log(snapshot.val());
                // setLoading(false);
                // setCategories(newState);
                // console.log(dataSnapshot);
                // dataSnapshot.forEach((childSnapshot) => {
                //     const childKey = childSnapshot.key;
                //     const childData = childSnapshot.val();
                //     console.log("Key: ", childKey);
                //     console.log("Data: ", childData);
                //     // tours.push({ childKey: childKey, ...childData });
                //     // console.log({ childKey: childKey, ...childData });
                // });
                // setLoading(false);
            });

        // setReturnedValues(tours);
    }, []);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleOptions = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEdit = () => {
        setAnchorEl(null);
    };
    const handleDelete = () => {
        setAnchorEl(null);
    };
    if (loading) {
        return <Loader />;
    }
    return (
        <div style={{ padding: 20 }}>
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar
                            aria-label="tour"
                            className={classes.avatar}
                            src={post.profileImg}
                        >
                            {post.fname[0]}
                        </Avatar>
                    }
                    action={
                        props.user ? (
                            <>
                                <IconButton
                                    aria-label="settings"
                                    onClick={handleOptions}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleEdit}>
                                        Düzenle
                                    </MenuItem>
                                    <MenuItem onClick={handleDelete}>
                                        Sil
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : null
                    }
                    title={
                        <Link
                            style={{
                                color: "inherit",
                                textDecoration: "inherit",
                            }}
                            to={`/search?uid=${post.ownerId}`}
                        >
                            {post.fname}
                        </Link>
                    }
                    subheader={
                        <Link
                            style={{
                                color: "inherit",
                                textDecoration: "inherit",
                            }}
                            to={`/search?l=${post.tCityId}`}
                        >
                            {post.city}
                        </Link>
                    }
                />
                <CardMedia
                    className={classes.media}
                    image={post.tourImage}
                    title="tour"
                />
                <CardContent>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        <ClassIcon style={{ verticalAlign: "middle" }} />

                        {`  ${post.category}`}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        <GroupIcon style={{ verticalAlign: "middle" }} />

                        {`  ${post.groupSize} kişi`}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        <LocalOfferIcon style={{ verticalAlign: "middle" }} />

                        {`  ${post.price} ₺`}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        <TranslateIcon style={{ verticalAlign: "middle" }} />

                        {`  ${post.language}`}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton
                        onClick={() =>
                            (window.location.href = `tel:${post.phone}`)
                        }
                        aria-label="Call"
                    >
                        <PhoneIcon />
                    </IconButton>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>Kişisel Bilgiler:</Typography>
                        <Typography paragraph>{post.personalDetail}</Typography>
                        <Typography paragraph>Tur Planı:</Typography>
                        <Typography
                            paragraph
                            style={{ display: "inline-block" }}
                        >
                            {post.tourPlan}
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>

            {/* <Grid item xs={12} md={2}>
                    <h1>Hello {post.fname}</h1>
                </Grid>
                <Grid item xs={12} md={10}>
                    <img
                        alt="tour"
                        src={post.tourImage}
                        style={{ width: "30%", height: "30%" }}
                    />
                </Grid> */}
        </div>
    );
}

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
// import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { auth, database } from "../../firebase";
import authentication from "../../services/authentication";
import { iller } from "../../iller.js";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PhotoIcon from "@material-ui/icons/Photo";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

const useStyles = makeStyles((theme) => ({
    fab: {
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

export default function FloatingActionButtons(props) {
    const [open, setOpen] = useState(false);
    const [cityValue, setCityValue] = useState(iller[0]);
    const [cityInputValue, setCityInputValue] = useState("");
    const [tripName, setTripName] = useState("");
    const [tripPrice, setTripPrice] = useState();
    const [groupSize, setGroupSize] = useState();
    const [categories, setCategories] = useState([]);
    // Category name object
    const [categoryValue, setCategoryValue] = useState();
    // Category name label
    const [categoryInputValue, setCategoryInputValue] = useState("");
    // Description
    const [descriptionValue, setDiscriptionValue] = useState("");
    const [clicked, setClicked] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    const [post, setPost] = useState({
        category: "",
        city: "Adana",
        groupSize: 1,
        isCultural: "",
        isNatural: "",
        isNightlife: "",
        isPhotography: "",
        language: "",
        ownerId: "",
        personalDetail: "",
        phone: "",
        price: 0,
        profileImg: "",
        tCategoryId: "",
        tCityId: "p1",
        time: "",
        tourImage: "",
        tourName: "",
        tourPlan: "",
    });

    const theme = useTheme();
    // const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const handleClickOpen = () => {
        console.log(props.user);
        setPost({
            ...post,
            ownerId: props.user.uid,
            profileImg: props.user.photoURL ? props.user.photoURL : "",
            firestore: true,
        });
        setOpen(true);
    };

    const handleCreate = (e) => {
        setOpen(false);
        setClicked(true);

        console.log(cityValue);
        console.log(cityInputValue);

        console.log(post);
        // database.ref("user/").on("value", (snapshot) => {
        //     const users = snapshot.val();
        //     // const newState = [];
        //     // for (let category in Categories) {
        //     //     newState.push(Categories[category]);
        //     // }
        //     // setCategories(newState);
        //     if (users[props.user.uid]) {
        //         setIsCurrentUser(true)
        //     }
        //     // setCategoryValue(newState[0]);
        // });

        database.ref("tours").push().set(post);
    };
    const handleCancel = (e) => {
        setOpen(false);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const classes = useStyles();

    const [age, setAge] = React.useState("");

    const handleChange = (event) => {
        setPost({
            ...post,
            tCityId: "p" + event.target.value.plaka,
            city: event.target.value.il,
        });
        setAge(event.target.value);
    };

    useEffect(() => {
        database.ref("categories/").on("value", (snapshot) => {
            const Categories = snapshot.val();
            const newState = [];
            for (let category in Categories) {
                newState.push(Categories[category]);
            }
            setCategories(newState);
            console.log(newState);
            setCategoryValue(newState[0]);
        });
    }, []);
    useEffect(() => {
        if (clicked) {
            console.log(post);
            setPost({
                ...post,
                city: cityValue.il,
                tCityId: "p" + cityValue.plaka,
            });

            setClicked(false);
        }
    }, [cityInputValue]);

    return (
        <div className={classes.root}>
            <Fab
                onClick={handleClickOpen}
                color="primary"
                aria-label="add"
                className={classes.fab}
                // component={Link}
                // to="/search"
                // onClick={<Link to="/search" />}
            >
                <AddIcon />
            </Fab>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    Yeni Gezi Oluştur
                </DialogTitle>
                <DialogContent>
                    <TextField
                        value={post.tourName}
                        onChange={(e) => {
                            setPost({ ...post, tourName: e.target.value });
                        }}
                        autoFocus
                        // margin="dense"
                        fullWidth
                        required
                        id="name"
                        label="Gezi ismi"
                        type="name"
                        variant="outlined"
                        helperText="Gezinizin ismini giriniz"
                    />
                    <TextField
                        value={post.price}
                        onChange={(e) => {
                            setPost({ ...post, price: e.target.value });
                        }}
                        // margin="dense"
                        fullWidth
                        required
                        id="price"
                        label="Ücret"
                        type="number"
                        variant="outlined"
                        helperText="Gezinizin ücretini giriniz"
                    />
                    <TextField
                        value={post.groupSize}
                        onChange={(e) => {
                            setPost({ ...post, groupSize: e.target.value });
                        }}
                        // margin="dense"
                        fullWidth
                        required
                        id="size"
                        label="Kişi sayısı"
                        type="number"
                        variant="outlined"
                        helperText="Kişi sayısını giriniz"
                    />
                    <TextField
                        value={post.time}
                        onChange={(e) => {
                            setPost({ ...post, time: e.target.value });
                        }}
                        // margin="dense"
                        fullWidth
                        required
                        id="time"
                        label="Tur uzunluğu"
                        type="name"
                        variant="outlined"
                        helperText="Tur uzunluğunu giriniz"
                    />
                    <TextField
                        value={post.language}
                        onChange={(e) => {
                            setPost({ ...post, language: e.target.value });
                        }}
                        // margin="dense"
                        fullWidth
                        required
                        id="language"
                        label="Dil"
                        type="name"
                        variant="outlined"
                        helperText="Gezide kullanacağınız dili seçiniz"
                    />
                    <TextField
                        value={post.phone}
                        onChange={(e) => {
                            setPost({ ...post, phone: e.target.value });
                        }}
                        // margin="dense"
                        fullWidth
                        required
                        id="phone"
                        label="Telefon Numarası"
                        type="name"
                        variant="outlined"
                        helperText="Telefon numaranızı giriniz"
                    />
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="locationLabel">Şehir</InputLabel>
                        <Select
                            labelId="locationLabel"
                            id="location"
                            value={age}
                            onChange={handleChange}
                            label="location"
                        >
                            {/* <MenuItem value="">
                                <em>None</em>
                            </MenuItem> */}
                            {iller.map((v, i) => {
                                return (
                                    <MenuItem key={v.il} value={v} id={v.il}>
                                        {v.il}
                                    </MenuItem>
                                );

                                {
                                    /* console.log(v.il, v.plaka); */
                                }
                            })}
                            {/* <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem> */}
                        </Select>
                        <FormHelperText>
                            Gezinin yer aldığı şehiri seçiniz
                        </FormHelperText>
                    </FormControl>
                    {/* <Autocomplete
                        id="location"
                        // style={{ width: 300 }}
                        fullWidth
                        options={iller}
                        // classes={{
                        //     option: classes.option,
                        // }}
                        autoHighlight
                        getOptionLabel={(option) => option.il}
                        value={cityValue}
                        onChange={(event, newValue) => {
                            setCityValue(newValue);
                            console.log(cityValue);
                        }}
                        inputValue={cityInputValue}
                        onInputChange={(event, newInputValue) => {
                            setClicked(true);
                            setCityInputValue(newInputValue);
                            console.log(cityInputValue);
                        }}
                        noOptionsText="İl bulunamadı"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Şehirler"
                                variant="outlined"
                                fullWidth
                                helperText="Gezinin yer aldığı şehiri seçiniz"
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "new-password", // disable autocomplete and autofill
                                }}
                            />
                        )}
                    /> */}
                    {/* Yedek */}
                    {/* <Autocomplete
                        value={cityValue}
                        onChange={(event, newValue) => {
                            setCityValue(newValue);
                        }}
                        inputValue={cityInputValue}
                        onInputChange={(event, newInputValue) => {
                            console.log("önce", cityValue);
                            setPost({
                                ...post,
                                city: cityValue.il,
                                tCityId: "p" + cityValue.plaka,
                            });
                            console.log("sonra", cityValue);
                            setCityInputValue(newInputValue);
                        }}
                        noOptionsText="İl bulunamadı"
                        id="locations"
                        options={iller}
                        getOptionLabel={(option) => option.il}
                        style={{
                            // width: 300,
                            marginTop: "1em",
                            marginBottom: "1em",
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                label="Şehirler"
                                fullWidth
                                variant="outlined"
                                helperText="Gezinin yer aldığı şehiri seçiniz"
                            />
                        )}
                    /> */}
                    <Autocomplete
                        // margin="dense"
                        value={categoryValue}
                        onChange={(event, newValue) => {
                            setCategoryValue(newValue);
                        }}
                        inputValue={categoryInputValue.categoryLabel}
                        onInputChange={(event, newInputValue) => {
                            let categoryId = "";
                            let categoryType = "";
                            let oldCategoryType = "";
                            switch (newInputValue) {
                                case "Doğa Gezintisi":
                                    categoryId = "c1";
                                    categoryType = "isNatural";
                                    break;
                                case "Kültür Gezintisi":
                                    categoryId = "c2";
                                    categoryType = "isCultural";
                                    break;
                                case "Fotoğraf Gezintisi":
                                    categoryId = "c3";
                                    categoryType = "isPhotography";
                                    break;
                                case "Gece Hayatı":
                                    categoryId = "c4";
                                    categoryType = "isNightlife";
                                    break;

                                default:
                                    // categoryId = "c1";
                                    // categoryType = "isNatural";
                                    break;
                            }
                            console.log(categoryId);
                            console.log(categoryType);
                            if (categoryType != "") {
                                setPost({
                                    ...post,
                                    category: newInputValue,
                                    tCategoryId: categoryId,
                                    isNightlife: "",
                                    isPhotography: "",
                                    isCultural: "",
                                    isNatural: "",
                                    [categoryType]: "true",
                                });
                            }
                            setCategoryInputValue(newInputValue);
                        }}
                        noOptionsText="Kategori bulunamadı"
                        id="categories"
                        fullWidth
                        options={categories}
                        getOptionLabel={(option) => option.categoryLabel}
                        style={{
                            // width: 300,
                            marginTop: "1em",
                            marginBottom: "1em",
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                label="Kategoriler"
                                variant="outlined"
                                helperText="Gezinin kategorisini seçiniz"
                            />
                        )}
                    />
                    <TextField
                        value={post.tourPlan}
                        onChange={(e) => {
                            setPost({ ...post, tourPlan: e.target.value });
                        }}
                        id="tourPlan"
                        label="Tur Planı"
                        multiline
                        rows={4}
                        placeholder="Tur Planı..."
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        style={{ marginTop: "1em" }}
                        value={post.personalDetail}
                        onChange={(e) => {
                            setPost({
                                ...post,
                                personalDetail: e.target.value,
                            });
                        }}
                        id="personalDetail"
                        label="Kişisel Açıklama"
                        multiline
                        rows={4}
                        placeholder="Kişisel açıklama..."
                        fullWidth
                        variant="outlined"
                    />
                    <Button
                        style={{ marginTop: "1em" }}
                        color="primary"
                        component="span"
                        //   disabled={performingAction}
                        startIcon={<PhotoIcon />}
                        variant="contained"
                        fullWidth
                    >
                        Seç
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button id="cancel" onClick={handleCancel} color="primary">
                        İptal
                    </Button>
                    <Button id="create" onClick={handleCreate} color="primary">
                        Oluştur
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

import React, { Component } from "react";

import PropTypes from "prop-types";

import validate from "validate.js";

import { withStyles } from "@material-ui/core/styles";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Tooltip,
    IconButton,
    Hidden,
    Grid,
    Button,
    Divider,
    TextField,
} from "@material-ui/core";

import { Close as CloseIcon } from "@material-ui/icons";

import AuthProviderList from "../AuthProviderList";

import constraints from "../../constraints";
import authentication from "../../services/authentication";

const styles = (theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
    },

    icon: {
        marginRight: theme.spacing(0.5),
    },

    divider: {
        margin: "auto",
    },

    grid: {
        marginBottom: theme.spacing(2),
    },
});

const initialState = {
    performingAction: false,
    emailAddress: "",
    password: "",
    errors: null,
};

class SignInDialog extends Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    getSignInButton = () => {
        const { emailAddress, password, performingAction } = this.state;

        if (emailAddress && !password) {
            return (
                <Button
                    color="primary"
                    disabled={!emailAddress || performingAction}
                    variant="contained"
                    onClick={() => this.sendSignInLinkToEmail()}
                >
                    Giriş e-maili gönder
                </Button>
            );
        }

        return (
            <Button
                color="primary"
                disabled={!emailAddress || performingAction}
                variant="contained"
                onClick={() => this.signIn()}
            >
                Giriş yap
            </Button>
        );
    };

    resetPassword = () => {
        const { emailAddress } = this.state;

        const errors = validate(
            {
                emailAddress: emailAddress,
            },
            {
                emailAddress: constraints.emailAddress,
            }
        );

        if (errors) {
            this.setState({
                errors: errors,
            });
        } else {
            this.setState(
                {
                    errors: null,
                },
                () => {
                    this.setState(
                        {
                            performingAction: true,
                        },
                        () => {
                            authentication
                                .resetPassword(emailAddress)
                                .then((value) => {
                                    this.props.openSnackbar(
                                        `Şifre sıfırlama e-maili ${emailAddress} adrese gönderildi`
                                    );
                                })
                                .catch((reason) => {
                                    const code = reason.code;
                                    const message = reason.message;

                                    switch (code) {
                                        case "auth/invalid-email":
                                        case "auth/missing-android-pkg-name":
                                        case "auth/missing-continue-uri":
                                        case "auth/missing-ios-bundle-id":
                                        case "auth/invalid-continue-uri":
                                        case "auth/unauthorized-continue-uri":
                                        case "auth/user-not-found":
                                            this.props.openSnackbar(message);
                                            return;

                                        default:
                                            this.props.openSnackbar(message);
                                            return;
                                    }
                                })
                                .finally(() => {
                                    this.setState({
                                        performingAction: false,
                                    });
                                });
                        }
                    );
                }
            );
        }
    };

    signIn = () => {
        const { emailAddress, password } = this.state;

        const errors = validate(
            {
                emailAddress: emailAddress,
                password: password,
            },
            {
                emailAddress: constraints.emailAddress,
                password: constraints.password,
            }
        );

        if (errors) {
            this.setState({
                errors: errors,
            });
        } else {
            this.setState(
                {
                    performingAction: true,
                    errors: null,
                },
                () => {
                    authentication
                        .signIn(emailAddress, password)
                        .then((user) => {
                            this.props.dialogProps.onClose(() => {
                                const displayName = user.displayName;
                                const emailAddress = user.email;

                                this.props.openSnackbar(
                                    `${
                                        displayName || emailAddress
                                    } olarak giriş yapıldı`
                                );
                            });
                        })
                        .catch((reason) => {
                            console.log(reason);
                            const code = reason.code;
                            const message = reason.message;

                            switch (code) {
                                case "auth/invalid-email":
                                case "auth/user-disabled":
                                case "auth/user-not-found":
                                case "auth/wrong-password":
                                    this.props.openSnackbar(message);
                                    return;

                                default:
                                    this.props.openSnackbar(message);
                                    return;
                            }
                        })
                        .finally(() => {
                            this.setState({
                                performingAction: false,
                            });
                        });
                }
            );
        }
    };

    sendSignInLinkToEmail = () => {
        const { emailAddress } = this.state;

        const errors = validate(
            {
                emailAddress: emailAddress,
            },
            {
                emailAddress: constraints.emailAddress,
            }
        );

        if (errors) {
            this.setState({
                errors: errors,
            });

            return;
        }

        this.setState(
            {
                performingAction: true,
                errors: null,
            },
            () => {
                authentication
                    .sendSignInLinkToEmail(emailAddress)
                    .then(() => {
                        this.props.dialogProps.onClose(() => {
                            this.props.openSnackbar(
                                `Giriş linki ${emailAddress} adresine gönderildi`
                            );
                        });
                    })
                    .catch((reason) => {
                        const code = reason.code;
                        const message = reason.message;

                        switch (code) {
                            case "auth/argument-error":
                            case "auth/invalid-email":
                            case "auth/missing-android-pkg-name":
                            case "auth/missing-continue-uri":
                            case "auth/missing-ios-bundle-id":
                            case "auth/invalid-continue-uri":
                                this.props.openSnackbar(
                                    "Devam etme URL'i doğru değil"
                                );
                                return;
                            case "auth/unauthorized-continue-uri":
                                this.props.openSnackbar(message);
                                return;

                            default:
                                this.props.openSnackbar(message);
                                return;
                        }
                    })
                    .finally(() => {
                        this.setState({
                            performingAction: false,
                        });
                    });
            }
        );
    };

    signInWithAuthProvider = (providerId) => {
        this.setState(
            {
                performingAction: true,
            },
            () => {
                authentication
                    .signInWithAuthProvider(providerId)
                    .then((user) => {
                        this.props.dialogProps.onClose(() => {
                            const displayName = user.displayName;
                            const emailAddress = user.email;

                            this.props.openSnackbar(
                                `${
                                    displayName || emailAddress
                                } olarak giriş yapıldı`
                            );
                        });
                    })
                    .catch((reason) => {
                        const code = reason.code;
                        const message = reason.message;

                        switch (code) {
                            case "auth/account-exists-with-different-credential":
                            case "auth/auth-domain-config-required":
                            case "auth/cancelled-popup-request":
                            case "auth/operation-not-allowed":
                            case "auth/operation-not-supported-in-this-environment":
                            case "auth/popup-blocked":
                                this.props.openSnackbar(
                                    "Giriş ekranı bloke edildi"
                                );
                                return;
                            case "auth/popup-closed-by-user":
                                this.props.openSnackbar(
                                    "Pencere kullanıcı tarafından kapatıldı"
                                );
                                return;
                            case "auth/unauthorized-domain":
                                this.props.openSnackbar(message);
                                return;

                            default:
                                this.props.openSnackbar(message);
                                return;
                        }
                    })
                    .finally(() => {
                        this.setState({
                            performingAction: false,
                        });
                    });
            }
        );
    };

    handleKeyPress = (event) => {
        const { emailAddress, password } = this.state;

        if (!emailAddress && !password) {
            return;
        }

        const key = event.key;

        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }

        if (key === "Enter") {
            if (emailAddress && !password) {
                this.sendSignInLinkToEmail();
            } else {
                this.signIn();
            }
        }
    };

    handleExited = () => {
        this.setState(initialState);
    };

    handleEmailAddressChange = (event) => {
        const emailAddress = event.target.value;

        this.setState({
            emailAddress: emailAddress,
        });
    };

    handlePasswordChange = (event) => {
        const password = event.target.value;

        this.setState({
            password: password,
        });
    };

    render() {
        // Styling
        const { classes } = this.props;

        // Dialog Properties
        const { dialogProps } = this.props;

        const { performingAction, emailAddress, password, errors } = this.state;

        return (
            <Dialog
                fullWidth
                maxWidth="sm"
                disableBackdropClick={performingAction}
                disableEscapeKeyDown={performingAction}
                {...dialogProps}
                onKeyPress={this.handleKeyPress}
                onExited={this.handleExited}
            >
                <DialogTitle disableTypography>
                    <Typography variant="h6">Hesabınıza giriş yapın</Typography>

                    <Tooltip title="Close">
                        <IconButton
                            className={classes.closeButton}
                            disabled={performingAction}
                            onClick={dialogProps.onClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </DialogTitle>

                <DialogContent>
                    <Hidden xsDown>
                        <Grid container direction="row">
                            <Grid item xs={4}>
                                <AuthProviderList
                                    performingAction={performingAction}
                                    onAuthProviderClick={
                                        this.signInWithAuthProvider
                                    }
                                />
                            </Grid>

                            <Grid item xs={1}>
                                <Divider
                                    className={classes.divider}
                                    orientation="vertical"
                                />
                            </Grid>

                            <Grid item xs={7}>
                                <Grid container direction="column" spacing={2}>
                                    <Grid item xs>
                                        <TextField
                                            autoComplete="email"
                                            disabled={performingAction}
                                            error={
                                                !!(
                                                    errors &&
                                                    errors.emailAddress
                                                )
                                            }
                                            fullWidth
                                            helperText={
                                                errors && errors.emailAddress
                                                    ? errors.emailAddress[0]
                                                    : ""
                                            }
                                            label="E-mail adresi"
                                            placeholder="john@doe.com"
                                            required
                                            type="email"
                                            value={emailAddress}
                                            variant="outlined"
                                            InputLabelProps={{
                                                required: false,
                                            }}
                                            onChange={
                                                this.handleEmailAddressChange
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs>
                                        <TextField
                                            autoComplete="current-password"
                                            disabled={performingAction}
                                            error={
                                                !!(errors && errors.password)
                                            }
                                            fullWidth
                                            helperText={
                                                errors && errors.password
                                                    ? errors.password[0]
                                                    : ""
                                            }
                                            label="Parola"
                                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                                            required
                                            type="password"
                                            value={password}
                                            variant="outlined"
                                            InputLabelProps={{
                                                required: false,
                                            }}
                                            onChange={this.handlePasswordChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Hidden>

                    <Hidden smUp>
                        <AuthProviderList
                            gutterBottom
                            performingAction={performingAction}
                            onAuthProviderClick={this.signInWithAuthProvider}
                        />

                        <Grid container direction="column" spacing={2}>
                            <Grid item xs>
                                <TextField
                                    autoComplete="email"
                                    disabled={performingAction}
                                    error={!!(errors && errors.emailAddress)}
                                    fullWidth
                                    helperText={
                                        errors && errors.emailAddress
                                            ? errors.emailAddress[0]
                                            : ""
                                    }
                                    label="E-mail adresi"
                                    placeholder="john@doe.com"
                                    required
                                    type="email"
                                    value={emailAddress}
                                    variant="outlined"
                                    InputLabelProps={{ required: false }}
                                    onChange={this.handleEmailAddressChange}
                                />
                            </Grid>

                            <Grid item xs>
                                <TextField
                                    autoComplete="current-password"
                                    disabled={performingAction}
                                    error={!!(errors && errors.password)}
                                    fullWidth
                                    helperText={
                                        errors && errors.password
                                            ? errors.password[0]
                                            : ""
                                    }
                                    label="Parola"
                                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                                    required
                                    type="password"
                                    value={password}
                                    variant="outlined"
                                    InputLabelProps={{ required: false }}
                                    onChange={this.handlePasswordChange}
                                />
                            </Grid>
                        </Grid>
                    </Hidden>
                </DialogContent>

                <DialogActions>
                    <Button
                        color="primary"
                        disabled={!emailAddress || performingAction}
                        variant="outlined"
                        onClick={this.resetPassword}
                    >
                        Şifre Sıfırla
                    </Button>

                    {this.getSignInButton()}
                </DialogActions>
            </Dialog>
        );
    }
}

SignInDialog.propTypes = {
    // Styling
    classes: PropTypes.object.isRequired,

    // Dialog Properties
    dialogProps: PropTypes.object.isRequired,

    // Custom Functions
    openSnackbar: PropTypes.func.isRequired,
};

export default withStyles(styles)(SignInDialog);

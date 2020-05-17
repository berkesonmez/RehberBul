import React, { Component } from "react";

import PropTypes from "prop-types";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Hidden,
    Box,
    TextField,
    Button,
} from "@material-ui/core";

const initialState = {
    username: "",
};

class DeleteAccountDialog extends Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    handleKeyPress = (event) => {
        const { userData } = this.props;

        if (userData && userData.username) {
            const { username } = this.state;

            if (!username) {
                return;
            }

            if (username !== userData.username) {
                return;
            }
        }

        const key = event.key;

        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }

        if (key === "Enter") {
            this.props.deleteAccount();
        }
    };

    handleExited = () => {
        this.setState(initialState);
    };

    handleUsernameChange = (event) => {
        const username = event.target.value;

        this.setState({
            username: username,
        });
    };

    render() {
        // Dialog Properties
        const { dialogProps } = this.props;

        // Custom Properties
        const { performingAction, userData } = this.props;

        // Custom Functions
        const { deleteAccount } = this.props;

        const { username } = this.state;

        const hasUsername = userData && userData.username;

        return (
            <Dialog
                {...dialogProps}
                onKeyPress={this.handleKeyPress}
                onExited={this.handleExited}
            >
                <DialogTitle>Hesabı sil?</DialogTitle>

                <DialogContent>
                    <Box mb={hasUsername ? 2 : 0}>
                        <DialogContentText>
                            Silinen hesaplar kurtarılamaz. Hesabınızla ilişkili
                            tüm veriler silinecek.
                        </DialogContentText>

                        {hasUsername && (
                            <DialogContentText>
                                Hesabınızı silmek için kullanıcı isminizi yazın
                                ve <Hidden xsDown>tıklayın</Hidden>
                                <Hidden smUp>dokunun</Hidden>
                            </DialogContentText>
                        )}
                    </Box>

                    {hasUsername && (
                        <TextField
                            autoComplete="username"
                            autoFocus
                            color="secondary"
                            disabled={performingAction}
                            fullWidth
                            label="Kullanıcı ismi"
                            placeholder={userData.username}
                            required
                            type="text"
                            value={username}
                            variant="outlined"
                            onChange={this.handleUsernameChange}
                        />
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        color="secondary"
                        disabled={performingAction}
                        onClick={dialogProps.onClose}
                    >
                        Vazgeç
                    </Button>
                    <Button
                        color="secondary"
                        disabled={
                            performingAction ||
                            (hasUsername && username !== userData.username)
                        }
                        variant="contained"
                        onClick={deleteAccount}
                    >
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

DeleteAccountDialog.propTypes = {
    // Dialog Properties
    dialogProps: PropTypes.object.isRequired,

    // Custom Properties
    performingAction: PropTypes.bool.isRequired,
    userData: PropTypes.object,

    // Custom Functions
    deleteAccount: PropTypes.func.isRequired,
};

export default DeleteAccountDialog;

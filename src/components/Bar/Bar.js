import React, { Component } from "react";

import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import SearchField from "../SearchField";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    ButtonGroup,
    Button,
    IconButton,
    Divider,
    Menu,
    MenuItem,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import UserAvatar from "../UserAvatar";

class Bar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menu: {
                anchorEl: null,
            },
        };
    }
    openMenu = (event) => {
        const anchorEl = event.currentTarget;

        this.setState({
            menu: {
                anchorEl,
            },
        });
    };

    closeMenu = () => {
        this.setState({
            menu: {
                anchorEl: null,
            },
        });
    };

    // handleKeyPress(target) {
    //     console.log(target.key);
    //     if (target.key === "Enter") {
    //         this.props.history.push(`/search`);
    //     }
    // }
    render() {
        // Properties
        const { performingAction, user, userData, roles } = this.props;
        // console.log(userData);

        // Events
        const {
            onAboutClick,
            onSettingsClick,
            onSignOutClick,
            onSignUpClick,
            onSignInClick,
        } = this.props;

        const { menu } = this.state;

        const menuItems = [
            {
                name: "Hakkında",
                onClick: onAboutClick,
            },
            {
                name: "Profil",
                to: user ? `/search?uid=${user.uid}` : null,
            },
            {
                name: "Ayarlar",
                onClick: onSettingsClick,
            },
            {
                name: "Çıkış yap",
                divide: true,
                onClick: onSignOutClick,
            },
        ];

        return (
            <AppBar color="primary" position="static">
                <Toolbar>
                    <Box display="flex" flexGrow={1}>
                        <Typography color="inherit" variant="h6">
                            <IconButton
                                aria-label="home"
                                component={Link}
                                to="/"
                            >
                                <HomeIcon />
                            </IconButton>
                        </Typography>
                    </Box>

                    <SearchField onKeyPress={this.handleKeyPress} />

                    {user && (
                        <>
                            {roles.includes("admin") && (
                                <Box mr={1}>
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to="/admin"
                                        variant="outlined"
                                    >
                                        Admin
                                    </Button>
                                </Box>
                            )}

                            <IconButton
                                color="inherit"
                                disabled={performingAction}
                                onClick={this.openMenu}
                            >
                                <UserAvatar
                                    user={Object.assign(user, userData)}
                                />
                            </IconButton>

                            <Menu
                                anchorEl={menu.anchorEl}
                                open={Boolean(menu.anchorEl)}
                                onClose={this.closeMenu}
                            >
                                {menuItems.map((menuItem, index) => {
                                    if (
                                        menuItem.hasOwnProperty("condition") &&
                                        !menuItem.condition
                                    ) {
                                        return null;
                                    }

                                    let component = null;

                                    if (menuItem.to) {
                                        component = (
                                            <MenuItem
                                                key={index}
                                                component={Link}
                                                to={menuItem.to}
                                                onClick={this.closeMenu}
                                            >
                                                {menuItem.name}
                                            </MenuItem>
                                        );
                                    } else {
                                        component = (
                                            <MenuItem
                                                key={index}
                                                onClick={() => {
                                                    this.closeMenu();

                                                    menuItem.onClick();
                                                }}
                                            >
                                                {menuItem.name}
                                            </MenuItem>
                                        );
                                    }

                                    if (menuItem.divide) {
                                        return (
                                            <span key={index}>
                                                <Divider />

                                                {component}
                                            </span>
                                        );
                                    }

                                    return component;
                                })}
                            </Menu>
                        </>
                    )}

                    {!user && (
                        <ButtonGroup
                            color="inherit"
                            disabled={performingAction}
                            variant="outlined"
                        >
                            <Button onClick={onSignUpClick}>Kayıt Ol</Button>
                            <Button onClick={onSignInClick}>Giriş Yap</Button>
                        </ButtonGroup>
                    )}
                </Toolbar>
            </AppBar>
        );
    }
}

Bar.defaultProps = {
    performingAction: false,
};

Bar.propTypes = {
    // Properties
    performingAction: PropTypes.bool.isRequired,
    user: PropTypes.object,
    userData: PropTypes.object,

    // Events
    onAboutClick: PropTypes.func.isRequired,
    onSettingsClick: PropTypes.func.isRequired,
    onSignOutClick: PropTypes.func.isRequired,
};

export default Bar;

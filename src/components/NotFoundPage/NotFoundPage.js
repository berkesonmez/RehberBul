import React, { Component } from "react";

import { Link } from "react-router-dom";

import { Fab, Box } from "@material-ui/core";

import { Home as HomeIcon } from "@material-ui/icons";

import EmptyState from "../EmptyState";

import { ReactComponent as NotFoundIllustration } from "../../illustrations/not-found.svg";

class NotFoundPage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{ marginTop: "10em" }}>
                <EmptyState
                    image={<NotFoundIllustration />}
                    title={
                        this.props.title
                            ? this.props.title
                            : "Aradığınız sayfa bulunamadı"
                    }
                    description={
                        this.props.subtitle
                            ? this.props.subtitle
                            : "Erişmeye çalıştığınız sayfa mevcut değil"
                    }
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
            </div>
        );
    }
}

export default NotFoundPage;

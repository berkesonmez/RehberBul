import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as InsertBlockIllustration } from "../../illustrations/undraw_traveling_t8y2.svg";
import EmptyState from "../EmptyState";

const useStyles = makeStyles({
    root: {
        "margin-top": "1rem",
    },
});

export default function WelcomePage(props) {
    const classes = useStyles();

    return (
        // <Box textAlign="center">
        // <Box mb={!props.description && props.button ? 2 : 0}>
        //                 <Typography variant={variant}>{props.title}</Typography>
        //             </Box>
        //     <InsertBlockIllustration className={classes.root} />
        // </Box>
        <div className={classes.root}>
            <EmptyState
                image={<InsertBlockIllustration />}
                size="small"
                title="RehberBul"
            />
        </div>
    );
}

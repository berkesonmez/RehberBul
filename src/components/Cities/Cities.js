import React from "react";
import { Grid } from "@material-ui/core";
import PostCard from "../PostCard";
import { Link } from "react-router-dom";
export default function Cities(props) {
    return (
        <Grid container spacing={7} alignItems="center">
            {props.cities.map((city, id) => {
                return (
                    <Grid item xl={2} md={3} sm={6} xs={12} key={city.cityId}>
                        <Link
                            to={`/search?l=${city.cityId}`}
                            style={{ textDecoration: "none" }}
                        >
                            <PostCard
                                title={city.cityLabel}
                                image={city.cityPhoto}

                                // subtitle={
                                //     "Size aileden biri gibi davranan rehberlerle doğa gezintisinin keyfini çıkartın."
                                // }
                            />
                        </Link>
                    </Grid>
                );
            })}
        </Grid>
    );
}

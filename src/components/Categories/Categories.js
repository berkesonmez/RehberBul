import React from "react";
import { Grid } from "@material-ui/core";
import PostCard from "../PostCard";
import { Link } from "react-router-dom";
function Categories(props) {
    return (
        <Grid container spacing={7} alignItems="center">
            {props.categories.map((category, id) => {
                return (
                    <Grid
                        item
                        xl={2}
                        md={3}
                        sm={6}
                        xs={12}
                        key={category.categoryId}
                    >
                        <Link
                            to={`/search?c=${category.categoryId}`}
                            style={{ textDecoration: "none" }}
                        >
                            <PostCard
                                title={category.categoryLabel}
                                image={category.categoryPhoto}
                                subtitle={category.categoryText}
                            />
                        </Link>
                    </Grid>
                );
            })}
        </Grid>
    );
}

export default Categories;

import React, { useState } from "react";
import { Page } from "../../redux/slices/pages";
import "./PageLink.css";
import {useNavigate} from "react-router-dom";


interface LinkItemProps {
    relativeUrl: string;
    title: string;
    children: Page[];
}

export default function PageLink(props: LinkItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const classes: string[] = ["nav-link-text"];
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        navigate(props.relativeUrl);
    };


    const pathname = window.location.pathname;

    if (pathname === props.relativeUrl) {
        classes.push("selected-nav-link");
    } else if (isHovered) {
        classes.push("selected-nav-link");
    } else {
        classes.push("unselected-nav-link");
    }

    return (
        <div
            className="nav-link-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <span className={classes.join(" ")}>{props.title}</span>
        </div>
    );
}

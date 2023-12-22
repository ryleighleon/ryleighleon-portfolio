import React, { useState } from "react";
import { Page } from "../../redux/slices/pages";
import "./PageLink.css";
import {useLocation, useNavigate} from "react-router-dom";


interface LinkItemProps {
    relativeUrl: string;
    title: string;
    children: Page[];
}

export default function PageLink(props: LinkItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const classes: string[] = ['nav-link-text'];
    const navigate = useNavigate();
    const children = props.children;

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        console.log('mouse leaving');
        setIsHovered(false);
    };

    const handleParentClick = () => {
        if (children.length === 0){
            navigateToLink(props.relativeUrl);
        }
    };

    const navigateToLink = (toNavigate: string) => {
        navigate(toNavigate);
        setIsHovered(false);
    }

    const location = useLocation();
    const pathname = location.pathname;

    if (pathname === props.relativeUrl || isHovered) {
        classes.push('selected-nav-link');
    } else {
        classes.push('unselected-nav-link');
    }
    if (children.length === 0){
        classes.push('clickable-text');
    } else {
        classes.push('not-clickable-text');
    }

    return (
        <div
            className="nav-link-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}

        >
            <span className={classes.join(' ')} onClick={handleParentClick}>{props.title}</span>
            {isHovered && children && (
                <ul className="child-list">
                    {children.map((child, index) => (
                        <li key={index} onClick={() => navigateToLink(child.relativeLink)}>
                            {child.shortTitle}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

import React from "react";
import {getFile} from "../../App";
import './HomePage.css';

export default function HomePage(){
    return (
        <div className={'introduction'}>
            <img src={getFile('profPic.jpg')} alt={'Profile'} className={'profile-pic'}/>
            <div className={'intro-text-container'}>
                <span className={'welcome-text'}>Welcome!</span>
                <span className={'explore-text'}>Explore My Work</span>
                <span className={'grab-snack-text'}>Grab a snack and stay awhile</span>
            </div>
        </div>
    );
}
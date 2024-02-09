import React from "react";
import {getFile} from "../../../App";
import './MobileHome.css';

export default function HomePage(){
    return (
        <div className={'mobile-homepage page'} >
            <div className={'mobile-introduction'}>
                <img src={getFile('homePic.jpg')} alt={'Profile'} className={'mobile-profile-pic'}/>
                <div className={'mobile-intro-text-container'}>
                    <span className={'mobile-not-found-title'}>Welcome!</span>
                    <span className={'mobile-explore-text'}>Explore My Work</span>
                    <span className={'mobile-grab-snack-text'}>Grab a snack and stay awhile</span>
                </div>
            </div>
        </div>

    );
}
import React from "react";
import {getRegularImage} from "../../../App";
import './MobileAbout.css';

export default function MobileAbout(){
    return (
        <div className={'mobile-homepage page'} >
            <div className={'mobile-introduction'}>
                <img src={getRegularImage('homePic.jpg')} alt={'Profile'} className={'mobile-profile-pic'}/>
                <div className={'mobile-intro-text-container'}>
                    <span className={'mobile-not-found-title'}>Welcome!</span>
                    <span className={'mobile-explore-text'}>Explore My Work</span>
                    <span className={'mobile-grab-snack-text'}>Grab a snack and stay awhile</span>
                </div>
            </div>
        </div>

    );
}
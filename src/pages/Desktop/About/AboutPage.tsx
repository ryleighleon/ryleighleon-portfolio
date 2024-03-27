import React from "react";
import {getRegularImage} from "../../../App";
import './AboutPage.css';
import ContactForm from "../../../components/ContactForm/ContactForm";

export default function AboutPage(){
    return (
        <div className={'homepage page'} >
            <div className={'introduction'}>
                <img src={getRegularImage('homePic.jpg')} alt={'Profile'} className={'profile-pic'}/>
                <div className={'intro-text-container'}>
                    <span className={'not-found-title'}>Welcome!</span>
                    <span className={'explore-text'}>Explore My Work</span>
                    <span className={'grab-snack-text'}>Grab a snack and stay awhile</span>
                </div>
            </div>
            <div className={'contact-form-container'}>
                <ContactForm/>
            </div>
        </div>

    );
}
import React from "react";
import {getFile} from "../../App";
import './HomePage.css';
import ContactForm from "../../components/ContactForm/ContactForm";

export default function HomePage(){
    return (
        <div className={'homepage page'} >
            <div className={'introduction'}>
                <img src={getFile('homePic.jpg')} alt={'Profile'} className={'profile-pic'}/>
                <div className={'intro-text-container'}>
                    <span className={'not-found-title'}>Welcome!</span>
                    <span className={'explore-text'}>Explore My Work</span>
                    <span className={'grab-snack-text'}>Grab a snack and stay awhile</span>
                </div>
            </div>
            <div className={'contact-form-container'}>
                <ContactForm color={'yellow'}/>
            </div>
        </div>

    );
}
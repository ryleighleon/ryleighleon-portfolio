import React from "react";
import {getRegularImage} from "../../App";
import './Footer.css';

export default function Footer(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    return (
        <div className={'footer-container'}>
            <span className={'footer-name'}>Ryleigh Leon</span>
            <a href='mailto:ryleighleon@gmail.com' className={'email'}>ryleighleon@gmail.com</a>
            <div className={'footer-socials'}>
                <a href={'https://www.linkedin.com/in/ryleigh-leon'} target="_blank" rel="noopener noreferrer">
                    <img src={getRegularImage('LinkedInBlack.png')} alt={'LinkedIn'} className={'social-icon'}/>
                </a>
                <a href={'https://www.instagram.com/ryleighleon.design'} target="_blank" rel="noopener noreferrer">
                    <img src={getRegularImage('InstagramBlack.png')} alt={'Instagram'} className={'social-icon'}/>
                </a>
            </div>
            <span className={'copyright'}>{`©${currentYear} by Ryleigh Leon`}</span>
        </div>
    );
}
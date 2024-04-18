import React from "react";
import {getIconImage} from "../../App";
import './MobileFooter.css';

export default function MobileFooter(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    return (
        <div className={'mobile-footer-container'}>
            <div className={'mobile-footer-border'}/>
            <span className={'mobile-footer-name'}>Ryleigh Leon</span>
            <a href='mailto:ryleighleon@gmail.com' className={'mobile-email'}>ryleighleon@gmail.com</a>
            <div className={'mobile-footer-socials'}>
                <a href={'https://www.linkedin.com/in/ryleigh-leon'} target="_blank" rel="noopener noreferrer">
                    <img src={getIconImage('LinkedInBlack.png')} alt={'LinkedIn'} className={'mobile-footer-social-icon'}/>
                </a>
                <a href={'https://www.instagram.com/ryleighleon.design'} target="_blank" rel="noopener noreferrer">
                    <img src={getIconImage('InstagramBlack.png')} alt={'Instagram'} className={'mobile-footer-social-icon'}/>
                </a>
            </div>
            <span className={'mobile-copyright'}>{`©${currentYear} by Ryleigh Leon`}</span>
        </div>
    );
}
import React, {useEffect, useState} from "react";
import {getFile, getRootFileText} from "../../../App";
import './MobilePortfolio.css';

export default function MobilePortfolio(){
    const [aboutMeText, setAboutMeText] = useState('');

    useEffect(() => {
        const populateBio = async () => {
            const bio = await getRootFileText('Bio.txt');
            setAboutMeText(bio);
        }
        populateBio();
    }, []);

    return (
        <div className={'mobile-about-page page'}>
            <img src={getFile('aboutPic.jpeg')} alt={'Profile'} className={'mobile-about-pic'}/>
            <div className={'mobile-about-text-container'}>
                <span className={'mobile-about-me-title'}>Get to know me!</span>
                <span className={'mobile-about-me-body'}>{aboutMeText}</span>
            </div>
        </div>
    );
}
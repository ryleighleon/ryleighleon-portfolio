import React, {useEffect, useState} from "react";
import {getFile, getRootFileText} from "../../App";
import './AboutPage.css';

export default function AboutPage(){
    const [aboutMeText, setAboutMeText] = useState('');

    useEffect(() => {
        const populateBio = async () => {
            const bio = await getRootFileText('Bio.txt');
            setAboutMeText(bio);
        }
        populateBio();
    }, []);

    return (
        <div className={'about-page page'}>
            <img src={getFile('aboutPic.jpeg')} alt={'Profile'} className={'about-pic'}/>
            <div className={'about-text-container'}>
                <span className={'about-me-title'}>Get to know me!</span>
                <span className={'about-me-body'}>{aboutMeText}</span>
            </div>
        </div>
    );
}
import React from "react";
import './ChristmasPage.css';
import {useNavigate} from "react-router-dom";
import {getRegularImage} from "../../../App";

export default function ChristmasPage(){
    const navigate = useNavigate();
    function redirectToHome(){
        navigate('/');
    }
    return (
        <div className={'christmas-container'}>
            <img src={getRegularImage('christmasWreath.png')} alt={'wreath'} className={'wreath-img'}/>
            <span className={'christmas-title'}>Merry Christmas Ryleigh!</span>
            <span className={'christmas-desc'}>I recreated and hosted your site, so you can use a custom domain for it.</span>
            <span className={'christmas-desc'}>ryleighleon.com, ryleigh.design, anything you can imagine for $10-15 a year!</span>
            <div className={'christmas-body-container'}>
                <span className={'christmas-body'}>Click </span>
                <span className={'christmas-link christmas-body'} onClick={redirectToHome}>here</span>
                <span className={'christmas-body'}> to see your site!</span>
            </div>
        </div>
    );
}
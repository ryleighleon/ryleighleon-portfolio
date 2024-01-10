import React from "react";
import './MobileChristmasPage.css';
import {useNavigate} from "react-router-dom";
import {getFile} from "../../App";

export default function MobileChristmasPage(){
    const navigate = useNavigate();
    function redirectToHome(){
        navigate('/');
    }
    return (
        <div className={'mobile-christmas-container page'}>
            <img src={getFile('christmasWreath.png')} alt={'wreath'} className={'mobile-wreath-img'}/>
            <span className={'mobile-christmas-title'}>Merry Christmas Ryleigh!</span>
            <span className={'mobile-christmas-desc'}>I recreated and hosted your site, so you can use a custom domain for it.</span>
            <span className={'mobile-christmas-desc'}>ryleighleon.com, ryleigh.design, anything you can imagine for $10-15 a year!</span>
            <div className={'mobile-christmas-body-container'}>
                <span className={'mobile-christmas-body'}>Click </span>
                <span className={'mobile-christmas-link mobile-christmas-body'} onClick={redirectToHome}>here</span>
                <span className={'mobile-christmas-body'}> to see your site!</span>
            </div>
        </div>
    );
}
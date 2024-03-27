import React from "react";
import {useAppSelector} from "../../redux/hooks";
import './NavBar.css';
import PageLink from "../PageLink/PageLink";
import {getFile} from "../../App";
import {Page} from "../../redux/slices/pages";
import {useNavigate} from "react-router-dom";

export default function NavBar(){
    const pages = useAppSelector(state => state.pages.pages);
    const navigate = useNavigate();
    const pagesWithoutPortfolio = pages.filter((page: Page) => page.relativeLink !== '/');

    function redirectHome(){
        navigate('/');
    }
    return (
        <div className={'nav-bar'}>
            <div className={'nav-logo'} onClick={redirectHome}>
                <img className={'logo-image'} src={getFile('LogoFull.png')} alt={'logo'}/>
            </div>
            <div className={'nav-links'}>
                <PageLink title={'Portfolio'} relativeUrl={'/'} key={'portfolio-link'} children={[]}/>
                <PageLink title={'Work'} key={'work'} children={pagesWithoutPortfolio}/>
                <PageLink relativeUrl={'/about'} title={'About'} key={'about'} children={[]}/>
                <a href={'https://www.linkedin.com/in/ryleigh-leon'} target="_blank" rel="noopener noreferrer">
                    <img src={getFile('LinkedInBlack.png')} alt={'LinkedIn'} className={'social-icon'}/>
                </a>
                <a href={'https://www.instagram.com/ryleighleon.design'} target="_blank" rel="noopener noreferrer">
                    <img src={getFile('InstagramBlack.png')} alt={'Instagram'} className={'social-icon'}/>
                </a>
            </div>
        </div>
    )
}
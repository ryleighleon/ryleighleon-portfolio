import React from "react";
import {useAppSelector} from "../../redux/hooks";
import './NavBar.css';
import PageLink from "../PageLink/PageLink";
import {getRegularImage} from "../../App";
import {Page} from "../../redux/slices/pages";
import {useNavigate} from "react-router-dom";

interface NavBarProps {
    setShowProjectOverlay: (show: boolean) => void;
}

export default function NavBar(props: NavBarProps){
    const pages = useAppSelector(state => state.pages.pages);
    const navigate = useNavigate();
    const pagesWithoutPortfolio = pages.filter((page: Page) => page.relativeLink !== '/');

    function redirectHome(){
        navigate('/');
        props.setShowProjectOverlay(false);
    }
    return (
        <div className={'nav-bar'}>
            <div className={'nav-logo'} onClick={redirectHome}>
                <img className={'logo-image'} src={getRegularImage('Logofull.png')} alt={'logo'}/>
            </div>
            <div className={'nav-links'}>
                <PageLink title={'Portfolio'} relativeUrl={'/'} key={'portfolio-link'} children={[]} setShowProjectOverlay={props.setShowProjectOverlay}/>
                <PageLink title={'Work'} key={'work'} children={pagesWithoutPortfolio} setShowProjectOverlay={props.setShowProjectOverlay}/>
                <PageLink relativeUrl={'/about'} title={'About'} key={'about'} children={[]} setShowProjectOverlay={props.setShowProjectOverlay}/>
                <a href={'https://www.linkedin.com/in/ryleigh-leon'} target="_blank" rel="noopener noreferrer">
                    <img src={getRegularImage('LinkedInBlack.png')} alt={'LinkedIn'} className={'social-icon'}/>
                </a>
                <a href={'https://www.instagram.com/ryleighleon.design'} target="_blank" rel="noopener noreferrer">
                    <img src={getRegularImage('InstagramBlack.png')} alt={'Instagram'} className={'social-icon'}/>
                </a>
            </div>
        </div>
    )
}
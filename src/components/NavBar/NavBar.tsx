import React from "react";
import {useAppSelector} from "../../redux/hooks";
import './NavBar.css';
import PageLink from "../PageLink/PageLink";
import {getFile} from "../../App";

export default function NavBar(){
    const pages = useAppSelector(state => state.pages.pages);
    return (
        <div className={'nav-bar'}>
            <div className={'nav-logo'}>
                <img className={'logo-image'} src={getFile('logo.png')} alt={'logo'}/>
                <span className={'name-title'}>Ryleigh Leon</span>
            </div>
            <div className={'nav-links'}>
                <PageLink title={'Home'} relativeUrl={'/'} key={'home'} children={[]}/>
                {pages.map((page, index) => {
                    return <PageLink
                        title={page.shortTitle}
                        relativeUrl={page.relativeLink}
                        key={`${page.shortTitle}-${index}`}
                        children={page.children}
                    />;
                })}
                <PageLink title={'More'} relativeUrl={'/more'} key={'more'} children={[]}/>
                <a href={'https://www.linkedin.com/in/ryleigh-leon'} target="_blank" rel="noopener noreferrer">
                    <img src={getFile('LinkedInWhite.png')} alt={'LinkedIn'} className={'social-icon'}/>
                </a>
                <a href={'https://www.instagram.com/ryleighleon.design'} target="_blank" rel="noopener noreferrer">
                    <img src={getFile('InstagramWhite.png')} alt={'Instagram'} className={'social-icon'}/>
                </a>
            </div>
        </div>
    )
}
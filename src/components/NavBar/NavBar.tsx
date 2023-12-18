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
                {pages.map(page => {
                    return <PageLink
                        title={page.shortTitle}
                        relativeUrl={page.relativeLink}
                        key={page.shortTitle}
                        children={page.children}
                    />;
                })}
                <img src={getFile('LinkedIn.png')} alt={'LinkedIn'} className={'social-icon'}/>
                <img src={getFile('Instagram.png')} alt={'Instagram'} className={'social-icon'}/>
            </div>
        </div>
    )
}
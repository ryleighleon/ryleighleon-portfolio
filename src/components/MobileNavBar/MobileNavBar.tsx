import React, {useEffect, useState} from "react";
import {useAppSelector} from "../../redux/hooks";
import './MobileNavBar.css';
import {getFile} from "../../App";
import {Page} from "../../redux/slices/pages";
import {useNavigate} from "react-router-dom";

export default function MobileNavBar(){
    const pages = useAppSelector(state => state.pages.pages);
    const [allPages, setAllPages] = useState<Page[]>([]);
    const navigate = useNavigate();
    const aboutPage: Page = {
        children: [], relativeLink: "/more/about", shortTitle: "About Me"
    }
    const contactPage: Page = {
        children: [], relativeLink: "/more/contact", shortTitle: "Contact"
    }

    useEffect(() => {
        const tempPages = pages.slice();
        tempPages.push(aboutPage);
        tempPages.push(contactPage);
        setAllPages(tempPages);
    }, [pages]);

    function redirectHome(){
        navigate('/');
    }
    return (
        <div className={'mobile-nav-bar'}>
            <img className={'mobile-logo-image'} src={getFile('logo.png')} alt={'logo'} onClick={redirectHome}/>
            <img src={getFile('hamburgerIcon.png')} alt={'nav'} className={'mobile-hamburger-icon'}/>
        </div>
    )
}
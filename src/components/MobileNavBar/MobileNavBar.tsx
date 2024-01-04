import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import './MobileNavBar.css';
import { getFile } from "../../App";
import { Page } from "../../redux/slices/pages";
import { useNavigate } from "react-router-dom";

export default function MobileNavBar() {
    const pages = useAppSelector(state => state.pages.pages);
    const [allPages, setAllPages] = useState<Page[]>([]);
    const [showPages, setShowPages] = useState(false);
    const navigate = useNavigate();
    const aboutPage: Page = {
        children: [],
        relativeLink: "/more/about",
        shortTitle: "About Me"
    };
    const contactPage: Page = {
        children: [],
        relativeLink: "/more/contact",
        shortTitle: "Contact"
    };

    function resetAllPages(){
        const tempPages = pages.slice();
        tempPages.push(aboutPage);
        tempPages.push(contactPage);
        setAllPages(tempPages);
    }

    useEffect(() => {
        resetAllPages();
    }, [pages]);

    function redirectHome() {
        navigate('/');
    }

    function handleHamburgerClick() {
        setShowPages(!showPages);
    }

    function handlePageClick(page: Page) {
        if (page.children.length === 0){
            navigate(page.relativeLink);
            resetAllPages();
            setShowPages(false);
        } else {
            setAllPages(page.children);
        }
    }

    return (
        <div className={'mobile-nav-bar'}>
            <img className={'mobile-logo-image'} src={getFile('logo.png')} alt={'logo'} onClick={redirectHome} />
            <span className={'mobile-name-title'}>Ryleigh Leon</span>
            <img src={getFile('hamburgerIcon.png')} alt={'nav'} className={'mobile-hamburger-icon'} onClick={handleHamburgerClick} />

            {showPages && (
                <div className={'mobile-pages-list'}>
                    <span className={'mobile-close-button'} onClick={() => setShowPages(false)}>X</span>
                    <ul>
                        {allPages.map((page, index) => (
                            <li key={index} onClick={() => handlePageClick(page)}>
                                {page.children.length > 0 ? (
                                    <span>{page.shortTitle}</span>
                                ) : (
                                    <span>{page.shortTitle}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

}

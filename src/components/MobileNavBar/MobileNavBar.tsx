import React, {useEffect, useState} from "react";
import { useAppSelector } from "../../redux/hooks";
import './MobileNavBar.css';
import { getRegularImage } from "../../App";
import { Page } from "../../redux/slices/pages";
import { useNavigate } from "react-router-dom";

export default function MobileNavBar() {
    const pages = useAppSelector(state => state.pages.pages);
    const [showPages, setShowPages] = useState(false);
    const navigate = useNavigate();

    function resetAllPages(){

    }

    useEffect(() => {
        function clearPageDropdown(){

        }
        clearPageDropdown();
    }, [pages]);

    function redirectHome() {
        navigate('/');
    }

    function handleHamburgerClick() {
        setShowPages(!showPages);
    }

    // function handlePageClick(page: Page) {
    //     if (page.children.length === 0){
    //         navigate(page.relativeLink);
    //         resetAllPages();
    //         setShowPages(false);
    //     } else {
    //         setAllPages(page.children);
    //     }
    // }

    function closeOverlay(){
        setShowPages(false);
        resetAllPages();
    }

    return (
        <div className={'mobile-nav-bar'}>
            <img className={'mobile-logo-image'} src={getRegularImage('LogoFull.png')} alt={'logo'} onClick={redirectHome} />
            <img src={getRegularImage('hamburgerIcon.png')} alt={'nav'} className={'mobile-hamburger-icon'} onClick={handleHamburgerClick} />

            {showPages && (
                <div className={'mobile-pages-list'}>
                    <span className={'mobile-close-button'} onClick={closeOverlay}>X</span>
                    <ul>
                        {/*{allPages.map((page, index) => (*/}
                        {/*    <li key={index} onClick={() => handlePageClick(page)}>*/}
                        {/*        {page.children.length > 0 ? (*/}
                        {/*            <span>{page.shortTitle}</span>*/}
                        {/*        ) : (*/}
                        {/*            <span>{page.shortTitle}</span>*/}
                        {/*        )}*/}
                        {/*    </li>*/}
                        {/*))}*/}
                    </ul>
                </div>
            )}
        </div>
    );

}

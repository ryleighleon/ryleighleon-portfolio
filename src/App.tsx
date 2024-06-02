import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import './variables.css';
import NavBar from "./components/NavBar/NavBar";
import {setPages} from "./redux/slices/pages";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import Footer from "./components/Footer/Footer";
import NotFound from "./pages/Desktop/NotFound/NotFound";
import LoadingPage from "./pages/Desktop/LoadingPage/LoadingPage";
import ChristmasPage from "./pages/Desktop/ChristmasPage/ChristmasPage";
import MobileNavBar from "./components/MobileNavBar/MobileNavBar";
import MobileChristmasPage from "./pages/Mobile/MobileChristmasPage/MobileChristmasPage";
import MobileFooter from "./components/MobileFooter/MobileFooter";
import MobileAbout from "./pages/Mobile/MobileAbout/MobileAbout";
import AboutPage from "./pages/Desktop/About/AboutPage";
import EditPage from "./pages/Desktop/EditPage/EditPage";
import ProjectPage from "./pages/Desktop/Page/ProjectPage";

export function getIconImage(filename: string){
    return process.env.PUBLIC_URL + '/media/files/icons/' + filename;
}

export function getProjectFile(sectionName: string, filename: string, projectName: string){
    return `${process.env.PUBLIC_URL}/media/files/${sectionName || 'Portfolio'}/${projectName}/${filename}`;
}

export function getProjectThumbnailImage(sectionName: string, filename: string, projectName: string){
    return `${process.env.PUBLIC_URL}/media/thumbnails/${sectionName || 'Portfolio'}/${projectName}/${filename}`;
}

export async function getRootFileText(filename: string) {
    try {
        const response = await fetch(process.env.PUBLIC_URL + '/media/' + filename);
        if (!response.ok) {
            return '';
        }
        return await response.text();
    } catch (error) {
        return '';
    }
}


function App() {
    const dispatch = useAppDispatch();
    const pages = useAppSelector(state => state.pages.pages);
    const [pagesLoading, setPagesLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showProjectOverlay, setShowProjectOverlay] = useState(false);

    useEffect(() => {
        const fetchPages = async () => {
            const response = await fetch(process.env.PUBLIC_URL + '/media/pages.rld');
            const data = await response.json();
            dispatch(setPages(data));
        }
        fetchPages().then(() => setPagesLoading(false));
    }, [dispatch]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={'app'}>
            <Router>
                {isMobile ? <MobileNavBar setShowProjectOverlay={setShowProjectOverlay}/> : <NavBar setShowProjectOverlay={setShowProjectOverlay}/>}
                <Routes>
                    {pages.map((page, index) => <Route path={page.relativeLink} key={index} element={
                        <ProjectPage page={page} setShowProjectOverlay={setShowProjectOverlay} showProjectOverlay={showProjectOverlay}/>
                    }/>)}
                    <Route path={'about'} Component={isMobile ? MobileAbout : AboutPage}/>
                    {pagesLoading ?
                        <Route path={'*'} Component={LoadingPage}/>
                        :
                        <Route path={'*'} Component={NotFound}/>
                    }
                    <Route path={'/christmas'} Component={isMobile ? MobileChristmasPage : ChristmasPage}/>
                    <Route path={'/edit'} element={<EditPage/>}/>
                </Routes>
                {isMobile ? <MobileFooter/> : <Footer/>}
            </Router>
        </div>
    );
}

export default App;

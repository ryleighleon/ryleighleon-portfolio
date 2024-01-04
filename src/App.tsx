import React, {useEffect, useState} from 'react';
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import HomePage from "./pages/Home/Home";
import NavBar from "./components/NavBar/NavBar";
import {addPage, clearPages, Page} from "./redux/slices/pages";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import Footer from "./components/Footer/Footer";
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage";
import {addProject, clearProjects, Project} from "./redux/slices/projects";
import AboutPage from "./pages/About/AboutPage";
import NotFound from "./pages/NotFound/NotFound";
import ContactPage from "./pages/Contact/ContactPage";
import LoadingPage from "./pages/LoadingPage/LoadingPage";
import ChristmasPage from "./pages/ChristmasPage/ChristmasPage";
import MobileNavBar from "./components/MobileNavBar/MobileNavBar";

export function getFile(filename: string){
    return process.env.PUBLIC_URL + '/media/files/' + filename;
}

export async function getRootFileText(filename: string) {
    const response = await fetch(process.env.PUBLIC_URL + '/media/' + filename);
    return await response.text();
}

function App() {
    const dispatch = useAppDispatch();
    const pages = useAppSelector(state => state.pages.pages);
    const [accessiblePages, setAccessiblePages] = useState<Page[]>([]);
    const [pagesLoading, setPagesLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setPagesLoading(true);
        const populatePages = async () => {
            try {
                const text = await getRootFileText('Pages.txt');
                const lines = text.split(/\r?\n/);
                let lineIndex = 0;
                let morePages = true;
                dispatch(clearPages())
                while (morePages){
                    const page: Page = {
                        children: [], relativeLink: "", shortTitle: "",
                    };
                    let nextLine = lines[lineIndex + 1];
                    while (morePages && !nextLine.startsWith('*')){
                        if (nextLine.startsWith('Short Title')){
                            const match = nextLine.match(/"([^"]*)"/);
                            if (match && match.length > 1) {
                                page.shortTitle = match[1]
                            } else {
                                alert(`This line is not formatted correctly: '${nextLine}'`)
                            }
                        } else if (nextLine.startsWith('Long Title')){
                            const match = nextLine.match(/"([^"]*)"/);
                            if (match && match.length > 1) {
                                page.longTitle = match[1]
                            } else {
                                alert(`This line is not formatted correctly: '${nextLine}'`)
                            }
                        } else if (nextLine.startsWith('Sub Title')){
                            const match = nextLine.match(/"([^"]*)"/);
                            if (match && match.length > 1) {
                                page.subTitle = match[1]
                            } else {
                                alert(`This line is not formatted correctly: '${nextLine}'`)
                            }
                        } else if (nextLine.startsWith('Description')){
                            try {
                                let description = '';
                                const match = nextLine.match(/"([^"]*)"/);
                                if (match && match.length > 1) {
                                    page.description = match[1]
                                } else {
                                    description += nextLine.slice(nextLine.indexOf('"') + 1);
                                    lineIndex += 1;
                                    nextLine = lines[lineIndex];
                                    while (!nextLine.includes('"')){
                                        description += `\n${nextLine}`
                                        lineIndex += 1;
                                        nextLine = lines[lineIndex];
                                    }
                                    description += `\n${nextLine.slice(0, nextLine.indexOf('"'))}`
                                    page.description = description;
                                }
                            } catch (error){
                                alert(`The description for Page ${page.shortTitle ? page.subTitle: '[No Title]'} is missing/formatted incorrectly`);
                            }
                        } else if (nextLine.startsWith('Relative Link')){
                            const match = nextLine.match(/"([^"]*)"/);
                            if (match && match.length > 1) {
                                page.relativeLink = match[1]
                            } else {
                                alert(`This line is not formatted correctly: '${nextLine}'`)
                            }
                        }
                        lineIndex += 1;
                        nextLine = lines[lineIndex];
                    }
                    if (page.relativeLink && page.shortTitle){
                        dispatch(addPage(page));
                    } else {
                        alert(`A required attribute for Page ${page.shortTitle ? page.subTitle: '[No Title]'} is missing/formatted incorrectly`)
                    }
                    if (lineIndex >= lines.length - 1){
                        morePages = false;
                    }
                }
            } catch (error) {
                alert('A general formatting error occurred')
            }
        };
        const populateProjects = async () => {
            try {
                const text = await getRootFileText('Projects.txt');
                const lines = text.split(/\r?\n/);
                let lineIndex = 0;
                let moreProjects = true;
                dispatch(clearProjects())
                while (moreProjects){
                    const project: Project = {
                        filename: "", type: "", name: "", path: ""
                    }
                    let nextLine = lines[lineIndex + 1];
                    while (moreProjects && !nextLine.startsWith('*')){
                        if (nextLine.startsWith('Project Name')){
                            const match = nextLine.match(/"([^"]*)"/);
                            if (match && match.length > 1) {
                                project.name = match[1]
                            } else {
                                alert(`This line is not formatted correctly: '${nextLine}'`)
                            }
                        } else if (nextLine.startsWith('Filename')){
                            const match = nextLine.match(/"([^"]*)"/);
                            if (match && match.length > 1) {
                                project.filename = match[1]
                            } else {
                                alert(`This line is not formatted correctly: '${nextLine}'`)
                            }
                        } else if (nextLine.startsWith('Type')){
                            const match = nextLine.match(/"([^"]*)"/);
                            if (match && match.length > 1) {
                                project.type = match[1]
                            } else {
                                alert(`This line is not formatted correctly: '${nextLine}'`)
                            }
                        } else if (nextLine.startsWith('Description')){
                            try {
                                let description = '';
                                const match = nextLine.match(/"([^"]*)"/);
                                if (match && match.length > 1) {
                                    project.description = match[1]
                                } else {
                                    description += nextLine.slice(nextLine.indexOf('"') + 1);
                                    lineIndex += 1;
                                    nextLine = lines[lineIndex];
                                    while (!nextLine.includes('"')){
                                        description += `\n${nextLine}`
                                        lineIndex += 1;
                                        nextLine = lines[lineIndex];
                                    }
                                    description += `\n${nextLine.slice(0, nextLine.indexOf('"'))}`
                                    project.description = description;
                                }
                            } catch (error){
                                alert(`The description for '${project.name ? project.name: '[No Project Name]'}' is is missing/formatted incorrectly`);
                            }
                        } else if (nextLine.startsWith('Page Path')){
                            const match = nextLine.match(/"([^"]*)"/);
                            if (match && match.length > 1) {
                                project.path = match[1]
                            } else {
                                alert(`This line is not formatted correctly: '${nextLine}'`)
                            }
                        }
                        lineIndex += 1;
                        nextLine = lines[lineIndex];
                    }
                    if (project.type && project.filename && project.name && project.path){
                        dispatch(addProject(project));
                    } else {
                        alert(`A required attribute for '${project.name ? project.name: '[No Project Name]'}' is is missing/formatted incorrectly`);
                    }
                    if (lineIndex >= lines.length - 1){
                        moreProjects = false;
                    }
                }
            } catch (error) {
                alert('A general formatting error occurred')
            }
        }
        async function populateData() {
            const pagesPromise = populatePages();
            const projectsPromise = populateProjects();

            await Promise.all([pagesPromise, projectsPromise]);

            setPagesLoading(false);
        }
        populateData();
    }, [dispatch]);

    useEffect(() => {
        setAccessiblePages([]);
        const tempPages: Page[] = [];
        for (let parentPage of pages){
            if (parentPage.children.length === 0){
                tempPages.push(parentPage)
            } else {
                for (let childPage of parentPage.children){
                    tempPages.push(childPage);
                }
            }
        }
        setAccessiblePages(tempPages);
    }, [pages]);

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
                {isMobile ? <MobileNavBar/> : <NavBar/>}
                <Routes>
                    <Route path="/" Component={HomePage} />
                    {accessiblePages.map(page => {
                        return <Route path={page.relativeLink} element={<ProjectsPage page={page} key={`${page.shortTitle}-${page.relativeLink}`}/>} key={page.shortTitle}/>
                    })}
                    <Route path={'more/about'} Component={AboutPage}/>
                    <Route path={'more/contact'} Component={ContactPage}/>
                    {pagesLoading ?
                        <Route path={'*'} Component={LoadingPage}/>
                        :
                        <Route path={'*'} Component={NotFound}/>
                    }
                    <Route path={'/christmas'} Component={ChristmasPage}/>
                </Routes>
                <Footer/>
            </Router>
        </div>
    );
}

export default App;

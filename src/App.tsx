import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import HomePage from "./pages/Home";
import NavBar from "./components/NavBar/NavBar";
import {addPage, Page} from "./redux/slices/pages";

export function getFile(filename: string){
    return process.env.PUBLIC_URL + '/media/files/' + filename;
}

function App() {
    useEffect(() => {
        const populatePages = async () => {
            try {
                const response = await fetch(process.env.PUBLIC_URL + '/media/Links.txt');
                const text = await response.text();

                const linkRegex = /\*{5}\s*Short Title:\s*"([^"]*)"\s*Long Title:\s*"([^"]*)"\s*Sub Title:\s*"([^"]*)"\s*Description:\s*"([^"]*)"\s*Relative Link:\s*"([^"]*)"\s*\*{5}/g;

                let match;

                while ((match = linkRegex.exec(text)) !== null) {
                    const [, shortTitle, longTitle, subTitle, description, relativeLink] = match;
                    const page: Page = {
                        shortTitle,
                        longTitle,
                        subTitle,
                        description,
                        relativeLink,
                        children: [],
                    };
                    addPage(page);
                }
            } catch (error) {
                console.error('Error fetching and parsing data:', error);
            }
        };
        populatePages();
        const populateProjects = async () => {
            try {
                const response = await fetch(process.env.PUBLIC_URL + '/media/Projects.txt');
            } catch (error) {
                console.error('Error fetching JSON data:', error);
            }
        }
        populateProjects();
    }, []);
    return (
        <div className={'app'}>
            <Router basename="/ryleighleon-portfolio">
                <NavBar/>
                <Routes>
                    <Route path="/" Component={HomePage} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

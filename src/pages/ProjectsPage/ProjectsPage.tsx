import React, {useEffect, useState} from "react";
import {Page} from "../../redux/slices/pages";
import './ProjectsPage.css';
import {Project} from "../../redux/slices/projects";
import {useAppSelector} from "../../redux/hooks";
import ProjectTile from "../../components/ProjectTile/ProjectTile";
import {useLocation} from "react-router-dom";
import ProjectOverlay from "../../components/ProjectOverlay/ProjectOverlay";

interface ProjectsPageProps {
    page: Page;
}

export default function ProjectsPage(props: ProjectsPageProps){
    const page = props.page;
    const projects: Project[] = useAppSelector(state => state.projects.projects);
    const [thisPageProjects, setThisPageProjects] = useState<Project[]>([]);
    const [projectIndex, setProjectIndex] = useState(0);
    const [showProjectOverlay, setShowProjectOverlay] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [canGoBackward, setCanGoBackward] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname;
        setThisPageProjects(projects.filter(project => project.path === pathname));
    }, [location.pathname, projects]);

    useEffect(() => {
        setCanGoForward(projectIndex < thisPageProjects.length - 1);
        setCanGoBackward(projectIndex > 0);
    }, [projectIndex, thisPageProjects]);

    const handleClick = (index: number) => {
        setProjectIndex(index);
        setShowProjectOverlay(true)
    }

    const handleClose = () => {
        setShowProjectOverlay(false);
    }

    const goForward = () => {
        setProjectIndex(projectIndex + 1);
    }

    const goBackward = () => {
        setProjectIndex(projectIndex - 1);
    }

    return (
        <div className={'project-page-container page'}>
            {page.longTitle &&
                <span className={'project-page-title'}>{page.longTitle}</span>
            }
            {page.subTitle &&
                <span className={'project-page-subtitle'}>{page.subTitle}</span>
            }
            {page.description &&
                <span className={'project-page-description'}>{page.description}</span>
            }
            <div className={'projects-container'}>
                {thisPageProjects.map((project, index) => {
                    return <ProjectTile
                                project={project}
                                onClick={() => handleClick(index)}
                                key={`${project.name}-${project.filename}`}
                            />
                })}
            </div>
            {showProjectOverlay &&
                <ProjectOverlay
                    project={thisPageProjects[projectIndex]}
                    onClose={handleClose}
                    goForward={goForward}
                    goBackward={goBackward}
                    canGoForward={canGoForward}
                    canGoBackward={canGoBackward}
                />
            }
        </div>
    );
}
import React, {useEffect, useState} from "react";
import {Page, ProjectSection} from "../../../redux/slices/pages";
import './ProjectSectionPage.css';
import {OldProject} from "../../../redux/slices/projects";
import {useAppSelector} from "../../../redux/hooks";
import ProjectTile from "../../../components/ProjectTile/ProjectTile";
import {useLocation} from "react-router-dom";
import ProjectOverlay from "../../../components/ProjectOverlay/ProjectOverlay";

interface ProjectsPageProps {
    section: ProjectSection;
}

export default function ProjectSectionPage(props: ProjectsPageProps){
    const section = props.section;
    const projects = section.projects;

    const [projectIndex, setProjectIndex] = useState(0);
    const [showProjectOverlay, setShowProjectOverlay] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [canGoBackward, setCanGoBackward] = useState(false);

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
            {section.title && <span className={'project-page-title'}>{section.title}</span>}
            {section.subtitle && <span className={'project-page-subtitle'}>{section.subtitle}</span>}
            {section.description && <span className={'project-page-description'}>{section.description}</span>}
            <div className={'projects-container'}>
                {projects.map((project, index) => {
                    return <ProjectTile
                                project={project}
                                onClick={() => handleClick(index)}
                                key={`${project.projectTitle}-${project.mainImageFilename}-${index}`}
                            />
                })}
            </div>
            {showProjectOverlay &&
                <ProjectOverlay
                    project={projects[projectIndex]}
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
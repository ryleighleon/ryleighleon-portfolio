import React, {useEffect, useState} from "react";
import {ProjectSection} from "../../../redux/slices/pages";
import './ProjectSectionPage.css';
import ProjectTile from "../../../components/ProjectTile/ProjectTile";
import ProjectOverlay from "../../../components/ProjectOverlay/ProjectOverlay";

interface ProjectsPageProps {
    section: ProjectSection;
    showProjectOverlay: boolean;
    setShowProjectOverlay: (show: boolean) => void;
}

export default function ProjectSectionPage(props: ProjectsPageProps){
    const section = props.section;
    const projects = section.projects;
    const showProjectOverlay = props.showProjectOverlay;

    const [projectIndex, setProjectIndex] = useState(0);
    const [nextProjectTitle, setNextProjectTitle] = useState('');
    const [previousProjectTitle, setPreviousProjectTitle] = useState('');

    useEffect(() => {
        if (projectIndex < projects.length - 1){
            setNextProjectTitle(projects[projectIndex + 1].projectTitle);
        } else {
            setNextProjectTitle('');
        }
        if (projectIndex > 0){
            setPreviousProjectTitle(projects[projectIndex - 1].projectTitle);
        } else {
            setPreviousProjectTitle('');
        }
    }, [projectIndex, projects]);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional: adds smooth scrolling effect
        });
    };

    const handleClick = (index: number) => {
        setProjectIndex(index);
        props.setShowProjectOverlay(true)
    }

    const handleClose = () => {
        props.setShowProjectOverlay(false);
    }

    const goForward = () => {
        setProjectIndex(projectIndex + 1);
        handleScrollToTop();
    }

    const goBackward = () => {
        setProjectIndex(projectIndex - 1);
        handleScrollToTop();
    }

    return (
        <div>
            {showProjectOverlay ?
                <ProjectOverlay
                    project={projects[projectIndex]}
                    onClose={handleClose}
                    goForward={goForward}
                    goBackward={goBackward}
                    nextProjectTitle={nextProjectTitle}
                    previousProjectTitle={previousProjectTitle}
                />
            :
                <div className={'project-section-container'}>
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
                </div>
            }
        </div>

    );
}
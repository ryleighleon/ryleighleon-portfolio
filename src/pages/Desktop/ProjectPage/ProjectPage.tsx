import React, {useState} from "react";
import {Page, ProjectSection} from "../../../redux/slices/pages";
import ProjectSectionPage from "../ProjectSectionPage/ProjectSectionPage";

interface ProjectPageProps {
    page: Page;
    showProjectOverlay: boolean;
    setShowProjectOverlay: (show: boolean) => void;
}

export default function ProjectPage(props: ProjectPageProps){
    const page = props.page;
    const projectSections: ProjectSection[] = page.projectSections;
    const showProjectOverlay = props.showProjectOverlay;
    const setShowProjectOverlay = props.setShowProjectOverlay;

    return (
        <div className={`project-page-container ${!showProjectOverlay && 'page'}`}>
            {page.topTitle && !showProjectOverlay &&
                <span className={'project-page-title'}>{page.topTitle}</span>
            }
            {projectSections.map((section, index) =>
                <ProjectSectionPage section={section} key={index} setShowProjectOverlay={setShowProjectOverlay} showProjectOverlay={showProjectOverlay}/>
            )}
            {page.bottomTitle && !showProjectOverlay &&
                <span className={'project-page-title'}>{page.bottomTitle}</span>
            }
        </div>
    )
}
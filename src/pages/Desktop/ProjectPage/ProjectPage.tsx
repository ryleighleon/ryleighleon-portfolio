import React from "react";
import {Page, ProjectSection} from "../../../redux/slices/pages";
import ProjectSectionPage from "../ProjectSectionPage/ProjectSectionPage";

interface ProjectPageProps {
    page: Page;
}

export default function ProjectPage(props: ProjectPageProps){
    const page = props.page;
    const projectSections: ProjectSection[] = page.projectSections;

    return (
        <div className={'project-page-container page'}>
            {page.topTitle &&
                <span className={'project-page-title'}>{page.topTitle}</span>
            }
            {projectSections.map((section, index) => <ProjectSectionPage section={section} key={index}/>)}
            {page.bottomTitle &&
                <span className={'project-page-title'}>{page.bottomTitle}</span>
            }
        </div>
    )
}
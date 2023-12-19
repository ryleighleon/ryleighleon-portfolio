import React, {useEffect, useState} from "react";
import {Page} from "../../redux/slices/pages";
import './ProjectsPage.css';
import {Project} from "../../redux/slices/projects";
import {useAppSelector} from "../../redux/hooks";
import ProjectTile from "../../components/ProjectTile/ProjectTile";
import {useLocation} from "react-router-dom";

interface ProjectsPageProps {
    page: Page;
}

export default function ProjectsPage(props: ProjectsPageProps){
    const page = props.page;
    const projects: Project[] = useAppSelector(state => state.projects.projects);
    const [thisPageProjects, setThisPageProjects] = useState<Project[]>([]);
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname;
        setThisPageProjects(projects.filter(project => project.path === pathname));
    }, [location.pathname, projects]);

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
                {thisPageProjects.map(project => {
                    return <ProjectTile project={project} key={`${project.name}-${project.filename}`}/>
                })}
            </div>
        </div>
    );
}
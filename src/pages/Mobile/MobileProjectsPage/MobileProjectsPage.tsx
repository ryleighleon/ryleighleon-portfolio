import React, {useEffect, useState} from "react";
import {Page} from "../../../redux/slices/pages";
import './MobileProjectsPage.css';
import {OldProject} from "../../../redux/slices/projects";
import {useAppSelector} from "../../../redux/hooks";
import {useLocation} from "react-router-dom";
import {getRegularImage} from "../../../App";

interface ProjectsPageProps {
    page: Page;
}

export default function MobileProjectsPage(props: ProjectsPageProps){
    const page = props.page;
    const projects: OldProject[] = useAppSelector(state => state.projects.projects);
    const [thisPageProjects, setThisPageProjects] = useState<OldProject[]>([]);
    const location = useLocation();

    useEffect(() => {
        const pathname = /*location.pathname*/ '/portfolio';
        setThisPageProjects(projects.filter(project => project.path === pathname));
    }, [location.pathname, projects]);

    return (
        <div className={'mobile-project-page-container page'}>
            {/*{page.longTitle &&*/}
            {/*    <span className={'mobile-project-page-title'}>{page.longTitle}</span>*/}
            {/*}*/}
            {/*{page.subTitle &&*/}
            {/*    <span className={'mobile-project-page-subtitle'}>{page.subTitle}</span>*/}
            {/*}*/}
            {/*{page.description &&*/}
            {/*    <span className={'mobile-project-page-description'}>{page.description}</span>*/}
            {/*}*/}
            <div className={'mobile-projects-container'}>
                {thisPageProjects.map((project, index) => {
                    return (
                        <div className={'mobile-project-tile'}>
                            {project.name &&
                                <span className={'mobile-project-title'}>{project.name}</span>
                            }
                            {project.description &&
                                <span className={'mobile-project-description'}>{project.description}</span>
                            }
                            {project.type === 'Image' &&
                                <img
                                    src={getRegularImage(project.filename)}
                                    alt={project.name}
                                    className={'mobile-project-image'}
                                />
                            }
                            {project.type === 'Video' &&
                                <video className={'mobile-project-image'} controls>
                                    <source src={getRegularImage(project.filename)} type="video/mp4"/>
                                    Your browser does not support videos
                                </video>
                            }
                            {index < thisPageProjects.length - 1 &&
                                <div className={'mobile-projects-divider'}></div>
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
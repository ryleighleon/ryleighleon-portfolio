import React, {useEffect, useState} from 'react';
import './ProjectOverlay.css';
import {getFile} from "../../App";
import {Project} from "../../redux/slices/pages";
import SubMediaImage from "./SubMediaImage";

interface ProjectOverlayProps {
    project: Project;
    onClose: () => void;
    goForward: () => void;
    goBackward: () => void;
    nextProjectTitle: string;
    previousProjectTitle: string;
}

export default function ProjectOverlay(props: ProjectOverlayProps){
    const project = props.project;
    return (
        <div className={'project-overlay-container'}>
            <img src={getFile(project.mainImageFilename)} alt={project.projectTitle} className={'project-overlay-img'}/>
            <div className={'project-overlay-description-container'}>
                {project.projectTitle && <span className={'project-overlay-title'}>{project.projectTitle}</span>}
                {project.projectSubtitle && <span className={'project-overlay-subtitle'}>{project.projectSubtitle}</span>}
                <div className={'project-paragraphs-container'}>
                    <div className={'project-paragraph-column'}>
                        {project.projectParagraphs.map((paragraph, index) => {
                            if (index % 2 === 0){
                                return (
                                    <div className={'project-paragraph-container'}>
                                        <span className={'project-overlay-paragraph-title'}>{paragraph.paragraphTitle}</span>
                                        <span className={'project-overlay-paragraph-text'}>{paragraph.paragraphText}</span>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <div className={'project-paragraph-column'}>
                        {project.projectParagraphs.map((paragraph, index) => {
                            if (index % 2 !== 0){
                                return (
                                    <div className={'project-paragraph-container'}>
                                        <span className={'project-overlay-paragraph-title'}>{paragraph.paragraphTitle}</span>
                                        <span className={'project-overlay-paragraph-text'}>{paragraph.paragraphText}</span>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
            <div className={'project-overlay-sub-media-container'}>
                {project.subMedia.map((media, index) =>
                    <SubMediaImage subMedia={media} key={index}/>
                )}
            </div>
            <div className={'project-overlay-navigation-container'}>
                <div className={'project-overlay-nav-previous'} onClick={props.goBackward}>
                    {props.previousProjectTitle && <span className={'project-overlay-nav-icon-text'}>{'<'}</span>}
                    {props.previousProjectTitle && <span className={'project-overlay-nav-description'}>{props.previousProjectTitle}</span>}
                </div>
                {props.nextProjectTitle && <div className={'project-overlay-nav-next'} onClick={props.goForward}>
                    <span className={'project-overlay-nav-description'}>{props.nextProjectTitle}</span>
                    <span className={'project-overlay-nav-icon-text'}>{'>'}</span>
                </div>}
            </div>
        </div>
    )
}
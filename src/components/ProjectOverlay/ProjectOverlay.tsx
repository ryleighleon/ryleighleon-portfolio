import React, {useEffect, useState} from 'react';
import './ProjectOverlay.css';
import {OldProject} from "../../redux/slices/projects";
import {getFile} from "../../App";
import {Project} from "../../redux/slices/pages";

interface ProjectOverlayProps {
    project: Project;
    onClose: () => void;
    goForward: () => void;
    goBackward: () => void;
    canGoForward: boolean;
    canGoBackward: boolean;
}

export default function ProjectOverlay(props: ProjectOverlayProps){
    const project = props.project;
    return (
        <div className={'project-overlay-container'}>
            <img src={getFile(project.mainImageFilename)} alt={project.projectTitle} className={'project-overlay-img'}/>
            <span className={'project-overlay-title'}>{project.projectTitle}</span>
            <span className={'project-overlay-subtitle'}>{project.projectSubtitle}</span>
            {project.projectParagraphs.map((paragraph, index) => {
                return (
                    <div>
                        <span className={'project-overlay-paragraph-title'}>{paragraph.paragraphTitle}</span>
                        <span className={'project-overlay-paragraph-text'}>{paragraph.paragraphText}</span>
                    </div>
                )
            })}
            {project.subMedia.map((media, index) => {
                return (
                    <div>
                        {media.type === 'image' &&
                            <img src={getFile(media.mediaFilename)} alt={media.mediaDescription} className={'project-overlay-sub-media-image'}/>
                        }
                    </div>
                );
            })}
        </div>
    )
}
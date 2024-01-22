import React, {useEffect, useState} from 'react';
import './ProjectOverlay.css';
import {Project} from "../../redux/slices/projects";
import {getFile} from "../../App";

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
    const [onlyImage, setOnlyImage] = useState(true);

    useEffect(() => {
        if (project.name || project.description){
            setOnlyImage(false);
        } else {
            setOnlyImage(true);
        }
    }, [project]);
    return (
        <div className={'project-overlay-container'}>
            <div className={'button-bar-container'}>
                <span className={'project-navigation-icon'} onClick={props.onClose}>X</span>
            </div>
            <div className={`overlay-content-container ${onlyImage ? 'center-overlay': 'fit-overlay'}`} key={`${project.name}-${project.path}`}>
                <div className={'overlay-image-nav-container'}>
                    {props.canGoBackward &&
                        <div className={'nav-button-container'}>
                            <span className={'project-navigation-icon go-back-span'} onClick={props.goBackward}>{`<`}</span>
                        </div>
                    }
                    {project.type === 'Image' &&
                        <img src={getFile(project.filename)} alt={project.name} className={'project-image'}/>
                    }
                    {project.type === 'Video' &&
                        <video className={'project-image'} controls>
                            <source src={getFile(project.filename)} type="video/mp4"/>
                                Your browser does not support the video tag.
                        </video>
                    }
                    {props.canGoForward &&
                        <div className={'nav-button-container'}>
                            <span className={'project-navigation-icon go-forward-span'} onClick={props.goForward}>{`>`}</span>
                        </div>
                    }
                </div>
                {!onlyImage &&
                    <div className={'project-overlay-text-container'}>
                        <span className={'overlay-title'}>{project.name}</span>
                        <span className={'overlay-description'}>{project.description}</span>
                    </div>
                }
            </div>


        </div>
    )
}
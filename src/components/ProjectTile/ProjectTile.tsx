import React, {useState} from 'react';
import './ProjectTile.css';
import {OldProject} from "../../redux/slices/projects";
import {getFile} from "../../App";

interface ProjectTileProps {
    project: OldProject;
    onClick: () => void;
}

export default function ProjectTile(props: ProjectTileProps) {
    const [isHovered, setIsHovered] = useState(false);
    const project = props.project;

    const onOpen = () => {
        setIsHovered(false);
        props.onClick()
    }

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onOpen}
            className={'project-tile'}
        >
            {project.type === 'Image' &&
                <img
                    src={getFile(project.filename)}
                    alt={project.name}
                    className={'project-tile-img'}
                />
            }
            {project.type === 'Video' &&
                <video className={'project-tile-img'} controls>
                    <source src={getFile(project.filename)} type="video/mp4"/>
                    Your browser does not support videos
                </video>
            }
            {isHovered &&
                <div className={'project-tile-overlay'}>
                    <span>{project.name}</span>
                </div>
            }
        </div>
    );
}
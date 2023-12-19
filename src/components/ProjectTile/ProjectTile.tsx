import React, {useState} from 'react';
import './ProjectTile.css';
import {Project} from "../../redux/slices/projects";
import {getFile} from "../../App";

interface ProjectTileProps {
    project: Project;
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
            <img
                src={getFile(project.filename)}
                alt={project.name}
                className={'project-tile-img'}
            />
            {isHovered &&
                <div className={'project-tile-overlay'}>
                    <span>{project.name}</span>
                </div>
            }
        </div>
    );
}
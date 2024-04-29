import React, {useState} from 'react';
import './ProjectTile.css';
import {getProjectFile} from "../../App";
import {Project} from "../../redux/slices/pages";

interface ProjectTileProps {
    sectionTitle: string;
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
                src={getProjectFile(props.sectionTitle, project.thumbnailImageFilename, project.projectTitle)}
                alt={project.projectTitle}
                className={'project-tile-img'}
            />
            {isHovered &&
                <div className={'project-tile-overlay'}>
                    <span className={'project-tile-overlay-title'}>{project.projectTitle}</span>
                </div>
            }
        </div>
    );
}
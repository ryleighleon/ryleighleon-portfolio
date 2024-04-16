import React, {useState} from 'react';
import './ProjectTile.css';
import {OldProject} from "../../redux/slices/projects";
import {getRegularImage, getThumbnailImage} from "../../App";
import {Project} from "../../redux/slices/pages";

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
                src={getThumbnailImage(project.thumbnailImageFilename, project.projectTitle)}
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
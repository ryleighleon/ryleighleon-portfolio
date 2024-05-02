import React, {useState} from 'react';
import {getIconImage, getProjectFile, getProjectThumbnailImage} from "../../../App";

interface SubMediaImageProps {
    subMedia: any;
    projectTitle: string;
    sectionTitle: string;
    onClick: () => void;
    type: 'Image' | 'Video' | 'GIF';
}

export default function SubMediaTile(props: SubMediaImageProps) {
    const orientation = props.subMedia.mediaOrientation || 'Square';
    const [isHovered, setIsHovered] = useState(false);
    const media = props.subMedia as any;
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={props.onClick}
            className={'submedia-image-container submedia-orientation-' + orientation.toLowerCase()}
        >
            {props.type === 'Image' &&
                <img
                    src={getProjectThumbnailImage(props.sectionTitle, media.mediaFilename, props.projectTitle)}
                    alt={media.mediaDescription}
                    className={'submedia-image submedia-orientation-' + orientation.toLowerCase()}
                />
            }
            {props.type === 'Video' &&
                <video
                    src={getProjectFile(props.sectionTitle, media.mediaFilename, props.projectTitle)}
                    className={'submedia-image submedia-orientation-' + orientation.toLowerCase()}
                    controls
                />
            }
            {props.type === 'GIF' &&
                <img
                    src={getProjectFile(props.sectionTitle, media.mediaFilename, props.projectTitle)}
                    alt={media.mediaDescription}
                    className={'submedia-image submedia-orientation-' + orientation.toLowerCase()}
                />
            }
            {isHovered &&
                <div className={'submedia-image-overlay'}>
                    <span>{media.mediaDescription}</span>
                </div>
            }
        </div>
    );
}
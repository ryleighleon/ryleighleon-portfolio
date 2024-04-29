import React, {useState} from 'react';
import {getIconImage, getProjectThumbnailImage} from "../../App";

interface SubMediaImageProps {
    subMedia: any;
    projectTitle: string;
    sectionTitle: string;
    onClick: () => void;
    type: 'Image' | 'Video' | 'GIF';
}

export default function SubMediaImage(props: SubMediaImageProps) {
    const [isHovered, setIsHovered] = useState(false);
    const media = props.subMedia as any;
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={props.onClick}
            className={'submedia-image-container'}
        >
            {props.type === 'Image' &&
                <img
                    src={getProjectThumbnailImage(props.sectionTitle, media.mediaFilename, props.projectTitle)}
                    alt={media.mediaDescription}
                    className={'submedia-image'}
                />
            }
            {props.type === 'Video' &&
                <video
                    src={getIconImage(media.mediaFilename)}
                    className={'submedia-image'}
                    controls
                />
            }
            {props.type === 'GIF' &&
                <img
                    src={getIconImage(media.mediaFilename)}
                    alt={media.mediaDescription}
                    className={'submedia-image'}
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
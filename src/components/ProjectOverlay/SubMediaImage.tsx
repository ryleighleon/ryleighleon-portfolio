import React, {useState} from 'react';
import {getRegularImage, getProjectFile, getProjectThumbnailImage} from "../../App";

interface SubMediaImageProps {
    subMedia: any;
    projectTitle: string;
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
                    src={getProjectThumbnailImage(media.mediaFilename, props.projectTitle)}
                    alt={media.mediaDescription}
                    className={'submedia-image'}
                />
            }
            {props.type === 'Video' &&
                <video
                    src={getRegularImage(media.mediaFilename)}
                    className={'submedia-image'}
                    controls
                />
            }
            {props.type === 'GIF' &&
                <img
                    src={getRegularImage(media.mediaFilename)}
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
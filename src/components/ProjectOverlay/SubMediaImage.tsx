import React, {useState} from 'react';
import {getRegularImage, getProjectImage} from "../../App";

interface SubMediaImageProps {
    subMedia: any;
    projectTitle: string;
    onClick: () => void;
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
            <img
                src={getProjectImage(media.mediaFilename, props.projectTitle)}
                alt={media.mediaDescription}
                className={'submedia-image'}
            />
            {isHovered &&
                <div className={'submedia-image-overlay'}>
                    <span>{media.mediaDescription}</span>
                </div>
            }
        </div>
    );
}
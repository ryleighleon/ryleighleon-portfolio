import React, {useState} from 'react';
import {getFile} from "../../App";

interface SubMediaImageProps {
    subMedia: any;
}

export default function SubMediaImage(props: SubMediaImageProps) {
    const [isHovered, setIsHovered] = useState(false);
    const media = props.subMedia as any;
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={'submedia-image-container'}
        >
            <img
                src={getFile(media.mediaFilename)}
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
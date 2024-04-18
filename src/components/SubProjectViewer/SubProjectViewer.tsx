import React, {useEffect, useState} from 'react';
import './SubProjectViewer.css';
import {getProjectFile} from "../../App";

interface SubMedia {
    mediaFilename: string;
    mediaType: string;
    mediaDescription?: string;
    subMediaUid: string;
}

interface ProjectSubMediaProps {
    projectName: string;
    subMedia: SubMedia;
    onClose: () => void;
    goForward: () => void;
    goBackward: () => void;
    canGoForward: boolean;
    canGoBackward: boolean;
}

export default function SubProjectViewer(props: ProjectSubMediaProps){
    const subMedia = props.subMedia;
    const [onlyImage, setOnlyImage] = useState(true);

    useEffect(() => {
        if (subMedia.mediaDescription){
            setOnlyImage(false);
        } else {
            setOnlyImage(true);
        }
    }, [subMedia]);
    return (
        <div className={'project-sub-media-container'}>
            <div className={'button-bar-container'}>
                <span className={'subproject-navigation-icon'} onClick={props.onClose}>X</span>
            </div>
            <div className={`sub-media-content-container ${onlyImage ? 'center-sub-media': 'fit-sub-media'}`} key={`${subMedia.subMediaUid}`}>
                <div className={'sub-media-image-nav-container'}>
                    {props.canGoBackward &&
                        <div className={'nav-button-container'}>
                            <span className={'subproject-navigation-icon go-back-span'} onClick={props.goBackward}>{`<`}</span>
                        </div>
                    }
                    {(subMedia.mediaType === 'Image' || subMedia.mediaType === 'GIF') &&
                        <img src={getProjectFile(subMedia.mediaFilename, props.projectName)} alt={subMedia.mediaFilename} className={'project-image'}/>
                    }
                    {subMedia.mediaType === 'Video' &&
                        <video src={getProjectFile(subMedia.mediaFilename, props.projectName)} className={'project-image'} controls/>
                    }
                    {props.canGoForward &&
                        <div className={'nav-button-container'}>
                            <span className={'subproject-navigation-icon go-forward-span'} onClick={props.goForward}>{`>`}</span>
                        </div>
                    }
                </div>
                {!onlyImage &&
                    <div className={'project-sub-media-text-container'}>
                        <span className={'sub-media-description'}>{subMedia.mediaDescription}</span>
                    </div>
                }
            </div>
        </div>
    )
}
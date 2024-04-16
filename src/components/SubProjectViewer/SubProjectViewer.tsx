import React, {useEffect, useState} from 'react';
import './SubProjectViewer.css';
import {getProjectImage} from "../../App";

interface SubMedia {
    mediaFilename: string;
    type: string;
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
                    {subMedia.type === 'Image' &&
                        <img src={getProjectImage(subMedia.mediaFilename, props.projectName)} alt={subMedia.mediaFilename} className={'project-image'}/>
                    }
                    {/*{subMedia.type === 'Video' &&*/}
                    {/*    <video className={'project-image'} controls>*/}
                    {/*        <source src={getRegularImage(subMedia.mediaFilename)} type="video/mp4"/>*/}
                    {/*        Your browser does not support the video tag.*/}
                    {/*    </video>*/}
                    {/*}*/}
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
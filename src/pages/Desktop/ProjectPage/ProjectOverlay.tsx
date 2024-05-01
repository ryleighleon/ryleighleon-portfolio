import React, {useEffect, useState} from 'react';
import './ProjectOverlay.css';
import SubMediaTile from "./SubMediaTile";
import {Project, SubMedia} from "../../../redux/slices/pages";
import SubProjectViewer from "../../../components/SubProjectViewer/SubProjectViewer";

interface ProjectOverlayProps {
    project: Project;
    onClose: () => void;
    goForward: () => void;
    goBackward: () => void;
    nextProjectTitle: string;
    previousProjectTitle: string;
    projectSection: string;
}

type GridItem = SubMedia | undefined | null;

export default function ProjectOverlay(props: ProjectOverlayProps){
    const [subMediaIndex, setSubMediaIndex] = useState<number | undefined>(undefined);
    const [grid, setGrid] = useState<GridItem[][]>([[]]);
    const [widthPX, setWidthPX] = useState(window.innerWidth);
    const [maxWidth, setMaxWidth] = useState(0);

    const handleResize = () => {
        setWidthPX(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const calc = Math.floor((widthPX - 130) / 510);
        setMaxWidth(calc);
    }, [widthPX]);

    const project = props.project;

    const getImageHeight = (image: SubMedia | undefined | null): number => {
        if (!image) return 1;
        switch (image.mediaOrientation) {
            case 'Vertical':
                return 2;
            case 'Horizontal':
            case 'Square':
                return 1;
            default:
                return 1;
        }
    };

    const getImageWidth = (image: SubMedia | undefined | null): number => {
        if (!image) return 1;
        switch (image.mediaOrientation) {
            case 'Vertical':
            case 'Square':
                return 1;
            case 'Horizontal':
                return 2;
            default:
                return 1;
        }
    };

    useEffect(() => {
        const placeMediaInGrid = (media: SubMedia[]): GridItem[][] => {
            let currentGrid: GridItem[][] = [];
            makeNewRow(currentGrid);
            let currentMedia = 0;
            let currentRow = 0;
            let currentCol = 0;
            while (currentMedia < media.length){
                let placed = false;
                while (!placed){
                    if (canPlaceInIndex(currentGrid[currentRow], currentCol, media[currentMedia])){
                        placeImageInIndex(media[currentMedia], currentGrid, currentCol, currentRow);
                        placed = true;
                    } else {
                        currentCol++;
                        if (currentCol >= maxWidth){
                            currentCol = 0;
                            currentRow++;
                            if (!currentGrid[currentRow]){
                                makeNewRow(currentGrid);
                            }
                        }
                    }
                }
                currentMedia++;
            }
            return currentGrid;
        };

        const placeImageInIndex = (media: SubMedia, currentGrid: GridItem[][], colIndex: number, rowIndex: number) => {
            currentGrid[rowIndex][colIndex] = media;
            if (getImageWidth(media) === 2){
                currentGrid[rowIndex][colIndex + 1] = null;
            } else if (getImageHeight(media) === 2){
                if (!currentGrid[rowIndex + 1]){
                    makeNewRow(currentGrid);
                    currentGrid[rowIndex + 1][colIndex] = null;
                }
            }
        }

        const makeNewRow = (currentGrid: GridItem[][]) => {
            currentGrid.push([]);
            const rowIndex = currentGrid.length - 1;
            for (let i = 0; i < maxWidth; i++) {
                currentGrid[rowIndex].push(undefined);
            }
        }

        const canPlaceInIndex = (row: GridItem[], colIndex: number, media: SubMedia): boolean => {
            if (row.length === 0) return true; // If the row is empty, place the image in it
            // Logic to check if image can be placed in the row based on available space
            const rowHeight = row.length > 0 ? getImageHeight(row[0]) : 0; // Height of the first image in the row
            const rowWidth = row.reduce((acc, curr) => acc + getImageWidth(curr), 0);
            const imageHeight = getImageHeight(media);
            const imageWidth = getImageWidth(media);

            // Check if the image can fit in the row horizontally
            const horizontalFit = rowWidth + imageWidth <= maxWidth;

            // Check if the image can fit in the row vertically (if it's a 2x1 and there's space vertically)
            const verticalFit = imageHeight === 2 && rowHeight + imageHeight <= getImageHeight(row[0]);

            return horizontalFit && verticalFit;
        };

        // Call the function to arrange images in the grid and update the state
        const arrangedGrid = placeMediaInGrid(project.subMedia);
        setGrid(arrangedGrid);
    }, [project.subMedia, maxWidth]);

    function generateSubMediaTile(media: SubMedia, rowIndex: number, colIndex: number, index: number){
        return <SubMediaTile
            key={`${rowIndex}-${colIndex}`}
            sectionTitle={props.projectSection}
            subMedia={media}
            projectTitle={project.projectTitle}
            onClick={() => setSubMediaIndex(index)}
            type={media.mediaType}
        />
    }


    return (
        <div className={'project-overlay-container'}>
            <div className={'project-overlay-description-container'}>
                {project.projectTitle && <span className={'project-overlay-title'}>{project.projectTitle}</span>}
                {project.projectSubtitle && <span className={'project-overlay-subtitle'}>{project.projectSubtitle}</span>}
                <div className={'project-paragraphs-container'}>
                    <div className={'project-paragraph-column'} key={'para-1'}>
                        {project.projectParagraphs.map((paragraph, index) => {
                            if (index % 2 === 0){
                                return (
                                    <div className={'project-paragraph-container'} key={index}>
                                        <span className={'project-overlay-paragraph-title'}>{paragraph.paragraphTitle}</span>
                                        <span className={'project-overlay-paragraph-text'}>{paragraph.paragraphText}</span>
                                    </div>
                                )
                            }
                            return null;
                        })}
                    </div>
                    <div className={'project-paragraph-column'} key={'para-2'}>
                        {project.projectParagraphs.map((paragraph, index) => {
                            if (index % 2 !== 0){
                                return (
                                    <div className={'project-paragraph-container'} key={index}>
                                        <span className={'project-overlay-paragraph-title'}>{paragraph.paragraphTitle}</span>
                                        <span className={'project-overlay-paragraph-text'}>{paragraph.paragraphText}</span>
                                    </div>
                                )
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
            <div className={'project-overlay-sub-media-container'}>
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="project-overlay-sub-media-row">

                    </div>
                ))}
            </div>
            {subMediaIndex !== undefined &&
                <SubProjectViewer
                    projectName={project.projectTitle}
                    sectionName={props.projectSection}
                    subMedia={project.subMedia[subMediaIndex]}
                    onClose={() => setSubMediaIndex(undefined)}
                    goForward={() => setSubMediaIndex(subMediaIndex + 1)}
                    goBackward={() => setSubMediaIndex(subMediaIndex - 1)}
                    canGoForward={project.subMedia.length > subMediaIndex + 1}
                    canGoBackward={subMediaIndex > 0}
                />
            }
            <div className={'project-overlay-navigation-container'}>
                <div className={'project-overlay-nav-previous'} onClick={props.goBackward}>
                    {props.previousProjectTitle && <span className={'project-overlay-nav-icon-text'}>{'<'}</span>}
                    {props.previousProjectTitle && <span className={'project-overlay-nav-description'}>{props.previousProjectTitle}</span>}
                </div>
                {props.nextProjectTitle && <div className={'project-overlay-nav-next'} onClick={props.goForward}>
                    <span className={'project-overlay-nav-description'}>{props.nextProjectTitle}</span>
                    <span className={'project-overlay-nav-icon-text'}>{'>'}</span>
                </div>}
            </div>
        </div>
    )
}
import React, {useEffect, useState} from 'react';
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import {
    addPageOnlyTitle, addProjectOnlyTitle, addProjectParagraphOnlyTitle, addProjectSubmediaOnlyFilename,
    addSectionOnlyTitle, deletePage, deleteProject, deleteProjectParagraph, deleteProjectSubmedia, deleteSection,
    Page,
    Project,
    ProjectSection, setPages,
    updatePage
} from "../../../redux/slices/pages";
import ImportComponent from "./InputComponent";
import './EditPage.css';

const EditPage: React.FC = () => {
    const dispatch = useAppDispatch();

    const [selectedPageUid, setSelectedPageUid] = useState<string>('');
    const [selectedSectionUid, setSelectedSectionUid] = useState<string>('');
    const [selectedProjectUid, setSelectedProjectUid] = useState<string>('');

    const pages = useAppSelector((state) => state.pages.pages);
    const selectedPage = useAppSelector((state) => state.pages.pages.find(page => page.uid === selectedPageUid));

    const sections = useAppSelector((state) => state.pages.pages.find(page => page.uid === selectedPageUid))?.projectSections;
    const selectedSection = useAppSelector((state) => state.pages.pages.find(page => page.uid === selectedPageUid)?.projectSections.find(section => section.uid === selectedSectionUid));

    const projects = useAppSelector((state) => state.pages.pages.find(page => page.uid === selectedPageUid)?.projectSections.find(section => section.title === selectedSection?.title)?.projects);
    const selectedProject = useAppSelector((state) => state.pages.pages.find(page => page.uid === selectedPageUid)?.projectSections.find(section => section.uid === selectedSection?.uid)?.projects.find(project => project.uid === selectedProjectUid));

    const [pageTitle, setPageTitle] = useState<string>('');
    const [sectionTitle, setSectionTitle] = useState<string>('');
    const [projectTitle, setProjectTitle] = useState<string>('');
    const [projectParagraphTitle, setProjectParagraphTitle] = useState<string>('');
    const [projectSubMediaFilename, setProjectSubMediaFilename] = useState<string>('');
    const [version, setVersion] = useState<number>(0);
    const [initialState, setInitialState] = useState<Page[]>([{shortTitle: 'Portfolio', uid: '1', relativeLink: '/', projectSections: [],}]);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    useEffect(() => {
        if (JSON.stringify(pages) !== JSON.stringify(initialState)) {
            setUnsavedChanges(true);
        } else {
            setUnsavedChanges(false);
        }
    }, [pages, initialState]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (unsavedChanges) {
                event.preventDefault();
                event.returnValue = ''; // This is required for Chrome
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [unsavedChanges]);

    function exportPages() {
        const data = new Blob([JSON.stringify(pages)], {type: 'application/json'});
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pages version ${version + 1}.rld`;
        a.click();
    }

    function importPages(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const contents = e.target?.result;
                if (contents) {
                    const data = JSON.parse(contents as string);
                    const filename = file.name;
                    const tempVersion = filename.match(/version (\d+)/)?.[1];
                    if (tempVersion) {
                        setVersion(parseInt(tempVersion));
                    }
                    setInitialState(data);
                    dispatch(setPages(data));
                }
            }
            reader.readAsText(file);
        }
    }

    const handlePageDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRelativeLink = event.target.value;
        const selectedPage = pages.find((page) => page.relativeLink === selectedRelativeLink) || null;
        if (selectedPage){
            setSelectedPageUid(selectedPage.uid);
        }
    };

    const handleSectionDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const sectionTitle = event.target.value;
        const selectedSection = sections?.find((section) => section.title === sectionTitle) || null;
        setSelectedSectionUid(selectedSection?.uid || '');
    };

    const handleProjectDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const projectTitle = event.target.value;
        const selectedProject = projects?.find((project) => project.projectTitle === projectTitle) || null;
        setSelectedProjectUid(selectedProject?.uid || '');
    };

    const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedPage) {
            const { name, value } = event.target;
            const updatedPage = { ...selectedPage, [name]: value };
            dispatch(updatePage(updatedPage));
        }
    };

    const handleSectionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedSection) {
            const { name, value } = event.target;
            if (selectedPage){
                const updatedSection = { ...selectedSection, [name]: value };
                const updatedPage: Page = { ...selectedPage, projectSections: selectedPage.projectSections.map(section => section.title === selectedSection.title ? updatedSection : section) };
                dispatch(updatePage(updatedPage));
            }
        }
    };

    const handleProjectInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedProject) {
            const { name, value } = event.target;
            if (selectedSection && selectedPage){
                const updatedProject = { ...selectedProject, [name]: value };
                const updatedSection: ProjectSection = { ...selectedSection, projects: selectedSection.projects.map(project => project.projectTitle === selectedProject.projectTitle ? updatedProject : project) };
                const updatedPage: Page = { ...selectedPage, projectSections: selectedPage.projectSections.map(section => section.title === selectedSection.title ? updatedSection : section) };
                dispatch(updatePage(updatedPage));
            }
        }
    };

    const handleProjectParagraphInputChange = (event: React.ChangeEvent<HTMLInputElement>, paragraphUid: string) => {
        if (selectedProject) {
            const { name, value } = event.target;
            if (selectedSection && selectedPage){
                const updatedProject = { ...selectedProject};
                updatedProject.projectParagraphs = selectedProject.projectParagraphs.map(paragraph => paragraph.paragraphUid === paragraphUid ? { ...paragraph, [name]: value } : paragraph);
                const updatedSection: ProjectSection = { ...selectedSection, projects: selectedSection.projects.map(project => project.projectTitle === selectedProject.projectTitle ? updatedProject : project) };
                const updatedPage: Page = { ...selectedPage, projectSections: selectedPage.projectSections.map(section => section.title === selectedSection.title ? updatedSection : section) };
                dispatch(updatePage(updatedPage));
            }
        }
    }

    const handleProjectSubmediaInputChange = (event: React.ChangeEvent<HTMLInputElement>, submediaUid: string) => {
        if (selectedProject) {
            const { name, value } = event.target;
            if (selectedSection && selectedPage){
                const updatedProject = { ...selectedProject };
                updatedProject.subMedia = selectedProject.subMedia.map(subMedia => subMedia.subMediaUid === submediaUid ? { ...subMedia, [name]: value } : subMedia);
                const updatedSection: ProjectSection = { ...selectedSection, projects: selectedSection.projects.map(project => project.projectTitle === selectedProject.projectTitle ? updatedProject : project) };
                const updatedPage: Page = { ...selectedPage, projectSections: selectedPage.projectSections.map(section => section.title === selectedSection.title ? updatedSection : section) };
                dispatch(updatePage(updatedPage));
            }
        }
    }

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageTitle(event.target.value);
    };

    const handleSectionTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSectionTitle(event.target.value);
    };

    const handleProjectTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProjectTitle(event.target.value);
    };

    const handleProjectParagraphTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProjectParagraphTitle(event.target.value);
    };

    const handleProjectSubMediaFilenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProjectSubMediaFilename(event.target.value);
    }

    const handleAddPageTitle = () => {
        if (pageTitle.trim() !== '') {
            dispatch(addPageOnlyTitle(pageTitle));
            setPageTitle('');
        }
    };

    const handleAddSectionTitle = () => {
        if (sectionTitle.trim() !== '') {
            const params = {
                pageUid: selectedPage? selectedPage.uid : '',
                title: sectionTitle
            }
            dispatch(addSectionOnlyTitle(params));
            setSectionTitle('');
        }
    };

    const handleAddProjectTitle = () => {
        if (projectTitle.trim() !== '') {
            if (!selectedPageUid || !selectedSection) return;
            const params = {
                pageUid: selectedPageUid,
                sectionTitle: selectedSection.title,
                projectTitle: projectTitle
            }
            dispatch(addProjectOnlyTitle(params));
            setProjectTitle('');
        }
    };

    const handleAddProjectParagraphTitle = () => {
        if (projectParagraphTitle.trim() !== '') {
            if (!selectedPageUid || !selectedSection || !selectedProject) return;
            const params = {
                pageUid: selectedPageUid,
                sectionTitle: selectedSection.title,
                projectTitle: selectedProject.projectTitle,
                paragraphTitle: projectParagraphTitle
            }
            dispatch(addProjectParagraphOnlyTitle(params));
            setProjectParagraphTitle('');
        }
    }

    const handleAddSubMediaFilename = () => {
        if (projectSubMediaFilename.trim() !== '') {
            if (!selectedPageUid || !selectedSection || !selectedProject) return;
            const params = {
                pageUid: selectedPageUid,
                sectionTitle: selectedSection.title,
                projectTitle: selectedProject.projectTitle,
                subMediaFilename: projectSubMediaFilename
            }
            dispatch(addProjectSubmediaOnlyFilename(params));
            setProjectParagraphTitle('');
        }
    }

    return (
        <div className={'edit-container'}>
            {version === 0 &&
                <div>
                    <p>Import an Existing .rld File</p>
                    <input type={'file'} onChange={importPages} />
                </div>
            }
            <div className={'title-input-container'}>
                <label htmlFor="pageTitle">Enter Page Title:</label>
                <input type="text" id="pageTitle" value={pageTitle} onChange={handleTitleChange} />
                <button onClick={handleAddPageTitle}>Add Page</button>
            </div>
            <label htmlFor="pageDropdown">Select a Page:</label>
            <select id="pageDropdown" value={selectedPage?.relativeLink || ''} onChange={handlePageDropdownChange}>
                <option value="">Select a Page</option>
                {pages.map((page) => (
                    <option key={page.uid} value={page.relativeLink}>
                        {page.shortTitle}
                    </option>
                ))}
            </select>
            {selectedPage && (
                <div className={'input-section-container'}>
                    <span className={'input-title'}>{`Page: ${selectedPage.shortTitle}`}</span>
                    <ImportComponent name={'shortTitle'} value={selectedPage.shortTitle} onChange={handlePageInputChange}/>
                    <ImportComponent name={'relativeLink'} value={selectedPage.relativeLink} onChange={handlePageInputChange}/>
                    <ImportComponent name={'topTitle'} value={selectedPage.topTitle} onChange={handlePageInputChange}/>
                    <ImportComponent name={'bottomTitle'} value={selectedPage.bottomTitle} onChange={handlePageInputChange}/>
                    <div className={'delete-button-container'}>
                        <button onClick={() => dispatch(deletePage(selectedPage.uid))}>Delete Page</button>
                    </div>
                    <div className={'title-input-container'}>
                        <label htmlFor="sectionTitle">Enter Section Title:</label>
                        <input type="text" id="sectionTitle" value={sectionTitle} onChange={handleSectionTitleChange} />
                        <button onClick={handleAddSectionTitle}>Add Section</button>
                    </div>
                    <label htmlFor="sectionDropdown">Select a Section:</label>
                    <select id="sectionDropdown" value={selectedSection?.title || ''} onChange={handleSectionDropdownChange}>
                        <option value="">Select a Section</option>
                        {sections?.map((section, index) => (
                            <option key={section.uid} value={section.title}>
                                {section.title}
                            </option>
                        ))}
                    </select>
                    {selectedSection && (
                        <div className={'input-section-container'}>
                            <span className={'input-title'}>{`Section: ${selectedSection.title}`}</span>
                            <ImportComponent name={'title'} value={selectedSection.title} onChange={handleSectionInputChange}/>
                            <ImportComponent name={'subtitle'} value={selectedSection.subtitle} onChange={handleSectionInputChange}/>
                            <ImportComponent name={'description'} value={selectedSection.description} onChange={handleSectionInputChange}/>
                            <div className={'delete-button-container'}>
                                <button onClick={() => dispatch(deleteSection({ pageUid: selectedPageUid, sectionUid: selectedSectionUid }))}>Delete Section</button>
                            </div>
                            <div className={'title-input-container'}>
                                <label htmlFor="projectTitle">Enter Project Title:</label>
                                <input type="text" id="projectTitle" value={projectTitle} onChange={handleProjectTitleChange} />
                                <button onClick={handleAddProjectTitle}>Add Project</button>
                            </div>
                            <label htmlFor="projectDropdown">Select a Project:</label>
                            <select id="projectDropdown" value={selectedProject?.projectTitle || ''} onChange={handleProjectDropdownChange}>
                                <option value="">Select a Project</option>
                                {projects?.map((project, index) => (
                                    <option key={project.uid} value={project.projectTitle}>
                                        {project.projectTitle}
                                    </option>
                                ))}
                            </select>
                            {selectedProject && (
                                <div className={'input-section-container'}>
                                    <span className={'input-title'}>{`Project: ${selectedProject.projectTitle}`}</span>
                                    <ImportComponent name={'mainImageFilename'} value={selectedProject.mainImageFilename} onChange={handleProjectInputChange}/>
                                    <ImportComponent name={'projectTitle'} value={selectedProject.projectTitle} onChange={handleProjectInputChange}/>
                                    <ImportComponent name={'projectSubtitle'} value={selectedProject.projectSubtitle} onChange={handleProjectInputChange}/>
                                    <ImportComponent name={'imageName'} value={selectedProject.projectSubtitle} onChange={handleProjectInputChange}/>
                                    <div className={'delete-button-container'}>
                                        <button onClick={() => dispatch(deleteProject({ pageUid: selectedPageUid, sectionUid: selectedSectionUid, projectUid: selectedProjectUid }))}>Delete Project</button>
                                    </div>
                                    <div className={'title-input-container'}>
                                        <label htmlFor="paragraphTitle">Enter Paragraph Title:</label>
                                        <input type="text" id="projectParagraphTitle" value={projectParagraphTitle} onChange={handleProjectParagraphTitleChange} />
                                        <button onClick={handleAddProjectParagraphTitle}>Add Paragraph</button>
                                    </div>
                                    {selectedProject.projectParagraphs.map((paragraph, index) => (
                                        <div key={`project-paragraph: ${paragraph.paragraphUid}`} className={'input-section-container'}>
                                            <ImportComponent name={'paragraphTitle'} value={paragraph.paragraphTitle} onChange={(e) => handleProjectParagraphInputChange(e, paragraph.paragraphUid)}/>
                                            <ImportComponent name={'paragraphText'} value={paragraph.paragraphText} onChange={(e) => handleProjectParagraphInputChange(e, paragraph.paragraphUid)}/>
                                            <button onClick={() => dispatch(deleteProjectParagraph({pageUid: selectedPageUid, sectionUid: selectedSectionUid, projectUid: selectedProjectUid, paragraphUid: paragraph.paragraphUid}))}>Delete Paragraph</button>
                                        </div>
                                    ))}
                                    <div className={'title-input-container'}>
                                        <label htmlFor="projectSubmediaFilename">Enter Media Filename:</label>
                                        <input type="text" id="projectParagraphTitle" value={projectSubMediaFilename} onChange={handleProjectSubMediaFilenameChange} />
                                        <button onClick={handleAddSubMediaFilename}>Add File</button>
                                    </div>
                                    {selectedProject.subMedia.map((subMedia, index) => (
                                        <div key={`submedia-${subMedia.subMediaUid}`} className={'input-section-container'}>
                                            <ImportComponent name={'mediaFilename'} value={subMedia.mediaFilename} onChange={(e) => handleProjectSubmediaInputChange(e, subMedia.subMediaUid)}/>
                                            <ImportComponent name={'type'} value={subMedia.type} onChange={(e) => handleProjectSubmediaInputChange(e, subMedia.subMediaUid)}/>
                                            <ImportComponent name={'mediaDescription'} value={subMedia.mediaDescription} onChange={(e) => handleProjectSubmediaInputChange(e, subMedia.subMediaUid)}/>
                                            <button onClick={() => dispatch(deleteProjectSubmedia({pageUid: selectedPageUid, sectionUid: selectedSectionUid, projectUid: selectedProjectUid, subMediaUid: subMedia.subMediaUid}))}>Delete File</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            <button onClick={exportPages}>Export</button>
        </div>
    );
};

export default EditPage;

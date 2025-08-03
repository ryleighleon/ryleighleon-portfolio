"use client"

import React, { useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import {
  setPages,
  deletePage,
  deleteProjectSection,
  deleteProject,
  deleteSubMedia,
  setSelectedPageId,
  setSelectedSectionId,
  setSelectedProjectId,
  setSelectedSubMediaId,
  moveItemUp,
  moveItemDown,
  moveSubMediaUp,
  moveSubMediaDown,
  updateProjectSection,
  updateProject,
  updateSubMedia,
} from "@/lib/store/slices/pagesSlice"
import { setAboutData, setSelectedAboutSection } from "@/lib/store/slices/aboutSlice"
import { ChevronUp, ChevronDown } from "lucide-react"
import { formatUid } from "@/lib/utils/image-paths"
import { ProjectPage, ProjectSection, Project } from "@/types"
import { v4 as uuidv4 } from "uuid"

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const { pages, selectedPageId, selectedSectionId, selectedProjectId, selectedSubMediaId } = useAppSelector((state) => state.pages)
  const { selectedAboutSection } = useAppSelector((state) => state.about)
  const about = useAppSelector((state) => state.about)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const handlePageSelect = (pageId: string) => {
    dispatch(setSelectedPageId(pageId))
    dispatch(setSelectedAboutSection(null))
    dispatch(setSelectedProjectId(null))
    dispatch(setSelectedSectionId(null))
  }

  const handleSectionSelect = (sectionId: string) => {
    dispatch(setSelectedSectionId(sectionId))
    dispatch(setSelectedProjectId(null))
  }

  const handleProjectSelect = (projectId: string) => {
    dispatch(setSelectedProjectId(projectId))
    dispatch(setSelectedSubMediaId(null))
  }

  const handleSubMediaSelect = (subMediaId: string) => {
    dispatch(setSelectedSubMediaId(subMediaId))
  }

  const handleAboutSectionSelect = (section: "bio" | "education" | "experience" | "skills" | "awardsAndExhibitions") => {
    dispatch(setSelectedAboutSection(section))
    dispatch(setSelectedPageId(null))
  }

  const handleMoveUp = (type: "page" | "section" | "project" | "subMedia", itemId: string) => {
    if (type === "page") {
      dispatch(moveItemUp({ type, itemUid: itemId }))
    } else if (type === "section" && selectedPageId) {
      dispatch(moveItemUp({ type, pageUid: selectedPageId, itemUid: itemId }))
    } else if (type === "project" && selectedPageId && selectedSectionId) {
      dispatch(moveItemUp({ type, pageUid: selectedPageId, sectionUid: selectedSectionId, itemUid: itemId }))
    } else if (type === "subMedia" && selectedPageId && selectedSectionId && selectedProjectId) {
      dispatch(moveSubMediaUp({ pageUid: selectedPageId, sectionUid: selectedSectionId, projectUid: selectedProjectId, subMediaUid: itemId }))
    }
  }

  const handleMoveDown = (type: "page" | "section" | "project" | "subMedia", itemId: string) => {
    if (type === "page") {
      dispatch(moveItemDown({ type, itemUid: itemId }))
    } else if (type === "section" && selectedPageId) {
      dispatch(moveItemDown({ type, pageUid: selectedPageId, itemUid: itemId }))
    } else if (type === "project" && selectedPageId && selectedSectionId) {
      dispatch(moveItemDown({ type, pageUid: selectedPageId, sectionUid: selectedSectionId, itemUid: itemId }))
    } else if (type === "subMedia" && selectedPageId && selectedSectionId && selectedProjectId) {
      dispatch(moveSubMediaDown({ pageUid: selectedPageId, sectionUid: selectedSectionId, projectUid: selectedProjectId, subMediaUid: itemId }))
    }
  }

  const handleDeletePage = (page: ProjectPage) => {
    if (window.confirm(`Are you sure you want to delete the page "${page.shortTitle}"? This action cannot be undone.`)) {
      dispatch(deletePage({ pageUid: page.uid }))
      setMessage({ text: "Page deleted successfully", type: "success" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteSection = (section: ProjectSection) => {
    if (selectedPageId && window.confirm(`Are you sure you want to delete the section "${section.title}"? This action cannot be undone.`)) {
      dispatch(deleteProjectSection({ pageUid: selectedPageId, sectionUid: section.uid }))
      setMessage({ text: "Section deleted successfully", type: "success" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteProject = (project: Project) => {
    if (selectedPageId && selectedSectionId && window.confirm(`Are you sure you want to delete the project "${project.projectTitle}"? This action cannot be undone.`)) {
      dispatch(deleteProject({ pageUid: selectedPageId, sectionUid: selectedSectionId, projectUid: project.uid }))
      setMessage({ text: "Project deleted successfully", type: "success" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteSubMedia = (subMediaUid: string, mediaDescription: string) => {
    if (selectedPageId && selectedSectionId && selectedProjectId && window.confirm(`Are you sure you want to delete the media "${mediaDescription || subMediaUid}"? This action cannot be undone.`)) {
      dispatch(deleteSubMedia({ pageUid: selectedPageId, sectionUid: selectedSectionId, projectUid: selectedProjectId, subMediaUid }))
      setMessage({ text: "Media deleted successfully", type: "success" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) {
        setMessage({ text: "No file selected.", type: "error" })
        return
      }

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        if (data.pages && Array.isArray(data.pages)) {
          dispatch(setPages(data.pages))
          localStorage.setItem("pages.json.pages", JSON.stringify(data.pages))
        } else {
          setMessage({ text: "Invalid pages data in file.", type: "error" })
        }

        if (data.about) {
          dispatch(setAboutData(data.about))
          localStorage.setItem("pages.json.about", JSON.stringify(data.about))
        } else {
          setMessage({ text: "Invalid about data in file.", type: "error" })
        }

        if (data.pages && data.about) {
          setMessage({ text: "Data imported successfully", type: "success" })
        }
        setTimeout(() => setMessage(null), 3000)
      } catch (error) {
        setMessage({ text: "Error importing file. Please ensure it's a valid JSON file.", type: "error" })
        console.error("Import error:", error)
      }
    }
    input.click()
  }

  const handleExport = () => {
    const exportData = {
      pages: pages,
      about: about,
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "pages.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    localStorage.setItem("pages.json.pages", JSON.stringify(pages))
    localStorage.setItem("pages.json.about", JSON.stringify(about))

    setMessage({ text: "Data exported successfully", type: "success" })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleAddNew = (type: "page" | "section" | "project" | "subMedia") => {
    if (type === "page") {
      const newPath = formatUid("new-page")
      const isDuplicate = pages.some((page) => page.path === newPath)
      const uniquePath = isDuplicate ? `${newPath}-${Date.now().toString().slice(-4)}` : newPath
      const newUid = uuidv4()

      const newPage: ProjectPage = {
        uid: newUid,
        path: uniquePath,
        shortTitle: "",
        topTitle: "",
        projectSections: [],
      }

      dispatch(setPages([...pages, newPage]))
      dispatch(setSelectedPageId(newPage.uid))
      dispatch(setSelectedSectionId(null))
      dispatch(setSelectedProjectId(null))
      dispatch(setSelectedSubMediaId(null))
    } else if (type === "section" && selectedPageId) {
      const newPath = formatUid("new-section")
      const page = pages.find((p) => p.uid === selectedPageId)
      const isDuplicate = page?.projectSections.some((section) => section.path === newPath)
      const uniquePath = isDuplicate ? `${newPath}-${Date.now().toString().slice(-4)}` : newPath
      const newUid = uuidv4()

      const newSection: ProjectSection = {
        uid: newUid,
        path: uniquePath,
        title: "",
        subtitle: "",
        description: "",
        projects: [],
      }

      dispatch(updateProjectSection({ pageUid: selectedPageId, section: newSection }))
      dispatch(setSelectedSectionId(newSection.uid))
      dispatch(setSelectedProjectId(null))
      dispatch(setSelectedSubMediaId(null))
    } else if (type === "project" && selectedSectionId && selectedPageId) {
      const newPath = formatUid("new-project")
      const page = pages.find((p) => p.uid === selectedPageId)
      const section = page?.projectSections.find((s) => s.uid === selectedSectionId)
      const isDuplicate = section?.projects.some((project) => project.path === newPath)
      const uniquePath = isDuplicate ? `${newPath}-${Date.now().toString().slice(-4)}` : newPath
      const newUid = uuidv4()

      const newProject: Project = {
        uid: newUid,
        path: uniquePath,
        thumbnailImage: "",
        projectTitle: "",
        projectSubtitle: "",
        projectParagraphs: [],
        subMedia: [],
        featured: false,
        mainImage: ""
      }

      dispatch(updateProject({ pageUid: selectedPageId, sectionUid: selectedSectionId, project: newProject }))
      dispatch(setSelectedProjectId(newProject.uid))
      dispatch(setSelectedSubMediaId(null))
    } else if (type === "subMedia" && selectedProjectId && selectedSectionId && selectedPageId) {
      const subMediaUid = uuidv4()
      const newSubMedia = {
        subMediaUid: subMediaUid,
        mediaFilename: `/images/${selectedPageId}/${selectedProjectId}/${subMediaUid}.png`,
        mediaType: "Image",
        mediaDescription: "",
      }

      dispatch(
          updateSubMedia({
            pageUid: selectedPageId,
            sectionUid: selectedSectionId,
            projectUid: selectedProjectId,
            subMedia: newSubMedia,
          })
      )
      dispatch(setSelectedSubMediaId(newSubMedia.subMediaUid))
    }
  }

  return (
      <>
      {message && (
          <div
              className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {message.text}
          </div>
      )}
      <div className="flex justify-end mb-4 space-x-2">
        <button onClick={handleImport} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Import Data
        </button>
        <button onClick={handleExport} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Export Data
        </button>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Pages</h2>
        <ul className="space-y-2">
          {pages.map((page) => (
              <li key={page.uid} className="flex items-center space-x-2">
                <button
                    onClick={() => handlePageSelect(page.uid)}
                    className={`flex-1 text-left px-3 py-2 rounded ${
                        selectedPageId === page.uid ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  {page.shortTitle} <span className="text-xs opacity-70">({page.path})</span>
                </button>
                <div className="flex flex-col">
                  <button
                      onClick={() => handleMoveUp("page", page.uid)}
                      className="p-1 text-gray-600 hover:text-purple-600"
                      aria-label="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                      onClick={() => handleMoveDown("page", page.uid)}
                      className="p-1 text-gray-600 hover:text-purple-600"
                      aria-label="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
                <button
                    onClick={() => handleDeletePage(page)}
                    className="p-1 text-gray-600 hover:text-red-600"
                    aria-label="Delete page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
          ))}
        </ul>
        <button
            onClick={() => handleAddNew("page")}
            className="mt-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add New Page
        </button>
      </div>
      {selectedPageId && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Sections</h2>
            <ul className="space-y-2">
              {pages
                  .find((p) => p.uid === selectedPageId)
                  ?.projectSections?.map((section) => (
                      <li key={section.uid} className="flex items-center space-x-2">
                        <button
                            onClick={() => handleSectionSelect(section.uid)}
                            className={`flex-1 text-left px-3 py-2 rounded ${
                                selectedSectionId === section.uid ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                          {section.title} <span className="text-xs opacity-70">({section.path})</span>
                        </button>
                        <div className="flex flex-col">
                          <button
                              onClick={() => handleMoveUp("section", section.uid)}
                              className="p-1 text-gray-600 hover:text-purple-600"
                              aria-label="Move up"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                              onClick={() => handleMoveDown("section", section.uid)}
                              className="p-1 text-gray-600 hover:text-purple-600"
                              aria-label="Move down"
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                        <button
                            onClick={() => handleDeleteSection(section)}
                            className="p-1 text-gray-600 hover:text-red-600"
                            aria-label="Delete section"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                  ))}
            </ul>
            <button
                onClick={() => handleAddNew("section")}
                className="mt-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add New Section
            </button>
          </div>
      )}
      {selectedSectionId && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <ul className="space-y-2">
              {pages
                  .find((p) => p.uid === selectedPageId)
                  ?.projectSections?.find((s) => s.uid === selectedSectionId)
                  ?.projects?.map((project) => (
                      <li key={project.uid} className="flex items-center space-x-2">
                        <button
                            onClick={() => handleProjectSelect(project.uid)}
                            className={`flex-1 text-left px-3 py-2 rounded ${
                                selectedProjectId === project.uid ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                          {project.projectTitle} <span className="text-xs opacity-70">({project.path})</span>
                        </button>
                        <div className="flex flex-col">
                          <button
                              onClick={() => handleMoveUp("project", project.uid)}
                              className="p-1 text-gray-600 hover:text-purple-600"
                              aria-label="Move up"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                              onClick={() => handleMoveDown("project", project.uid)}
                              className="p-1 text-gray-600 hover:text-purple-600"
                              aria-label="Move down"
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                        <button
                            onClick={() => handleDeleteProject(project)}
                            className="p-1 text-gray-600 hover:text-red-600"
                            aria-label="Delete project"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                  ))}
            </ul>
            {selectedSectionId && (
                <button
                    onClick={() => handleAddNew("project")}
                    className="mt-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add New Project
                </button>
            )}
          </div>
      )}
      {selectedProjectId && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Additional Media</h2>
            <ul className="space-y-2">
              {pages
                  .find((p) => p.uid === selectedPageId)
                  ?.projectSections?.find((s) => s.uid === selectedSectionId)
                  ?.projects?.find((p) => p.uid === selectedProjectId)
                  ?.subMedia?.map((media) => (
                      <li key={media.subMediaUid} className="flex items-center space-x-2">
                        <button
                            onClick={() => handleSubMediaSelect(media.subMediaUid)}
                            className={`flex-1 text-left px-3 py-2 rounded ${
                                selectedSubMediaId === media.subMediaUid ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                          {media.mediaDescription || media.mediaFilename}
                        </button>
                        <div className="flex flex-col">
                          <button
                              onClick={() => handleMoveUp("subMedia", media.subMediaUid)}
                              className="p-1 text-gray-600 hover:text-purple-600"
                              aria-label="Move up"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                              onClick={() => handleMoveDown("subMedia", media.subMediaUid)}
                              className="p-1 text-gray-600 hover:text-purple-600"
                              aria-label="Move down"
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                        <button
                            onClick={() => handleDeleteSubMedia(media.subMediaUid, media.mediaDescription || "")}
                            className="p-1 text-gray-600 hover:text-red-600"
                            aria-label="Delete media"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                  ))}
            </ul>
            {selectedProjectId && (
                <button
                    onClick={() => handleAddNew("subMedia")}
                    className="mt-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add New Media
                </button>
            )}
          </div>
      )}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-2">About Page</h2>
        <ul className="space-y-2">
          <li>
            <button
                onClick={() => handleAboutSectionSelect("bio")}
                className={`w-full text-left px-3 py-2 rounded ${
                    selectedAboutSection === "bio" ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              Biography
            </button>
          </li>
          <li>
            <button
                onClick={() => handleAboutSectionSelect("education")}
                className={`w-full text-left px-3 py-2 rounded ${
                    selectedAboutSection === "education" ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              Education
            </button>
          </li>
          <li>
            <button
                onClick={() => handleAboutSectionSelect("experience")}
                className={`w-full text-left px-3 py-2 rounded ${
              selectedAboutSection === "experience" ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
              >
              Experience
          </button>
        </li>
        <li>
          <button
              onClick={() => handleAboutSectionSelect("skills")}
              className={`w-full text-left px-3 py-2 rounded ${
                  selectedAboutSection === "skills" ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            Skills
          </button>
        </li>
        <li>
          <button
              onClick={() => handleAboutSectionSelect("awardsAndExhibitions")}
              className={`w-full text-left px-3 py-2 rounded ${
                  selectedAboutSection === "awardsAndExhibitions" ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            Awards & Exhibitions
          </button>
        </li>
      </ul>
      </div>
</>
)
}
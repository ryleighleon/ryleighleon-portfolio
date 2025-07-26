"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import {
  fetchPages,
  setPages,
  updatePage,
  updateProjectSection,
  updateProject,
  updateSubMedia,
  addParagraphToProject,
  moveItemUp,
  moveItemDown,
} from "@/lib/store/slices/pagesSlice"
import {
  fetchAboutData,
  updateBio,
  updateEducation,
  addEducation,
  updateExperience,
  addExperience,
  updateSkills,
} from "@/lib/store/slices/aboutSlice"
import type { Page, ProjectSection, Project, SubMedia } from "@/types"
import { v4 as uuidv4 } from "uuid"
import Loading from "@/components/loading"
import { ChevronUp, ChevronDown } from "lucide-react"
import { formatUid } from "@/lib/utils/image-paths"

export default function EditPage() {
  const dispatch = useAppDispatch()
  const { pages, status } = useAppSelector((state) => state.pages)
  const aboutData = useAppSelector((state) => state.about)

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedSubMediaId, setSelectedSubMediaId] = useState<string | null>(null)

  const [editData, setEditData] = useState<any>(null)
  const [aboutSection, setAboutSection] = useState<"bio" | "education" | "experience" | "skills" | null>(null)
  const [editAboutData, setEditAboutData] = useState<any>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  // Load data on initial render
  useEffect(() => {
    dispatch(fetchPages())
    dispatch(fetchAboutData())
  }, [dispatch])

  // Update editData when selection changes
  useEffect(() => {
    if (selectedPageId && !selectedSectionId) {
      const page = pages.find((p) => p.uid === selectedPageId)
      if (page) {
        setEditData({ ...page })
      }
    } else if (selectedPageId && selectedSectionId && !selectedProjectId) {
      const page = pages.find((p) => p.uid === selectedPageId)
      if (page && page.projectSections) {
        const section = page.projectSections.find((s) => s.uid === selectedSectionId)
        if (section) {
          setEditData({ ...section })
        }
      }
    } else if (selectedPageId && selectedSectionId && selectedProjectId && !selectedSubMediaId) {
      const page = pages.find((p) => p.uid === selectedPageId)
      if (page && page.projectSections) {
        const section = page.projectSections.find((s) => s.uid === selectedSectionId)
        if (section && section.projects) {
          const project = section.projects.find((p) => p.uid === selectedProjectId)
          if (project) {
            setEditData({ ...project })
          }
        }
      }
    } else if (selectedPageId && selectedSectionId && selectedProjectId && selectedSubMediaId) {
      const page = pages.find((p) => p.uid === selectedPageId)
      if (page && page.projectSections) {
        const section = page.projectSections.find((s) => s.uid === selectedSectionId)
        if (section && section.projects) {
          const project = section.projects.find((p) => p.uid === selectedProjectId)
          if (project && project.subMedia) {
            const subMedia = project.subMedia.find((sm) => sm.subMediaUid === selectedSubMediaId)
            if (subMedia) {
              setEditData({ ...subMedia })
            }
          }
        }
      }
    } else {
      setEditData(null)
    }
  }, [selectedPageId, selectedSectionId, selectedProjectId, selectedSubMediaId, pages])

  // Update editAboutData when aboutSection changes
  useEffect(() => {
    if (aboutSection === "bio") {
      setEditAboutData(aboutData.bio)
    } else if (aboutSection === "education") {
      setEditAboutData([...aboutData.education])
    } else if (aboutSection === "experience") {
      setEditAboutData([...aboutData.experience])
    } else if (aboutSection === "skills") {
      setEditAboutData([...aboutData.skills])
    } else {
      setEditAboutData(null)
    }
  }, [aboutSection, aboutData])

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId)
    setSelectedSectionId(null)
    setSelectedProjectId(null)
    setSelectedSubMediaId(null)
    setAboutSection(null)
  }

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSectionId(sectionId)
    setSelectedProjectId(null)
    setSelectedSubMediaId(null)
  }

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId)
    setSelectedSubMediaId(null)
  }

  const handleSubMediaSelect = (subMediaId: string) => {
    setSelectedSubMediaId(subMediaId)
  }

  const handleAboutSectionSelect = (section: "bio" | "education" | "experience" | "skills") => {
    setAboutSection(section)
    setSelectedPageId(null)
    setSelectedSectionId(null)
    setSelectedProjectId(null)
    setSelectedSubMediaId(null)
  }

  const handleMoveUp = (type: "page" | "section" | "project", itemId: string) => {
    if (type === "page") {
      dispatch(moveItemUp({ type, itemUid: itemId }))
    } else if (type === "section" && selectedPageId) {
      dispatch(moveItemUp({ type, pageUid: selectedPageId, itemUid: itemId }))
    } else if (type === "project" && selectedPageId && selectedSectionId) {
      dispatch(moveItemUp({ type, pageUid: selectedPageId, sectionUid: selectedSectionId, itemUid: itemId }))
    }
  }

  const handleMoveDown = (type: "page" | "section" | "project", itemId: string) => {
    if (type === "page") {
      dispatch(moveItemDown({ type, itemUid: itemId }))
    } else if (type === "section" && selectedPageId) {
      dispatch(moveItemDown({ type, pageUid: selectedPageId, itemUid: itemId }))
    } else if (type === "project" && selectedPageId && selectedSectionId) {
      dispatch(moveItemDown({ type, pageUid: selectedPageId, sectionUid: selectedSectionId, itemUid: itemId }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let updatedValue = value

    // Format Folder Namefields to enforce lowercase and hyphen-only
    if (name === "uid") {
      updatedValue = formatUid(value)

      // Check if Folder Nameis unique
      if (selectedPageId && !selectedSectionId) {
        // Check page Folder Names
        const isDuplicate = pages.some((page) => page.uid === updatedValue && page.uid !== selectedPageId)
        if (isDuplicate) {
          setMessage({ text: "This Folder Nameis already in use. Please choose a unique identifier.", type: "error" })
          return
        }
      } else if (selectedPageId && selectedSectionId && !selectedProjectId) {
        // Check section Folder Names within the current page
        const page = pages.find((p) => p.uid === selectedPageId)
        if (page) {
          const isDuplicate = page.projectSections.some(
            (section) => section.uid === updatedValue && section.uid !== selectedSectionId,
          )
          if (isDuplicate) {
            setMessage({ text: "This section Folder Nameis already in use within this page.", type: "error" })
            return
          }
        }
      } else if (selectedPageId && selectedSectionId && selectedProjectId) {
        // Check project Folder Names within the current section
        const page = pages.find((p) => p.uid === selectedPageId)
        if (page) {
          const section = page.projectSections.find((s) => s.uid === selectedSectionId)
          if (section) {
            const isDuplicate = section.projects.some(
              (project) => project.uid === updatedValue && project.uid !== selectedProjectId,
            )
            if (isDuplicate) {
              setMessage({ text: "This project Folder Nameis already in use within this section.", type: "error" })
              return
            }
          }
        }
      }
    }

    // Create a deep copy to avoid direct state mutation
    const updatedData = { ...editData, [name]: updatedValue }
    setEditData(updatedData)

    // Clear any error messages
    if (message && message.type === "error") {
      setMessage(null)
    }

    // Update Redux immediately
    if (selectedSubMediaId && selectedProjectId && selectedSectionId && selectedPageId) {
      dispatch(
        updateSubMedia({
          pageUid: selectedPageId,
          sectionUid: selectedSectionId,
          projectUid: selectedProjectId,
          subMedia: updatedData,
        }),
      )
    } else if (selectedProjectId && selectedSectionId && selectedPageId) {
      dispatch(
        updateProject({
          pageUid: selectedPageId,
          sectionUid: selectedSectionId,
          project: updatedData,
        }),
      )
    } else if (selectedSectionId && selectedPageId) {
      dispatch(
        updateProjectSection({
          pageUid: selectedPageId,
          section: updatedData,
        }),
      )
    } else if (selectedPageId) {
      dispatch(updatePage(updatedData))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target

    // Create a deep copy to avoid direct state mutation
    const updatedData = { ...editData, [name]: checked }
    setEditData(updatedData)

    // Update Redux immediately
    if (selectedProjectId && selectedSectionId && selectedPageId) {
      dispatch(
        updateProject({
          pageUid: selectedPageId,
          sectionUid: selectedSectionId,
          project: updatedData,
        }),
      )
    }
  }

  const handleAboutInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target

    if (aboutSection === "bio") {
      setEditAboutData(value)
      dispatch(updateBio(value))
    }
  }

  const handleSkillChange = (index: number, value: string) => {
    if (aboutSection === "skills") {
      const updatedSkills = [...editAboutData]
      updatedSkills[index] = value
      setEditAboutData(updatedSkills)
      dispatch(updateSkills(updatedSkills))
    }
  }

  const handleAddSkill = () => {
    if (aboutSection === "skills") {
      const updatedSkills = [...editAboutData, ""]
      setEditAboutData(updatedSkills)
      dispatch(updateSkills(updatedSkills))
    }
  }

  const handleRemoveSkill = (index: number) => {
    if (aboutSection === "skills") {
      const updatedSkills = [...editAboutData]
      updatedSkills.splice(index, 1)
      setEditAboutData(updatedSkills)
      dispatch(updateSkills(updatedSkills))
    }
  }

  const handleEducationChange = (index: number, field: string, value: string) => {
    if (aboutSection === "education") {
      const updatedEducation = [...editAboutData]
      updatedEducation[index] = { ...updatedEducation[index], [field]: value }
      setEditAboutData(updatedEducation)
      dispatch(updateEducation(updatedEducation))
    }
  }

  const handleAddEducation = () => {
    if (aboutSection === "education") {
      const newEducation = {
        id: uuidv4(),
        degree: "New Degree",
        institution: "Institution Name",
        years: "Year Range",
      }

      const updatedEducation = [...editAboutData, newEducation]
      setEditAboutData(updatedEducation)
      dispatch(addEducation(newEducation))
    }
  }

  const handleRemoveEducation = (index: number) => {
    if (aboutSection === "education") {
      const updatedEducation = [...editAboutData]
      updatedEducation.splice(index, 1)
      setEditAboutData(updatedEducation)
      dispatch(updateEducation(updatedEducation))
    }
  }

  const handleExperienceChange = (index: number, field: string, value: string | string[]) => {
    if (aboutSection === "experience") {
      const updatedExperience = [...editAboutData]
      updatedExperience[index] = { ...updatedExperience[index], [field]: value }
      setEditAboutData(updatedExperience)
      dispatch(updateExperience(updatedExperience))
    }
  }

  const handleAddExperience = () => {
    if (aboutSection === "experience") {
      const newExperience = {
        id: uuidv4(),
        title: "New Position",
        company: "Company Name",
        period: "Time Period",
        responsibilities: ["Responsibility 1"],
      }

      const updatedExperience = [...editAboutData, newExperience]
      setEditAboutData(updatedExperience)
      dispatch(addExperience(newExperience))
    }
  }

  const handleRemoveExperience = (index: number) => {
    if (aboutSection === "experience") {
      const updatedExperience = [...editAboutData]
      updatedExperience.splice(index, 1)
      setEditAboutData(updatedExperience)
      dispatch(updateExperience(updatedExperience))
    }
  }

  const handleAddResponsibility = (expIndex: number) => {
    if (aboutSection === "experience") {
      const updatedExperience = [...editAboutData]
      updatedExperience[expIndex].responsibilities.push("New responsibility")
      setEditAboutData(updatedExperience)
      dispatch(updateExperience(updatedExperience))
    }
  }

  const handleResponsibilityChange = (expIndex: number, respIndex: number, value: string) => {
    if (aboutSection === "experience") {
      const updatedExperience = [...editAboutData]
      updatedExperience[expIndex].responsibilities[respIndex] = value
      setEditAboutData(updatedExperience)
      dispatch(updateExperience(updatedExperience))
    }
  }

  const handleRemoveResponsibility = (expIndex: number, respIndex: number) => {
    if (aboutSection === "experience") {
      const updatedExperience = [...editAboutData]
      updatedExperience[expIndex].responsibilities.splice(respIndex, 1)
      setEditAboutData(updatedExperience)
      dispatch(updateExperience(updatedExperience))
    }
  }

  const handleAddNew = (type: "page" | "section" | "project" | "subMedia" | "paragraph") => {
    if (type === "page") {
      // Create a formatted Folder Namefrom the title
      const newUid = formatUid("new-page")

      // Check if Folder Namealready exists
      const isDuplicate = pages.some((page) => page.uid === newUid)
      const uniqueUid = isDuplicate ? `${newUid}-${Date.now().toString().slice(-4)}` : newUid

      const newPage: Page = {
        uid: uniqueUid,
        shortTitle: "New Page",
        topTitle: "New Page Title",
        projectSections: [],
      }

      dispatch(setPages([...pages, newPage]))
      setSelectedPageId(newPage.uid)
    } else if (type === "section" && selectedPageId) {
      // Create a formatted Folder Namefrom the title
      const newUid = formatUid("new-section")

      // Check if Folder Namealready exists in this page
      const page = pages.find((p) => p.uid === selectedPageId)
      const isDuplicate = page?.projectSections.some((section) => section.uid === newUid)
      const uniqueUid = isDuplicate ? `${newUid}-${Date.now().toString().slice(-4)}` : newUid

      const newSection: ProjectSection = {
        uid: uniqueUid,
        title: "New Section",
        subtitle: "New Section Subtitle",
        description: "New section description",
        projects: [],
      }

      const updatedPage = { ...pages.find((p) => p.uid === selectedPageId)! }
      if (!updatedPage.projectSections) {
        updatedPage.projectSections = []
      }
      updatedPage.projectSections = [...updatedPage.projectSections, newSection]

      dispatch(updatePage(updatedPage))
      setSelectedSectionId(newSection.uid)
    } else if (type === "project" && selectedSectionId && selectedPageId) {
      // Create a formatted Folder Namefrom the title
      const newUid = formatUid("new-project")

      // Check if Folder Namealready exists in this section
      const page = pages.find((p) => p.uid === selectedPageId)
      const section = page?.projectSections.find((s) => s.uid === selectedSectionId)
      const isDuplicate = section?.projects.some((project) => project.uid === newUid)
      const uniqueUid = isDuplicate ? `${newUid}-${Date.now().toString().slice(-4)}` : newUid

      const newProject: Project = {
        uid: uniqueUid,
        imageFilename: `/placeholder.svg`,
        projectTitle: "New Project",
        projectSubtitle: "New Project Subtitle",
        imageName: "New Project Image",
        projectParagraphs: [],
        subMedia: [],
        featured: false,
      }

      dispatch(
        updateProject({
          pageUid: selectedPageId,
          sectionUid: selectedSectionId,
          project: newProject,
        }),
      )

      setSelectedProjectId(newProject.uid)
    } else if (type === "subMedia" && selectedProjectId && selectedSectionId && selectedPageId) {
      const subMediaUid = uuidv4()
      const newSubMedia: SubMedia = {
        subMediaUid: subMediaUid,
        mediaFilename: `/images/${selectedPageId}/${selectedProjectId}/${subMediaUid}.png`,
        mediaType: "Image",
        mediaOrientation: "Square",
        mediaDescription: "New media item",
      }

      dispatch(
        updateSubMedia({
          pageUid: selectedPageId,
          sectionUid: selectedSectionId,
          projectUid: selectedProjectId,
          subMedia: newSubMedia,
        }),
      )

      setSelectedSubMediaId(newSubMedia.subMediaUid)
    } else if (type === "paragraph" && selectedProjectId && selectedSectionId && selectedPageId) {
      const newParagraph = {
        paragraphUid: uuidv4(),
        paragraphTitle: "New Paragraph",
        paragraphText: "New paragraph text",
      }

      dispatch(
        addParagraphToProject({
          pageUid: selectedPageId,
          sectionUid: selectedSectionId,
          projectUid: selectedProjectId,
          paragraph: newParagraph,
        }),
      )

      // Update the local state to reflect the change
      setEditData({
        ...editData,
        projectParagraphs: [...(editData.projectParagraphs || []), newParagraph],
      })
    }
  }

  const handleExport = () => {
    // Create a combined export with both pages and about data
    const exportData = {
      pages: pages,
      about: aboutData,
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "pages.rld"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    // Also update localStorage
    localStorage.setItem("pages.rld", JSON.stringify(exportData))

    setMessage({ text: "Data exported successfully", type: "success" })
    setTimeout(() => setMessage(null), 3000)
  }

  if (status === "loading") {
    return <Loading />
  }

  return (
    <div className="py-8 px-6 md:px-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Admin Edit Page</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button onClick={handleExport} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Export Data
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Pages</h2>
            <ul className="space-y-2">
              {pages.map((page) => (
                <li key={page.uid} className="flex items-center">
                  <button
                    onClick={() => handlePageSelect(page.uid)}
                    className={`flex-1 text-left px-3 py-2 rounded ${
                      selectedPageId === page.uid ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {page.shortTitle} <span className="text-xs opacity-70">({page.uid})</span>
                  </button>
                  <div className="flex flex-col ml-1">
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Sections</h2>
              <ul className="space-y-2">
                {pages
                  .find((p) => p.uid === selectedPageId)
                  ?.projectSections?.map((section) => (
                    <li key={section.uid} className="flex items-center">
                      <button
                        onClick={() => handleSectionSelect(section.uid)}
                        className={`flex-1 text-left px-3 py-2 rounded ${
                          selectedSectionId === section.uid
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {section.title} <span className="text-xs opacity-70">({section.uid})</span>
                      </button>
                      <div className="flex flex-col ml-1">
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Projects</h2>
              <ul className="space-y-2">
                {pages
                  .find((p) => p.uid === selectedPageId)
                  ?.projectSections?.find((s) => s.uid === selectedSectionId)
                  ?.projects?.map((project) => (
                    <li key={project.uid} className="flex items-center">
                      <button
                        onClick={() => handleProjectSelect(project.uid)}
                        className={`flex-1 text-left px-3 py-2 rounded ${
                          selectedProjectId === project.uid
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {project.projectTitle} <span className="text-xs opacity-70">({project.uid})</span>
                      </button>
                      <div className="flex flex-col ml-1">
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
                    </li>
                  ))}
              </ul>
              <button
                onClick={() => handleAddNew("project")}
                className="mt-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add New Project
              </button>
            </div>
          )}

          {selectedProjectId && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Additional Media</h2>
              <ul className="space-y-2">
                {pages
                  .find((p) => p.uid === selectedPageId)
                  ?.projectSections?.find((s) => s.uid === selectedSectionId)
                  ?.projects?.find((p) => p.uid === selectedProjectId)
                  ?.subMedia?.map((media) => (
                    <li key={media.subMediaUid}>
                      <button
                        onClick={() => handleSubMediaSelect(media.subMediaUid)}
                        className={`w-full text-left px-3 py-2 rounded ${
                          selectedSubMediaId === media.subMediaUid
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {media.mediaDescription || media.mediaFilename}
                      </button>
                    </li>
                  ))}
              </ul>
              <button
                onClick={() => handleAddNew("subMedia")}
                className="mt-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add New Media
              </button>
            </div>
          )}

          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-2">About Page</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleAboutSectionSelect("bio")}
                  className={`w-full text-left px-3 py-2 rounded ${
                    aboutSection === "bio" ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Biography
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAboutSectionSelect("education")}
                  className={`w-full text-left px-3 py-2 rounded ${
                    aboutSection === "education" ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Education
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAboutSectionSelect("experience")}
                  className={`w-full text-left px-3 py-2 rounded ${
                    aboutSection === "experience" ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAboutSectionSelect("skills")}
                  className={`w-full text-left px-3 py-2 rounded ${
                    aboutSection === "skills" ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Skills
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:w-3/4">
          {/* Portfolio Page Editing */}
          {editData && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">
                {selectedSubMediaId
                  ? "Edit Media"
                  : selectedProjectId
                    ? "Edit Project"
                    : selectedSectionId
                      ? "Edit Section"
                      : "Edit Page"}
              </h2>

              <div className="space-y-4">
                {/* Page Fields */}
                {selectedPageId && !selectedSectionId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Browser Path Excluding '/' (i.e. portfolio)</label>
                      <input
                        type="text"
                        name="uid"
                        value={editData.uid || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Only lowercase letters, numbers, and hyphens. Used in URLs like: /{editData.uid}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Short Title</label>
                      <input
                        type="text"
                        name="shortTitle"
                        value={editData.shortTitle || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Top Title</label>
                      <input
                        type="text"
                        name="topTitle"
                        value={editData.topTitle || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bottom Title</label>
                      <input
                        type="text"
                        name="bottomTitle"
                        value={editData.bottomTitle || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </>
                )}

                {/* Section Fields */}
                {selectedSectionId && !selectedProjectId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
                      <input
                        type="text"
                        name="uid"
                        value={editData.uid || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Only lowercase letters, numbers, and hyphens. Must be unique within this page.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editData.title || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        name="subtitle"
                        value={editData.subtitle || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={editData.description || ""}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </>
                )}

                {/* Project Fields */}
                {selectedProjectId && !selectedSubMediaId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Browser Path Excluding '/' (i.e. portfolio)</label>
                      <input
                        type="text"
                        name="uid"
                        value={editData.uid || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Only lowercase letters, numbers, and hyphens. Used in URLs like: /projects/{editData.uid}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                      <input
                        type="text"
                        name="projectTitle"
                        value={editData.projectTitle || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Subtitle</label>
                      <input
                        type="text"
                        name="projectSubtitle"
                        value={editData.projectSubtitle || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image Name</label>
                      <input
                        type="text"
                        name="imageName"
                        value={editData.imageName || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image Filename</label>
                      <input
                        type="text"
                        name="imageFilename"
                        value={editData.imageFilename || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        placeholder="Enter full URL or path to image"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended path: /images/{selectedPageId}/{selectedProjectId}/cover.png
                      </p>
                      <p className="text-xs text-gray-500 mt-1 bg-gray-100 p-2 rounded font-mono">
                        /ryleighleon-portfolio/public/images/{selectedPageId}/{selectedProjectId}/cover.png
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={editData.featured || false}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                        Featured Project (will appear on homepage)
                      </label>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Project Paragraphs</h3>
                      {editData.projectParagraphs?.map((paragraph: any, index: number) => (
                        <div key={paragraph.paragraphUid} className="mb-4 p-4 border rounded">
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph Title</label>
                            <input
                              type="text"
                              value={paragraph.paragraphTitle || ""}
                              onChange={(e) => {
                                const updatedParagraphs = [...(editData.projectParagraphs || [])]
                                updatedParagraphs[index].paragraphTitle = e.target.value

                                const updatedProject = {
                                  ...editData,
                                  projectParagraphs: updatedParagraphs,
                                }

                                setEditData(updatedProject)

                                dispatch(
                                  updateProject({
                                    pageUid: selectedPageId,
                                    sectionUid: selectedSectionId,
                                    project: updatedProject,
                                  }),
                                )
                              }}
                              className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph Text</label>
                            <textarea
                              value={paragraph.paragraphText || ""}
                              onChange={(e) => {
                                const updatedParagraphs = [...(editData.projectParagraphs || [])]
                                updatedParagraphs[index].paragraphText = e.target.value

                                const updatedProject = {
                                  ...editData,
                                  projectParagraphs: updatedParagraphs,
                                }

                                setEditData(updatedProject)

                                dispatch(
                                  updateProject({
                                    pageUid: selectedPageId,
                                    sectionUid: selectedSectionId,
                                    project: updatedProject,
                                  }),
                                )
                              }}
                              rows={4}
                              className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddNew("paragraph")}
                        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Add Paragraph
                      </button>
                    </div>
                  </>
                )}

                {/* SubMedia Fields */}
                {selectedSubMediaId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                      <select
                        name="mediaType"
                        value={editData.mediaType || "Image"}
                        onChange={(e) => {
                          const updated = { ...editData, mediaType: e.target.value }
                          setEditData(updated)

                          dispatch(
                            updateSubMedia({
                              pageUid: selectedPageId,
                              sectionUid: selectedSectionId,
                              projectUid: selectedProjectId,
                              subMedia: updated,
                            }),
                          )
                        }}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="Image">Image</option>
                        <option value="Video">Video</option>
                        <option value="GIF">GIF</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Media Orientation</label>
                      <select
                        name="mediaOrientation"
                        value={editData.mediaOrientation || "Square"}
                        onChange={(e) => {
                          const updated = { ...editData, mediaOrientation: e.target.value }
                          setEditData(updated)

                          dispatch(
                            updateSubMedia({
                              pageUid: selectedPageId,
                              sectionUid: selectedSectionId,
                              projectUid: selectedProjectId,
                              subMedia: updated,
                            }),
                          )
                        }}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="Square">Square</option>
                        <option value="Vertical">Vertical</option>
                        <option value="Horizontal">Horizontal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Media Description</label>
                      <input
                        type="text"
                        name="mediaDescription"
                        value={editData.mediaDescription || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Media Filename</label>
                      <input
                        type="text"
                        name="mediaFilename"
                        value={editData.mediaFilename || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        placeholder="Enter full URL or path to media"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Standard path: /images/{selectedPageId}/{selectedProjectId}/{editData.subMediaUid}.png or use a
                        full URL
                      </p>
                      <p className="text-xs text-gray-500 mt-1 bg-gray-100 p-2 rounded font-mono">
                        /ryleighleon-portfolio/public/images/{selectedPageId}/{selectedProjectId}/{editData.subMediaUid}
                        .png
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* About Page Editing */}
          {aboutSection === "bio" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Biography</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                <textarea
                  value={editAboutData || ""}
                  onChange={handleAboutInputChange}
                  rows={8}
                  className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {aboutSection === "education" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Education</h2>

              {editAboutData?.map((edu: any, index: number) => (
                <div key={edu.id} className="mb-6 p-4 border rounded">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree || ""}
                      onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                      className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    <input
                      type="text"
                      value={edu.institution || ""}
                      onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                      className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
                    <input
                      type="text"
                      value={edu.years || ""}
                      onChange={(e) => handleEducationChange(index, "years", e.target.value)}
                      className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveEducation(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={handleAddEducation}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Education
              </button>
            </div>
          )}

          {aboutSection === "experience" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Experience</h2>

              {editAboutData?.map((exp: any, index: number) => (
                <div key={exp.id} className="mb-6 p-4 border rounded">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={exp.title || ""}
                      onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                      className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company || ""}
                      onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                      className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                    <input
                      type="text"
                      value={exp.period || ""}
                      onChange={(e) => handleExperienceChange(index, "period", e.target.value)}
                      className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                    {exp.responsibilities?.map((resp: string, respIndex: number) => (
                      <div key={respIndex} className="flex mb-2">
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => handleResponsibilityChange(index, respIndex, e.target.value)}
                          className="flex-1 p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />
                        <button
                          onClick={() => handleRemoveResponsibility(index, respIndex)}
                          className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddResponsibility(index)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Add Responsibility
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveExperience(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Remove Experience
                  </button>
                </div>
              ))}

              <button
                onClick={handleAddExperience}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Experience
              </button>
            </div>
          )}

          {aboutSection === "skills" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Skills</h2>

              {editAboutData?.map((skill: string, index: number) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="flex-1 p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={handleAddSkill}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-2"
              >
                Add Skill
              </button>
            </div>
          )}

          {!editData && !aboutSection && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Select an item to edit</h2>
              <p>
                Choose a page, section, project, media item, or about page section from the sidebar to edit its details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

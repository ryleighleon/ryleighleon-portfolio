import React, { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { updateProject, addParagraphToProject, moveParagraphUp, moveParagraphDown, deleteParagraph } from "@/lib/store/slices/pagesSlice"
import { formatUid } from "@/lib/utils/image-paths"
import { v4 as uuidv4 } from "uuid"

export default function ProjectEditor() {
  const dispatch = useAppDispatch()
  const { pages, selectedPageId, selectedSectionId, selectedProjectId } = useAppSelector((state) => state.pages)
  const page = pages.find((p) => p.uid === selectedPageId)
  const [editData, setEditData] = useState<any>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const handleDeleteParagraph = (paragraphUid: string) => {
      if (!selectedPageId || !selectedSectionId || !selectedProjectId) return;

      dispatch(
        deleteParagraph({
          pageUid: selectedPageId,
          sectionUid: selectedSectionId,
          projectUid: selectedProjectId,
          paragraphUid,
        }),
      );

      // Also update local editData to keep UI in sync immediately
      setEditData((prev: any) => ({
        ...prev,
        projectParagraphs: prev.projectParagraphs.filter(
          (p: any) => p.paragraphUid !== paragraphUid,
        ),
      }));
    };

  useEffect(() => {
    if (selectedPageId && selectedSectionId && selectedProjectId) {
      if (page && page.projectSections) {
        const section = page.projectSections.find((s) => s.uid === selectedSectionId)
        if (section && section.projects) {
          const project = section.projects.find((p) => p.uid === selectedProjectId)
          if (project) {
            setEditData({ ...project })
          }
        }
      }
    } else {
      setEditData(null)
    }
  }, [selectedPageId, selectedSectionId, selectedProjectId, pages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let updatedValue = value

    if (name === "path") {
      updatedValue = formatUid(value)
      const page = pages.find((p) => p.uid === selectedPageId)
      if (page) {
        const section = page.projectSections.find((s) => s.uid === selectedSectionId)
        if (section) {
          const isDuplicate = section.projects.some(
              (project) => project.path === updatedValue && project.uid !== selectedProjectId,
          )
          if (isDuplicate) {
            setMessage({ text: "This project Path is already in use within this section.", type: "error" })
            return
          }
        }
      }
    }

    const updatedData = { ...editData, [name]: updatedValue }
    setEditData(updatedData)
    dispatch(updateProject({ pageUid: selectedPageId!, sectionUid: selectedSectionId!, project: updatedData }))
    if (message && message.type === "error") {
      setMessage(null)
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    const updatedData = { ...editData, [name]: checked }
    setEditData(updatedData)
    dispatch(updateProject({ pageUid: selectedPageId!, sectionUid: selectedSectionId!, project: updatedData }))
  }

  const handleAddNew = () => {
    const newPath = formatUid("new-project")
    const page = pages.find((p) => p.uid === selectedPageId)
    const section = page?.projectSections.find((s) => s.uid === selectedSectionId)
    const isDuplicate = section?.projects.some((project) => project.path === newPath)
    const uniquePath = isDuplicate ? `${newPath}-${Date.now().toString().slice(-4)}` : newPath
    const newUid = uuidv4()

    const newProject = {
      uid: newUid,
      path: uniquePath,
      thumbnailImage: ``,
      mainImage: ``,
      projectTitle: "",
      projectSubtitle: "",
      projectParagraphs: [],
      subMedia: [],
      featured: false,
    }

    dispatch(updateProject({ pageUid: selectedPageId!, sectionUid: selectedSectionId!, project: newProject }))
  }

  const handleAddParagraph = () => {
    const newParagraph = {
      paragraphUid: uuidv4(),
      paragraphTitle: "",
      paragraphText: "",
    }

    dispatch(
        addParagraphToProject({
          pageUid: selectedPageId!,
          sectionUid: selectedSectionId!,
          projectUid: selectedProjectId!,
          paragraph: newParagraph,
        }),
    )

    setEditData({
      ...editData,
      projectParagraphs: [...(editData.projectParagraphs || []), newParagraph],
    })
  }

  const handleMoveParagraphUp = (paragraphUid: string) => {
      if (!selectedPageId || !selectedSectionId || !selectedProjectId) return;
      dispatch(
        moveParagraphUp({
          pageUid: selectedPageId,
          sectionUid: selectedSectionId,
          projectUid: selectedProjectId,
          paragraphUid,
        }),
      );
    };

    const handleMoveParagraphDown = (paragraphUid: string) => {
      if (!selectedPageId || !selectedSectionId || !selectedProjectId) return;
      dispatch(
        moveParagraphDown({
          pageUid: selectedPageId,
          sectionUid: selectedSectionId,
          projectUid: selectedProjectId,
          paragraphUid,
        }),
      );
    };

  if (!editData || !selectedProjectId) return null

  return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
        {message && (
            <div
                className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message.text}
            </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Path</label>
            <input
                type="text"
                name="path"
                value={editData.path || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Only lowercase letters, numbers, and hyphens. Project will be located at <b>ryleighleon.com/{page!.path}/{editData.path}</b>
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
          <div className="border rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
            <input
                type="text"
                name="mainImage"
                value={editData.mainImage || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="Enter full URL or path to main image"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended name: main.png</p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Save the main image at this path to ensure it displays correctly:
              </label>
              <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded font-mono">
                {`/ryleighleon-portfolio/media/${selectedPageId}/${selectedProjectId}/${editData.mainImage || ""}`}
              </p>
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
            <input
                type="text"
                name="thumbnailImage"
                value={editData.thumbnailImage || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="Enter full URL or path to thumbnail image"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended name: thumbnail.png</p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Save the thumbnail image at this path to ensure it displays correctly:
              </label>
              <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded font-mono">
                {`/ryleighleon-portfolio/media/${selectedPageId}/${selectedProjectId}/${editData.thumbnailImage || ""}`}
              </p>
            </div>
          </div>
          {selectedSectionId === "portfolio" && (
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
          )}
          <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Project Paragraphs</h3>

              {editData.projectParagraphs?.map((paragraph: any, index: number) => (
                <div
                  key={paragraph.paragraphUid}
                  className="mb-4 p-4 border rounded bg-white relative"
                >
                  {/* Arrows – placed top-right */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveParagraphUp(paragraph.paragraphUid)}
                      disabled={index === 0}
                      title="Move up"
                      className="text-gray-500 hover:text-purple-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveParagraphDown(paragraph.paragraphUid)}
                      disabled={index === editData.projectParagraphs.length - 1}
                      title="Move down"
                      className="text-gray-500 hover:text-purple-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ↓
                    </button>
                    {/* Delete button – appears on hover or always visible */}
                    <button
                      onClick={() => handleDeleteParagraph(paragraph.paragraphUid)}
                      title="Delete paragraph"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      × {/* or use a trash icon from lucide-react / heroicons */}
                    </button>
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph Title</label>
                    <input
                        type="text"
                        value={paragraph.paragraphTitle || ""}
                        onChange={(e) => {
                          const updatedParagraphs = editData.projectParagraphs.map((p, i) =>
                            i === index
                              ? { ...p, paragraphTitle: e.target.value }   // ← create new object
                              : p
                          );

                          const updatedProject = {
                            ...editData,
                            projectParagraphs: updatedParagraphs,
                          };

                          setEditData(updatedProject);
                          dispatch(
                            updateProject({
                              pageUid: selectedPageId!,
                              sectionUid: selectedSectionId!,
                              project: updatedProject,
                            })
                          );
                        }}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph Text</label>
                    <textarea
                        value={paragraph.paragraphText || ""}
                        onChange={(e) => {
                          const updatedParagraphs = editData.projectParagraphs.map((p, i) =>
                              i === index
                                  ? { ...p, paragraphText: e.target.value }
                                  : p
                          );

                          const updatedProject = {
                            ...editData,
                            projectParagraphs: updatedParagraphs,
                          };

                          setEditData(updatedProject);
                          dispatch(
                              updateProject({
                                pageUid: selectedPageId!,
                                sectionUid: selectedSectionId!,
                                project: updatedProject,
                              })
                          );
                        }}
                        rows={4}
                        className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
            ))}
            <button
                onClick={handleAddParagraph}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Paragraph
            </button>
          </div>
        </div>
      </div>
  )
}
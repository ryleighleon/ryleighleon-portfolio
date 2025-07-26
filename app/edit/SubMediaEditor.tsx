import React, { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { updateSubMedia } from "@/lib/store/slices/pagesSlice"
import { v4 as uuidv4 } from "uuid"

export default function SubMediaEditor() {
  const dispatch = useAppDispatch()
  const { pages, selectedPageId, selectedSectionId, selectedProjectId, selectedSubMediaId } = useAppSelector((state) => state.pages)
  const [editData, setEditData] = useState<any>(null)

  useEffect(() => {
    if (selectedPageId && selectedSectionId && selectedProjectId && selectedSubMediaId) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updatedData = { ...editData, [name]: value }
    setEditData(updatedData)
    dispatch(
      updateSubMedia({
        pageUid: selectedPageId!,
        sectionUid: selectedSectionId!,
        projectUid: selectedProjectId!,
        subMedia: updatedData,
      }),
    )
  }

  const handleAddNew = () => {
    const subMediaUid = uuidv4()
    const newSubMedia = {
      subMediaUid: subMediaUid,
      mediaFilename: `/images/${selectedPageId}/${selectedProjectId}/${subMediaUid}.png`,
      mediaType: "Image",
      mediaOrientation: "Square",
      mediaDescription: "New media item",
    }

    dispatch(
      updateSubMedia({
        pageUid: selectedPageId!,
        sectionUid: selectedSectionId!,
        projectUid: selectedProjectId!,
        subMedia: newSubMedia,
      }),
    )
  }

  if (!editData || !selectedSubMediaId) return null

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Media</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
          <select
            name="mediaType"
            value={editData.mediaType || "Image"}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Save the image file at this path to ensure it displays correctly:
            </label>
            <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded font-mono">
              {`/ryleighleon-portfolio/media/${selectedPageId}/${selectedProjectId}/${editData.mediaFilename}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
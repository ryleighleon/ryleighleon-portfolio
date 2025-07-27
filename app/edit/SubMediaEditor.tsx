import React, { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { updateSubMedia } from "@/lib/store/slices/pagesSlice"
import { v4 as uuidv4 } from "uuid"

export default function SubMediaEditor() {
  const dispatch = useAppDispatch()
  const { pages, selectedPageId, selectedSectionId, selectedProjectId, selectedSubMediaId } = useAppSelector((state) => state.pages)
  const [editData, setEditData] = useState<any>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

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

    // Validate that thumbnail and main image are provided for GIF/Video
    if (name === "mediaType" && (value === "GIF" || value === "Video")) {
      if (!updatedData.thumbnailImage || !updatedData.mainImage) {
        setMessage({ text: "Thumbnail and Main Image are required for GIF or Video media types.", type: "error" })
        return
      }
    }

    setEditData(updatedData)
    dispatch(
        updateSubMedia({
          pageUid: selectedPageId!,
          sectionUid: selectedSectionId!,
          projectUid: selectedProjectId!,
          subMedia: updatedData,
        }),
    )
    if (message && message.type === "error") {
      setMessage(null)
    }
  }

  const handleAddNew = () => {
    const subMediaUid = uuidv4()
    const newSubMedia = {
      subMediaUid: subMediaUid,
      mediaFilename: `/images/${selectedPageId}/${selectedProjectId}/${subMediaUid}.png`,
      thumbnailImage: `/images/${selectedPageId}/${selectedProjectId}/thumbnail-${subMediaUid}.png`,
      mainImage: `/images/${selectedPageId}/${selectedProjectId}/main-${subMediaUid}.png`,
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
        {message && (
            <div
                className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message.text}
            </div>
        )}
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
                Save the media file at this path to ensure it displays correctly:
              </label>
              <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded font-mono">
                {`/ryleighleon-portfolio/media/${selectedPageId}/${selectedProjectId}/${editData.mediaFilename}`}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail Image {editData.mediaType === "GIF" || editData.mediaType === "Video" ? "(Required)" : "(Optional)"}
            </label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image {editData.mediaType === "GIF" || editData.mediaType === "Video" ? "(Required)" : "(Optional)"}
            </label>
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
        </div>
      </div>
  )
}
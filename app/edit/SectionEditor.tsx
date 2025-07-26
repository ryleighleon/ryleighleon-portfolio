import React, { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { updateProjectSection } from "@/lib/store/slices/pagesSlice"
import { formatUid } from "@/lib/utils/image-paths"
import { v4 as uuidv4 } from "uuid"

export default function SectionEditor() {
  const dispatch = useAppDispatch()
  const { pages, selectedPageId, selectedSectionId } = useAppSelector((state) => state.pages)
  const [editData, setEditData] = useState<any>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    if (selectedPageId && selectedSectionId) {
      const page = pages.find((p) => p.uid === selectedPageId)
      if (page && page.projectSections) {
        const section = page.projectSections.find((s) => s.uid === selectedSectionId)
        if (section) {
          setEditData({ ...section })
        }
      }
    } else {
      setEditData(null)
    }
  }, [selectedPageId, selectedSectionId, pages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let updatedValue = value

    if (name === "path") {
      updatedValue = formatUid(value)
      const page = pages.find((p) => p.uid === selectedPageId)
      if (page) {
        const isDuplicate = page.projectSections.some(
            (section) => section.path === updatedValue && section.uid !== selectedSectionId,
        )
        if (isDuplicate) {
          setMessage({ text: "This section Path is already in use within this page.", type: "error" })
          return
        }
      }
    }

    const updatedData = { ...editData, [name]: updatedValue }
    setEditData(updatedData)
    dispatch(updateProjectSection({ pageUid: selectedPageId!, section: updatedData }))
    if (message && message.type === "error") {
      setMessage(null)
    }
  }

  const handleAddNew = () => {
    const newPath = formatUid("new-section")
    const page = pages.find((p) => p.uid === selectedPageId)
    const isDuplicate = page?.projectSections.some((section) => section.path === newPath)
    const uniquePath = isDuplicate ? `${newPath}-${Date.now().toString().slice(-4)}` : newPath
    const newUid = uuidv4()

    const newSection = {
      uid: newUid,
      path: uniquePath,
      title: "New Section",
      subtitle: "New Section Subtitle",
      description: "New section description",
      projects: [],
    }

    dispatch(updateProjectSection({ pageUid: selectedPageId!, section: newSection }))
  }

  if (!editData || !selectedSectionId) return null

  return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Section</h2>
        {message && (
            <div
                className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message.text}
            </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Path</label>
            <input
                type="text"
                name="path"
                value={editData.path || ""}
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
        </div>
      </div>
  )
}
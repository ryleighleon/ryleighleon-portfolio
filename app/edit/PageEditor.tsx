import React, { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { updatePage, setPages } from "@/lib/store/slices/pagesSlice"
import { formatUid } from "@/lib/utils/image-paths"
import { v4 as uuidv4 } from "uuid"

export default function PageEditor() {
  const dispatch = useAppDispatch()
  const { pages, selectedPageId } = useAppSelector((state) => state.pages)
  const [editData, setEditData] = useState<any>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    if (selectedPageId) {
      const page = pages.find((p) => p.uid === selectedPageId)
      if (page) {
        setEditData({ ...page })
      }
    } else {
      setEditData(null)
    }
  }, [selectedPageId, pages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let updatedValue = value

    if (name === "path") {
      updatedValue = formatUid(value) // Ensure path is formatted like uid (lowercase, hyphenated)
      const isDuplicate = pages.some((page) => page.path === updatedValue && page.uid !== selectedPageId)
      if (isDuplicate) {
        setMessage({ text: "This Path is already in use. Please choose a unique path.", type: "error" })
        return
      }
    }

    const updatedData = { ...editData, [name]: updatedValue }
    setEditData(updatedData)
    dispatch(updatePage(updatedData))
    if (message && message.type === "error") {
      setMessage(null)
    }
  }

  const handleAddNew = () => {
    const newPath = formatUid("new-page")
    const isDuplicate = pages.some((page) => page.path === newPath)
    const uniquePath = isDuplicate ? `${newPath}-${Date.now().toString().slice(-4)}` : newPath
    const newUid = uuidv4() // Generate unique uid for new page

    const newPage = {
      uid: newUid,
      path: uniquePath,
      shortTitle: "New Page",
      topTitle: "New Page Title",
      projectSections: [],
    }

    dispatch(setPages([...pages, newPage]))
  }

  if (!editData || !selectedPageId) return null

  return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Page</h2>
        {message && (
            <div
                className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message.text}
            </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Browser Path Excluding '/' (i.e. portfolio)</label>
            <input
                type="text"
                name="path"
                value={editData.path || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Only lowercase letters, numbers, and hyphens. Used in URLs like: /{editData.path}
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
        </div>
      </div>
  )
}
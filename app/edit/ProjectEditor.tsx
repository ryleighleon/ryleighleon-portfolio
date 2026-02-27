import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  updateProject,
  addParagraphToProject,
  moveParagraphUp,
  moveParagraphDown,
  deleteParagraph,
} from "@/lib/store/slices/pagesSlice";
import { formatUid } from "@/lib/utils/image-paths";
import { v4 as uuidv4 } from "uuid";

const PARAGRAPH_TITLE_OPTIONS = [
  "The Project:",
  "The Process:",
  "The Company:",
  "Role In Project:"
] as const;

export default function ProjectEditor() {
  const dispatch = useAppDispatch();
  const { pages, selectedPageId, selectedSectionId, selectedProjectId } =
      useAppSelector((state) => state.pages);

  const page = pages.find((p) => p.uid === selectedPageId);

  const [editData, setEditData] = useState<any>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (selectedPageId && selectedSectionId && selectedProjectId) {
      if (page && page.projectSections) {
        const section = page.projectSections.find((s) => s.uid === selectedSectionId);
        if (section && section.projects) {
          const project = section.projects.find((p) => p.uid === selectedProjectId);
          if (project) {
            setEditData({ ...project });
          }
        }
      }
    } else {
      setEditData(null);
    }
  }, [selectedPageId, selectedSectionId, selectedProjectId, pages]);

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

    // Immediate local UI update
    setEditData((prev: any) => ({
      ...prev,
      projectParagraphs: prev.projectParagraphs.filter(
          (p: any) => p.paragraphUid !== paragraphUid,
      ),
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "path") {
      updatedValue = formatUid(value);
      const page = pages.find((p) => p.uid === selectedPageId);
      if (page) {
        const section = page.projectSections.find((s) => s.uid === selectedSectionId);
        if (section) {
          const isDuplicate = section.projects.some(
              (project) => project.path === updatedValue && project.uid !== selectedProjectId,
          );
          if (isDuplicate) {
            setMessage({
              text: "This project Path is already in use within this section.",
              type: "error",
            });
            return;
          }
        }
      }
    }

    const updatedData = { ...editData, [name]: updatedValue };
    setEditData(updatedData);

    dispatch(
        updateProject({
          pageUid: selectedPageId!,
          sectionUid: selectedSectionId!,
          project: updatedData,
        }),
    );

    if (message && message.type === "error") {
      setMessage(null);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const updatedData = { ...editData, [name]: checked };
    setEditData(updatedData);

    dispatch(
        updateProject({
          pageUid: selectedPageId!,
          sectionUid: selectedSectionId!,
          project: updatedData,
        }),
    );
  };

  const handleAddNew = () => {
    const newPath = formatUid("new-project");
    const page = pages.find((p) => p.uid === selectedPageId);
    const section = page?.projectSections.find((s) => s.uid === selectedSectionId);
    const isDuplicate = section?.projects.some((project) => project.path === newPath);
    const uniquePath = isDuplicate ? `${newPath}-${Date.now().toString().slice(-4)}` : newPath;

    const newUid = uuidv4();
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
    };

    dispatch(
        updateProject({
          pageUid: selectedPageId!,
          sectionUid: selectedSectionId!,
          project: newProject,
        }),
    );
  };

  const handleAddParagraph = () => {
    const newParagraph = {
      paragraphUid: uuidv4(),
      paragraphTitle: "",
      paragraphText: "",
    };

    dispatch(
        addParagraphToProject({
          pageUid: selectedPageId!,
          sectionUid: selectedSectionId!,
          projectUid: selectedProjectId!,
          paragraph: newParagraph,
        }),
    );

    setEditData({
      ...editData,
      projectParagraphs: [...(editData.projectParagraphs || []), newParagraph],
    });
  };

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

  if (!editData || !selectedProjectId) return null;

  return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Edit Project</h2>

        {message && (
            <div
                className={`mb-5 p-3 rounded-lg border ${
                    message.type === "success"
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-red-50 text-red-800 border-red-200"
                }`}
            >
              {message.text}
            </div>
        )}

        <div className="space-y-6">
          {/* Project Path */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Path</label>
            <input
                type="text"
                name="path"
                value={editData.path || ""}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Only lowercase letters, numbers, and hyphens. Project will be located at{" "}
              <b className="font-medium">
                ryleighleon.com/{page!.path}/{editData.path}
              </b>
            </p>
          </div>

          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
                type="text"
                name="projectTitle"
                value={editData.projectTitle || ""}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Project Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Subtitle</label>
            <input
                type="text"
                name="projectSubtitle"
                value={editData.projectSubtitle || ""}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Main Image */}
          <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Main Image</label>
            <input
                type="text"
                name="mainImage"
                value={editData.mainImage || ""}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                placeholder="Enter full URL or path to main image"
            />
            <p className="mt-1.5 text-xs text-gray-500">Recommended name: main.png</p>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Recommended save path:</p>
              <p className="mt-1 text-xs font-mono bg-white p-2.5 rounded border border-gray-200 break-all">
                /ryleighleon-portfolio/media/{selectedPageId}/{selectedProjectId}/
                {editData.mainImage || "main.png"}
              </p>
            </div>
          </div>

          {/* Thumbnail Image */}
          <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail Image</label>
            <input
                type="text"
                name="thumbnailImage"
                value={editData.thumbnailImage || ""}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                placeholder="Enter full URL or path to thumbnail image"
            />
            <p className="mt-1.5 text-xs text-gray-500">Recommended name: thumbnail.png</p>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Recommended save path:</p>
              <p className="mt-1 text-xs font-mono bg-white p-2.5 rounded border border-gray-200 break-all">
                /ryleighleon-portfolio/media/{selectedPageId}/{selectedProjectId}/
                {editData.thumbnailImage || "thumbnail.png"}
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
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900 font-medium">
                  Featured Project (will appear on homepage)
                </label>
              </div>
          )}

          {/* ────────────────────────────────────────────── */}
          {/*               PARAGRAPHS SECTION                 */}
          {/* ────────────────────────────────────────────── */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Project Paragraphs</h3>
              <button
                  onClick={handleAddParagraph}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                + Add Paragraph
              </button>
            </div>

            <div className="space-y-5">
              {editData.projectParagraphs?.map((paragraph: any, index: number) => (
                  <div
                      key={paragraph.paragraphUid}
                      className="relative p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow transition-shadow"
                  >
                    {/* Control buttons (top-right corner) */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                      <button
                          onClick={() => handleMoveParagraphUp(paragraph.paragraphUid)}
                          disabled={index === 0}
                          title="Move up"
                          className="text-gray-500 hover:text-purple-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                      >
                        ↑
                      </button>
                      <div className="w-px h-4 bg-gray-300" />
                      <button
                          onClick={() => handleMoveParagraphDown(paragraph.paragraphUid)}
                          disabled={index === editData.projectParagraphs.length - 1}
                          title="Move down"
                          className="text-gray-500 hover:text-purple-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                      >
                        ↓
                      </button>
                      <div className="w-px h-4 bg-gray-300" />
                      <button
                          onClick={() => handleDeleteParagraph(paragraph.paragraphUid)}
                          title="Delete paragraph"
                          className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        ×
                      </button>
                    </div>

                    {/* Paragraph Title - now a dropdown */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Paragraph Type / Title
                      </label>
                      <select
                          value={paragraph.paragraphTitle || ""}
                          onChange={(e) => {
                            const updatedParagraphs = editData.projectParagraphs.map((p: any, i: number) =>
                                i === index ? { ...p, paragraphTitle: e.target.value } : p,
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
                                }),
                            );
                          }}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none bg-white"
                      >
                        {PARAGRAPH_TITLE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                        ))}
                      </select>
                    </div>

                    {/* Paragraph Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Paragraph Content
                      </label>
                      <textarea
                          value={paragraph.paragraphText || ""}
                          onChange={(e) => {
                            const updatedParagraphs = editData.projectParagraphs.map((p: any, i: number) =>
                                i === index ? { ...p, paragraphText: e.target.value } : p,
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
                                }),
                            );
                          }}
                          rows={5}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none resize-y min-h-[120px]"
                      />
                    </div>
                  </div>
              ))}
            </div>

            {(!editData.projectParagraphs || editData.projectParagraphs.length === 0) && (
                <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                  No paragraphs yet — click "Add Paragraph" to start
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
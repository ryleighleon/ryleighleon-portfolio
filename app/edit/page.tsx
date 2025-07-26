"use client"

import React from "react"
import { useAppSelector } from "@/lib/store/hooks"
import Sidebar from "./Sidebar"
import PageEditor from "./PageEditor"
import SectionEditor from "./SectionEditor"
import ProjectEditor from "./ProjectEditor"
import SubMediaEditor from "./SubMediaEditor"
import AboutEditor from "./AboutEditor"
import Loading from "@/components/loading"

export default function Page() {
  const { status } = useAppSelector((state) => state.pages)

  if (status === "loading") {
    return <Loading />
  }

  return (
      <div className="py-8 px-6 md:px-12 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Edit Page</h1>
        <div className="mb-8 text-gray-600">
          <p className="mb-4">
            The Admin Edit Page is your control center for managing your portfolio website’s content. Use the <strong>Sidebar</strong> on the left to navigate, add, reorder, or delete pages, project sections, projects, sub-media, and About page sections (Biography, Education, Experience, Skills). The <strong>Editor</strong> area on the right displays the selected item’s editor for making changes, which are saved automatically to local storage.
          </p>
          <p className="mb-4">
            <strong>Sidebar Usage:</strong>
            <ul className="list-disc pl-5">
              <li><strong>Pages</strong>: Click a page to edit it, add a new page with "Add New Page," reorder with up/down arrows, or delete with the trash icon.</li>
              <li><strong>Sections</strong>: Select a page, then click a section to edit, add, reorder, or delete sections within it.</li>
              <li><strong>Projects</strong>: Select a section, then manage projects similarly.</li>
              <li><strong>SubMedia</strong>: Select a project to add or edit media items (e.g., images, videos).</li>
              <li><strong>About Page</strong>: Click Biography, Education, Experience, or Skills to edit those sections. Selecting an About section clears page selections.</li>
              <li><strong>Import/Export</strong>: Import a <code>pages.json</code> file to replace data or export to download and save to local storage.</li>
            </ul>
          </p>
          <p className="mb-4">
            <strong>Editor Area:</strong> The editor shown depends on your Sidebar selection:
            <ul className="list-disc pl-5">
              <li><strong>Page Editor</strong>: Edit page titles.</li>
              <li><strong>Section Editor</strong>: Edit section title, subtitle, and description.</li>
              <li><strong>Project Editor</strong>: Edit project title, subtitle, paragraphs, image, and featured status.</li>
              <li><strong>SubMedia Editor</strong>: Edit media file path, type, orientation, and description.</li>
              <li><strong>About Editor</strong>: Edit bio (text), education (add/edit/remove entries), experience (add/edit/remove entries and responsibilities), or skills (add/edit/remove entries).</li>
            </ul>
          </p>
          <p className="mb-4">
            <strong>Images:</strong> Images are stored in <code>ryleighleon-portfolio/public/media/files/personal_pictures</code>:
            <ul className="list-disc pl-5">
              <li><code>about_pic.jpg</code>: Displayed on the About page.</li>
              <li><code>home_large.jpg</code>: Large banner image on the home page.</li>
              <li><code>home_small.jpg</code>: Small image on the home page.</li>
            </ul>
            When editing projects or sub-media, ensure image paths point to this directory or upload new images here.
          </p>
          <p>
            <strong>Tips:</strong> Always select an item in the Sidebar before editing. Adding a new page clears section/project/media selections; adding a section clears project/media selections; adding a project clears media selections. Confirm deletions to avoid accidental data loss. Export data regularly for backups. If no editor appears, select an item in the Sidebar. For import issues, ensure the <code>pages.json</code> file matches the expected format.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <Sidebar />
          </div>
          <div className="md:w-3/4 space-y-8">
            <PageEditor />
            <SectionEditor />
            <ProjectEditor />
            <SubMediaEditor />
            <AboutEditor />
          </div>
        </div>
      </div>
  )
}
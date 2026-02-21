"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { SubMedia, Project, ProjectSection } from "@/types"
import Loading from "@/components/loading"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import AnimatedLine from "@/components/AnimatedLine"

interface ProjectDetailProps {
  pageId: string
  projectId: string
  currentProject: Project | null
  projectSection: ProjectSection | null
  relatedProjects: Project[]
  status: "loading" | "succeeded" | "failed"
}

export default function ProjectDetail({
  pageId,
  projectId,
  currentProject,
  projectSection,
  relatedProjects,
  status,
}: ProjectDetailProps) {
  const [selectedMedia, setSelectedMedia] = useState<SubMedia | null>(null)
  const [mediaIndex, setMediaIndex] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  if (status === "loading") return <Loading />

  if (status === "failed") {
    return (
      <div className="py-12 px-6 text-center">
        <h1 className="text-4xl font-bold mb-6">Project Details</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Project</h2>
          <p className="text-red-600">We're having trouble loading the project details. Please try again later.</p>
        </div>
      </div>
    )
  }

  if (!currentProject || !projectSection) {
    return (
      <div className="py-12 px-6 text-center">
        <h1 className="text-4xl font-bold mb-6">Project Not Found</h1>
        <p>The project you're looking for could not be found.</p>
      </div>
    )
  }

  const openMedia = (media: SubMedia, index: number) => {
    setSelectedMedia(media)
    setMediaIndex(index)
  }

  const closeMedia = () => setSelectedMedia(null)

  const navigateMedia = (direction: "prev" | "next") => {
    if (!currentProject?.subMedia) return
    const mediaCount = currentProject.subMedia.length
    if (mediaCount <= 1) return
    const newIndex = direction === "prev" ? (mediaIndex - 1 + mediaCount) % mediaCount : (mediaIndex + 1) % mediaCount
    setMediaIndex(newIndex)
    setSelectedMedia(currentProject.subMedia[newIndex])
  }

  return (
    <div ref={contentRef} className="min-h-screen bg-white">
      {/* Hero + Content */}
      <section className="relative bg-white pt-8 md:pt-12 pb-12 md:pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* We use this wrapper to conditionally center or keep left-aligned */}
            <div
              className={
                currentProject.projectParagraphs?.length > 0
                  ? "text-left"
                  : "text-center mx-auto max-w-4xl"
              }
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                {currentProject.projectTitle}
              </h1>
              {currentProject.projectSubtitle && (
                <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-600 leading-relaxed mt-4 md:mt-5">
                  {currentProject.projectSubtitle}
                </h2>
              )}
              {/* Consistent spacing above the line — works whether subtitle exists or not */}
              <div className="mt-6 md:mt-8 lg:mt-9 flex justify-center md:justify-start">
                <AnimatedLine colorClass="bg-purple-600" widthClass="w-[70%] max-w-[480px]" />
              </div>
            </div>
          </motion.div>

          {/* Paragraphs – only shown when they exist, keeps left-aligned grid */}
          {currentProject.projectParagraphs?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 mt-12 md:mt-16">
              {currentProject.projectParagraphs.map((paragraph: any, index: number) => (
                <motion.div
                  key={paragraph.paragraphUid}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="prose prose-gray max-w-none"
                >
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">{paragraph.paragraphTitle}</h3>
                  <p className="text-gray-700 leading-relaxed">{paragraph.paragraphText}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      {currentProject.subMedia?.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-10 text-gray-900"
            >
              Project Gallery
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {currentProject.subMedia.map((media: any, index: number) => (
                <motion.div
                  key={media.subMediaUid}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative aspect-square overflow-hidden rounded-xl shadow-md cursor-pointer group"
                  onClick={() => openMedia(media, index)}
                >
                  <Image
                    src={`/media/${pageId}/${projectSection.path}/${projectId}/${media.mediaFilename}`}
                    alt={media.mediaDescription || currentProject.projectTitle}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                      {media.mediaDescription && <p>{media.mediaDescription}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-10 text-gray-900"
            >
              Related Projects
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedProjects.map((project, index) => (
                <motion.div
                  key={project.uid}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/${pageId}/${project.uid}`}>
                    <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={`/media/${pageId}/${projectSection.path}/${project.path}/${project.thumbnailImage}`}
                          alt={project.projectTitle || "Project"}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6 flex-grow">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-700 transition-colors">
                          {project.projectTitle || "Untitled Project"}
                        </h3>
                        {project.projectSubtitle && (
                          <p className="text-gray-600">{project.projectSubtitle}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-10"
            onClick={closeMedia}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-12 right-0 text-white hover:text-purple-300"
                onClick={closeMedia}
              >
                <X size={28} />
              </button>

              {selectedMedia.mediaType === "Image" && (
                <Image
                  src={`/media/${pageId}/${projectSection.path}/${projectId}/${selectedMedia.mediaFilename}`}
                  alt={selectedMedia.mediaDescription || ""}
                  width={1600}
                  height={1000}
                  className="object-contain max-h-[82vh] mx-auto"
                  priority
                />
              )}

              {selectedMedia.mediaType === "Video" && (
                <video src={selectedMedia.mediaFilename} controls className="max-h-[82vh] mx-auto" />
              )}

              {selectedMedia.mediaDescription && (
                <div className="mt-5 text-white text-center text-lg">
                  {selectedMedia.mediaDescription}
                </div>
              )}

              {currentProject.subMedia && currentProject.subMedia.length > 1 && (
                <>
                  <button
                    className="absolute left-0 md:left-[-80px] top-1/2 -translate-y-1/2 text-white hover:text-purple-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateMedia("prev")
                    }}
                  >
                    <ChevronLeft size={48} />
                  </button>
                  <button
                    className="absolute right-0 md:right-[-80px] top-1/2 -translate-y-1/2 text-white hover:text-purple-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateMedia("next")
                    }}
                  >
                    <ChevronRight size={48} />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
"use client"

import { useState, useEffect, useRef } from "react"
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

    if (status === "loading") {
        return <Loading />
    }

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

    const closeMedia = () => {
        setSelectedMedia(null)
    }

    const navigateMedia = (direction: "prev" | "next") => {
        if (!currentProject || !currentProject.subMedia) return

        const mediaCount = currentProject.subMedia.length
        if (mediaCount <= 1) return

        let newIndex
        if (direction === "prev") {
            newIndex = (mediaIndex - 1 + mediaCount) % mediaCount
        } else {
            newIndex = (mediaIndex + 1) % mediaCount
        }

        setMediaIndex(newIndex)
        setSelectedMedia(currentProject.subMedia[newIndex])
    }

    return (
        <div ref={contentRef} className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[70vh] bg-gray-900">
                <div className="absolute inset-0">
                    <Image
                        src={`/media/${pageId}/${projectSection.path}/${projectId}/${currentProject.mainImage}`}
                        alt={currentProject.projectTitle || "Project"}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-5xl mx-auto text-white">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 pl-0">{currentProject.projectTitle}</h1>
                        {currentProject.projectSubtitle && (
                            <h2 className="text-xl md:text-2xl text-white/80 mb-6 pl-0">{currentProject.projectSubtitle}</h2>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-8 px-6 md:px-12 max-w-5xl mx-auto content-wrapper">
                <div className="content-wrapper">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {currentProject.projectParagraphs &&
                            currentProject.projectParagraphs.slice(0, 2).map((paragraph: any, index: number) => (
                                <motion.div
                                    key={paragraph.paragraphUid}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="mb-12"
                                >
                                    <h3 className="text-2xl font-semibold mb-4 text-green pl-0">
                                        {paragraph.paragraphTitle}
                                    </h3>
                                    <p className="text-green leading-relaxed pl-0">
                                        {paragraph.paragraphText}
                                    </p>
                                </motion.div>
                            ))}
                    </div>
                    <div className="grid grid-cols-1">
                        {currentProject.projectParagraphs &&
                            currentProject.projectParagraphs.slice(2).map((paragraph: any, index: number) => (
                                <motion.div
                                    key={paragraph.paragraphUid}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="mb-12"
                                >
                                    <h3 className="text-2xl font-semibold mb-4 text-green pl-0">
                                        {paragraph.paragraphTitle}
                                    </h3>
                                    <p className="text-green leading-relaxed pl-0">
                                        {paragraph.paragraphText}
                                    </p>
                                </motion.div>
                            ))}
                    </div>
                </div>
            </section>

            {/* Media Gallery Section */}
            {currentProject.subMedia && currentProject.subMedia.length > 0 && (
                <section className="py-8 px-6 md:px-12 max-w-5xl mx-auto content-wrapper">
                    <div className="content-wrapper">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-3xl font-bold mb-10 text-green pl-0"
                        >
                            Project Gallery
                        </motion.h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentProject.subMedia.map((media: any, index: number) => (
                                <motion.div
                                    key={media.subMediaUid}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="relative aspect-square overflow-hidden rounded-xl shadow-md cursor-pointer group"
                                    onClick={() => openMedia(media, index)}
                                >
                                    <Image
                                        src={`/media/${pageId}/${projectSection.path}/${projectId}/${media.mediaFilename}`}
                                        alt={media.mediaDescription || currentProject.projectTitle}
                                        fill
                                        className="object-cover transition-all duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-purple-800 bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center">
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

            {/* Related Projects Section */}
            {relatedProjects.length > 0 && (
                <section className="py-8 px-6 md:px-12 max-w-5xl mx-auto content-wrapper">
                    <div className="content-wrapper">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-3xl font-bold mb-10 text-green pl-0"
                        >
                            Related Projects
                        </motion.h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProjects.map((project, index) => (
                                <motion.div
                                    key={project.uid}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                >
                                    <Link href={`/${pageId}/${project.uid}`}>
                                        <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <Image
                                                    src={`/media/${pageId}/${projectSection.path}/${project.path}/${project.thumbnailImage}`}
                                                    alt={project.projectTitle || "Project"}
                                                    fill
                                                    className="object-cover transition-all duration-500 group-hover:scale-105"
                                                />
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors pl-0">
                                                    {project.projectTitle || "Untitled Project"}
                                                </h3>
                                                {project.projectSubtitle && (
                                                    <p className="text-green pl-0">{project.projectSubtitle}</p>
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

            {/* Media Overlay */}
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
                            className="relative max-w-5xl max-h-[90vh] w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute -top-12 right-0 text-white hover:text-purple-300 transition-colors"
                                onClick={closeMedia}
                            >
                                <X size={24} />
                            </button>

                            {selectedMedia.mediaType === "Image" && (
                                <div className="relative h-full flex items-center justify-center">
                                    <Image
                                        src={`/media/${pageId}/${projectSection.path}/${projectId}/${selectedMedia.mediaFilename}`}
                                        alt={selectedMedia.mediaDescription || ""}
                                        width={1200}
                                        height={800}
                                        className="object-contain max-h-[80vh]"
                                    />
                                </div>
                            )}

                            {selectedMedia.mediaType === "Video" && (
                                <video src={selectedMedia.mediaFilename} controls className="max-h-[80vh] mx-auto" />
                            )}

                            {selectedMedia.mediaDescription && (
                                <div className="mt-4 text-white text-center">
                                    <p>{selectedMedia.mediaDescription}</p>
                                </div>
                            )}

                            {currentProject.subMedia && currentProject.subMedia.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 md:-translate-x-16 text-white hover:text-purple-300 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            navigateMedia("prev")
                                        }}
                                    >
                                        <ChevronLeft size={36} />
                                    </button>
                                    <button
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 md:translate-x-16 text-white hover:text-purple-300 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            navigateMedia("next")
                                        }}
                                    >
                                        <ChevronRight size={36} />
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
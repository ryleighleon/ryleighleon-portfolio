"use client"

import { ProjectPage } from "@/types"
import Loading from "@/components/loading"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

interface PageDetailProps {
    pageId: string
    currentPage: ProjectPage | null
    status: "loading" | "succeeded" | "failed"
}

export default function PageDetail({ pageId, currentPage, status }: PageDetailProps) {
    if (status === "loading") {
        return <Loading />
    }

    if (status === "failed") {
        return (
            <div className="py-12 px-6 text-center">
                <h1 className="text-4xl font-bold mb-6">Page Not Found</h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Page</h2>
                    <p className="text-red-600">We're having trouble loading the page content. Please try again later.</p>
                </div>
            </div>
        )
    }

    if (!currentPage) {
        return (
            <div className="py-12 px-6 text-center">
                <h1 className="text-4xl font-bold mb-6">Page Not Found</h1>
                <p>The page you're looking for doesn't exist or has been moved.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className={`relative ${pageId === "portfolio" ? "bg-white text-green py-8" : "bg-purple-400 text-green py-8 h-[20vh] md:h-[25vh]"} px-6 flex items-center`}>
                <div className="relative max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        {currentPage.topTitle && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="mb-6"
                            >
                                <span className={`text-lg md:text-xl font-light tracking-wider ${pageId === "portfolio" ? "text-green" : "text-green"} relative inline-block`}>
                                    <span className={`absolute -left-6 top-1/2 w-4 h-[1px] ${pageId === "portfolio" ? "bg-green/60" : "bg-green/60"}`}></span>
                                    {currentPage.topTitle}
                                    <span className={`absolute -right-6 top-1/2 w-4 h-[1px] ${pageId === "portfolio" ? "bg-green/60" : "bg-green/60"}`}></span>
                                </span>
                            </motion.div>
                        )}
                        <motion.h1
                            className={`text-4xl md:text-6xl font-bold ${pageId === "portfolio" ? "text-green" : "text-green"}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {currentPage.shortTitle}
                        </motion.h1>
                        <motion.div
                            className={`w-20 h-1 ${pageId === "portfolio" ? "bg-green" : "bg-purple-300"} mx-auto mt-6`}
                            initial={{ width: 0 }}
                            animate={{ width: 80 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        />
                    </motion.div>
                </div>
            </section>

            {/* Projects Section */}
            <div className="py-12 px-4 max-w-7xl mx-auto">
                {currentPage.projectSections.length === 0 ? (
                    <div className="text-center py-8">
                        <p>No sections found for this page.</p>
                    </div>
                ) : (
                    currentPage.projectSections
                        .map((section, sectionIndex) => {
                            if (section.projects.length === 0) {
                                return null
                            }

                            return (
                                <motion.div
                                    key={section.uid}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="mb-8"
                                >
                                    <div className="mb-10">
                                        <h2 className="text-3xl font-bold mb-3 text-green">{section.title}</h2>
                                        {section.subtitle && <h3 className="text-xl text-green mb-4">{section.subtitle}</h3>}
                                        {section.description && <p className="text-green max-w-3xl">{section.description}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {section.projects.map((project, index) => (
                                            <motion.div
                                                key={project.uid}
                                                initial={{ opacity: 0, y: 60 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.7, delay: index * 0.15 }}
                                                viewport={{ once: true, margin: "-150px" }}
                                            >
                                                <Link href={`/${currentPage.uid}/${project.uid}`} className="block group">
                                                    <div className="relative overflow-hidden rounded-xl">
                                                        <div className="relative aspect-square overflow-hidden">
                                                            <Image
                                                                src={`/media/${pageId}/${section.path}/${project.uid}/${project.thumbnailImage}` || "/placeholder.svg"}
                                                                alt={project.projectTitle || "Project"}
                                                                fill
                                                                className="object-cover transition-all duration-500 group-hover:scale-105"
                                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                                                priority={sectionIndex === 0 && index < 4}
                                                            />

                                                            {/* Hover overlay */}
                                                            <div className="absolute inset-0 bg-purple-800/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-white">
                                                                {project.projectSubtitle && <p className="text-base mb-2">{project.projectSubtitle}</p>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Title below image */}
                                                    <h3 className="mt-3 text-lg font-medium text-green group-hover:text-purple-600 transition-colors">
                                                        {project.projectTitle || "Untitled Project"}
                                                    </h3>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )
                        })
                        .filter(Boolean)
                )}
            </div>

            {currentPage.bottomTitle && (
                <div className={`py-8 px-6 text-center ${pageId === "portfolio" ? "bg-white text-green" : "bg-purple-400 text-green"} mb-8`}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <h2 className={`text-3xl md:text-5xl font-normal ${pageId === "portfolio" ? "text-green" : "text-green"}`}>{currentPage.bottomTitle}</h2>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
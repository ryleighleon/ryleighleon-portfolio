"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Loading from "@/components/loading"
import { motion } from "framer-motion"

export default function PageDetail() {
  const params = useParams()
  const pageId = params!.pageId as string

  const dispatch = useAppDispatch()
  const { pages, status, initialized } = useAppSelector((state) => state.pages)
  const currentPage = pages.find((page) => page.uid === pageId)

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
      <section className="relative bg-purple-900 text-white py-24 px-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-400 via-purple-700 to-purple-900"></div>
        </div>
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
                className="mb-8"
              >
                <span className="text-xl md:text-2xl font-light tracking-wider text-white/90 relative inline-block">
                  <span className="absolute -left-8 top-1/2 w-6 h-[1px] bg-white/60"></span>
                  {currentPage.topTitle}
                  <span className="absolute -right-8 top-1/2 w-6 h-[1px] bg-white/60"></span>
                </span>
              </motion.div>
            )}
            <motion.h1
              className="text-5xl md:text-7xl font-bold"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {currentPage.shortTitle}
            </motion.h1>
            <motion.div
              className="w-24 h-1 bg-purple-400 mx-auto mt-8"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
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
                  className="mb-20"
                >
                  <div className="mb-10">
                    <h2 className="text-3xl font-bold mb-3 text-gray-900">{section.title}</h2>
                    {section.subtitle && <h3 className="text-xl text-gray-600 mb-4">{section.subtitle}</h3>}
                    {section.description && <p className="text-gray-700 max-w-3xl">{section.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {section.projects.map((project, index) => (
                      <motion.div
                        key={project.uid}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: index * 0.15 }}
                        viewport={{ once: true, margin: "-150px" }}
                      >
                        <Link href={`/${currentPage.uid}/${project.uid}`} className="block group">
                          <div className="relative overflow-hidden">
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <Image
                                src={`/media/files/${pageId}/${section.path}/${project.uid}/${project.imageFilename}` || "/placeholder.svg"}
                                alt={project.projectTitle || "Project"}
                                fill
                                className="object-cover transition-all duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={sectionIndex === 0 && index < 4}
                              />

                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-white">
                                {project.projectSubtitle && <p className="text-lg mb-2">{project.projectSubtitle}</p>}
                              </div>
                            </div>
                          </div>

                          {/* Title below image */}
                          <h3 className="mt-3 text-xl font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
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
        <div className="bg-purple-900 text-white py-16 px-6 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-2xl md:text-3xl font-bold max-w-3xl mx-auto">{currentPage.bottomTitle}</p>
          </motion.div>
        </div>
      )}
    </div>
  )
}

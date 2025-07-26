"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { fetchPages } from "@/lib/store/slices/pagesSlice"
import { fetchAboutData } from "@/lib/store/slices/aboutSlice"
import Loading from "@/components/loading"
import { motion } from "framer-motion"
import {getPersonalPictureUrl} from "@/lib/utils/image-paths";

export default function About() {
  const dispatch = useAppDispatch()
  const { pages, status: pagesStatus } = useAppSelector((state) => state.pages)
  const aboutData = useAppSelector((state) => state.about)
  const [aboutPage, setAboutPage] = useState<any>(null)
  const [activeSection, setActiveSection] = useState("bio")
  const sectionRefs = {
    bio: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
  }

  useEffect(() => {
    dispatch(fetchPages())
    dispatch(fetchAboutData())
  }, [dispatch])

  useEffect(() => {
    if (pages && pages.length > 0) {
      // Find the about page
      const about = pages.find((page) => page.uid === "about")
      setAboutPage(about)
    }
  }, [pages])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200

      // Check which section is currently in view
      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const element = ref.current
          const offsetTop = element.offsetTop
          const height = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (pagesStatus === "loading") {
    return <Loading />
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const scrollToSection = (section: string) => {
    sectionRefs[section as keyof typeof sectionRefs]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-purple-600/80 z-10" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-6">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {aboutPage?.topTitle || "About Me"}
          </motion.h1>
          <motion.div
            className="w-24 h-1 bg-white mb-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <motion.h2
            className="text-xl md:text-2xl text-center max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Graphic Designer & Visual Storyteller
          </motion.h2>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white shadow-md z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex overflow-x-auto py-4 gap-8 justify-center md:justify-start no-scrollbar">
            <button
              onClick={() => scrollToSection("bio")}
              className={`whitespace-nowrap px-4 py-2 font-medium transition-colors ${
                activeSection === "bio"
                  ? "text-purple-700 border-b-2 border-purple-700"
                  : "text-gray-600 hover:text-purple-700"
              }`}
            >
              Biography
            </button>
            <button
              onClick={() => scrollToSection("education")}
              className={`whitespace-nowrap px-4 py-2 font-medium transition-colors ${
                activeSection === "education"
                  ? "text-purple-700 border-b-2 border-purple-700"
                  : "text-gray-600 hover:text-purple-700"
              }`}
            >
              Education
            </button>
            <button
              onClick={() => scrollToSection("experience")}
              className={`whitespace-nowrap px-4 py-2 font-medium transition-colors ${
                activeSection === "experience"
                  ? "text-purple-700 border-b-2 border-purple-700"
                  : "text-gray-600 hover:text-purple-700"
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection("skills")}
              className={`whitespace-nowrap px-4 py-2 font-medium transition-colors ${
                activeSection === "skills"
                  ? "text-purple-700 border-b-2 border-purple-700"
                  : "text-gray-600 hover:text-purple-700"
              }`}
            >
              Skills
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Bio Section */}
        <motion.section
          ref={sectionRefs.bio}
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Biography</h2>
              <div className="prose prose-lg max-w-none text-gray-600">{aboutData.bio}</div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-xl">
                <Image
                  src={getPersonalPictureUrl('about_pic.jpg')}
                  alt="Ryleigh Leon"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Education Section */}
        <motion.section
          ref={sectionRefs.education}
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aboutData.education && aboutData.education.length > 0 ? (
              aboutData.education.map((edu) => (
                <motion.div
                  key={edu.id}
                  className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                  variants={fadeInUp}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-purple-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                  </div>
                  <div className="ml-16">
                    <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {edu.years}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 col-span-2">Education information not available</p>
            )}
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section
          ref={sectionRefs.experience}
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Experience</h2>
          <div className="space-y-12">
            {aboutData.experience && aboutData.experience.length > 0 ? (
              aboutData.experience.map((exp, index) => (
                <motion.div key={exp.id} className="relative" variants={fadeInUp}>
                  {/* Timeline connector */}
                  {index < aboutData.experience.length - 1 && (
                    <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-purple-200"></div>
                  )}

                  <div className="flex gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-purple-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{exp.title}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            {exp.period}
                          </span>
                        </div>
                      </div>
                      <ul className="mt-4 space-y-2 text-gray-700">
                        {exp.responsibilities &&
                          exp.responsibilities.map((resp, idx) => (
                            <li key={idx} className="flex items-start">
                              <svg
                                className="h-5 w-5 text-purple-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {resp}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">Experience information not available</p>
            )}
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          ref={sectionRefs.skills}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Skills</h2>
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-md">
            {aboutData.skills && aboutData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {aboutData.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    className="px-4 py-3 bg-white text-purple-800 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow"
                    variants={fadeInUp}
                  >
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      <span className="font-medium">{skill}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Skills information not available</p>
            )}
          </div>
        </motion.section>
      </div>

      {/* Contact CTA */}
      <div className="bg-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-purple-100 max-w-2xl mx-auto mb-8">
            I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
          </p>
          <a
            href="mailto:ryleighleon@gmail.com"
            className="inline-block px-8 py-3 bg-white text-purple-700 font-medium rounded-lg hover:bg-purple-50 transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </div>
  )
}

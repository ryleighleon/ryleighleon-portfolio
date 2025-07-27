"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import Loading from "@/components/loading"
import { motion } from "framer-motion"
import { getPersonalPictureUrl } from "@/lib/utils/image-paths"

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
    awardsAndExhibitions: useRef<HTMLDivElement>(null),
  }

  useEffect(() => {
    if (pages && pages.length > 0) {
      const about = pages.find((page) => page.uid === "about")
      setAboutPage(about)
    }
  }, [pages])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200

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
          <div className="absolute inset-0 bg-purple-900" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
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
            <div className="flex overflow-x-auto py-4 gap-8 justify-center no-scrollbar">
              <button
                  onClick={() => scrollToSection("bio")}
                  className={`whitespace-nowrap px-4 py-2 font-medium relative transition-all duration-300
                ${
                      activeSection === "bio"
                          ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-purple-700 after:scale-x-100 after:transition-all after:duration-300"
                          : "text-gray-600 hover:text-purple-700 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-purple-700 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-all after:duration-300"
                  }`}
              >
                Biography
              </button>
              <button
                  onClick={() => scrollToSection("education")}
                  className={`whitespace-nowrap px-4 py-2 font-medium relative transition-all duration-300
                ${
                      activeSection === "education"
                          ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-purple-700 after:scale-x-100 after:transition-all after:duration-300"
                          : "text-gray-600 hover:text-purple-700 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-purple-700 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-all after:duration-300"
                  }`}
              >
                Education
              </button>
              <button
                  onClick={() => scrollToSection("experience")}
                  className={`whitespace-nowrap px-4 py-2 font-medium relative transition-all duration-300
                ${
                      activeSection === "experience"
                          ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-purple-700 after:scale-x-100 after:transition-all after:duration-300"
                          : "text-gray-600 hover:text-purple-700 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-purple-700 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-all after:duration-300"
                  }`}
              >
                Experience
              </button>
              <button
                  onClick={() => scrollToSection("skills")}
                  className={`whitespace-nowrap px-4 py-2 font-medium relative transition-all duration-300
                ${
                      activeSection === "skills"
                          ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-purple-700 after:scale-x-100 after:transition-all after:duration-300"
                          : "text-gray-600 hover:text-purple-700 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-purple-700 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-all after:duration-300"
                  }`}
              >
                Skills
              </button>
              <button
                  onClick={() => scrollToSection("awardsAndExhibitions")}
                  className={`whitespace-nowrap px-4 py-2 font-medium relative transition-all duration-300
                ${
                      activeSection === "awardsAndExhibitions"
                          ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-purple-700 after:scale-x-100 after:transition-all after:duration-300"
                          : "text-gray-600 hover:text-purple-700 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-purple-700 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-all after:duration-300"
                  }`}
              >
                Awards & Exhibitions
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
                      src={getPersonalPictureUrl("about_pic.jpg")}
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
            <div className="space-y-12">
              {aboutData.education && aboutData.education.length > 0 ? (
                  aboutData.education.map((edu) => (
                      <motion.div key={edu.id} className="relative" variants={fadeInUp}>
                        <div className="flex gap-8">
                          <div className="flex-grow bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-800">{edu.degree}</h3>
                                <p className="text-gray-600">{edu.institution}</p>
                              </div>
                              <div className="mt-2 md:mt-0">
                                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                  {edu.years}
                                </span>
                              </div>
                            </div>
                            {edu.accomplishments && edu.accomplishments.length > 0 && (
                                <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
                                  {edu.accomplishments.map((acc, idx) => (
                                      <li key={idx}>{acc}</li>
                                  ))}
                                </ul>
                            )}
                          </div>
                        </div>
                      </motion.div>
                  ))
              ) : (
                  <p className="text-gray-500">Education information not available</p>
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
                  aboutData.experience.map((exp) => (
                      <motion.div key={exp.id} className="relative" variants={fadeInUp}>
                        <div className="flex gap-8">
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
                            <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
                              {exp.responsibilities &&
                                  exp.responsibilities.map((resp, idx) => (
                                      <li key={idx}>{resp}</li>
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
              className="mb-20"
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
                          <span className="font-medium">{skill}</span>
                        </motion.div>
                    ))}
                  </div>
              ) : (
                  <p className="text-gray-500">Skills information not available</p>
              )}
            </div>
          </motion.section>

          {/* Awards and Exhibitions Section */}
          <motion.section
              ref={sectionRefs.awardsAndExhibitions}
              className="mb-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Awards & Exhibitions</h2>
            <div className="space-y-12">
              {aboutData.awardsAndExhibitions && aboutData.awardsAndExhibitions.length > 0 ? (
                  aboutData.awardsAndExhibitions.map((award) => (
                      <motion.div key={award.id} className="relative" variants={fadeInUp}>
                        <div className="flex gap-8">
                          <div className="flex-grow bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-800">{award.title}</h3>
                                {award.subtitle && <p className="text-gray-600">{award.subtitle}</p>}
                              </div>
                              <div className="mt-2 md:mt-0">
                                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                  {award.date}
                                </span>
                              </div>
                            </div>
                            <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
                              {award.descriptions &&
                                  award.descriptions.map((desc, idx) => (
                                      <li key={idx}>{desc}</li>
                                  ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                  ))
              ) : (
                  <p className="text-gray-500">Awards and exhibitions information not available</p>
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
"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { ContactForm } from "@/components/contact-form"
import Loading from "@/components/loading"
import { motion } from "framer-motion"
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react"
import {getIconUrl, getPersonalPictureUrl} from "@/lib/utils/image-paths";

export default function Home() {
  const dispatch = useAppDispatch()
  const { pages, status } = useAppSelector((state) => state.pages)
  const homePage = pages.find((page) => page.uid === "home" || page.shortTitle === "Home" || page.shortTitle === "/")
  const portfolioPage = pages.find((page) => page.uid === "portfolio" || page.shortTitle === "Portfolio")

  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  // Get featured projects from all pages
  const projectsToShow = pages
    .flatMap((page) =>
      page.projectSections.flatMap((section) => section.projects.filter((project) => project.featured)),
    )
    .slice(0, 3)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (status === "loading") {
    return <Loading />
  }

  const parallaxOffset = scrollY * 0.4
  const opacityValue = Math.max(0, 1 - scrollY / 500)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${parallaxOffset}px)`,
            opacity: opacityValue + 0.3,
          }}
        >
          <Image src={getPersonalPictureUrl('home_large.jpg')} alt="Ryleigh Leon" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-purple-800/30 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">{homePage?.topTitle || "Ryleigh Leon"}</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">Graphic Designer & Visual Artist</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/portfolio"
                className="px-8 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                View Portfolio
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-md hover:bg-white/20 transition-all shadow-lg transform hover:-translate-y-1"
              >
                About Me
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <button
            onClick={() =>
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              })
            }
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Scroll down"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Work</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A selection of my recent projects and creative explorations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsToShow.map((project, index) => (
              <motion.div
                key={project.uid}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Link href={`/portfolio/${project.uid}`} className="block group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                    <Image
                      src={`/media/files/portfolio/${project.uid}/${project.imageFilename}`}
                      alt={project.projectTitle || "Project"}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-300 transition-colors">
                        {project.projectTitle || "Untitled Project"}
                      </h3>
                      {project.projectSubtitle && <p className="text-sm text-white/80">{project.projectSubtitle}</p>}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mt-16"
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-all shadow-md group"
            >
              View Portfolio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-24 px-6 md:px-12 bg-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Hi, I'm Ryleigh</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                I'm a passionate graphic designer with a keen eye for detail and a love for creating visually stunning
                designs that communicate effectively. My work spans branding, typography, and digital design.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-purple-700 font-medium hover:text-purple-900 transition-colors group"
              >
                Learn more about me
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-xl">
                <Image src={getPersonalPictureUrl('home_small.jpg')} alt="Ryleigh Leon" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-purple-600 text-white p-4 rounded-lg shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Let's Connect</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have a project in mind? I'd love to hear about it and see how we can work together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { Menu, X } from "lucide-react"
import {getIconUrl} from "@/lib/utils/image-paths";

export function Navbar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { pages, status, initialized } = useAppSelector((state) => state.pages)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dispatch, initialized])

  // Filter pages for the work dropdown (exclude portfolio, about, home)
  const workPages = pages.filter((page) => page.uid !== "portfolio" && page.uid !== "about" && page.uid !== "home")

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="py-3 px-4 md:px-8 flex justify-between items-center border-b border-gray-100">
      <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center">
        {isMobile ? (
          <Image src={getIconUrl('Logoshort.png')} alt="Ryleigh Leon" width={36} height={36} className="my-1" priority />
        ) : (
          <Image src={getIconUrl('Logofull.png')} alt="Ryleigh Leon" width={180} height={45} className="my-1" priority />
        )}
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link
          href="/portfolio"
          className={`${
            pathname === "/portfolio" ? "border-b-2 border-purple-600" : ""
          } hover:text-purple-600 transition-colors`}
        >
          Portfolio
        </Link>

        <div className="relative group">
          <button
            className={`flex items-center space-x-1 ${
              workPages.some((page) => pathname === `/${page.uid}`) ? "border-b-2 border-purple-600" : ""
            } hover:text-purple-600 transition-colors`}
          >
            <span>Work</span>
          </button>

          <div className="absolute top-full left-0 mt-1 w-40 bg-white shadow-lg rounded-md py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            {workPages.length > 0 ? (
              workPages.map((page) => (
                <Link key={page.uid} href={`/${page.uid}`} className="block px-4 py-2 hover:bg-gray-100">
                  {page.shortTitle}
                </Link>
              ))
            ) : (
              <span className="block px-4 py-2 text-gray-500 italic">No work pages</span>
            )}
          </div>
        </div>

        <Link
          href="/about"
          className={`${
            pathname === "/about" ? "border-b-2 border-purple-600" : ""
          } hover:text-purple-600 transition-colors`}
        >
          About
        </Link>

        <div className="flex space-x-3">
          <Link
            href="https://www.linkedin.com/in/ryleigh-leon"
            target="_blank"
            aria-label="LinkedIn"
            className="flex items-center"
          >
            <Image src={getIconUrl('LinkedInBlack.png')} alt="LinkedIn" width={20} height={20} />
          </Link>
          <Link
            href="https://www.instagram.com/ryleighleon.design"
            target="_blank"
            aria-label="Instagram"
            className="flex items-center"
          >
            <Image src={getIconUrl('InstagramBlack.png')} alt="Instagram" width={20} height={20} />
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-gray-800 focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div ref={menuRef} className="fixed inset-0 bg-white z-50 md:hidden pt-20 px-6 flex flex-col items-center">
          <button
            className="absolute top-4 right-6 text-gray-800 focus:outline-none"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          <nav className="flex flex-col space-y-6 text-xl text-center">
            <Link
              href="/portfolio"
              className={`${
                pathname === "/portfolio" ? "text-purple-600 font-semibold" : ""
              } hover:text-purple-600 transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>

            <div className="space-y-3">
              <div className="font-semibold">Work</div>
              <div className="pl-4 space-y-3">
                {workPages.length > 0 ? (
                  workPages.map((page) => (
                    <Link
                      key={page.uid}
                      href={`/${page.uid}`}
                      className="block hover:text-purple-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {page.shortTitle}
                    </Link>
                  ))
                ) : (
                  <span className="block text-gray-500 italic">No work pages</span>
                )}
              </div>
            </div>

            <Link
              href="/about"
              className={`${
                pathname === "/about" ? "text-purple-600 font-semibold" : ""
              } hover:text-purple-600 transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

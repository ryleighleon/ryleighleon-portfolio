"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create mailto link with form data
    const mailtoLink = `mailto:ryleighleon@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name}\n\n${formData.message}`)}`

    // Open email client
    window.location.href = mailtoLink

    // Reset form
    setFormData({ name: "", subject: "", message: "" })
  }

  return (
    <div className="flex flex-col md:flex-row gap-12">
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-6">Connect with Me!</h2>
        <p className="mb-6">
          Interested in learning more about me, my work or how we can collaborate on an upcoming project? Feel free to
          reach out anytime, I would be more than happy to chat.
        </p>
        <p className="mb-4">
          <a href="mailto:ryleighleon@gmail.com" className="hover:text-purple-600 transition-colors">
            ryleighleon@gmail.com
          </a>
        </p>
        <div className="flex space-x-2">
          <a
            href="https://www.linkedin.com/in/ryleigh-leon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Image src="/images/linkedin.png" alt="LinkedIn" width={24} height={24} />
          </a>
          <a
            href="https://www.instagram.com/ryleighleon.design"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Image src="/images/instagram.png" alt="Instagram" width={24} height={24} />
          </a>
        </div>
      </div>
      <div className="md:w-1/2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full p-2 border-b border-purple-300 focus:border-purple-600 outline-none transition-colors"
            />
          </div>
          <div>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full p-2 border-b border-purple-300 focus:border-purple-600 outline-none transition-colors"
            />
          </div>
          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here..."
              required
              rows={6}
              className="w-full p-2 border-b border-purple-300 focus:border-purple-600 outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Email
          </button>
        </form>
      </div>
    </div>
  )
}

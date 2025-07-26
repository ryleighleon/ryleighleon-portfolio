"use client"

import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import type { SubMedia } from "@/types"

interface MediaOverlayProps {
  selectedMedia: SubMedia
  mediaCount: number
  onClose: () => void
  onNavigate: (direction: "prev" | "next") => void
}

export function MediaOverlay({ selectedMedia, mediaCount, onClose, onNavigate }: MediaOverlayProps) {
  return (
    <div className="media-overlay" onClick={onClose}>
      <div className="media-overlay-content" onClick={(e) => e.stopPropagation()}>
        <button className="media-overlay-close" onClick={onClose}>
          <X size={20} />
        </button>

        {selectedMedia.mediaType === "Image" && (
          <Image
            src={selectedMedia.mediaFilename || "/placeholder.svg"}
            alt={selectedMedia.mediaDescription || ""}
            width={1000}
            height={800}
            className="object-contain max-h-[80vh]"
          />
        )}

        {selectedMedia.mediaType === "Video" && (
          <video src={selectedMedia.mediaFilename} controls className="max-h-[80vh]" />
        )}

        {selectedMedia.mediaDescription && (
          <div className="mt-4 text-white text-center">
            <p>{selectedMedia.mediaDescription}</p>
          </div>
        )}

        {mediaCount > 1 && (
          <>
            <button
              className="media-overlay-nav prev"
              onClick={(e) => {
                e.stopPropagation()
                onNavigate("prev")
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="media-overlay-nav next"
              onClick={(e) => {
                e.stopPropagation()
                onNavigate("next")
              }}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

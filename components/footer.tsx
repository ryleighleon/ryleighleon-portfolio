import Link from "next/link"
import Image from "next/image"
import {getIconUrl} from "@/lib/utils/image-paths";

export function Footer() {
  return (
    <footer className="py-8 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="mb-4">
          <h2 className="text-2xl font-bold font-playfair text-green">Ryleigh Leon</h2>
          <p className="text-green mt-4">
            <a href="mailto:ryleighleon@gmail.com" className="hover:text-purple-400 transition-colors">
              ryleighleon@gmail.com
            </a>
          </p>
        </div>
        <div className="flex space-x-2 mb-4">
          <Link
            href="https://www.linkedin.com/in/ryleigh-leon"
            target="_blank"
            aria-label="LinkedIn"
            className="flex items-center"
          >
            <Image src={getIconUrl('LinkedInBlack.png')} alt="LinkedIn" width={24} height={24} />
          </Link>
          <Link
            href="https://www.instagram.com/ryleighleon.design"
            target="_blank"
            aria-label="Instagram"
            className="flex items-center"
          >
            <Image src={getIconUrl('InstagramBlack.png')} alt="Instagram" width={24} height={24} />
          </Link>
        </div>
        <div className="text-sm text-green">&copy;{new Date().getFullYear()} by Ryleigh Leon</div>
      </div>
    </footer>
  )
}

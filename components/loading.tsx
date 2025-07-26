import Image from "next/image"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/loading-cMPwMQBVW3YogHakRgwrzx6yKdilb3.png"
        alt="Loading"
        width={300}
        height={100}
        priority
      />
    </div>
  )
}

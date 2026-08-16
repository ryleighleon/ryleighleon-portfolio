import React from "react"
import sharp from "sharp"
import { Font, renderToFile, Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectDirectory = path.resolve(scriptDirectory, "..")
const pagesData = JSON.parse(await readFile(path.join(projectDirectory, "data", "pages.json"), "utf8"))
const portfolio = pagesData.pages.find((page) => page.uid === "portfolio")

if (!portfolio) throw new Error("Portfolio data was not found.")

const publicDirectory = path.join(projectDirectory, "public")
Font.register({ family: "Montserrat", src: path.join(publicDirectory, "fonts", "Montserrat-Medium.ttf"), fontWeight: 500 })
Font.register({ family: "Montserrat", src: path.join(publicDirectory, "fonts", "Montserrat-SemiBold.ttf"), fontWeight: 600 })
Font.register({ family: "Playfair Display", src: path.join(publicDirectory, "fonts", "PlayfairDisplay.ttf") })

const colors = { ink: "#000000", muted: "#000000", purple: "#323b26", paper: "#ffffff" }
const styles = StyleSheet.create({
  page: { padding: 42, fontFamily: "Montserrat", color: colors.ink, backgroundColor: colors.paper },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 2, borderBottomColor: colors.purple, paddingBottom: 14, marginBottom: 18 },
  eyebrow: { fontSize: 9, letterSpacing: 2, color: colors.ink, textTransform: "uppercase" },
  pageNumber: { fontSize: 9, color: colors.muted },
  title: { fontFamily: "Playfair Display", fontSize: 30, marginTop: 6 },
  subtitle: { fontSize: 12, color: colors.muted, marginTop: 5 },
  content: { flexDirection: "row", flex: 1, gap: 24 },
  copy: { width: "36%" },
  paragraph: { marginBottom: 12 },
  paragraphTitle: { fontSize: 11, fontWeight: 600, marginBottom: 4, color: colors.ink },
  paragraphText: { fontSize: 8.7, fontWeight: 500, lineHeight: 1.45, color: colors.ink },
  gallery: { width: "64%", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", gap: 8 },
  imageCard: { width: "31.8%", height: 128 },
  image: { width: "100%", height: "100%", objectFit: "contain" },
  caption: { fontSize: 7, color: colors.ink, marginTop: 3 },
  footer: { position: "absolute", bottom: 20, left: 42, right: 42, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: colors.ink },
})

const h = React.createElement
const rasterDirectory = await mkdtemp(path.join(os.tmpdir(), "ryleigh-portfolio-pdf-"))
const projects = await Promise.all(portfolio.projectSections.flatMap((section) => section.projects.map(async (project) => {
  const images = await Promise.all(project.subMedia
    .filter((media) => media.mediaType === "Image")
    .map(async (media) => {
      const sourcePath = path.join(publicDirectory, "media", portfolio.uid, section.path, project.uid, media.mediaFilename)
      const outputPath = path.join(rasterDirectory, `${project.uid}-${media.subMediaUid}.jpg`)

      await sharp(sourcePath)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true })
        .toFile(outputPath)

      return { ...media, pdfImageUrl: pathToFileURL(outputPath).href }
    }))

  return { project, sectionPath: section.path, images }
})))

const document = h(
  Document,
  { title: "Ryleigh Leon Portfolio", author: "Ryleigh Leon" },
  projects.map(({ project, images }, projectIndex) => {
    const imageCards = images.map((media) => h(
        View,
        { key: media.subMediaUid, style: styles.imageCard },
        h(Image, { src: media.pdfImageUrl, style: styles.image }),
        media.mediaDescription ? h(Text, { style: styles.caption }, media.mediaDescription) : null,
      ))

    return h(
      Page,
      { key: project.uid, size: "A3", orientation: "landscape", style: styles.page, wrap: false },
      h(View, { style: styles.header },
        h(View, null,
          h(Text, { style: styles.eyebrow }, "Ryleigh Leon · Portfolio"),
          h(Text, { style: styles.title }, project.projectTitle),
          project.projectSubtitle ? h(Text, { style: styles.subtitle }, project.projectSubtitle) : null,
        ),
        h(Text, { style: styles.pageNumber }, `${String(projectIndex + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`),
      ),
      h(View, { style: styles.content },
        h(View, { style: styles.copy }, project.projectParagraphs.map((paragraph) => h(
          View,
          { key: paragraph.paragraphUid, style: styles.paragraph },
          h(Text, { style: styles.paragraphTitle }, paragraph.paragraphTitle),
          h(Text, { style: styles.paragraphText }, paragraph.paragraphText),
        ))),
        h(View, { style: styles.gallery }, imageCards),
      ),
      h(View, { fixed: true, style: styles.footer }, h(Text, null, "ryleighleon.design"), h(Text, null, project.projectTitle)),
    )
  }),
)

await renderToFile(document, path.join(publicDirectory, "portfolio.pdf"))
await rm(rasterDirectory, { recursive: true, force: true })
console.log("Generated public/portfolio.pdf with compressed images and embedded site fonts")

import pagesRLD from "@/data/pages.json"
import PageDetail from "@/components/PageDetail"
import { ProjectPage } from "@/types"

export default async function Page({ params }: { params: { pageId: string } }) {
    const { pageId } = await params
    let status: "loading" | "succeeded" | "failed" = "loading"
    let currentPage: ProjectPage | null = null

    try {
        const pages: ProjectPage[] = pagesRLD.pages as ProjectPage[] || []
        currentPage = pages.find((p) => p.uid === pageId) || null
        status = currentPage ? "succeeded" : "failed"
    } catch (error) {
        console.error("Error fetching page data:", error)
        status = "failed"
    }

    return <PageDetail pageId={pageId} currentPage={currentPage} status={status} />
}

export async function generateStaticParams() {
    const pages: ProjectPage[] = pagesRLD.pages as ProjectPage[] || []

    const paths = pages.map((page) => ({
        pageId: page.uid,
    }))

    return paths
}
import pagesRLD from "@/data/pages.json"
import ProjectDetail from "@/components/ProjectDetail"
import { ProjectPage, Project, ProjectSection } from "@/types"

export default async function ProjectPageComponent({ params }: { params: { pageId: string; projectId: string } }) {
    const { pageId, projectId } = await params
    let status: "loading" | "succeeded" | "failed" = "loading"
    let currentProject: Project | null = null
    let projectSection: ProjectSection | null = null
    let relatedProjects: Project[] = []

    try {
        const pages: ProjectPage[] = pagesRLD.pages as ProjectPage[] || []
        const page = pages.find((p) => p.uid === pageId)

        if (page && page.projectSections) {
            for (const section of page.projectSections) {
                if (section.projects) {
                    const project = section.projects.find((p) => p.uid === projectId)
                    if (project) {
                        currentProject = project
                        projectSection = section
                        relatedProjects = section.projects
                            .filter((p) => p.uid !== projectId)
                            .sort(() => Math.random() - 0.5) // Shuffle
                            .slice(0, 3); // Pick first 3
                        status = "succeeded"
                        break
                    }
                }
            }
        }

        if (!currentProject) {
            status = "failed"
        }
    } catch (error) {
        console.error("Error fetching project data:", error)
        status = "failed"
    }

    return (
        <ProjectDetail
            pageId={pageId}
            projectId={projectId}
            currentProject={currentProject}
            projectSection={projectSection}
            relatedProjects={relatedProjects}
            status={status}
        />
    )
}

export async function generateStaticParams() {
    const pages: ProjectPage[] = pagesRLD.pages as ProjectPage[] || []

    const paths = pages.flatMap((page) =>
        page.projectSections?.flatMap((section) =>
            section.projects?.map((project) => ({
                pageId: page.uid,
                projectId: project.uid,
            })) || []
        ) || []
    )

    return paths
}
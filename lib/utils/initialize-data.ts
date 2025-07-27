// Default data to use if no data is found
export const defaultPagesData = [
  {
    uid: "home",
    shortTitle: "Home",
    topTitle: "Welcome!",
    projectSections: [],
  },
  {
    uid: "portfolio",
    shortTitle: "Portfolio",
    topTitle: "My Work",
    projectSections: [
      {
        uid: "branding",
        title: "Branding",
        subtitle: "Identity Design",
        description: "A collection of branding and identity design projects.",
        projects: [
          {
            uid: "target",
            thumbnailImage:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-22%20at%208.56.17%E2%80%AFPM-qUB2hQS9wxoDYZ2eyqquVsK6wOdpmR.png",
            projectTitle: "Target",
            projectSubtitle: "Art Direction",
            projectParagraphs: [
              {
                paragraphTitle: "The Project",
                paragraphText:
                  "Target is launching a new Mondo Llama product of paint and paintbrushes. They want a physical and a digital banner ad for the new product. A professional photographer will photograph the concept. You will direct them based on your sketches, mood board, and layout concepts to communicate your vision to the photographer. Both ads need to include: Target logo, Target Visual Identity Headline and copy Photography of product Item name + price",
                paragraphUid: "target-p1",
              },
            ],
            subMedia: [
              {
                mediaFilename:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-22%20at%208.56.38%E2%80%AFPM-V1loYoe95T1bnYGnG0OOkHU3VgN5De.png",
                mediaType: "Image",
                mediaOrientation: "Vertical",
                mediaDescription: "Print ad for magazine spread",
                subMediaUid: "target-media-1",
              },
            ],
          },
          {
            uid: "typography",
            thumbnailImage:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-22%20at%208.58.59%E2%80%AFPM-GEjACRqtTSk0sXseRBY9p1Ss06EfUr.png",
            projectTitle: "Typography",
            projectSubtitle: "Letterform Study",
            projectParagraphs: [
              {
                paragraphTitle: "The Project",
                paragraphText: "A deep exploration of typography and letterform design.",
                paragraphUid: "typography-p1",
              },
            ],
            subMedia: [
              {
                mediaFilename:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-22%20at%208.58.59%E2%80%AFPM-GEjACRqtTSk0sXseRBY9p1Ss06EfUr.png",
                mediaType: "Image",
                mediaOrientation: "Square",
                mediaDescription: "Letterform study",
                subMediaUid: "typography-media-1",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    uid: "about",
    shortTitle: "About",
    topTitle: "About Me",
    projectSections: [],
  },
]

// Default about data
export const defaultAboutData = {
  bio: "I'm a graphic designer with a passion for creating meaningful visual experiences. My work spans branding, typography, packaging design, and digital media. With a background in fine arts and a degree in graphic design, I bring a unique perspective to each project. I believe in the power of thoughtful design to communicate ideas and evoke emotions. When I'm not designing, you can find me exploring nature, photographing interesting compositions, or experimenting with new creative techniques.",
  education: [
    {
      id: "edu1",
      degree: "Bachelor of Fine Arts in Graphic Design",
      institution: "Design Institute",
      years: "2019-2023",
    },
  ],
  experience: [
    {
      id: "exp1",
      title: "Graphic Designer",
      company: "Creative Studio",
      period: "2023-Present",
      responsibilities: [
        "Developed brand identities for various clients",
        "Created packaging designs for consumer products",
        "Collaborated with marketing teams on campaign visuals",
      ],
    },
    {
      id: "exp2",
      title: "Design Intern",
      company: "Design Agency",
      period: "Summer 2022",
      responsibilities: [
        "Assisted senior designers with client projects",
        "Contributed to brainstorming sessions and concept development",
        "Prepared presentation materials for client meetings",
      ],
    },
  ],
  skills: [
    "Adobe Creative Suite",
    "Brand Identity",
    "Typography",
    "Packaging Design",
    "Digital Design",
    "Illustration",
  ],
}

// Initialize data in localStorage if it doesn't exist
export function initializeData() {
  if (!localStorage.getItem("pages.json")) {
    localStorage.setItem(
      "pages.json",
      JSON.stringify({
        pages: defaultPagesData,
        about: defaultAboutData,
      }),
    )
  }
}

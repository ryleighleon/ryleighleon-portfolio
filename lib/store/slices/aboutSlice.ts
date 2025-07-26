import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"

export interface AboutState {
  bio: string
  education: {
    id: string
    degree: string
    institution: string
    years: string
  }[]
  experience: {
    id: string
    title: string
    company: string
    period: string
    responsibilities: string[]
  }[]
  skills: string[]
}

// Default about data
const defaultAboutData: AboutState = {
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

// Empty initial state
const initialState: AboutState = {
  bio: "",
  education: [],
  experience: [],
  skills: [],
}

export const fetchAboutData = createAsyncThunk("about/fetchAboutData", async () => {
  // During static build (NODE_ENV=production and no window), return empty initial state
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    return initialState
  }

  try {
    // Try to fetch from public URL
    const response = await fetch('/media/pages.rld')
    if (response.ok) {
      const data = await response.json()
      if (data.about) {
        return data.about
      }
    }

    // Fallback to localStorage if fetch fails or no about data
    const storedData = localStorage.getItem("pages.rld")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        if (parsedData.about) {
          return parsedData.about
        }
      } catch (e) {
        console.error("Error parsing localStorage data:", e)
      }
    }

    // If both fail, return default data
    return defaultAboutData
  } catch (error) {
    console.error("Error fetching about data:", error)
    return defaultAboutData
  }
})

export const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    updateBio: (state, action: PayloadAction<string>) => {
      state.bio = action.payload
      // Update localStorage
      const storedData = localStorage.getItem("pages.rld")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        parsedData.about = { ...(parsedData.about || state), bio: action.payload }
        localStorage.setItem("pages.rld", JSON.stringify(parsedData))
      } else {
        localStorage.setItem("pages.rld", JSON.stringify({ pages: [], about: state }))
      }
    },
    updateEducation: (state, action: PayloadAction<AboutState["education"]>) => {
      state.education = action.payload
      // Update localStorage
      const storedData = localStorage.getItem("pages.rld")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        parsedData.about = { ...(parsedData.about || state), education: action.payload }
        localStorage.setItem("pages.rld", JSON.stringify(parsedData))
      } else {
        localStorage.setItem("pages.rld", JSON.stringify({ pages: [], about: state }))
      }
    },
    addEducation: (state, action: PayloadAction<AboutState["education"][0]>) => {
      state.education.push(action.payload)
      // Update localStorage
      const storedData = localStorage.getItem("pages.rld")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        parsedData.about = { ...(parsedData.about || state), education: state.education }
        localStorage.setItem("pages.rld", JSON.stringify(parsedData))
      } else {
        localStorage.setItem("pages.rld", JSON.stringify({ pages: [], about: state }))
      }
    },
    updateExperience: (state, action: PayloadAction<AboutState["experience"]>) => {
      state.experience = action.payload
      // Update localStorage
      const storedData = localStorage.getItem("pages.rld")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        parsedData.about = { ...(parsedData.about || state), experience: action.payload }
        localStorage.setItem("pages.rld", JSON.stringify(parsedData))
      } else {
        localStorage.setItem("pages.rld", JSON.stringify({ pages: [], about: state }))
      }
    },
    addExperience: (state, action: PayloadAction<AboutState["experience"][0]>) => {
      state.experience.push(action.payload)
      // Update localStorage
      const storedData = localStorage.getItem("pages.rld")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        parsedData.about = { ...(parsedData.about || state), experience: state.experience }
        localStorage.setItem("pages.rld", JSON.stringify(parsedData))
      } else {
        localStorage.setItem("pages.rld", JSON.stringify({ pages: [], about: state }))
      }
    },
    updateSkills: (state, action: PayloadAction<string[]>) => {
      state.skills = action.payload
      // Update localStorage
      const storedData = localStorage.getItem("pages.rld")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        parsedData.about = { ...(parsedData.about || state), skills: action.payload }
        localStorage.setItem("pages.rld", JSON.stringify(parsedData))
      } else {
        localStorage.setItem("pages.rld", JSON.stringify({ pages: [], about: state }))
      }
    },
    setAboutData: (state, action: PayloadAction<AboutState>) => {
      // Update localStorage
      const storedData = localStorage.getItem("pages.rld")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        parsedData.about = action.payload
        localStorage.setItem("pages.rld", JSON.stringify(parsedData))
      } else {
        localStorage.setItem("pages.rld", JSON.stringify({ pages: [], about: action.payload }))
      }
      return action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAboutData.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

export const { updateBio, updateEducation, addEducation, updateExperience, addExperience, updateSkills, setAboutData } =
    aboutSlice.actions
export default aboutSlice.reducer
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AboutState } from "@/types"
import aboutRLD from "@/data/pages.json"
import { v4 as uuidv4 } from "uuid"

const initialState: AboutState = {
  bio: aboutRLD.about?.bio || "I am a passionate designer and developer with a focus on creating user-centric solutions.",
  education: aboutRLD.about?.education || [
    {
      id: uuidv4(),
      degree: "Bachelor of Arts in Design",
      institution: "Example University",
      years: "2016 - 2020",
    },
  ],
  experience: aboutRLD.about?.experience || [
    {
      id: uuidv4(),
      title: "UI/UX Designer",
      company: "Tech Corp",
      period: "2020 - Present",
      responsibilities: ["Designed user interfaces", "Conducted user research"],
    },
  ],
  skills: aboutRLD.about?.skills || ["UI/UX Design", "React", "TypeScript"],
  selectedAboutSection: null,
}

export const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    setAboutData: (state, action: PayloadAction<AboutState>) => {
      state.bio = action.payload.bio
      state.education = action.payload.education
      state.experience = action.payload.experience
      state.skills = action.payload.skills
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
      }))
    },
    updateBio: (state, action: PayloadAction<string>) => {
      state.bio = action.payload
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
      }))
    },
    addEducation: (state, action: PayloadAction<AboutState["education"][0]>) => {
      state.education.push(action.payload)
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
      }))
    },
    updateEducation: (state, action: PayloadAction<AboutState["education"]>) => {
      state.education = action.payload
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
      }))
    },
    deleteEducation: (state, action: PayloadAction<string>) => {
      state.education = state.education.filter((edu) => edu.id !== action.payload)
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
      }))
    },
    addExperience: (state, action: PayloadAction<AboutState["experience"][0]>) => {
      state.experience.push(action.payload)
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
      }))
    },
    updateExperience: (state, action: PayloadAction<AboutState["experience"]>) => {
      state.experience = action.payload
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
      }))
    },
    deleteExperience: (state, action: PayloadAction<string>) => {
      state.experience = state.experience.filter((exp) => exp.id !== action.payload)
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
      }))
    },
    addSkill: (state, action: PayloadAction<string>) => {
      if (!state.skills.includes(action.payload)) {
        state.skills.push(action.payload)
        localStorage.setItem("pages.json.about", JSON.stringify({
          bio: state.bio,
          education: state.education,
          experience: state.experience,
          skills: state.skills,
        }))
      }
    },
    updateSkills: (state, action: PayloadAction<string[]>) => {
      state.skills = action.payload
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
      }))
    },
    deleteSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter((skill) => skill !== action.payload)
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
      }))
    },
    setSelectedAboutSection: (state, action: PayloadAction<"bio" | "education" | "experience" | "skills" | null>) => {
      state.selectedAboutSection = action.payload
    },
  },
})

export const {
  setAboutData,
  updateBio,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addSkill,
  updateSkills,
  deleteSkill,
  setSelectedAboutSection,
} = aboutSlice.actions
export default aboutSlice.reducer
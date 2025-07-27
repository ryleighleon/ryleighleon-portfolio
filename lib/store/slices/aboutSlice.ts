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
      accomplishments: [],
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
  awardsAndExhibitions: aboutRLD.about?.awardsAndExhibitions || [
    {
      id: uuidv4(),
      title: "Best Design Award",
      subtitle: "Annual Design Conference",
      date: "2023",
      descriptions: ["Received for innovative UI design"],
    },
  ],
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
      state.awardsAndExhibitions = action.payload.awardsAndExhibitions
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    updateBio: (state, action: PayloadAction<string>) => {
      state.bio = action.payload
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    addEducation: (state, action: PayloadAction<AboutState["education"][0]>) => {
      state.education.push(action.payload)
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    updateEducation: (state, action: PayloadAction<AboutState["education"]>) => {
      state.education = action.payload
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    deleteEducation: (state, action: PayloadAction<string>) => {
      state.education = state.education.filter((edu) => edu.id !== action.payload)
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    addExperience: (state, action: PayloadAction<AboutState["experience"][0]>) => {
      state.experience.push(action.payload)
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    updateExperience: (state, action: PayloadAction<AboutState["experience"]>) => {
      state.experience = action.payload
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    deleteExperience: (state, action: PayloadAction<string>) => {
      state.experience = state.experience.filter((exp) => exp.id !== action.payload)
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
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
          awardsAndExhibitions: state.awardsAndExhibitions,
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
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    deleteSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter((skill) => skill !== action.payload)
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    addAwardOrExhibition: (state, action: PayloadAction<AboutState["awardsAndExhibitions"][0]>) => {
      state.awardsAndExhibitions.push(action.payload)
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    updateAwardOrExhibition: (state, action: PayloadAction<AboutState["awardsAndExhibitions"]>) => {
      state.awardsAndExhibitions = action.payload
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    deleteAwardOrExhibition: (state, action: PayloadAction<string>) => {
      state.awardsAndExhibitions = state.awardsAndExhibitions.filter((award) => award.id !== action.payload)
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    setSelectedAboutSection: (state, action: PayloadAction<"bio" | "education" | "experience" | "skills" | "awardsAndExhibitions" | null>) => {
      state.selectedAboutSection = action.payload
    },
    reorderSkills: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const reorderedSkills = [...state.skills]
      const [movedSkill] = reorderedSkills.splice(action.payload.sourceIndex, 1)
      reorderedSkills.splice(action.payload.destinationIndex, 0, movedSkill)
      state.skills = reorderedSkills
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    reorderEducation: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const reorderedEducation = [...state.education]
      const [movedEducation] = reorderedEducation.splice(action.payload.sourceIndex, 1)
      reorderedEducation.splice(action.payload.destinationIndex, 0, movedEducation)
      state.education = reorderedEducation
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    reorderExperience: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const reorderedExperience = [...state.experience]
      const [movedExperience] = reorderedExperience.splice(action.payload.sourceIndex, 1)
      reorderedExperience.splice(action.payload.destinationIndex, 0, movedExperience)
      state.experience = reorderedExperience
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    reorderAwardsAndExhibitions: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const reorderedAwards = [...state.awardsAndExhibitions]
      const [movedAward] = reorderedAwards.splice(action.payload.sourceIndex, 1)
      reorderedAwards.splice(action.payload.destinationIndex, 0, movedAward)
      state.awardsAndExhibitions = reorderedAwards
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    reorderAccomplishments: (state, action: PayloadAction<{ eduIndex: number; sourceIndex: number; destinationIndex: number }>) => {
      const updatedEducation = [...state.education]
      const updatedEntry = { ...updatedEducation[action.payload.eduIndex] }

      const accomplishments = Array.isArray(updatedEntry.accomplishments)
          ? [...updatedEntry.accomplishments]
          : []

      const [movedAccomplishment] = accomplishments.splice(action.payload.sourceIndex, 1)

      if (movedAccomplishment !== undefined) {
        accomplishments.splice(action.payload.destinationIndex, 0, movedAccomplishment)
        updatedEntry.accomplishments = accomplishments
        updatedEducation[action.payload.eduIndex] = updatedEntry
        state.education = updatedEducation

        localStorage.setItem(
            "pages.json.about",
            JSON.stringify({
              bio: state.bio,
              education: state.education,
              experience: state.experience,
              skills: state.skills,
              awardsAndExhibitions: state.awardsAndExhibitions,
            })
        )
      }
    },
    reorderResponsibilities: (state, action: PayloadAction<{ expIndex: number; sourceIndex: number; destinationIndex: number }>) => {
      const updatedExperience = [...state.experience]
      const updatedEntry = { ...updatedExperience[action.payload.expIndex] }
      const reorderedResponsibilities = [...updatedEntry.responsibilities]
      const [movedResponsibility] = reorderedResponsibilities.splice(action.payload.sourceIndex, 1)
      reorderedResponsibilities.splice(action.payload.destinationIndex, 0, movedResponsibility)
      updatedEntry.responsibilities = reorderedResponsibilities
      updatedExperience[action.payload.expIndex] = updatedEntry
      state.experience = updatedExperience
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
    },
    reorderDescriptions: (state, action: PayloadAction<{ awardIndex: number; sourceIndex: number; destinationIndex: number }>) => {
      const updatedAwards = [...state.awardsAndExhibitions]
      const updatedEntry = { ...updatedAwards[action.payload.awardIndex] }
      const reorderedDescriptions = [...updatedEntry.descriptions]
      const [movedDescription] = reorderedDescriptions.splice(action.payload.sourceIndex, 1)
      reorderedDescriptions.splice(action.payload.destinationIndex, 0, movedDescription)
      updatedEntry.descriptions = reorderedDescriptions
      updatedAwards[action.payload.awardIndex] = updatedEntry
      state.awardsAndExhibitions = updatedAwards
      localStorage.setItem("pages.json.about", JSON.stringify({
        bio: state.bio,
        education: state.education,
        experience: state.experience,
        skills: state.skills,
        awardsAndExhibitions: state.awardsAndExhibitions,
      }))
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
  addAwardOrExhibition,
  updateAwardOrExhibition,
  deleteAwardOrExhibition,
  setSelectedAboutSection,
  reorderSkills,
  reorderEducation,
  reorderExperience,
  reorderAwardsAndExhibitions,
  reorderAccomplishments,
  reorderResponsibilities,
  reorderDescriptions,
} = aboutSlice.actions
export default aboutSlice.reducer
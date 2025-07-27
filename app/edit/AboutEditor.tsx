import React from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import {
  updateBio,
  updateEducation,
  addEducation,
  updateExperience,
  addExperience,
  updateSkills,
  deleteEducation,
  deleteExperience,
  addSkill,
  deleteSkill,
  reorderSkills,
  reorderEducation,
  reorderExperience,
  addAwardOrExhibition,
  updateAwardOrExhibition,
  deleteAwardOrExhibition,
  reorderAwardsAndExhibitions,
  reorderAccomplishments,
  reorderResponsibilities,
  reorderDescriptions,
} from "@/lib/store/slices/aboutSlice"
import { v4 as uuidv4 } from "uuid"
import Loading from "@/components/loading"

// Assuming these types are defined in types.ts
interface Education {
  id: string
  degree: string
  institution: string
  years: string
  accomplishments: string[]
}

interface Experience {
  id: string
  title: string
  company: string
  period: string
  responsibilities: string[]
}

interface AwardOrExhibition {
  id: string
  title: string
  subtitle: string
  date: string
  descriptions: string[]
}

export default function AboutEditor() {
  const dispatch = useAppDispatch()
  const { selectedAboutSection, bio, education, experience, skills, awardsAndExhibitions } = useAppSelector((state) => state.about)

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateBio(e.target.value))
  }

  const handleSkillChange = (index: number, value: string) => {
    if (selectedAboutSection === "skills") {
      const updatedSkills = [...skills]
      updatedSkills[index] = value
      dispatch(updateSkills(updatedSkills))
    }
  }

  const handleAddSkill = () => {
    if (selectedAboutSection === "skills") {
      dispatch(addSkill(""))
    }
  }

  const handleRemoveSkill = (index: number) => {
    if (selectedAboutSection === "skills") {
      dispatch(deleteSkill(skills[index]))
    }
  }

  const handleMoveSkill = (index: number, direction: "up" | "down") => {
    if (selectedAboutSection === "skills") {
      const destinationIndex = direction === "up" ? index - 1 : index + 1
      if (destinationIndex >= 0 && destinationIndex < skills.length) {
        dispatch(reorderSkills({ sourceIndex: index, destinationIndex }))
      }
    }
  }

  const handleEducationChange = (
      index: number,
      field: keyof Education | "accomplishments",
      value: string | string[],
      accIndex?: number
  ) => {
    if (selectedAboutSection === "education") {
      const updatedEducation = [...education]
      const updatedEntry = { ...updatedEducation[index] }
      if (field === "accomplishments" && accIndex !== undefined) {
        updatedEntry.accomplishments = [...(updatedEntry.accomplishments || [])]
        updatedEntry.accomplishments[accIndex] = value as string
      } else if (field !== "accomplishments" && field !== "id") {
        updatedEntry[field as keyof Omit<Education, "accomplishments" | "id">] = value as string
      }
      updatedEducation[index] = updatedEntry
      dispatch(updateEducation(updatedEducation))
    }
  }

  const handleAddEducation = () => {
    if (selectedAboutSection === "education") {
      const newEducation: Education = {
        id: uuidv4(),
        degree: "",
        institution: "",
        years: "",
        accomplishments: [],
      }
      dispatch(addEducation(newEducation))
    }
  }

  const handleRemoveEducation = (index: number) => {
    if (selectedAboutSection === "education") {
      dispatch(deleteEducation(education[index].id))
    }
  }

  const handleMoveEducation = (index: number, direction: "up" | "down") => {
    if (selectedAboutSection === "education") {
      const destinationIndex = direction === "up" ? index - 1 : index + 1
      if (destinationIndex >= 0 && destinationIndex < education.length) {
        dispatch(reorderEducation({ sourceIndex: index, destinationIndex }))
      }
    }
  }

  const handleAddAccomplishment = (eduIndex: number) => {
    if (selectedAboutSection === "education") {
      const updatedEducation = [...education]
      const updatedEntry = { ...updatedEducation[eduIndex] }
      updatedEntry.accomplishments = [...(updatedEntry.accomplishments || []), ""]
      updatedEducation[eduIndex] = updatedEntry
      dispatch(updateEducation(updatedEducation))
    }
  }

  const handleRemoveAccomplishment = (eduIndex: number, accIndex: number) => {
    if (selectedAboutSection === "education") {
      const updatedEducation = [...education]
      const updatedEntry = { ...updatedEducation[eduIndex] }
      updatedEntry.accomplishments = (updatedEntry.accomplishments || []).filter((_, i) => i !== accIndex)
      updatedEducation[eduIndex] = updatedEntry
      dispatch(updateEducation(updatedEducation))
    }
  }

  const handleMoveAccomplishment = (eduIndex: number, accIndex: number, direction: "up" | "down") => {
    if (
        selectedAboutSection === "education" &&
        Array.isArray(education) &&
        education[eduIndex] &&
        Array.isArray(education[eduIndex].accomplishments)
    ) {
      const accomplishments = education[eduIndex].accomplishments
      const destinationIndex = direction === "up" ? accIndex - 1 : accIndex + 1

      if (destinationIndex >= 0 && destinationIndex < accomplishments.length) {
        dispatch(
            reorderAccomplishments({
              eduIndex,
              sourceIndex: accIndex,
              destinationIndex,
            })
        )
      }
    }
  }

  const handleExperienceChange = (
      index: number,
      field: keyof Experience | "responsibilities",
      value: string | string[],
      respIndex?: number
  ) => {
    if (selectedAboutSection === "experience") {
      const updatedExperience = [...experience]
      const updatedEntry = { ...updatedExperience[index] }
      if (field === "responsibilities" && respIndex !== undefined) {
        updatedEntry.responsibilities = [...updatedEntry.responsibilities]
        updatedEntry.responsibilities[respIndex] = value as string
      } else if (field !== "responsibilities" && field !== "id") {
        updatedEntry[field as keyof Omit<Experience, "responsibilities" | "id">] = value as string
      }
      updatedExperience[index] = updatedEntry
      dispatch(updateExperience(updatedExperience))
    }
  }

  const handleResponsibilityChange = (expIndex: number, respIndex: number, value: string) => {
    if (selectedAboutSection === "experience") {
      handleExperienceChange(expIndex, "responsibilities", value, respIndex)
    }
  }

  const handleAddExperience = () => {
    if (selectedAboutSection === "experience") {
      const newExperience: Experience = {
        id: uuidv4(),
        title: "",
        company: "",
        period: "",
        responsibilities: [""],
      }
      dispatch(addExperience(newExperience))
    }
  }

  const handleRemoveExperience = (index: number) => {
    if (selectedAboutSection === "experience") {
      dispatch(deleteExperience(experience[index].id))
    }
  }

  const handleMoveExperience = (index: number, direction: "up" | "down") => {
    if (selectedAboutSection === "experience") {
      const destinationIndex = direction === "up" ? index - 1 : index + 1
      if (destinationIndex >= 0 && destinationIndex < experience.length) {
        dispatch(reorderExperience({ sourceIndex: index, destinationIndex }))
      }
    }
  }

  const handleAddResponsibility = (expIndex: number) => {
    if (selectedAboutSection === "experience") {
      const updatedExperience = [...experience]
      const updatedEntry = { ...updatedExperience[expIndex] }
      updatedEntry.responsibilities = [...updatedEntry.responsibilities, ""]
      updatedExperience[expIndex] = updatedEntry
      dispatch(updateExperience(updatedExperience))
    }
  }

  const handleRemoveResponsibility = (expIndex: number, respIndex: number) => {
    if (selectedAboutSection === "experience") {
      const updatedExperience = [...experience]
      const updatedEntry = { ...updatedExperience[expIndex] }
      updatedEntry.responsibilities = updatedEntry.responsibilities.filter((_, i) => i !== respIndex)
      updatedExperience[expIndex] = updatedEntry
      dispatch(updateExperience(updatedExperience))
    }
  }

  const handleMoveResponsibility = (expIndex: number, respIndex: number, direction: "up" | "down") => {
    if (selectedAboutSection === "experience") {
      const destinationIndex = direction === "up" ? respIndex - 1 : respIndex + 1
      if (destinationIndex >= 0 && destinationIndex < experience[expIndex].responsibilities.length) {
        dispatch(reorderResponsibilities({ expIndex, sourceIndex: respIndex, destinationIndex }))
      }
    }
  }

  const handleAwardOrExhibitionChange = (
      index: number,
      field: keyof AwardOrExhibition | "descriptions",
      value: string | string[],
      descIndex?: number
  ) => {
    if (selectedAboutSection === "awardsAndExhibitions") {
      const updatedAwards = [...awardsAndExhibitions]
      const updatedEntry = { ...updatedAwards[index] }
      if (field === "descriptions" && descIndex !== undefined) {
        updatedEntry.descriptions = [...updatedEntry.descriptions]
        updatedEntry.descriptions[descIndex] = value as string
      } else if (field !== "descriptions" && field !== "id") {
        updatedEntry[field as keyof Omit<AwardOrExhibition, "descriptions" | "id">] = value as string
      }
      updatedAwards[index] = updatedEntry
      dispatch(updateAwardOrExhibition(updatedAwards))
    }
  }

  const handleAddAwardOrExhibition = () => {
    if (selectedAboutSection === "awardsAndExhibitions") {
      const newAward: AwardOrExhibition = {
        id: uuidv4(),
        title: "",
        subtitle: "",
        date: "",
        descriptions: [""],
      }
      dispatch(addAwardOrExhibition(newAward))
    }
  }

  const handleRemoveAwardOrExhibition = (index: number) => {
    if (selectedAboutSection === "awardsAndExhibitions") {
      dispatch(deleteAwardOrExhibition(awardsAndExhibitions[index].id))
    }
  }

  const handleMoveAwardOrExhibition = (index: number, direction: "up" | "down") => {
    if (selectedAboutSection === "awardsAndExhibitions") {
      const destinationIndex = direction === "up" ? index - 1 : index + 1
      if (destinationIndex >= 0 && destinationIndex < awardsAndExhibitions.length) {
        dispatch(reorderAwardsAndExhibitions({ sourceIndex: index, destinationIndex }))
      }
    }
  }

  const handleAddDescription = (awardIndex: number) => {
    if (selectedAboutSection === "awardsAndExhibitions") {
      const updatedAwards = [...awardsAndExhibitions]
      const updatedEntry = { ...updatedAwards[awardIndex] }
      updatedEntry.descriptions = [...updatedEntry.descriptions, ""]
      updatedAwards[awardIndex] = updatedEntry
      dispatch(updateAwardOrExhibition(updatedAwards))
    }
  }

  const handleRemoveDescription = (awardIndex: number, descIndex: number) => {
    if (selectedAboutSection === "awardsAndExhibitions") {
      const updatedAwards = [...awardsAndExhibitions]
      const updatedEntry = { ...updatedAwards[awardIndex] }
      updatedEntry.descriptions = updatedEntry.descriptions.filter((_, i) => i !== descIndex)
      updatedAwards[awardIndex] = updatedEntry
      dispatch(updateAwardOrExhibition(updatedAwards))
    }
  }

  const handleMoveDescription = (awardIndex: number, descIndex: number, direction: "up" | "down") => {
    if (selectedAboutSection === "awardsAndExhibitions") {
      const destinationIndex = direction === "up" ? descIndex - 1 : descIndex + 1
      if (destinationIndex >= 0 && destinationIndex < awardsAndExhibitions[awardIndex].descriptions.length) {
        dispatch(reorderDescriptions({ awardIndex, sourceIndex: descIndex, destinationIndex }))
      }
    }
  }

  return (
      <div className="p-6">
        {selectedAboutSection === "bio" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Biography</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                <textarea
                    value={bio || ""}
                    onChange={handleBioChange}
                    rows={8}
                    className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-y"
                />
              </div>
            </div>
        )}
        {selectedAboutSection === "education" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Education</h2>
              {education.map((edu, index) => (
                  <div key={edu.id} className="mb-6 p-4 border rounded">
                    <div className="flex justify-between mb-3">
                      <div className="flex space-x-2">
                        <button
                            onClick={() => handleMoveEducation(index, "up")}
                            disabled={index === 0}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                        >
                          ↑
                        </button>
                        <button
                            onClick={() => handleMoveEducation(index, "down")}
                            disabled={index === education.length - 1}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                        >
                          ↓
                        </button>
                      </div>
                      <button
                          onClick={() => handleRemoveEducation(index)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Remove Education
                      </button>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                      <input
                          type="text"
                          value={edu.degree || ""}
                          onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                          className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                      <input
                          type="text"
                          value={edu.institution || ""}
                          onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                          className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
                      <input
                          type="text"
                          value={edu.years || ""}
                          onChange={(e) => handleEducationChange(index, "years", e.target.value)}
                          className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Accomplishments (Bullet Points)</label>
                      {(edu.accomplishments || []).map((acc, accIndex) => (
                          <div key={accIndex} className="flex mb-2 items-start">
                            <div className="flex space-x-2 mr-2">
                              <button
                                  onClick={() => handleMoveAccomplishment(index, accIndex, "up")}
                                  disabled={accIndex === 0}
                                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                              >
                                ↑
                              </button>
                              <button
                                  onClick={() => handleMoveAccomplishment(index, accIndex, "down")}
                                  disabled={accIndex === (edu.accomplishments || []).length - 1}
                                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                              >
                                ↓
                              </button>
                            </div>
                            <textarea
                                value={acc || ""}
                                onChange={(e) => handleEducationChange(index, "accomplishments", e.target.value, accIndex)}
                                rows={3}
                                className="flex-1 p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-y"
                            />
                            <button
                                onClick={() => handleRemoveAccomplishment(index, accIndex)}
                                className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm self-start"
                            >
                              Remove
                            </button>
                          </div>
                      ))}
                      <button
                          onClick={() => handleAddAccomplishment(index)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Add Accomplishment
                      </button>
                    </div>
                  </div>
              ))}
              <button
                  onClick={handleAddEducation}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Education
              </button>
            </div>
        )}
        {selectedAboutSection === "experience" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Experience</h2>
              {!experience ? (
                  <Loading />
              ) : (
                  experience.map((exp, index) => (
                      <div key={exp.id} className="mb-6 p-4 border rounded">
                        <div className="flex justify-between mb-3">
                          <div className="flex space-x-2">
                            <button
                                onClick={() => handleMoveExperience(index, "up")}
                                disabled={index === 0}
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                            >
                              ↑
                            </button>
                            <button
                                onClick={() => handleMoveExperience(index, "down")}
                                disabled={index === experience.length - 1}
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                            >
                              ↓
                            </button>
                          </div>
                          <button
                              onClick={() => handleRemoveExperience(index)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            Remove Experience
                          </button>
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                              type="text"
                              value={exp.title || ""}
                              onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                              className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                          <input
                              type="text"
                              value={exp.company || ""}
                              onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                              className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                          <input
                              type="text"
                              value={exp.period || ""}
                              onChange={(e) => handleExperienceChange(index, "period", e.target.value)}
                              className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                          {(exp.responsibilities || []).map((resp, respIndex) => (
                              <div key={respIndex} className="flex mb-2 items-start">
                                <div className="flex space-x-2 mr-2">
                                  <button
                                      onClick={() => handleMoveResponsibility(index, respIndex, "up")}
                                      disabled={respIndex === 0}
                                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                                  >
                                    ↑
                                  </button>
                                  <button
                                      onClick={() => handleMoveResponsibility(index, respIndex, "down")}
                                      disabled={respIndex === exp.responsibilities.length - 1}
                                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                                  >
                                    ↓
                                  </button>
                                </div>
                                <textarea
                                    value={resp || ""}
                                    onChange={(e) => handleResponsibilityChange(index, respIndex, e.target.value)}
                                    rows={3}
                                    className="flex-1 p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-y"
                                />
                                <button
                                    onClick={() => handleRemoveResponsibility(index, respIndex)}
                                    className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm self-start"
                                >
                                  Remove
                                </button>
                              </div>
                          ))}
                          <button
                              onClick={() => handleAddResponsibility(index)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Add Responsibility
                          </button>
                        </div>
                      </div>
                  ))
              )}
              <button
                  onClick={handleAddExperience}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Experience
              </button>
            </div>
        )}
        {selectedAboutSection === "skills" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Skills</h2>
              {skills.map((skill, index) => (
                  <div key={`skill-${index}`} className="flex mb-2 items-start">
                    <div className="flex space-x-2 mr-2">
                      <button
                          onClick={() => handleMoveSkill(index, "up")}
                          disabled={index === 0}
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                      >
                        ↑
                      </button>
                      <button
                          onClick={() => handleMoveSkill(index, "down")}
                          disabled={index === skills.length - 1}
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                      >
                        ↓
                      </button>
                    </div>
                    <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        className="flex-1 p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                        onClick={() => handleRemoveSkill(index)}
                        className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm self-start"
                    >
                      Remove
                    </button>
                  </div>
              ))}
              <button
                  onClick={handleAddSkill}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-2"
              >
                Add Skill
              </button>
            </div>
        )}
        {selectedAboutSection === "awardsAndExhibitions" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Awards and Exhibitions</h2>
              {awardsAndExhibitions.map((award, index) => (
                  <div key={award.id} className="mb-6 p-4 border rounded">
                    <div className="flex justify-between mb-3">
                      <div className="flex space-x-2">
                        <button
                            onClick={() => handleMoveAwardOrExhibition(index, "up")}
                            disabled={index === 0}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                        >
                          ↑
                        </button>
                        <button
                            onClick={() => handleMoveAwardOrExhibition(index, "down")}
                            disabled={index === awardsAndExhibitions.length - 1}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                        >
                          ↓
                        </button>
                      </div>
                      <button
                          onClick={() => handleRemoveAwardOrExhibition(index)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Remove Award/Exhibition
                      </button>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                          type="text"
                          value={award.title || ""}
                          onChange={(e) => handleAwardOrExhibitionChange(index, "title", e.target.value)}
                          className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (Optional)</label>
                      <input
                          type="text"
                          value={award.subtitle || ""}
                          onChange={(e) => handleAwardOrExhibitionChange(index, "subtitle", e.target.value)}
                          className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                          type="text"
                          value={award.date || ""}
                          onChange={(e) => handleAwardOrExhibitionChange(index, "date", e.target.value)}
                          className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (Bullet Points)</label>
                      {(award.descriptions || []).map((desc, descIndex) => (
                          <div key={descIndex} className="flex mb-2 items-start">
                            <div className="flex space-x-2 mr-2">
                              <button
                                  onClick={() => handleMoveDescription(index, descIndex, "up")}
                                  disabled={descIndex === 0}
                                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                              >
                                ↑
                              </button>
                              <button
                                  onClick={() => handleMoveDescription(index, descIndex, "down")}
                                  disabled={descIndex === award.descriptions.length - 1}
                                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                              >
                                ↓
                              </button>
                            </div>
                            <textarea
                                value={desc || ""}
                                onChange={(e) => handleAwardOrExhibitionChange(index, "descriptions", e.target.value, descIndex)}
                                rows={3}
                                className="flex-1 p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-y"
                            />
                            <button
                                onClick={() => handleRemoveDescription(index, descIndex)}
                                className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm self-start"
                            >
                              Remove
                            </button>
                          </div>
                      ))}
                      <button
                          onClick={() => handleAddDescription(index)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Add Description
                      </button>
                    </div>
                  </div>
              ))}
              <button
                  onClick={handleAddAwardOrExhibition}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Award/Exhibition
              </button>
            </div>
        )}
      </div>
  )
}
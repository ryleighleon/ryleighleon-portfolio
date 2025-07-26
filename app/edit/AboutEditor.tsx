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
} from "@/lib/store/slices/aboutSlice"
import { v4 as uuidv4 } from "uuid"
import Loading from "@/components/loading"

export default function AboutEditor() {
  const dispatch = useAppDispatch()
  const { selectedAboutSection, bio, education, experience, skills } = useAppSelector((state) => state.about)

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
      dispatch(addSkill("New Skill"))
    }
  }

  const handleRemoveSkill = (index: number) => {
    if (selectedAboutSection === "skills") {
      dispatch(deleteSkill(skills[index]))
    }
  }

  const handleEducationChange = (index: number, field: keyof typeof education[0], value: string) => {
    if (selectedAboutSection === "education") {
      const updatedEducation = [...education]
      updatedEducation[index] = { ...updatedEducation[index], [field]: value }
      dispatch(updateEducation(updatedEducation))
    }
  }

  const handleAddEducation = () => {
    if (selectedAboutSection === "education") {
      const newEducation = {
        id: uuidv4(),
        degree: "New Degree",
        institution: "Institution Name",
        years: "Year Range",
      }
      dispatch(addEducation(newEducation))
    }
  }

  const handleRemoveEducation = (index: number) => {
    if (selectedAboutSection === "education") {
      dispatch(deleteEducation(education[index].id))
    }
  }

  const handleExperienceChange = (
      index: number,
      field: keyof typeof experience[0] | "responsibilities",
      value: string | string[],
      respIndex?: number
  ) => {
    if (selectedAboutSection === "experience") {
      const updatedExperience = [...experience]
      if (field === "responsibilities" && respIndex !== undefined) {
        updatedExperience[index].responsibilities[respIndex] = value as string
      } else {
        updatedExperience[index] = { ...updatedExperience[index], [field]: value }
      }
      dispatch(updateExperience(updatedExperience))
    }
  }

  const handleAddExperience = () => {
    if (selectedAboutSection === "experience") {
      const newExperience = {
        id: uuidv4(),
        title: "New Position",
        company: "Company Name",
        period: "Time Period",
        responsibilities: ["Responsibility 1"],
      }
      dispatch(addExperience(newExperience))
    }
  }

  const handleRemoveExperience = (index: number) => {
    if (selectedAboutSection === "experience") {
      dispatch(deleteExperience(experience[index].id))
    }
  }

  const handleAddResponsibility = (expIndex: number) => {
    if (selectedAboutSection === "experience") {
      const updatedExperience = [...experience]
      updatedExperience[expIndex].responsibilities.push("New responsibility")
      dispatch(updateExperience(updatedExperience))
    }
  }

  const handleResponsibilityChange = (expIndex: number, respIndex: number, value: string) => {
    if (selectedAboutSection === "experience") {
      handleExperienceChange(expIndex, "responsibilities", value, respIndex)
    }
  }

  const handleRemoveResponsibility = (expIndex: number, respIndex: number) => {
    if (selectedAboutSection === "experience") {
      const updatedExperience = [...experience]
      updatedExperience[expIndex].responsibilities = updatedExperience[expIndex].responsibilities.filter(
          (_, i) => i !== respIndex
      )
      dispatch(updateExperience(updatedExperience))
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
                    className="w-full p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
        )}
        {selectedAboutSection === "education" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Education</h2>
              {education.map((edu, index) => (
                  <div key={edu.id} className="mb-6 p-4 border rounded">
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
                    <button
                        onClick={() => handleRemoveEducation(index)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Remove
                    </button>
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
                              <div key={respIndex} className="flex mb-2">
                                <input
                                    type="text"
                                    value={resp || ""}
                                    onChange={(e) => handleResponsibilityChange(index, respIndex, e.target.value)}
                                    className="flex-1 p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                                <button
                                    onClick={() => handleRemoveResponsibility(index, respIndex)}
                                    className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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
                        <button
                            onClick={() => handleRemoveExperience(index)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Remove Experience
                        </button>
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
                  <div key={index} className="flex mb-2">
                    <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        className="flex-1 p-2 border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                        onClick={() => handleRemoveSkill(index)}
                        className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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
      </div>
  )
}
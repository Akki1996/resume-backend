const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  profileImage: { type: String }, 
  summary: { type: String },

  education: [
    {
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      fieldOfStudy: { type: String },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      location: { type: String },
      description: { type: String }
    }
  ],

  experience: [
    {
      company: { type: String, required: true },
      position: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      location: { type: String },
      projects: [
        {
          name: { type: String, required: true },
          description: { type: String },
          technologies: [{ type: String }],
          responsibilities: [{ type: String }]
        }
      ]
    }
  ],

  skills: [
    {
      category: { type: String, required: true },
      list: [{ type: String, required: true }]
    }
  ],

  certifications: [
    {
      name: { type: String, required: true },
      organization: { type: String },
      date: { type: Date },
      credentialURL: { type: String }
    }
  ],

  projects: [
    {
      name: { type: String, required: true },
      description: { type: String },
      technologies: [{ type: String }],
      url: { type: String },
      responsibilities: [{ type: String }]
    }
  ],

  languages: [
    {
      name: { type: String, required: true },
      proficiency: { type: String, enum: ["Beginner", "Intermediate", "Fluent", "Native"], required: true }
    }
  ],

  achievements: [
    {
      title: { type: String, required: true },
      description: { type: String },
      year: { type: Number }
    }
  ],

  volunteering: [
    {
      organization: { type: String, required: true },
      role: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      description: { type: String }
    }
  ],

  socialLinks: [
    {
      platform: { type: String, required: true },
      url: { type: String, required: true }
    }
  ],

  interests: [{ type: String }]
}, { timestamps: true });

const Resume = mongoose.model("Resume", ResumeSchema);

module.exports = Resume;

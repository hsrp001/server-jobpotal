// models/JobApplication.js

const mongoose = require('mongoose');

// Define schema for the job application form data
const jobApplicationSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'comapnyId', default: 'comapnyId' },
    applair: { type: mongoose.Schema.Types.ObjectId, ref: 'jobseeker', default: 'jobseekar' },
  
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  experience: { type: String, required: true },
  jobDescription: { type: String, required: true },
  cv: { type: String, required: true }, // Assuming file path or URL for CV
}, { timestamps: true });

// Create and export the model

const Jobapplyfromdata = mongoose.model('JobApplication', jobApplicationSchema);
module.exports = Jobapplyfromdata

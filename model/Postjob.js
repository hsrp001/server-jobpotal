const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: 'user' },
    jobTitle: String,
    jobLocation: String,
    openings: Number,
    totalExp: String,
    salary: String,
    bonus: String,
    jobDescription: String,
    skills: String,
    companyName: String,
    contactPerson: String,
    phoneNumber: String,
    email: String,
    contactProfile: String,
    organizationSize: String,
    jobAddress: String,
    personal: [String],
    education: [String],
    additional: [String],
    applieduser: [{ type: mongoose.Schema.ObjectId, ref: "applieduser" }]
  });
  
  const Postjob = mongoose.model('Postjob', jobSchema);
 module.exports = Postjob
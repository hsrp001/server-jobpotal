const express = require('express')
const router = express.Router()
const multer = require('multer')
const userdatas = require('../model/userdata')
const Jobapplyfromdata = require('../model/Jobapplyfromdata')
const Postjob = require('../model/Postjob')
const {postjobgetapi, postjobpostapi} = require('../controllers/Alljobs')
const  bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')
const path = require('path'); // Import the path module
const auth = require('../middleware/auth')
const key = "sonu#12345"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const cv = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(__dirname,'..', 'Cv'); // Adjust the path based on your project structure
     
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});


const upload =multer({ storage: storage }) 
const cvfiles =multer({ storage: cv }) 


router.get('/', (req,res)=>{

    res.send('server running sucess fully ')

})
router.post('/login', async (req, res) => {
    const {  username, password } = req.body;
    try {

        const phoneNumber = !isNaN(username) ? parseInt(username) : null;

        const userdata = await userdatas.findOne({ $or: [
               
                { email: username },
                { phone: phoneNumber }
            ] });

 if (!userdata) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Use bcryptjs instead of bcrypt for password comparison
        const isMatch = await bcrypt.compare(password, userdata.password);
      
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const tokens = jwt.sign({ _id: userdata._id.toString() }, key, { expiresIn: '10h' });
     
        userdata.token = tokens;
        await userdata.save();




        res.status(200).json({ message: 'Login successful', user: userdata });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Internal server error' });
    }

});


router.get('/profile', auth, (req, res) => {

    res.json({ data: req.user, success: true });
  });


router.post('/register', upload.single('file'), async (req, res, next) => {
   
    const {username, phone,password,email,catagory}= req.body
    
   
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

   
    try {
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

    
        const newUser = new userdatas({
            catagory: catagory,
            username: username,
            password: hashedPassword,
            email: email,
            phone: phone,
            file: req.file.path // Assuming you want to store the filename in the database
        });

        // Save the user data to the database
        await newUser.save();

        res.status(201).send('User data saved successfully.');
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).send('Error saving user data.');
    }
  
});


router.route('/postjob').post(auth, postjobpostapi).get(auth,postjobgetapi);

router.get('/alljobs',auth, async(req,res)=>{

    try {
    
    

    const jobs = await Postjob.find({});
    res.status(200).json({massage :"successfully ",data :jobs , succse: true});


 } catch (error) {

    console.error('Error retrieving jobs:', error);
        res.status(500).json({ error: 'Internal server error' });
 }

})

router.get('/getjobs/:id',auth, async(req,res)=>{

    const {id}= req.params

    try {
    const jobs = await Postjob.find({_id:id});
    res.status(200).json({massage :"successfully ",data :jobs , succse: true});


 } catch (error) {

    console.error('Error retrieving jobs:', error);
        res.status(500).json({ error: 'Internal server error' });
 }

})

router.get('/postapplyjobfrom/:id',auth, async(req,res)=>{

    const {id}= req.params

    try {
    const jobs = await Postjob.find({_id:id});
    res.status(200).json({massage :"successfully ",data :jobs , succse: true});


 } catch (error) {

    console.error('Error retrieving jobs:', error);
        res.status(500).json({ error: 'Internal server error' });
 }

})


router.post('/submitapplyjobform/:id', auth , cvfiles.single('cv'), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id; 
     
      const findjob = await Postjob.findById(id);
      if (!findjob) {
        return res.status(404).json({ error: 'Job not found' });
    }
    
      const newJobApplication = new Jobapplyfromdata({
        companyId: findjob.userId,
        applair: userId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        experience: req.body.experience,
        jobDescription: req.body.jobDescription,
        cv: req.file ? req.file.path : null, // Assuming file path or URL for CV
      });
  
      // Save the job application data to the database
      const savedJobApplication = await newJobApplication.save();
      const updatedJob = await Postjob.findByIdAndUpdate(id, { $push: { applieduser: userId } }, { new: true });
      // Return success response with the saved job application data
   
      res.status(201).json(savedJobApplication);
    } catch (error) {
      console.error('Error submitting form:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  router.get('/alljobappliedform/:id',auth,async (req,res)=>{

    try {
        

        const {id} = req.params;

          // Find the job that contains the provided ID in the applieduser array
          const job = await Postjob.find({ applieduser: id });

          if (!job) {
              return res.status(404).json({ error: 'Job not found' });
          }
  
          res.status(200).json(job);

    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})

router.get('/allcandidateappliedform/:id',auth,async (req,res)=>{

    try {
        

        const {id} = req.params;

          // Find the job that contains the provided ID in the applieduser array
          const job = await Jobapplyfromdata.find({ companyId: id });

          if (!job) {
              return res.status(404).json({ error: 'Job not found' });
          }
  
          res.status(200).json(job);

    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
})










module.exports = router
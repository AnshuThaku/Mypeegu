// update-lab-pin.js
const mongoose = require('mongoose');


const { Schools } = require('../models/database/myPeegu-school'); 


async function updateLabPins() {
  try {
   
    const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/mypeegu'; 
    
    await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to DB. Updating schools...");

    
    const result = await Schools.updateMany(
      { labPin: { $exists: false } }, 
      { $set: { labPin: '654321' } }
    );

    console.log(`Update Complete! Modified ${result.modifiedCount} schools.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateLabPins();
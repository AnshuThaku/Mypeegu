const mongoose = require('mongoose');

// Import required Mongoose models
// Note: Paths might need adjustment based on the exact directory structure of the models
const { Students: Student } = require('../../models/database/myPeegu-student'); 
const { BaselineRecord } = require('../../models/database/myPeegu-baseline');
const { StudentCheckList } = require('../../models/database/myPeegu-sendCheckList');
const { ObservationRecord: Observation } = require('../../models/database/myPeegu-observation');
const IEPRecord = require('../../models/database/myPeegu-iep-new');

class IEP360Service {
    /**
     * Retrieves the complete 360-degree profile for a student, 
     * aggregating data from multiple collections concurrently.
     * 
     * @param {string} studentId - The unique identifier for the student
     * @param {string} academicYear - The target academic year for the IEP record
     * @returns {Promise<Object>} Formatted dashboard profile payload
     */
    async getStudent360Profile(studentId, academicYear) {
        try {
            // 1. Check if the provided studentId is a valid Mongoose ObjectId structure
            let query = { user_id: studentId }; // Default to treating it as custom string ID like "abc-143"
            if (mongoose.Types.ObjectId.isValid(studentId)) {
                // If it's a valid 24 hex char string, search by either _id OR user_id just to be safe
                query = { $or: [{ _id: studentId }, { user_id: studentId }] };
            }

            // FIRST: Get the student so we can resolve their true MongoDB ObjectId
            // Removing strict .select() to grab whatever data actually exists on the document
            const studentDetails = await Student.findOne(query).lean();
            
            if (!studentDetails) {
                throw new Error(`Student not found for identifier: ${studentId}`);
            }

            // Extract the pure Mongoose ObjectId mapping
            const pureObjectId = studentDetails._id; 

            // 2. Execute 4 related MongoDB queries concurrently using Promise.all
            const [
                latestBaselineArray,
                checklistRecords,
                observationRecords,
                iepRecord
            ] = await Promise.all([
                // Fetch the most recent BaselineRecord (sorted by createdAt descending, limited to 1) 
                // Using $or here because Baseline sometimes saves student identifier in user_id OR studentId fields
                BaselineRecord.find({ $or: [{ studentId: pureObjectId }, { user_id: studentDetails.user_id }] }).sort({ createdAt: -1 }).limit(1).lean(),
                
                // Fetch all StudentCheckList records for this student using the strict pureObjectId
                StudentCheckList.find({ studentId: pureObjectId }).lean(),
                
                // Fetch all Observation records for this student
                Observation.find({ studentId: pureObjectId }).lean(),
                
                // Fetch the active IEPRecord for this student and given academic year
                IEPRecord.findOne({ studentId: pureObjectId, academicYear: academicYear }).lean()
            ]);

            // Safely extract the single latest baseline from the array returned by find()
            const latestBaseline = latestBaselineArray.length > 0 ? latestBaselineArray[0] : null;

            // 3. Format 'plopBaseline' by safely mapping the latest baseline data
           let plopBaseline = null;
            if (latestBaseline) {
                plopBaseline = {
                    baselineCategory: latestBaseline.baselineCategory || null,
                    overallTier: latestBaseline.overallTier || null, 
                    adjustedRisk: latestBaseline.adjustedRisk || 0,
                    strengthScore: latestBaseline.strengthScore || 0,
                    
                    // Mapping typical domain scores safely
                    domainScores: {
                        physical: latestBaseline.Physical?.total || null,
                        cognitive: latestBaseline.Cognitive?.total || null,
                        social: latestBaseline.Social?.total || null,
                        emotional: latestBaseline.Emotional?.total || null,
                        behavioral: latestBaseline.Behavioral?.total || null,
                        
                        // 🟢 YEH LINE ADD KARO (Asli Fix):
                        language: latestBaseline.Language?.total || latestBaseline.Verbal?.total || null
                    }
                };
            }

            // 4. Return the formatted and clearly keyed object
            return {
                studentProfile: studentDetails || null,
                plopBaseline: plopBaseline,
                checklistData: checklistRecords || [],
                observationData: observationRecords || [],
                iepData: iepRecord || null
            };

        } catch (error) {
            // Catch, log, and re-throw any database or mapping errors
            console.error(`Error fetching Student 360 Profile for ID ${studentId}:`, error);
            throw error;
        }
    }
}

// Export a singleton instance of the service
module.exports = new IEP360Service();
const Resignation = require('../models/Resignation');
const ExitQuestionnaire = require('../models/ExitQuestionnaire');
const Notification = require('../models/Notification');

/**
 * Get all resignations with employee details
 */
exports.getResignations = async (req, res) => {
    try {
        const resignations = await Resignation.find()
            .populate('employeeId', 'username email')
            .sort({ createdAt: -1 });
        
        res.json({ data: resignations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Process and conclude a resignation request
 * Updates resignation status and creates notification for employee
 */
exports.concludeResignation = async (req, res) => {
    try {
        const { resignationId, approved, lwd } = req.body;
        
        const resignation = await Resignation.findById(resignationId)
            .populate('employeeId', 'username email');
        
        if (!resignation) {
            return res.status(404).json({ message: 'Resignation not found' });
        }

        resignation.status = approved ? 'approved' : 'rejected';
        if (approved) {
            resignation.approvedLwd = new Date(lwd);
        }
        
        await resignation.save();

        // Create notification for employee
        await Notification.create({
            userId: resignation.employeeId._id,
            title: `Resignation ${approved ? 'Approved' : 'Rejected'}`,
            message: approved 
                ? `Your resignation has been approved. Last working day: ${lwd}`
                : 'Your resignation request has been rejected.'
        });

        res.json({ message: 'Resignation updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get all exit questionnaire responses with employee details
 */
exports.getExitResponses = async (req, res) => {
    try {
        const responses = await ExitQuestionnaire.find()
            .populate('employeeId', 'username')
            .sort({ submittedAt: -1 });
        
        res.json({ data: responses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
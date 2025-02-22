const Resignation = require('../models/Resignation');
const ExitQuestionnaire = require('../models/ExitQuestionnaire');
const Notification = require('../models/Notification');
const { checkHoliday } = require('../utils/holidayService');

exports.submitResignation = async (req, res) => {
  try {
    const { lwd } = req.body;
    const lastWorkingDay = new Date(lwd);
    
    // Check if LWD is a weekend
    const dayOfWeek = lastWorkingDay.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({ 
        message: 'Last working day cannot be on a weekend' 
      });
    }

    // Check if LWD is a holiday
    const isHoliday = await checkHoliday(lastWorkingDay);
    if (isHoliday) {
      return res.status(400).json({ 
        message: 'Last working day cannot be a holiday' 
      });
    }

    const resignation = await Resignation.create({
      employeeId: req.user._id,
      lwd: lastWorkingDay
    });

    res.json({ 
      data: { 
        resignation: { 
          _id: resignation._id 
        } 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResignationStatus = async (req, res) => {
  try {
    const resignation = await Resignation.findOne({ 
      employeeId: req.user._id 
    }).sort({ createdAt: -1 });

    res.json({ resignation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitExitQuestionnaire = async (req, res) => {
  try {
    const { responses } = req.body;
    
    await ExitQuestionnaire.create({
      employeeId: req.user._id,
      responses
    });

    res.json({ message: 'Exit questionnaire submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
      read: false
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


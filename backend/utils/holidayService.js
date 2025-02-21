const axios = require('axios');

const checkHoliday = async (date) => {
  try {
    const year = date.getFullYear();
    const country = 'US';

    const response = await axios.get(
      `https://calendarific.com/api/v2/holidays?api_key=${process.env.CALENDARIFIC_API_KEY}&country=${country}&year=${year}`
    );

    const holidays = response.data.response.holidays;
    const dateString = date.toISOString().split('T')[0];

    return holidays.some(holiday => holiday.date.iso === dateString);
  } catch (error) {
    console.error('Holiday check failed:', error);
    return false;
  }
};

module.exports = { checkHoliday };
const moment = require("moment")



const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function getPostedDate(postedAgo) {
    const currentDate = new Date(); // Get current date and time

    // Split the input string into parts like "10", "hours"
    const parts = postedAgo.split(' '); 
    const timeDifference = parseInt(parts[1]); // Get the numeric value (e.g., 10, 32)
    const unit = parts[2]; // Get the time unit (e.g., hours, minutes)

    // Adjust the current date based on the time difference
    switch(unit) {
        case 'minute':
        case 'minutes':
            currentDate.setMinutes(currentDate.getMinutes() - timeDifference);
            break;
        case 'hour':
        case 'hours':
            currentDate.setHours(currentDate.getHours() - timeDifference);
            break;
        case 'day':
        case 'days':
            currentDate.setDate(currentDate.getDate() - timeDifference);
            break;
        default:
            console.error('Invalid time unit');
            return null;
    }

    return moment(currentDate).format('MM-DD-YYYY');
}


module.exports= {
    sleep,
    getPostedDate
}
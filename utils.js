const moment = require("moment")



const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function getPostedDate(postedAgo) {
    console.log("Posted Date ", postedAgo)
    const currentDate = new Date(); // Get current date and time

    if(postedAgo.includes("yesterday")){
        return moment(currentDate.setDate(currentDate.getDate() - 1)).format('MM-DD-YYYY');
    }

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


// console.log(getPostedDate("Posted 4 days ago"))


module.exports= {
    sleep,
    getPostedDate
}
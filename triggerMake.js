const axios = require('axios');

// Replace with your Make.com Webhook URL
const webhookURL = 'https://hook.us1.make.com/lba4d5m3enerkqntjvvhekbktcnia3if';

// Data to send to the webhook, including an array


// Function to trigger the webhook
async function triggerMakeWebhook(jobs) {

    const data = {
        title: 'These are jobs',
        jobs:jobs,
        batch_date: '2024-08-20'
    };
    try {
        const response = await axios.post(webhookURL, data);
        console.log('Webhook triggered successfully:', response.status);
    } catch (error) {
        console.error('Error triggering webhook:', error);
    }
}

// Call the function
module.exports = {triggerMakeWebhook}
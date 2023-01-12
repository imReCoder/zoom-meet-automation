const baseUrl = "https://api.whatsspot.in/api";
const axios = require('axios');
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRJZCI6IjYyNmZhMzgzNmE2MmZiMmVmZDRlODEwMSIsInVzZXJJZCI6IjYyNmZhMzgzNmE2MmZiMmVmZDRlODEwMiIsImRldmljZUlkIjoiNjI2ZmEzYjA2YTYyZmIyZWZkNGU4MTAzIiwiaWF0IjoxNjY3NjU3MTQyfQ.00h_CHjdU6VOP5iqoh4BmetHJiezMCosursxjrH4-RU";

const sendMessage = async (message, to) => {
    try {

        const options = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_TOKEN}`
            }
        }
        const url = baseUrl + "/message/text";
        const body = {
            numbers: to,
            message: {
                text: message
            },
        }

        const res = await axios.post(url, body, options);
        console.log("Message sent successfully ", res.data);

    } catch (e) {
        console.log("Error occurred while sending message ", e);
    }
}
module.exports = {
    sendMessage
}
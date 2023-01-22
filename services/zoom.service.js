const { Browser, ZoomPage } = require('./zoom-page.service');
const moment = require('moment');
const { dayToNumber } = require('../utils/utils');
const cronJob = require('cron').CronJob;

const zoomPages = [];



const joinZoomMeeting = (userInfo, url, meeting) => {
    try {
        console.log("Joining meeting ", meeting.name);

        let page = new ZoomPage(userInfo, url + "#success", meeting);
        const endTime = meeting.endTime;
        const endTime24 = moment(endTime, ["h:mm A"]).format("HH:mm");
        const [endHour, endMinute] = endTime24.split(":");
        const cronTime = `${endMinute} ${endHour} * * ${dayToNumber(meeting.day)} `;
        console.log("Meeting scheduled to end at: ", cronTime, " for meeting: ", meeting.name);
        const job = new cronJob(cronTime, () => {
            console.log("Ending meeting: ", meeting);
            page.endMeeting();
            page = null;
        })
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = { joinZoomMeeting }

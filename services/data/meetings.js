const { dayToNumber } = require('../../utils/utils');
const { joinZoomMeeting } = require('../zoom.service');

const cronJob = require('cron').CronJob;
// const dayJs = require('dayjs');
const moment = require('moment');
const { config } = require('../../config/config');

const RANJIT = {
    INFO: {
        Name: 'Ranjit Kumar Pandit',
        Email: "190303105129@paruluniversity.ac.in",
        En: "190303105129",
        EmailP: "ranjitkumar448@yahoo.com",
        Phone: "7984545163"
    },
    // INFO: {
    //     Name: '190303115291_Krunal Patel',
    //     Email: "190303115291@paruluniversity.ac.in",
    //     En: "190303115291",
    //     EmailP: "krunalpatel489@yahoo.com",
    //     Phone: "8989767890"
    // },
    MEETINGS: [
        {
            name: "Python",
            zoomUrl: "https://zoom.us/j/9062747139?pwd=eTJRZjNsU0E1dHpDRCtaTHhMRm9DZz09",
            sendScore: true,
            schedules: [
                {
                    day: "Wednesday",
                    startTime: "12:45 PM",
                    endTime: "02:15 PM"
                },
                {
                    day: "Thursday",
                    startTime: "09:45 AM",
                    endTime: "12:45 PM",

                },
                {
                    day: "Friday",
                    startTime: "02:45 PM",
                    endTime: "04:45 PM"
                }
            ]
        },
        {
            name: "Machine Learning",
            sendScore: false,
            zoomUrl: "https://zoom.us/j/9751091159?pwd=U09udlJLWDlPSnM5SDhCdSsvVm5uUT09",
            schedules: [
                {
                    day: "Monday",
                    startTime: "07:00 AM",
                    endTime: "09:00 AM"
                },
                {
                    day: "Tuesday",
                    startTime: "07:30 PM",
                    endTime: "09:30 PM"
                },
                {
                    day: "Sunday",
                    startTime: "08:00 AM",
                    endTime: "09:00 AM"
                }
            ]
        },
        {
            name: "Testing",
            sendScore: true,
            zoomUrl: "https://zoom.us/j/88462470049?pwd=ZFhtb2p2Z0tNa2ZpNlEvR3NrTVhyQT09",
            schedules: [
                {
                    day: "Friday",
                    startTime: "04:55 PM",
                    endTime: "04:45 PM",
                    now: true
                }
            ]
        }
    ]
}


// schedule cron job 

const scheduleMeetings = (person) => {
    const info = person.INFO;
    const meetings = person.MEETINGS;
    for (let i = 0; i < meetings.length; i++) {
        const meeting = meetings[i];
        const schedules = meeting.schedules;
        for (let j = 0; j < schedules.length; j++) {
            const schedule = schedules[j];
            const { day, startTime, endTime } = schedule;
            // convert AM PM to 24 hour format
            const startTime24 = moment(startTime, ["h:mm A"]).add(config.meetingJoinDelayInMinutes, 'minutes').format("HH:mm");
            let [startHour, startMinute] = startTime24.split(":");
            const endTime24 = moment(endTime, ["h:mm A"]).format("HH:mm");
            if (meeting.now) {
                //    start hour and minute is after 1 minute
                startHour = moment().add(1, 'minutes').format('HH');
                startMinute = moment().add(1, 'minutes').format('mm');
            }
            const cronTime = `${startMinute} ${startHour} * * ${dayToNumber(day)} `;
            console.log("Meeting scheduled at: ", cronTime, " for meeting: ", meeting.name);

            const job = new cronJob(cronTime, () => {
                console.log("Joining meeting: ", meeting);
                joinZoomMeeting(info, meeting.zoomUrl, meeting);
            }, null, true, 'Asia/Kolkata');
        }
    }
}

scheduleMeetings(RANJIT);

module.exports = {
    RANJIT
}
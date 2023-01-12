const { launchBrowser } = require("../services/zoom-page.service");
const { joinZoomMeeting } = require("../services/zoom.service");
const { responseHandler } = require("../utils/utils");

exports.getUser = async (req, res, next) => {
   const body = "success";
    responseHandler(res,body);
}

exports.joinMeeting = async (req, res, next) => {
    const body = "Join Success";
    await launchBrowser();
    const userInfo = {
        _id: "fdas89fdas",
        name: "Shubham"
    }
    await joinZoomMeeting(userInfo, 'https://zoom.us/j/9062747139?pwd=eTJRZjNsU0E1dHpDRCtaTHhMRm9DZz09');
    responseHandler(res, body);
}

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
        name: "Ranjit Kumar"
    }
    await joinZoomMeeting(userInfo, 'https://zoom.us/j/85107504501?pwd=d0tNTHl2RmNMUHc0WDE5b3hyM0R0dz09');
    responseHandler(res, body);
}

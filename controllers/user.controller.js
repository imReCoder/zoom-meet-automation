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
    await joinZoomMeeting(userInfo, 'https://zoom.us/j/87025107487?pwd=VDBqYW9VS0sxbXRCU0F5SmtaYVB2dz09');
    responseHandler(res, body);
}

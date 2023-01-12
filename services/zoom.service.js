const { Browser, ZoomPage } = require('./zoom-page.service');
const zoomPages = [];



const joinZoomMeeting = (userInfo, url, meeting) => {
    try {
        const page = new ZoomPage(userInfo, url + "#success", meeting);
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = { joinZoomMeeting }

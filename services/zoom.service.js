const { Browser, ZoomPage } = require('./zoom-page.service');
const zoomPages = [];



const joinZoomMeeting = (userInfo, url) => {
    try {
        const page = new ZoomPage(userInfo, url + "#success");
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = { joinZoomMeeting }

const { Browser, ZoomPage } = require('./zoom-page.service');
const zoomPages = [];



exports.joinZoomMeeting = (userInfo, url) => {
    try {
        const page = new ZoomPage(userInfo, url + "#success");
    }
    catch (e) {
        console.log(e);
    }
}


import {Browser,ZoomPage} from './zoom-page.service.js';
const zoomPages = [];



export const joinZoomMeeting = (userInfo,url)=>{
    try {
        const page = new ZoomPage(userInfo, url + "#success");
    }
    catch (e) {
        console.log(e);
    }
}


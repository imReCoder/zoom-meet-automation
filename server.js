import {app} from './app.js'
import { launchBrowser } from './services/zoom-page.service.js';
import { joinZoomMeeting } from './services/zoom.service.js';
const PORT =3000;






app.listen(PORT,async ()=>{
    console.log("App listening at port:"+PORT);
    // await launchBrowser();
    // const userInfo = {
    //     _id:"fdas89fdas",
    //     name:"Ranjit Kumar"
    // }
    // joinZoomMeeting(userInfo,'https://zoom.us/j/84235068051?pwd=TDBFYkJwL2djaEI1MzRaVERvMDRtdz09');
    })

process.on('unCaughtException',(e)=>{
    console.log("Uncaught Exception Occcured ",e);
})
const { app } = require('./app');
const { launchBrowser } = require('./services/zoom-page.service');
const { joinZoomMeeting } = require('./services/zoom.service');
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
const { app } = require('./app');
const { launchBrowser } = require('./services/zoom-page.service');
const { joinZoomMeeting } = require('./services/zoom.service');
const PORT =3000;


app.listen(PORT,async ()=>{
    console.log("App listening at port:"+PORT);

    })

process.on('unCaughtException',(e)=>{
    console.log("Uncaught Exception Occcured ",e);
})
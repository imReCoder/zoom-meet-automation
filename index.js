const { app } = require('./app');
const { COMMON_ANSWERS } = require('./services/data/answers');
const { fillGForm } = require('./services/gform');
const { sendMessage } = require('./services/wa');
const { launchBrowser } = require('./services/zoom-page.service');
const { joinZoomMeeting } = require('./services/zoom.service');
const PORT =3000;


app.listen(PORT,async ()=>{
    console.log("App listening at port:"+PORT);
    const formLink = 'https://docs.google.com/forms/d/e/1FAIpQLScYAjRHvC-Vpk7PZ024S5bwsYvKQQRPQWJAUBmM_mmaZi13tw/viewform';
    // const formLink = "https://docs.google.com/forms/d/e/1FAIpQLSf_HwDrQBivEirlRIgrteLsqpFpE_B-ldb8JTEdMOhxx48xmA/viewform"
    // const result = await fillGForm(formLink, true);
    // console.log("final result is ", result);
    // await sendMessage(JSON.stringify(result, null, 2), `+91${COMMON_ANSWERS.Phone}`);
})

process.on('unCaughtException', (e) => {
    console.log("Uncaught Exception Occcured ", e);
})
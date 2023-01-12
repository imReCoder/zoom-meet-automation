const { app } = require('./app');
const { RANJIT } = require('./services/data/meetings');
const { fillGForm } = require('./services/gform');
const { sendMessage } = require('./services/wa');
const { launchBrowser } = require('./services/zoom-page.service');
const PORT =3000;


app.listen(PORT,async ()=>{
    console.log("App listening at port:"+PORT);
    const formLink = 'https://forms.gle/skNT14iVhMLddB8z8';
    // // const formLink = "https://docs.google.com/forms/d/e/1FAIpQLSf_HwDrQBivEirlRIgrteLsqpFpE_B-ldb8JTEdMOhxx48xmA/viewform"
    // const result = await fillGForm(formLink, RANJIT.INFO, true);
    // console.log("final result is ", result);
    // await sendMessage(JSON.stringify(result, null, 2), `+91${RANJIT.INFO.Phone}`);
    await launchBrowser();

})

process.on('unCaughtException', (e) => {
    console.log("Uncaught Exception Occcured ", e);
})
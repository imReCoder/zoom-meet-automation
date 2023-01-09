const puppeteer = require('puppeteer-core');
const { config } = require('../config/config');
const chrome = require('chrome-aws-lambda');

let Browser;
const LAUNCH_BUTTON = '#zoom-ui-frame > div.bhauZU7H > div > div.ifP196ZE.x2RD4pnS > div'; 
const JOIN_FROM_BROWSER ="#zoom-ui-frame > div.bhauZU7H > div > div.pUmU_FLW > h3:nth-child(2) > span > a";
const DOWNLOAD_ZOOM = "#zoom-ui-frame > div.bhauZU7H > div > div.pUmU_FLW > h3 > a";
const NAME_INPUT = "#inputname"
const JOIN_BUTTON="#joinBtn";
const FINAL_JOIN="#root > div > div.preview > button";
const OPEN_CHAT ="#foot-bar > div.footer__btns-container > div:nth-child(3)";
const CHAT_BOX = "#chat-list-content > div";
const CHAT_ITEM = "#chat-item-container-";
const CHAT_ITEM_MESSAGE = ".chat-message__text-box"


const IS_DEBUG = true;
const launchBrowser = async () => {
  Browser = await chrome.puppeteer.launch({
      args: chrome.args,
      headless: chrome.headless,
    });
    return Browser;
}

class ZoomPage{
     chatCount = 0;
    
    constructor(userInfo,url){
       this.zoomUrl = url;
       this.userInfo =userInfo;
       this.launchNewPage();
      console.log("New meeting started..")
    }

    async launchNewPage(){
        console.log("Launching new page with url ",this.zoomUrl);
        this.page = await Browser.newPage();
        
        const client = await this.page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow', downloadPath: './downloads/'
        });
        await this.page.setViewport({
            width:config.viewPortWidth,
            height:config.viewPortHeight,  
            
        })
       
        await this.page.goto(this.zoomUrl);
     
        if(IS_DEBUG)console.log("Navigation Completed...");
        //launch button class mbTuDeF1
        await this.page.waitForSelector(DOWNLOAD_ZOOM);
        if(IS_DEBUG)console.log("Download button found...");
        
        await this.page.click(DOWNLOAD_ZOOM)
        if(IS_DEBUG)console.log("Download Button Clicked...");

        await this.page.waitForSelector(JOIN_FROM_BROWSER);
        if(IS_DEBUG)console.log("Join from browser button found..")
        await this.page.click(JOIN_FROM_BROWSER);

        await this.page.waitForSelector(NAME_INPUT);
        if(IS_DEBUG)console.log("Enter name input found..")
        await this.page.$eval(NAME_INPUT, (el, value) => el.value = value, this.userInfo.name);
        await this.page.waitForSelector(JOIN_BUTTON);
        await this.delay(config.defaultDelay);
        await this.page.click(JOIN_BUTTON);

          console.log("Meeting join clicked success")
          await this.page.waitForSelector(FINAL_JOIN);
          if(IS_DEBUG)console.log("Final Join  button found..")
          await this.page.click(FINAL_JOIN);
          await this.page.waitForSelector(OPEN_CHAT);
          await this.delay(config.defaultDelay);
          await this.page.click(OPEN_CHAT);

          if(IS_DEBUG)console.log("Chatbox clicked..");
        //   await this.page.waitForSelector(CHAT_BOX,{visible:true});
          if(IS_DEBUG)console.log("Chat box found..");
          this.monitor(CHAT_ITEM, async el => {
            let element = await this.page.$(CHAT_ITEM+this.chatCount+" "+CHAT_ITEM_MESSAGE);

            this.chatCount++;
            let chat = await this.page.evaluate(el => el?.textContent, element)
            console.log("New chat ",chat);
          })
    }

    async  monitor(selector, callback) {
        if(IS_DEBUG)console.log("checking for chat ",selector+this.chatCount);
        const ele = await this.page.$(selector+this.chatCount);
      
        if (ele) {
          callback(ele);
        }
        /* add some delay */
        await this.delay(config.chatReadDelay);
        /* call recursively */
        this.monitor (selector, callback);
      }

      async delay(ms){
        console.log(ms+" delay..")
        return new Promise(_ => setTimeout(_, ms))
      }

   
}
module.exports = { Browser, ZoomPage, launchBrowser };
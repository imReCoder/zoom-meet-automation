// const puppeteer = require('puppeteer-core');
const { config } = require('../config/config');
// const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');
const { sendMessage } = require('./wa');
const { COMMON_ANSWERS } = require('./data/answers');
const { fillGForm } = require('./gform');
const { delay } = require('../utils/utils');
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
const LEAVE_BUTTON = "button.footer__leave-btn"
const CHAT_INPUT = "textarea.chat-box__chat-textarea"

const IS_DEBUG = true;
const NOT_STARTED = "//h4[contains(text(), 'The meeting has not started')]";

const launchBrowser = async () => {
  // const executablePath = await chrome.executablePath

  Browser = await puppeteer.launch({
    // executablePath,
    // args: chrome.args,
    // headless: chrome.headless,
    headless: config.headless,
    });
    return Browser;
}

class ZoomPage{
     chatCount = 0;
  failedCount = 0;
  maxFailure = 5;
  monitorChat = true;
  constructor(userInfo, url, meeting) {
       this.zoomUrl = url;
       this.userInfo =userInfo;
    this.meeting = meeting;
       this.launchNewPage();
      console.log("New meeting started..")
    }

    async launchNewPage(){
      try {
        console.log("Launching new page with url ",this.zoomUrl);
        await sendMessage("Trying to join meeting " + new Date() + "\n" + this.zoomUrl, `+91${this.userInfo.Phone}`);
        this.page = await Browser.newPage();
        
        const client = await this.page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow', downloadPath: './downloads/'
        });
        await this.page.setViewport({
            width:config.viewPortWidth,
            height:config.viewPortHeight,  
            
        })
       
        await this.page.goto(this.zoomUrl, { waitUntil: 'networkidle2' });
        // await waitForMeetingToStart(this.page);
        if(IS_DEBUG)console.log("Navigation Completed...");
        await dealy(5000);
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
        await this.page.$eval(NAME_INPUT, (el, value) => el.value = value, this.userInfo.En + "_" + this.userInfo.Name);
        await this.page.waitForSelector(JOIN_BUTTON);
        await this.delay(config.defaultDelay);
        await this.page.click(JOIN_BUTTON);
      await this.page.waitForNavigation();
      if (IS_DEBUG) console.log("Meeting join clicked success")
        await this.delay(5000);
        const res = await openChatOrJoinFInal(this.page);
        if (res && res.type == "chat") {
          if (IS_DEBUG) console.log("Chat box found..");
          await this.page.click(OPEN_CHAT);
          if (IS_DEBUG) console.log("Chatbox clicked..");

        } else {
          if(IS_DEBUG)console.log("Final Join  button found..")
          await this.page.click(FINAL_JOIN);
          await waitForElement(this.page, OPEN_CHAT, "Open Chat");
          await this.page.click(OPEN_CHAT);
          if (IS_DEBUG) console.log("Chatbox clicked..");
        }


        // await waitForElement(this.page, FINAL_JOIN, "Final Join");
        // await waitForElement(this.page, OPEN_CHAT, "Open Chat");

        //   await this.page.waitForSelector(CHAT_BOX,{visible:true});
        const LeaveBtn = await this.page.$(LEAVE_BUTTON);
        await sendMessage('Meeting joined successfully ' + new Date(), `+91${this.userInfo.Phone}`);
          this.monitor(CHAT_ITEM, async el => {
            let element = await this.page.$(CHAT_ITEM + this.chatCount + " " + CHAT_ITEM_MESSAGE);
            this.chatCount++;
            let chat = await this.page.evaluate(el => el?.textContent, element);
            console.log("New chat ",chat);

            if (chat && (chat.includes("docs.google.com") || chat.includes("forms.gle"))) {
              console.log("Google Doc link found in chat ", chat);
              await sendMessage(this.meeting.name + "==> Google Doc link found in chat :" + new Date() + "\n" + chat, `+91${this.userInfo.Phone}`);
              const result = await fillGForm(chat.trim(), this.userInfo, true);
              // send result to user
              await sendMessage(JSON.stringify(result, null, 2), `+91${this.userInfo.Phone}`);
              if (result.score) {
                console.log("Gform filled, score ", result.score);
                if (this.meeting.sendScore) {
                  const chatInputBox = await this.page.$(CHAT_INPUT);
                  if (chatInputBox) {
                    if (IS_DEBUG) console.log("Chat input box found..");
                    let score = result.score.charAt(0);
                    await chatInputBox.click();
                    if (parseInt(score) == 0) {
                      score = "1";
                    }
                    await chatInputBox.type(score);
                    await this.page.keyboard.press('Enter');
                    await this.delay(3000);
                  }
                }
              }
              if (LeaveBtn) {
                await LeaveBtn.click();
                await this.delay(5000);
              }
              await this.page.close();
              this.monitorChat = false;
            }
          })
      } catch (e) {
        console.log("Error in launch new page ", e);
        this.failedCount++;
        if (this.failedCount < this.maxFailure) {
          // wait for 2 min
          await this.delay(120000);
          await this.launchNewPage();
        } else {
          await sendMessage(this.meeting.name + ":: Failed to join meeting " + new Date() + "\n" + this.zoomUrl + "\n" + e.message, `+91${this.userInfo.Phone}`);
        }
      }
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
      if (this.monitorChat) {
        this.monitor(selector, callback);
      }
    }

      async delay(ms){
        console.log(ms+" delay..")
        return new Promise(_ => setTimeout(_, ms))
      }

   
}

const openChatOrJoinFInal = async (page) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      console.log("Waiting for chat or final join");
      const chat = await page.$(OPEN_CHAT);
      const finalJoin = await page.$(FINAL_JOIN);
      if (chat || finalJoin) {
        clearInterval(interval);
        if (chat) {
          resolve({ type: "chat" })
        } else if (finalJoin) {
          resolve({ type: "finalJoin" })
        }
      }
    }, 10000)
  })
}

async function waitForElement(page, selector, desc) {
  return new Promise((resolve, reject) => {
    // keep checking for the element until it is found
    const interval = setInterval(async () => {
      console.log("Waiting for ", desc);
      if (await page.$(selector)) {
        clearInterval(interval);
        resolve();
      }
    }, 10000)
  })
}

const waitForMeetingToStart = async (page) => {
  const meetingNotStarted = await page.$x(NOT_STARTED);
  if (meetingNotStarted) {
    console.log("Meeting not started yet..");
    await delay(10000);
    return await waitForMeetingToStart(page);
  }
  console.log("Meeting started..");
}
module.exports = { Browser, ZoomPage, launchBrowser };
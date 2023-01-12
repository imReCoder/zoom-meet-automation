'use strict';

const { Browser } = require("./zoom-page.service");
// const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');
const { config } = require("../config/config");
const { delay } = require("../utils/utils");
const { handleTextQuestion, handleOptionQuestion } = require("./data/answers");

const INPUT_CONTAINERS = ".Qr7Oae"
const SUBMIT_BUTTON = "//span[contains(text(), 'Submit')]";
const VIEW_SCORE = "//span[contains(text(), 'View score')]";
const SCORE = ".nkOYNd";

const QnA = [];

const INPUT_TYPES = {
    TEXT: "TEXT",
    DROPDOWN: "DROPDOWN",
    MCQ: "MCQ",
    CHECK: "CHECK",
    TEXTAREA: "TEXTAREA"
}

const inputTypes = {
    TEXT: {
        selector: "input[type=text]",
        question: "div[role=heading]"
    },
    DROPDOWN: {
        selector: "div[role=listbox]",
        question: "div[role=heading]"

    },
    MCQ: {
        selector: "div[role=radiogroup] .nWQGrd",
        question: "div[role=heading]"

    },
    CHECK: {
        selector: "div[role=checkbox]",
        question: "div[role=heading]"

    },
    TEXTAREA: {
        selector: "textarea",
        question: "div[role=heading]"


    }
}

const launchBrowser = async () => {
    // const executablePath = await chrome.executablePath;
    let b = await puppeteer.launch({
        headless: false,

    });

    return b;
}

const getInputType = async (inputContainer) => {
    if (await inputContainer.$(inputTypes.TEXT.selector)) {
        return INPUT_TYPES.TEXT;
    } else if (await inputContainer.$(inputTypes.DROPDOWN.selector)) {
        return INPUT_TYPES.DROPDOWN;
    } else if (await inputContainer.$(inputTypes.MCQ.selector)) {
        return INPUT_TYPES.MCQ;
    } else if (await inputContainer.$(inputTypes.CHECK.selector)) {
        return INPUT_TYPES.CHECK;
    } else if (await inputContainer.$(inputTypes.TEXTAREA.selector)) {
        return INPUT_TYPES.TEXTAREA;
    }
    else {
        return null;
    }
}

async function fillGForm(formLink, userInfo, submitForm) {
    let B = Browser;
    return new Promise(async (resolve) => {
        if (!B) {
            console.log("Browser not initialized..")
            B = await launchBrowser();
        }


        try {

            const page = await B.newPage();
            console.log("Opening form link...");
            await page.setViewport({
                width: config.viewPortWidth,
                height: config.viewPortHeight,

            })
            // Opening Form
            await page.goto(formLink, { waitUntil: 'networkidle2' });
            const title = await page.$eval("title", el => el.textContent);
            console.log("form opened");
            console.log("Form Title: " + title);
            const r = await waitForFormToOpen(page);
            if (!r) {
                return resolve({ success: false, message: "Form not opened" });
            }
            const inputContainers = await page.$$(INPUT_CONTAINERS);
            console.log("Input Containers: ", inputContainers);

            for (let i = 0; i < inputContainers.length; i++) {
                try {

                    const inputContainer = inputContainers[i];
                    await scrollIntoView(page, inputContainer);
                    await delay(config.inputDelay);
                    const inputType = await getInputType(inputContainer);
                    console.log("Input Type: ", inputType);
                    if (inputType === INPUT_TYPES.TEXT) {
                        const input = await inputContainer.$(inputTypes.TEXT.selector);
                        const inputQuestion = await inputContainer.$eval(inputTypes.TEXT.question, el => el.textContent);
                        console.log("Input Question: ", inputQuestion);
                        await input.click();
                        await delay(config.inputDelay);
                        const answer = await handleTextQuestion(inputQuestion, userInfo);
                        console.log("Answer: ", answer);
                        await input.type(answer);
                        await delay(config.inputDelay);
                        QnA.push({ question: inputQuestion, answer });
                    } else if (inputType === INPUT_TYPES.DROPDOWN) {
                        const input = await inputContainer.$(inputTypes.DROPDOWN.selector);
                        const inputQuestion = await inputContainer.$eval(inputTypes.DROPDOWN.question, el => el.textContent);
                        console.log("Input Question: ", inputQuestion);
                        await delay(config.inputDelay);
                        await input.click();
                        await delay(config.inputDelay);
                        const dropdownOptions = await inputContainer.$$("div[role=option]");
                        console.log("Dropdown Options: ", dropdownOptions.length);
                        const options = [];
                        for (let j = 0; j < dropdownOptions.length; j++) {
                            const dropdownOption = dropdownOptions[j];
                            if (j === 0) {
                                continue;
                            }
                            const dropdownOptionText = await dropdownOption.$eval("span", el => el.textContent);
                            console.log("Dropdown Option text: ", dropdownOptionText)
                            // match question answer with dropdown option
                            options.push(dropdownOptionText);
                        }
                        const optionIndex = await handleOptionQuestion(inputQuestion, options, userInfo);
                        console.log("Answer: ", options[optionIndex]);
                        const option = await inputContainer.$(`div[role=option][data-value="${options[optionIndex]}"]`);
                        console.log("Option: ", option);
                        await delay(config.inputDelay);
                        await option.click();
                        QnA.push({ question: inputQuestion, answer: options[optionIndex], options });

                    } else if (inputType === INPUT_TYPES.MCQ) {
                        const input = await inputContainer.$(inputTypes.MCQ.selector);
                        const inputQuestion = await inputContainer.$eval(inputTypes.MCQ.question, el => el.textContent);
                        console.log("Input Question: ", inputQuestion);
                        // await input.click();
                        await delay(config.inputDelay);
                        const mcqOptions = await inputContainer.$$("div[role=radio");
                        const mcqOptionsText = await inputContainer.$$("label");
                        const options = [];
                        console.log("MCQ Options: ", mcqOptions.length);
                        for (let j = 0; j < mcqOptions.length; j++) {
                            const mcqOption = mcqOptions[j];
                            // const mcqOptionText = await mcqOption.$eval("span", el => el.textContent);
                            const mcqOptionText = await mcqOptionsText[j].$eval("span", el => el.textContent);
                            console.log("MCQ Option text: ", mcqOptionText)
                            options.push(mcqOptionText);
                        }
                        const optionIndex = await handleOptionQuestion(inputQuestion, options, userInfo);
                        console.log("Answer: ", options[optionIndex]);
                        const option = await inputContainer.$(`div[role=radio][data-value="${options[optionIndex]}"]`);
                        await option.click();
                        QnA.push({ question: inputQuestion, answer: options[optionIndex], options });

                    } else if (inputType === INPUT_TYPES.TEXTAREA) {
                        const input = await inputContainer.$(inputTypes.TEXTAREA.selector);
                        const inputQuestion = await inputContainer.$eval(inputTypes.TEXTAREA.question, el => el.textContent);
                        console.log("Input Question: ", inputQuestion);
                        await input.click();
                        await delay(config.inputDelay);
                        const answer = await handleTextQuestion(inputQuestion, userInfo);
                        console.log("Answer: ", answer);
                        await input.type(answer);
                        await delay(config.inputDelay);
                        QnA.push({ question: inputQuestion, answer });

                    } else if (inputType === INPUT_TYPES.CHECK) {
                        const input = await inputContainer.$(inputTypes.CHECK.selector);
                        const inputQuestion = await inputContainer.$eval(inputTypes.CHECK.question, el => el.textContent);
                        console.log("Input Question: ", inputQuestion);
                        const checkBoxOptions = await inputContainer.$$("div[role=checkbox");
                        const checkBoxOptionsText = await inputContainer.$$("label");

                        const options = [];
                        for (let j = 0; j < checkBoxOptions.length; j++) {
                            const checkBoxOption = checkBoxOptions[j];
                            const checkBoxOptionText = await checkBoxOptionsText[j].$eval("span", el => el.textContent);
                            console.log("Checkbox Option text: ", checkBoxOptionText)
                            options.push(checkBoxOptionText);
                        }
                        const optionIndex = await handleOptionQuestion(inputQuestion, options, userInfo);
                        console.log("Answer: ", options[optionIndex]);
                        const option = await inputContainer.$(`div[role=checkbox][data-answer-value="${options[optionIndex]}"]`);
                        await option.click();
                        QnA.push({ question: inputQuestion, answer: options[optionIndex], options });

                    }
                    else {
                        console.log("Input type not supported");
                    }
                    console.log("----------------------------------------------------------");

                    await delay(config.inputDelay);
                } catch (e) {
                    console.log("error at input index " + i);
                }
            }
            // To answer questions, first identify selectors of all similar questions type
            // then use the selector index to select the question
            // then perform an action to answer the question,
            // e.g. click or type an answer



            // Form Submission
            if (submitForm) {
                const submitButtonSpan = await page.$x(SUBMIT_BUTTON);
                const submitButton = await submitButtonSpan[0].getProperty('parentNode');
                console.log("Submitting Form ", submitButton);
                await submitButton.click();
                await page.waitForNavigation();
                await delay(3000);
                const submissionPage = await page.url();
                console.log("submited url: ", submissionPage);
                if (submissionPage.includes("formResponse")) {
                    console.log("Form Submitted Successfully");
                    const viewScoreSpan = await page.$x(VIEW_SCORE);

                    if (viewScoreSpan.length > 0) {
                        const viewScore = await viewScoreSpan[0].getProperty('parentNode');
                        if (viewScore) {
                            const v = await viewScore.getProperty('parentNode');
                            console.log("View Score ", viewScore);
                            const viewScoreLink = await page.evaluate((el) => el.getAttribute('href'), v);
                            console.log(viewScoreLink);
                            const scorePage = await B.newPage();
                            await scorePage.goto(viewScoreLink);
                            await scorePage.waitForNavigation();
                            page.close();
                            await delay(2000);

                            const scoreEl = await scorePage.$$(SCORE);
                            let value = await scorePage.evaluate(el => el.textContent, scoreEl[0])

                            console.log("score  ", value);
                            return resolve({ success: true, QnA, score: value, scoreLink: viewScoreLink })
                                ;
                        }
                    }


                }
            }

            await page.close();
            await B.close();
            resolve({ success: true, QnA })

        } catch (error) {

            console.error(error.message);
            resolve({ error: error.message, success: false })
        }


    })
}

const waitForFormToOpen = (page) => {
    return new Promise((resolve, reject) => {
        console.log("Waiting for form to open...");
        const waitStartTime = Date.now();
        const interval = setInterval(async () => {
            // wait time 3 hour
            const waitTime = 3 * 60 * 60 * 1000;
            // check if wait is more then 1 hour
            if (Date.now() - waitStartTime > waitTime) {
                clearInterval(interval);
                console.log("Form not opened max wait reached");
                resolve(false);
            }
            const inputContainers = await page.$$(INPUT_CONTAINERS);
            if (inputContainers.length > 0) {
                clearInterval(interval);
                resolve(true);
            }
        }, 1000);
    })
}

async function scrollIntoView(page, el) {
    return await page.evaluate((element) => { element.scrollIntoView(); }, el);
}
module.exports = { fillGForm }
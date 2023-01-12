// Python form reference
// https://docs.google.com/forms/d/e/1FAIpQLSe4plTIdtcVC1qFShX6p9O2KuuYo2WQumf2jkZbyTrVeqD5Hg/viewscore?viewscore=AE0zAgDQBuFVCIWDo-x2YdZU9ubxWHf5aLzKdlqQkSf5Uc2hdr5LzHEV-LE8b4J6_HHqWNg

const COMMON_ANSWERS = {
    Name: 'Ranjit Kumar Pandit',
    Email: "190303105129@paruluniversity.ac.in",
    En: "190303105129",
    EmailP: "ranjitkumar448@yahoo.com",
    Phone: "7984545163"

}

const handleTextQuestion = (question, userInfo) => {
    const questionText = question.toLowerCase();
    if (questionText.includes('name')) {
        return userInfo.Name;
    } else if (questionText.includes('email')) {
        return userInfo.Email;
    } else if (questionText.includes('enrollment') || questionText.includes('roll') || questionText.includes('enroll')) {
        return userInfo.En;
    } else if (questionText.includes('phone')) {
        return userInfo.Phone;
    } else if (questionText.includes('email') && questionText.includes('private')) {
        return userInfo.EmailP;
    } else {
        return "...";
    }
}

const handleOptionQuestion = async (question, options, userInfo) => {
    // handle common question
    if (question.includes('name')) {
        //    find option with name
        const matchingOptionIndex = options.findIndex(option => option.toLowerCase().includes(userInfo.Name));
        if (matchingOptionIndex !== -1) {
            return matchingOptionIndex;
        } else {
            // return random option
            return Math.floor(Math.random() * options.length);
        }
    } else if (question.includes('email')) {
        const matchingOptionIndex = options.findIndex(option => option.toLowerCase().includes(userInfo.Email));
        if (matchingOptionIndex !== -1) {
            return matchingOptionIndex;
        } else {
            return Math.floor(Math.random() * options.length);
        }
    } else if (question.includes('enrollment') || question.includes('roll') || question.includes('enroll')) {
        const matchingOptionIndex = options.findIndex(option => option.toLowerCase().includes(userInfo.En));
        if (matchingOptionIndex !== -1) {
            return matchingOptionIndex;
        } else {
            return Math.floor(Math.random() * options.length);
        }
    } else if (question.includes('phone')) {
        const matchingOptionIndex = options.findIndex(option => option.toLowerCase().includes(userInfo.Phone));
        if (matchingOptionIndex !== -1) {
            return matchingOptionIndex;
        } else {
            return Math.floor(Math.random() * options.length);
        }
    } else if (question.includes('email') && question.includes('private')) {
        const matchingOptionIndex = options.findIndex(option => option.toLowerCase().includes(userInfo.EmailP));
        if (matchingOptionIndex !== -1) {
            return matchingOptionIndex;
        } else {
            return Math.floor(Math.random() * options.length);
        }
    } else {
        return Math.floor(Math.random() * options.length);
    }
}

module.exports = {
    handleOptionQuestion,
    handleTextQuestion
}
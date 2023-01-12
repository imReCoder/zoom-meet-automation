// Python form reference
// https://docs.google.com/forms/d/e/1FAIpQLSe4plTIdtcVC1qFShX6p9O2KuuYo2WQumf2jkZbyTrVeqD5Hg/viewscore?viewscore=AE0zAgDQBuFVCIWDo-x2YdZU9ubxWHf5aLzKdlqQkSf5Uc2hdr5LzHEV-LE8b4J6_HHqWNg

const COMMON_ANSWERS = {
    Name: 'Ranjit Kumar Pandit',
    Email: "190303105129@paruluniversity.ac.in",
    En: "190303105129",
    EmailP: "ranjitkumar448@yahoo.com",
    Phone: "7984545163"

}

const handleTextQuestion = (question) => {
    const questionText = question.toLowerCase();
    if (questionText.includes('name')) {
        return COMMON_ANSWERS.Name;
    } else if (questionText.includes('email')) {
        return COMMON_ANSWERS.Email;
    } else if (questionText.includes('enrollment')) {
        return COMMON_ANSWERS.En;
    } else if (questionText.includes('phone')) {
        return COMMON_ANSWERS.Phone;
    } else if (questionText.includes('email') && questionText.includes('private')) {
        return COMMON_ANSWERS.EmailP;
    } else {
        return "...";
    }
}

const handleOptionQuestion = async (question, options) => {
    // handle common question
    if (question.includes('name')) {
        //    find option with name
        const matchingOptionIndex = options.findIndex(option => option.toLowerCase().includes(COMMON_ANSWERS.Email));
        if (matchingOptionIndex !== -1) {
            return matchingOptionIndex;
        } else {
            // return random option
            return Math.floor(Math.random() * options.length);
        }
    } else if (question.includes('email')) {
        const matchingOptionIndex = options.findIndex(option => option.toLowerCase().includes(COMMON_ANSWERS.Email));
        if (matchingOptionIndex !== -1) {
            return matchingOptionIndex;
        } else {
            return Math.floor(Math.random() * options.length);
        }
    } else if (question.includes('enrollment')) {
        const matchingOptionIndex = options.findIndex(option => option.toLowerCase().includes(COMMON_ANSWERS.En));
        if (matchingOptionIndex !== -1) {
            return matchingOptionIndex;
        } else {
            return Math.floor(Math.random() * options.length);
        }
    } else if (question.includes('phone')) {
        const matchingOptionIndex = options.findIndex(option => option.toLowerCase().includes(COMMON_ANSWERS.Phone));
        if (matchingOptionIndex !== -1) {
            return matchingOptionIndex;
        } else {
            return Math.floor(Math.random() * options.length);
        }
    } else if (question.includes('email') && question.includes('private')) {
        const matchingOptionIndex = options.findIndex(option => option.toLowerCase().includes(COMMON_ANSWERS.EmailP));
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
    handleTextQuestion,
    COMMON_ANSWERS
}
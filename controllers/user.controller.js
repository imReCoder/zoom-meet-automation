const { responseHandler } = require("../utils/utils");

exports.getUser = async (req, res, next) => {
   const body = "success";
    responseHandler(res,body);
}

exports.joinMeeting = async (req, res, next) => {
    const body = "Join Success";
    responseHandler(res, body);
}

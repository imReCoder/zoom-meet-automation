const { responseHandler } = require("../utils/utils");

exports.getUser = async (req, res, next) => {
   const body = "success";
    responseHandler(res,body);
}

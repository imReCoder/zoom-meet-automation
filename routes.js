const userController = require('./controllers/user.controller');

const routes = [
    {
        method:"GET",
        path: "/",
        handlers:[userController.getUser]
    },
    {
        method: "GET",
        path: "/join",
        handlers: [userController.joinMeeting]
    }
]

module.exports = routes;
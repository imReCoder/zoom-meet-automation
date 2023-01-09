const userController = require('./controllers/user.controller');

const routes = [
    {
        method:"GET",
        path: "/",
        handlers:[userController.getUser]
    }
]

module.exports = routes;
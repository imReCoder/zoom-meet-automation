import express from 'express'
import * as userController from './controllers/user.controller.js';

const routes = [
    {
        method:"GET",
        path:"/check",
        handlers:[userController.getUser]
    }
]

export default routes;
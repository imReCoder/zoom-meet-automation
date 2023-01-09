import express from 'express'
import * as userController from './controllers/user.controller.js';

const routes = [
    {
        method:"GET",
        path: "/",
        handlers:[userController.getUser]
    }
]

export default routes;
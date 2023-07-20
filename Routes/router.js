const express = require('express')
const userController = require("../controllers/userController")
const middleware = require("../middleware/authMiddleware")
const router = new express.Router()

// register - http://localhost:3000/register
router.post("/register",userController.register)

// Login - http://localhost:3000/login
router.post("/login",userController.login)

// Balance enquery - http://localhost:3000/get-balance/:acno
router.get("/getbalance/:acno",middleware.jwtMiddleware,userController.getbalance)

// get fund transfer
router.post("/fund-transfer",middleware.jwtMiddleware,userController.fundtrasfer)

// get transaction
router.get("/get-transaction",middleware.jwtMiddleware,userController.gettransactions)

// delete Acno
router.delete("/deletemyacno",middleware.jwtMiddleware,userController.deleteAcno)

module.exports = router
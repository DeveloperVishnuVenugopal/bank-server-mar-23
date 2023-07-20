const jwt = require("jsonwebtoken")

exports.appMiddleware = (req, res, next) => {
    console.log("Inside Application specific middleware");
    next()
}

exports.jwtMiddleware = (req, res, next) => {
    console.log(" Inside Jwt Middleware");
    // get token from request header 
    const token = req.headers["access-token"]
    // verify token 
    try {
        const {lohinAcno} = jwt.verify(token, "supersecretkey12345")
        console.log(lohinAcno);
        req.loginData = lohinAcno
        next()
    }
    catch {
        res.status(406).json("Please Login")
    }
}
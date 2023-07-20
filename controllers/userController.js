const users = require('../MODEL/userSchema')
const jwt = require("jsonwebtoken")

// register
exports.register = async (req, res) => {
    console.log("inside register function");

    // get data from request body
    const { username, acno, password } = req.body

    try {// check acno in users model
        const result = await users.findOne({ acno })
        if (result) {
            // if acno exist, send response as "already exist"
            res.status(406).json("Account already exist. Please Log in!!!")
        } else {
            // if acno not exist, add to users model, 
            const newUser = new users({
                username, acno, password, balance: 5000, transactions: []
            })
            // to save changes to mongodb
            await newUser.save()
            //  send response as "success"
            res.status(200).json(newUser)
        }
    }
    catch (err) {
        res.status(401).json(err)
    }
}

// login logic
exports.login = async (req, res) => {
    // get data from req body
    const { acno, password } = req.body
    try {
        // check acno in mongodb
        const bankUser = await users.findOne({ acno, password })
        if (bankUser) {
            // user already exist
            const token = jwt.sign({ lohinAcno: acno }, "supersecretkey12345")
            res.status(200).json({
                loginUser: bankUser,
                token
            })
        }
        else {
            res.status(404).json("*Invalid Accountno / Password*")
        }
    }
    catch (err) {
        res.status(401).json(err)
    }
}
// get-balance/:acno
exports.getbalance = async (req, res) => {
    // get acno from req 
    const { acno } = req.params
    try {
        // check acno in mongodb
        const response = await users.findOne({ acno })
        if (response) {
            res.status(200).json(response.balance)
        }
        else {
            res.status(404).json("Account not found")
        }

    }
    catch (err) {
        res.status(401).json(err)
    }

}

// fund-transfer 
exports.fundtrasfer = async (req, res) => {

    console.log("inside Fund transfer");
    // debit Acno
    const { loginData } = req
    // get data from request : creditacno ,amound 
    const { creditAcno, amount } = req.body
    let amt = Number(amount)

    try {
        // /check debit acno in mongoDb 
        const debitUser = await users.findOne({ acno: loginData })
        console.log(debitUser);

        // check credit user detail
        const creditUser = await users.findOne({ acno: creditAcno })
        console.log(creditUser);

        if(loginData==creditAcno){
            res.status(406).json("Operation Denied!!!")
        }
        else{
            if (creditUser) { 
                // sufficent balance for debituser
                if(debitUser.balance>=amt){
                    debitUser.balance-=amt
                    debitUser.transactions.push({
                        transactions_type:"CREDIT",amount:amt,toAcno:creditAcno,fromAcno:loginData
                    })
                    await debitUser.save()
    
                    creditUser.balance+=amt
                    creditUser.transactions.push({
                        transactions_type:"DEBIT",amount:amt,toAcno:creditAcno,fromAcno:loginData
                    })
                    await creditUser.save()
                    res.status(200).json("Trasnsaction successfully completed")
                }
                else{
                    res.status(406).json("Transaction Failed!!!...Insufficent Balance!!!")
                }
            }
            else {
                res.status(404).json("Invalid credit account details!!!")
            }
        }

        
    }
    catch(err) {
        res.status(401).json(err)
    }
    // res.send("received")
}

exports.gettransactions = async (req,res)=>{
    console.log("inside transaction function");
    // get acno to fetch transaction
    const {loginData} = req;
    // get all details of this acno from mongodb
    try{
        const userDetails = await users.findOne({acno:loginData})
        if(userDetails){
            const {transactions} = userDetails
            res.status(200).json(transactions)
        }
        else{
            res.status(404).json("invalid Account Details!!!")
        }
    }
    catch(err){
        res.status(401).json(err);
    }
}

exports.deleteAcno = async (req,res)=>{
    // get login data
    const {loginData} = req;
    try{
        await users.deleteOne({acno:loginData})
        res.status(200).json("Account deleted successfully!!!")
    }
    catch(err){
        res.status(401).json(err);
    }
}
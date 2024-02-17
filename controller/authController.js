const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const User = require("../models/User")

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "please provide valid email" })
    }
    if (!validator.isStrongPassword(password)) {
        //Skillhub@123
        return res.status(400).json({ message: "please provide valid password" })

    }
    if (!name) {
        return res.status(400).json({ message: "please provide  name" })
    }
    const result = await User.findOne({ email })
    if (result) {
        return res.status(400).json({ message: "Email Already use" })

    }

    const hashPass = await bcrypt.hash(password, 10)


    await User.create({ ...req.body, password: hashPass })
    return res.status(201).json({ message: "User Register Success" })
})
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "email and password Required" })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "please provide valid email" })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "please provide valid password" })
    }
    const result = await User.findOne({ email })
    if (!result) {
        return res.status(400).json({ message: "email not registered with us" })
    }

    if (!result.active) {

        return res.status(400).json({ message: "Account Block Get i  touch with admin" })
    }

    const verify = bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(400).json({ message: "Password do not match" })
    }
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })

    res.cookie("devAuth", token, { maxAge: 3600000 * 6 })
    res.status(200).json({
        message: "login Success",
        result: {
            name: result.name,
            email: result.email,
            role: result.role,
        }
    })
})

exports.logout = asyncHandler(async (req, res) => {
    res.clearCookie("devAuth")
    res.status(200).json({ message: "logout success" })
})


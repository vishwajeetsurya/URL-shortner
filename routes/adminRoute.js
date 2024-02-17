const { adminGetAllUsers, adminUpdateUser, adminGetUserUrls } = require("../controller/adminController")

const router = require("express").Router()

router
    .get("/user", adminGetAllUsers)
    .put("/user/:userId", adminUpdateUser)
    .get("/user/url/:userId", adminGetUserUrls)

module.exports = router
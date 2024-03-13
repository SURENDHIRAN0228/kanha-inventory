const express = require('express')
const server = express()
const mysql = require('mysql')
const path = require('path')
const session = require('express-session')
const cors = require('cors');

//require('dotenv').config()

const departmentRouter = require('./routes/asset_department.routes')
const locationRouter = require('./routes/asset_location.route')
const locationGroupRouter = require('./routes/asset_location_group.route')
const classificationRouter = require('./routes/asset_classification.route')
const vendorDetailsRouter = require('./routes/asset_vendor_details.route')
const assetDetailsRouter = require('./routes/asset_details.route')
const assetDetailsManagementRouter = require('./routes/asset_details_management.route')

const con = mysql.createConnection({
    host: 'localhost',
    user: 'admin_kanha',
    password: '7MFPDcj3uE',
    database: 'admin_kaninv'
})

con.connect(function (err) {
    if (err) {
        console.log("database connection error")
    } else {
        console.log('database connection success')
    }
})



// connecting route to database
server.use(function (req, res, next) {
    req.con = con
    next()
})

//user session
server.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//connecting frontend
server.use(cors());

// parsing post data
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// routing
server.use('/department', departmentRouter)
server.use('/location', locationRouter)
server.use('/location_group', locationGroupRouter)
server.use('/classification', classificationRouter)
server.use('/vendor', vendorDetailsRouter)
server.use('/asset', assetDetailsRouter)
server.use('/asset_management', assetDetailsManagementRouter)
//app.use(express.static('public'))

server.listen(2000, function () {
    console.log('server started - http://localhost:2000/')
})

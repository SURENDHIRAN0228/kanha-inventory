const express = require('express')
const server = express()
const mysql = require('mysql')
const path = require('path')
const session = require('express-session')
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const departmentRouter = require('./routes/asset_department.routes')
const locationRouter = require('./routes/asset_location.route')
const locationGroupRouter = require('./routes/asset_location_group.route')
const classificationRouter = require('./routes/asset_classification.route')
const vendorDetailsRouter = require('./routes/asset_vendor_details.route')
const assetDetailsRouter = require('./routes/asset_details.route')
const assetDetailsManagementRouter = require('./routes/asset_details_management.route')
const userLoginRegister = require('./routes/userLoginRegister.route')

// MySQL database configuration
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

// Open the connection
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
server.use('/locationGroup', locationGroupRouter)
server.use('/classification', classificationRouter)
server.use('/vendor', vendorDetailsRouter)
server.use('/asset', assetDetailsRouter)
server.use('/asset_management', assetDetailsManagementRouter)
server.use('/user', userLoginRegister)

//app.use(express.static('public'))

// Start the server
server.listen(process.env.PORT, function () {
    console.log('server started - http://localhost:'+process.env.PORT+'/')
})

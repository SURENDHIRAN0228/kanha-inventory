const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const classificationController = require("../controllers/classification.controller");
const { upload } = require("../middleware/uploader");

router.post("/import", upload("file"), classificationController.import);

router.get("/", function(req, res) {
    req.con.query(`SELECT * FROM asset_classifications` , function (error, result) {
        if (error) {
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    })
})

router.get("/:id", function(req, res) {
    req.con.query(`SELECT * FROM asset_classifications WHERE id='${req.params.id}'`, function (error, result) {
        if (error) {
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    });
});

router.post('/create', function (req, res) {
    const data = req.body
    req.con.query(`INSERT INTO asset_classifications SET classification = '${data.classification}'`, (error, results) => {
        if(results) {
            res.send({"status":true, "message":"User created successfully"});
        } else {
            res.send({"status":false, "message":"Error creating user"});
        } 
    })
});

router.post('/update/:id', function (req, res) {
    const data = req.body
    console.log(req.params.id)
    req.con.query(`UPDATE asset_classifications SET classification = '${data.classification}' WHERE id= '${req.params.id}'`, (error, results) => {
        if(results) {
            res.send({"status":true, "message":"Updated successfully"});
        } else {
            res.send({"status":false, "message":"Updation Failed"});
        } 
    })
});

router.delete('/delete/:id', function (req, res) {
    req.con.query(`DELETE FROM asset_classifications WHERE id='${req.params.id}'`, (error, results) => {
        if (results) {
            res.send({ status: true, message: "Deleted Successfully" });
        } else {
            res.send({ status: false, message: error });
        }
    })
})

/*router.post('/login', (req, res) => {
    const data = req.body;
    //console.log(data);

    if (data) {
        req.con.query(`SELECT * FROM students WHERE email = '${data.email}' AND password = '${data.password}'`, (error, results) => {
           req.con.query(`SELECT id FROM students WHERE email = '${data.email}' `, (error, row) => {
        
            if (results.length > 0) {
                //console.log(row);
                req.session.loggedin = true;
                req.session.email = data.email;
                //res.redirect('/data');
                res.send({ "status": true, "message": row});
            } else {
                res.send({ "status": false, "message": 'Incorrect Username and/or Password!' });
            }
        })
    })
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
})

router.get('/logout', (req, res) => {
    req.session.loggedin = false;
    res.redirect('/');
})

*/

module.exports = router
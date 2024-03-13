const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const departmentController = require("../controllers/department.controller");
const { upload } = require("../middleware/uploader");

router.post("/import", upload("file"), departmentController.import);

router.get("/", function(req, res) {
    req.con.query(`SELECT * FROM asset_departments` , function (error, result) {
        if (error) {
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    })
})

router.get("/:id", function(req, res) {
    req.con.query(`SELECT * FROM asset_departments WHERE id='${req.params.id}'`, function (error, result) {
        if (error) {
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    });
});

router.post('/create', function (req, res) {
    const data = req.body
    req.con.query(`INSERT INTO asset_departments SET department_name = '${data.department_name}', department_email = '${data.department_email}', department_hod_name = '${data.department_hod_name}', department_hod_email = '${data.department_hod_email}', department_hod_phone = '${data.department_hod_phone}'`, (error, results) => {  
        if(results) {
            req.con.query(`SELECT MAX(id) AS max_id FROM asset_departments ` , function (error, result, fields) { 
                const MaxId = result[0].max_id
                var department_code = "KANDPET00"+MaxId
                console.log(department_code)
                req.con.query(`UPDATE asset_departments SET department_code = '${department_code}' WHERE id = '${MaxId}'`, (error, results) => {
                    res.send({"status":true, "message":"User Created Successfully"});
                })
            })

        } else {
            res.send({"status":false, "message":"Error creating user"});
        } 
    })
});

router.post('/update/:id', function (req, res) {
    const data = req.body
    console.log(req.params.id)
    req.con.query(`UPDATE asset_departments SET department_name = '${data.department_name}', department_email = '${data.department_email}', department_hod_name = '${data.department_hod_name}', department_hod_email = '${data.department_hod_email}', department_hod_phone = '${data.department_hod_phone}' WHERE id= '${req.params.id}'`, (error, results) => {
        if(results) {
            res.send({"status":true, "message":"Updated successfully"});
        } else {
            res.send({"status":false, "message":"Updation Failed"});
        } 
    })
});

router.delete('/delete/:id', function (req, res) {
    req.con.query(`DELETE FROM asset_departments WHERE id='${req.params.id}'`, (error, results) => {
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
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const vendorDetailsController = require("../controllers/vendor_details.controller");
const { upload } = require("../middleware/uploader");

router.post("/import", upload("file"), vendorDetailsController.import);

router.get("/", function(req, res) {
    req.con.query(`SELECT * FROM vendor_details` , function (error, result) {
        if (error) {
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    })
})

router.get("/:id", function(req, res) {
    req.con.query(`SELECT * FROM vendor_details WHERE id='${req.params.id}'`, function (error, result) {
        if (error) {
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    });
});

router.post('/create', function (req, res) {
    const data = req.body
    req.con.query(`INSERT INTO vendor_details SET vendor_shop_name = '${data.vendor_shop_name}', shop_address = '${data.shop_address}', contact_no = '${data.contact_no}', vendor_email = '${data.vendor_email}', vendor_poc_name = '${data.vendor_poc_name}', vendor_poc_contact_no = '${data.vendor_poc_contact_no}'`, (error, results) => {
        if(results) {
            req.con.query(`SELECT MAX(id) AS max_id FROM vendor_details ` , function (error, result, fields) { 
                const MaxId = result[0].max_id
                var vendor_code = "KANVEN00"+MaxId
                console.log(vendor_code)
                req.con.query(`UPDATE vendor_details SET vendor_code = '${vendor_code}' WHERE id = '${MaxId}'`, (error, results) => {
                    res.send({"status":true, "message":"Vendor Created Successfully"});
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
    req.con.query(`UPDATE vendor_details SET vendor_shop_name = '${data.vendor_shop_name}', shop_address = '${data.shop_address}', contact_no = '${data.contact_no}', vendor_email = '${data.vendor_email}', vendor_poc_name = '${data.vendor_poc_name}', vendor_poc_contact_no = '${data.vendor_poc_contact_no}' WHERE id= '${req.params.id}'`, (error, results) => {
        if(results) {
            res.send({"status":true, "message":"Updated successfully"});
        } else {
            res.send({"status":false, "message":"Updation Failed"});
        } 
    })
});

router.delete('/delete/:id', function (req, res) {
    req.con.query(`DELETE FROM vendor_details WHERE id='${req.params.id}'`, (error, results) => {
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
// Import necessary modules
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const departmentController = require("../controllers/department.controller");
const { upload } = require("../middleware/uploader");

//Route to Importing csv  file
router.post("/importDeparment", upload("file"), departmentController.import);

// Route to fetch data from MySQL database
router.get("/getDepartment", function(req, res) {

    //Read data from Mysql database
    req.con.query(`SELECT * FROM asset_departments` , function (error, result) {
        if (error) {
            // Handle error
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    })
})

// Route to fetch single data from MySql database
router.get("/getDepartment/:id", function(req, res) {

    //Read data from Mysql database
    req.con.query(`SELECT * FROM asset_departments WHERE id='${req.params.id}'`, function (error, result) {
        if (error) {
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    });
});

// Define a route to handle data insertion
router.post('/createDepartment', function (req, res) {

    // Extract data from the request body
    const data = req.body
    
    // Insert data into the database
    req.con.query(`INSERT INTO asset_departments SET departmentName = '${data.departmentName}', departmentEmail = '${data.departmentEmail}', departmentHODName = '${data.departmentHODName}', departmentHODEmail = '${data.departmentHODEmail}', departmentHODPhone = '${data.departmentHODPhone}'`, (error, results) => {  
        if(results) {
            req.con.query(`SELECT MAX(id) AS maxId FROM asset_departments ` , function (error, result, fields) { 
                const maxId = result[0].maxId
                var departmentCode = "KANDPET00"+maxId
                req.con.query(`UPDATE asset_departments SET departmentCode = '${departmentCode}' WHERE id = '${maxId}'`, (error, results) => {
                    res.send({"status":true, "message":"User Created Successfully"});
                })
            })

        } else {
            res.send({"status":false, "message":"Error Creating User"});
        } 
    })
});

// Route to handle updating data
router.post('/updateDepartment/:id', function (req, res) {

     // Assuming you pass the updated data in the request body
    const data = req.body
    
    // Request to update data
    req.con.query(`UPDATE asset_departments SET departmentName = '${data.departmentName}', departmentEmail = '${data.departmentEmail}', departmentHODName = '${data.departmentHODName}', departmentHODEmail = '${data.departmentHODEmail}', departmentHODPhone = '${data.departmentHODPhone}' WHERE id= '${req.params.id}'`, (error, results) => {
        if(results) {
            res.send({"status":true, "message":"Updated successfully"});
        } else {
            res.send({"status":false, "message":"Updation Failed"});
        } 
    })
});

// Route to delete data from MySQL database
router.delete('/deleteDepartment/:id', function (req, res) {
    req.con.query(`DELETE FROM asset_departments WHERE id='${req.params.id}'`, (error, results) => {
        if (results) {
            res.send({ status: true, message: "Deleted Successfully" });
        } else {
            res.send({ status: false, message: error });
        }
    })
})

// Route to delete multiple data from MySQL database
router.delete('/deleteDepartmentRows', (req, res) => {
    // Assuming you send an array of IDs to delete in the request body
    const idsToDelete = req.body.ids;
     
    if (!idsToDelete || !Array.isArray(idsToDelete) || idsToDelete.length === 0) {
      return res.status(400).json({ error: 'Invalid request. Please provide an array of IDs to delete.' });
    }
  
    // Convert array elements to integers (assuming IDs are integers)
    const parsedIds = idsToDelete.map(id => parseInt(id, 10));
  
    // Construct the SQL query
    const sql = 'DELETE FROM asset_departments WHERE id IN (?)';
    const values = parsedIds;

    // Execute the query
    req.con.query(sql, [values], (err, result) => {
      if (err) {
        console.error('Error Executing Query: ' + err.message);
        return res.status(500).json({ error: 'Internal Server Error.' });
      }
  
      // Check if any rows were affected
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No rows found for deletion.' });
      }
       // Return success response
      res.json({ message: 'Rows deleted successfully.' });
    });
  
    
  });

module.exports = router

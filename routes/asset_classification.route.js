// Import necessary modules
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const classificationController = require("../controllers/classification.controller");
const { upload } = require("../middleware/uploader");

//Route to Importing csv  file
router.post("/importClassification", upload("file"), classificationController.import);

// Route to fetch data from MySQL database
router.get("/GetClassification", function(req, res) {

    //Read data from Mysql database
    req.con.query(`SELECT * FROM asset_classifications` , function (error, result) {
        if (error) {
            // Handle error
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    })
})

// Route to fetch single data from MySql database
router.get("/getClassification/:id", function(req, res) {

    //Read data from Mysql database
    req.con.query(`SELECT * FROM asset_classifications WHERE id='${req.params.id}'`, function (error, result) {
        if (error) {
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    });
});

// Define a route to handle data insertion
router.post('/createClassification', function (req, res) {

    // Extract data from the request body
    const data = req.body

    // Insert data into the database
    req.con.query(`INSERT INTO asset_classifications SET classification = '${data.classification}'`, (error, results) => {
        if(results) {
            res.send({"status":true, "message":"Classification created successfully"});
        } else {
            res.send({"status":false, "message":"Error creating user"});
        } 
    })
});

// Route to handle updating data
router.post('/updateClassification/:id', function (req, res) {

    // Assuming you pass the updated data in the request body
    const data = req.body

    // Request to update data
    req.con.query(`UPDATE asset_classifications SET classification = '${data.classification}' WHERE id= '${req.params.id}'`, (error, results) => {
        if(results) {
            res.send({"status":true, "message":"Updated successfully"});
        } else {
            res.send({"status":false, "message":"Updation Failed"});
        } 
    })
});

// Route to delete data from MySQL database
router.delete('/deleteClassification/:id', function (req, res) {

    req.con.query(`DELETE FROM asset_classifications WHERE id='${req.params.id}'`, (error, results) => {
        if (results) {
            res.send({ status: true, message: "Deleted Successfully" });
        } else {
            res.send({ status: false, message: error });
        }
    })
})

// Route to delete multiple data from MySQL database
router.delete('/deleteClassificationRows', (req, res) => {
    // Assuming you send an array of IDs to delete in the request body
    const idsToDelete = req.body.ids;
     
    if (!idsToDelete || !Array.isArray(idsToDelete) || idsToDelete.length === 0) {
      return res.status(400).json({ error: 'Invalid request. Please provide an array of IDs to delete.' });
    }
  
    // Convert array elements to integers (assuming IDs are integers)
    const parsedIds = idsToDelete.map(id => parseInt(id, 10));
  
    // Construct the SQL query
    const sql = 'DELETE FROM asset_classifications WHERE id IN (?)';
    const values = parsedIds;

      // Execute the query
    req.con.query(sql, [values], (err, result) => {
      if (err) {
        console.error('Error executing query: ' + err.message);
        return res.status(500).json({ error: 'Internal server error.' });
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

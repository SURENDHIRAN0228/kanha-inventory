// Import necessary modules
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const assetDetailsController = require("../controllers/asset_details.controller");
const { uploads } = require("../middleware/uploads");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// set uploads directory
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, 'uploads/photo/')
        } else if(file.mimetype === 'text/csv') {
            cb(null, 'storage/uploads/')
        } else
        {
            cb(null, 'storage/pdf_copies/')

        }
	},
	filename: (req, file, cb) => {
		// save file with current timestamp + field name of the file + file extension
		cb(null,  Date.now() + file.fieldname + path.extname(file.originalname));
	}
})

const fileFilter = (req, file, cb) => {
    if(file.fieldname === "assetImage") {
        (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')? cb(null,true): cb(null,false);
    }
    else if(file.fieldname === "storeInwardCopy" || file.fieldname === "departmentGatepassCopy" || file.fieldname === "warrantyCopy" || file.fieldname === "insuranceCopy"|| file.fieldname === "purchaseAndDisposalApprovalCopy"|| file.fieldname === "purchaseOrderCopy" || file.fieldname === "invoiceCopy") {
        (file.mimetype === 'application/msword' || file.mimetype === 'application/pdf')? cb(null,true): cb(null,false);
    } else if(file.fieldname === "file") {
        (file.mimetype === 'text/csv')? cb(null,true): cb(null,false);
    }
}

// initialize the multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter    
}).fields([{ name: 'assetImages', maxCount: 1 }])

//Route to Importing csv  file
router.post("/importAsset", uploads("file"), assetDetailsController.import);

// Route to fetch data from MySQL database
router.get("/getAsset", function(req, res) {

    //Read data from Mysql database
    req.con.query(`SELECT * FROM asset_details` , function (error, result) {
        if (error) {
            // Handle error
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    })
})

// Route to fetch single data from MySql database
router.get("/getAsset/:id", function(req, res) {

    //Read data from Mysql database
    req.con.query(`SELECT * FROM asset_details WHERE id='${req.params.id}'`, function (error, result) {
        if (error) {
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    });
});

// Define a route to handle data insertion
router.post('/createAsset', upload, function (req, res) {
    const assetName = req.body.assetName
    const assetClassification = req.body.assetClassification
    const assetCategory = req.body.assetCategory
    const assetDateOfInclusion = req.body.assetDateOfInclusion
    const assetManufacturedBy = req.body.assetManufacturedBy
    const assetModel = req.body.assetModel
    const manufacturedAssetSerialNo	 = req.body.manufacturedAssetSerialNo	
    const assetCapacity = req.body.assetCapacity
    const vendorName = req.body.vendorName
    const assetImages = req.files.assetImages[0].filename
    
    // Insert data into the database
    req.con.query(`INSERT INTO asset_details SET assetName = '${assetName}', assetClassification = '${assetClassification}', assetCategory = '${assetCategory}', assetDateOfInclusion = '${assetDateOfInclusion}', assetManufacturedBy = '${assetManufacturedBy}', assetModel = '${assetModel}', manufacturedAssetSerialNo = '${manufacturedAssetSerialNo}', assetCapacity = '${assetCapacity}', vendorName = '${vendorName}', aseetImages = '${assetImages}'`, (error, results) => {
        if(results) {
            req.con.query(`SELECT MAX(id) AS maxId FROM asset_details ` , function (error, result, fields) { 
                const maxId = result[0].maxId
                var assetCode = "KANASS00"+maxId
                req.con.query(`UPDATE asset_details SET assetCode = '${assetCode}' WHERE id = '${maxId}'`, (error, results) => {
                    res.send({"status":true, "message":"Asset Created Successfully"});
                })
            })        } else {
            res.send({"status":false, "message":"Error creating user"});
        } 
    })
});

// Route to handle updating data
router.post('/updateAsset/:id', function (req, res) {
    const assetName = req.body.assetName
    const assetClassification = req.body.assetClassification
    const assetCategory = req.body.assetCategory
    const assetDateOfInclusion = req.body.assetDateOfInclusion
    const assetManufacturedBy = req.body.assetManufacturedBy
    const assetModel = req.body.assetModel
    const manufacturedAssetSerialNo = req.body.manufacturedAssetSerialNo	
    const assetCapacity = req.body.assetCapacity
    const vendorName = req.body.vendorName

    // if user upload new photo, then remove old photo and save photo's name in database
	//if (req.file) {
		// if old photo exists (old photo not empty) then unlink / remove the photo in directory
		//if (req.body.old_photo !== '')
			//fs.unlink(`uploads/photo/${req.body.old_photo}`);
        //asset_images = req.file.filename
	//}
    //const assetImages = !req.file ? 'placeholder.jpg' : req.file.filename
  
    
    // Request to update data
    req.con.query(`UPDATE asset_details SET assetName = '${assetName}', assetClassification = '${assetClassification}', assetCategory = '${assetCategory}', assetDateOfInclusion = '${assetDateOfInclusion}', assetManufacturedBy = '${assetManufacturedBy}', assetModel = '${assetModel}', manufacturedAssetSerialNo = '${manufacturedAssetSerialNo}', assetCapacity = '${assetCapacity}', vendorName = '${vendorName}' WHERE id= '${req.params.id}'`, (error, results) => {
        if(results) {
            res.send({"status":true, "message":"Updated successfully"});
        } else {
            res.send({"status":false, "message":"Updation Failed"});
        } 
    })
});

// Route to delete data from MySQL database
router.delete('/deleteAsset/:id', function (req, res) {
    req.con.query(`DELETE FROM asset_details WHERE id='${req.params.id}'`, (error, results) => {
        if (results) {
            res.send({ status: true, message: "Deleted Successfully" });
        } else {
            res.send({ status: false, message: error });
        }
    })
})

// Route to delete multiple data from MySQL database
router.delete('/deleteAssetRows', (req, res) => {
    // Assuming you send an array of IDs to delete in the request body
    const idsToDelete = req.body.ids;
     
    if (!idsToDelete || !Array.isArray(idsToDelete) || idsToDelete.length === 0) {
      return res.status(400).json({ error: 'Invalid request. Please provide an array of IDs to delete.' });
    }
  
    // Convert array elements to integers (assuming IDs are integers)
    const parsedIds = idsToDelete.map(id => parseInt(id, 10));
  
    // Construct the SQL query
    const sql = 'DELETE FROM asset_details WHERE id IN (?)';
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

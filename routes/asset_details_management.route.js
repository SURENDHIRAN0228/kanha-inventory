// Import necessary modules
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const assetDetailsManagementController = require("../controllers/asset_details_management.controller");
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
}).fields([{ name: 'file', maxCount: 1 },{ name: 'assetImage', maxCount: 1 }, { name: 'storeInwardCopy', maxCount: 1 }, { name: 'departmentGatepassCopy', maxCount: 1 }, { name: 'warrantyCopy', maxCount: 1 }, { name: 'insuranceCopy', maxCount: 1 }, { name: 'purchaseAndDisposalApprovalCopy', maxCount: 1 }, { name: 'purchaseOrderCopy', maxCount: 1 }, { name: 'invoiceCopy', maxCount: 1}]);

//Route to Importing csv  file
router.post("/import", uploads("file"), assetDetailsManagementController.import);

// Route to fetch data from MySQL database
router.get("/", function(req, res) {
	console.log()
    //Read data from Mysql database
    req.con.query(`SELECT * FROM asset_details_managements` , function (error, result) {
        if (error) {
            // Handle error
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    })
})

// Route to fetch single data from MySql database
router.get("/:id", function(req, res) {

    //Read data from Mysql database
    req.con.query(`SELECT * FROM asset_details_managements WHERE id='${req.params.id}'`, function (error, result) {
        if (error) {
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    });
});

// Define a route to handle data insertion
router.post('/create', upload , function (req, res) {
    const asset_name = req.body.assetName
    const asset_classification = req.body.assetClassification
    const asset_category = req.body.assetCategory
    const asset_department = req.body.department
    const asset_location = req.body.location
    const asset_model = req.body.model
    const manufactured_asset_serial_no	 = req.body.assetSerialNumber	
    const date_of_inclusion = req.body.dateOfInclusion
    const manufactured_by = req.body.manufacturedBy
    const asset_capacity = req.body.capacity
    const asset_quantity = req.body.quantity
    const asset_description = req.body.description
    const assetImage =req.files.assetImage[0].filename
    const asset_store_inward_number = req.body.storeInwardNo
    const asset_store_inward_copy = req.files.storeInwardCopy[0].filename
    const department_gatepass_number = req.body.deptGatepassNo
    const department_gatepass_copy = req.files.departmentGatepassCopy[0].filename
    const warranty_number = req.body.warrantyNumber
    const warranty_expiry_date = req.body.warrantyExpiryDate
    const warranty_copy = req.files.warrantyCopy[0].filename
    const insurance_number = req.body.insuranceNumber
    const insurance_expiry_date = req.body.insuranceExpiryDate
    const insurance_copy = req.files.insuranceCopy[0].filename
    const spare_mrn = req.body.spareMrn
    const scrape_mrn = req.body.scrapeMrn
    const asset_working_status = req.body.assetWorkingStatus
    const purchase_and_disposal_copy = req.files.purchaseAndDisposalApprovalCopy[0].filename
    const purchase_order_number = req.body.purchaseOrderNo
    const purchase_order_copy = req.files.purchaseOrderCopy[0].filename
    const date_of_purchase = req.body.dateOfPurchase
    const asset_company_purchased = req.body.organization
    const invoice_number = req.body.invoiceNumber
    const invoice_copy = req.files.invoiceCopy[0].filename
    const vendor_name = req.body.vendor_name
    const asset_price = req.body.price
    
    // Insert data into the database
    req.con.query(`INSERT INTO asset_details_managements SET asset_name = '${asset_name}', asset_classification = '${asset_classification}', asset_category = '${asset_category}', asset_department = '${asset_department}', asset_location = '${asset_location}', asset_model = '${asset_model}', manufactured_asset_serial_no = '${manufactured_asset_serial_no}', date_of_inclusion = '${date_of_inclusion}', manufactured_by = '${manufactured_by}', asset_capacity = '${asset_capacity}', asset_quantity = '${asset_quantity}', asset_description = '${asset_description}', asset_images = '${assetImage}', asset_store_inward_number = '${asset_store_inward_number}', asset_store_inward_copy = '${asset_store_inward_copy}', department_gatepass_number = '${department_gatepass_number}', department_gatepass_copy = '${department_gatepass_copy}', warranty_number = '${warranty_number}', warranty_expiry_date = '${warranty_expiry_date}', warranty_copy = '${warranty_copy}', insurance_number = '${insurance_number}', insurance_expiry_date = '${insurance_expiry_date}', insurance_copy = '${insurance_copy}', spare_mrn = '${spare_mrn}', scrape_mrn = '${scrape_mrn}', asset_working_status = '${asset_working_status}', purchase_and_disposal_copy = '${purchase_and_disposal_copy}', purchase_order_number = '${purchase_order_number}', purchase_order_copy = '${purchase_order_copy}', date_of_purchase = '${date_of_purchase}', asset_company_purchased = '${asset_company_purchased}', invoice_number = '${invoice_number}', invoice_copy = '${invoice_copy}', vendor_name = '${vendor_name}', asset_price = '${asset_price}'`, (error, results) => {
        if(results) {
            req.con.query(`SELECT MAX(id) AS max_id FROM asset_details_managements ` , function (error, result, fields) { 
                const MaxId = result[0].max_id
                var asset_code = "KANASMA00"+MaxId
                req.con.query(`UPDATE asset_details_managements SET asset_code = '${asset_code}' WHERE id = '${MaxId}'`, (error, results) => {
                    res.send({"status":true, "message":"Asset Created Successfully"});
                })
            })
        } else {
            res.send({"status":false, "message":error});
        } 
    })
});

// Route to handle updating data
router.post('/update/:id', function (req, res) {
    const asset_name = req.body.assetName
    const asset_category = req.body.assetCategory
    const asset_department = req.body.department
    const asset_location = req.body.location

    // if user upload new photo, then remove old photo and save photo's name in database
	//if (req.file) {
		// if old photo exists (old photo not empty) then unlink / remove the photo in directory
		//if (req.body.old_photo !== '')
			//fs.unlink(`uploads/photo/${req.body.old_photo}`);
        //asset_images = req.file.filename
	//}
    
    
    // Request to update data
    req.con.query(`UPDATE asset_details_managements SET asset_name = '${asset_name}', asset_category = '${asset_category}', asset_department = '${asset_department}', asset_location = '${asset_location}' WHERE id= '${req.params.id}'`, (error, results) => {
        if(results) {
            res.send({"status":true, "message":"Updated successfully"});
        } else {
            res.send({"status":false, "message":"Updation Failed"});
        } 
    })
});


// Route to delete data from MySQL database
router.delete('/delete/:id', function (req, res) {
    req.con.query(`DELETE FROM asset_details_managements WHERE id='${req.params.id}'`, (error, results) => {
        if (results) {
            res.send({ status: true, message: "Deleted Successfully" });
        } else {
            res.send({ status: false, message: error });
        }
    })
})

// Route to delete multiple data from MySQL database
router.delete('/delete-rows', (req, res) => {
  // Assuming you send an array of IDs to delete in the request body
  const idsToDelete = req.body.ids;
   
  if (!idsToDelete || !Array.isArray(idsToDelete) || idsToDelete.length === 0) {
    return res.status(400).json({ error: 'Invalid request. Please provide an array of IDs to delete.' });
  }

  // Convert array elements to integers (assuming IDs are integers)
  const parsedIds = idsToDelete.map(id => parseInt(id, 10));

  // Construct the SQL query
  const sql = 'DELETE FROM asset_details_managements WHERE id IN (?)';
  const values = parsedIds;
  console.log(parsedIds)
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

/*router.post('/update/:id', upload , function (req, res) {
    const asset_name = req.body.asset_name
    const asset_classification = req.body.asset_classification
    const asset_category = req.body.asset_category
    const asset_department = req.body.asset_department
    const asset_location = req.body.asset_location
    const asset_model = req.body.asset_model
    const manufactured_asset_serial_no	 = req.body.manufactured_asset_serial_no	
    const date_of_inclusion = req.body.date_of_inclusion
    const manufactured_by = req.body.manufactured_by
    const asset_capacity = req.body.asset_capacity
    const asset_quantity = req.body.asset_quantity
    const asset_description = req.body.asset_description
    //const asset_images = !req.file ? 'placeholder.jpg' : req.file.filename
    const asset_images = req.files.asset_images[0].filename
    const asset_store_inward_number = req.body.asset_store_inward_number
    const asset_store_inward_copy = req.files.asset_store_inward_copy[0].filename
    const department_gatepass_number = req.body.department_gatepass_number
    const department_gatepass_copy = req.files.department_gatepass_copy[0].filename
    const warranty_number = req.body.warranty_number
    const warranty_expiry_date = req.body.warranty_expiry_date
    const warranty_copy = req.files.warranty_copy[0].filename
    const insurance_number = req.body.insurance_number
    const insurance_expiry_date = req.body.insurance_expiry_date
    const insurance_copy = req.files.insurance_copy[0].filename
    const spare_mrn = req.body.spare_mrn
    const scrape_mrn = req.body.scrape_mrn
    const asset_working_status = req.body.asset_working_status
    const purchase_and_disposal_copy = req.files.purchase_and_disposal_copy[0].filename
    const purchase_order_number = req.body.purchase_order_number
    const purchase_order_copy = req.files.purchase_order_copy[0].filename
    const date_of_purchase = req.body.date_of_purchase
    const asset_company_purchased = req.body.asset_company_purchased
    const invoice_number = req.body.invoice_number
    const invoice_copy = req.files.invoice_copy[0].filename
    const vendor_name = req.body.vendor_name
    const asset_price = req.body.asset_price

    // if user upload new photo, then remove old photo and save photo's name in database
	//if (req.file) {
		// if old photo exists (old photo not empty) then unlink / remove the photo in directory
		//if (req.body.old_photo !== '')
			//fs.unlink(`uploads/photo/${req.body.old_photo}`);
        //asset_images = req.file.filename
	//}
    
    req.con.query(`UPDATE asset_details_managements SET asset_name = '${asset_name}', asset_classification = '${asset_classification}', asset_category = '${asset_category}', asset_department = '${asset_department}', asset_location = '${asset_location}', asset_model = '${asset_model}', manufactured_asset_serial_no = '${manufactured_asset_serial_no}', date_of_inclusion = '${date_of_inclusion}', manufactured_by = '${manufactured_by}', asset_capacity = '${asset_capacity}', asset_quantity = '${asset_quantity}', asset_description = '${asset_description}', asset_images = '${asset_images}', asset_store_inward_number = '${asset_store_inward_number}', asset_store_inward_copy = '${asset_store_inward_copy}', department_gatepass_number = '${department_gatepass_number}', department_gatepass_copy = '${department_gatepass_copy}', warranty_number = '${warranty_number}', warranty_expiry_date = '${warranty_expiry_date}', warranty_copy = '${warranty_copy}', insurance_number = '${insurance_number}', insurance_expiry_date = '${insurance_expiry_date}', insurance_copy = '${insurance_copy}', spare_mrn = '${spare_mrn}', scrape_mrn = '${scrape_mrn}', asset_working_status = '${asset_working_status}', purchase_and_disposal_copy = '${purchase_and_disposal_copy}', purchase_order_number = '${purchase_order_number}', purchase_order_copy = '${purchase_order_copy}', date_of_purchase = '${date_of_purchase}', asset_company_purchased = '${asset_company_purchased}', invoice_number = '${invoice_number}', invoice_copy = '${invoice_copy}', vendor_name = '${vendor_name}', asset_price = '${asset_price}' WHERE id= '${req.params.id}'`, (error, results) => {
        if(results) {
            res.send({"status":true, "message":"Updated successfully"});
        } else {
            res.send({"status":false, "message":"Updation Failed"});
        } 
    })
});

*/

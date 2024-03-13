const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')


const assetDetailsController = require("../controllers/asset_details.controller");
const { upload } = require("../middleware/uploader");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// set uploads directory
		cb(null, 'uploads/photo/')
	},
	filename: (req, file, cb) => {
		// save file with current timestamp + user email + file extension
		cb(null, Date.now() + path.extname(file.originalname));
	}
})

// initialize the multer configuration
const uploader = multer({storage: storage});


router.post("/import", upload("file"), assetDetailsController.import);

router.get("/", function(req, res) {
    req.con.query(`SELECT * FROM asset_details` , function (error, result) {
        if (error) {
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    })
})

router.get("/:id", function(req, res) {
    req.con.query(`SELECT * FROM asset_details WHERE id='${req.params.id}'`, function (error, result) {
        if (error) {
            console.log("Error Connecting to DB");
        } else {
            res.send({ status: true, data: result });
        }
    });
});

router.post('/create', uploader.single('asset_images'), function (req, res) {
    const asset_name = req.body.asset_name
    const asset_classification = req.body.asset_classification
    const asset_category = req.body.asset_category
    const asset_date_of_inclusion = req.body.asset_date_of_inclusion
    const asset_manufactured_by = req.body.asset_manufactured_by
    const asset_model = req.body.asset_model
    const manufactured_asset_serial_no	 = req.body.manufactured_asset_serial_no	
    const asset_capacity = req.body.asset_capacity
    const vendor_name = req.body.vendor_name
    const asset_images = !req.file ? 'placeholder.jpg' : req.file.filename

    req.con.query(`INSERT INTO asset_details SET asset_name = '${asset_name}', asset_classification = '${asset_classification}', asset_category = '${asset_category}', asset_date_of_inclusion = '${asset_date_of_inclusion}', asset_manufactured_by = '${asset_manufactured_by}', asset_model = '${asset_model}', manufactured_asset_serial_no = '${manufactured_asset_serial_no}', asset_capacity = '${asset_capacity}', vendor_name = '${vendor_name}', asset_images = '${asset_images}'`, (error, results) => {
        if(results) {
            req.con.query(`SELECT MAX(id) AS max_id FROM asset_details ` , function (error, result, fields) { 
                const MaxId = result[0].max_id
                var asset_code = "KANASS00"+MaxId
                req.con.query(`UPDATE asset_details SET asset_code = '${asset_code}' WHERE id = '${MaxId}'`, (error, results) => {
                    res.send({"status":true, "message":"Asset Created Successfully"});
                })
            })        } else {
            res.send({"status":false, "message":"Error creating user"});
        } 
    })
});

router.post('/update/:id', uploader.single('asset_images'), function (req, res) {
    const asset_name = req.body.asset_name
    const asset_classification = req.body.asset_classification
    const asset_category = req.body.asset_category
    const asset_date_of_inclusion = req.body.asset_date_of_inclusion
    const asset_manufactured_by = req.body.asset_manufactured_by
    const asset_model = req.body.asset_model
    const manufactured_asset_serial_no = req.body.manufactured_asset_serial_no	
    const asset_capacity = req.body.asset_capacity
    const vendor_name = req.body.vendor_name

    // if user upload new photo, then remove old photo and save photo's name in database
	//if (req.file) {
		// if old photo exists (old photo not empty) then unlink / remove the photo in directory
		//if (req.body.old_photo !== '')
			//fs.unlink(`uploads/photo/${req.body.old_photo}`);
        //asset_images = req.file.filename
	//}
    const asset_images = !req.file ? 'placeholder.jpg' : req.file.filename
    
    console.log(req.params.id +','+ asset_images)
    req.con.query(`UPDATE asset_details SET asset_name = '${asset_name}', asset_classification = '${asset_classification}', asset_category = '${asset_category}', asset_date_of_inclusion = '${asset_date_of_inclusion}', asset_manufactured_by = '${asset_manufactured_by}', asset_model = '${asset_model}', manufactured_asset_serial_no = '${manufactured_asset_serial_no}', asset_capacity = '${asset_capacity}', vendor_name = '${vendor_name}', asset_images = '${asset_images}' WHERE id= '${req.params.id}'`, (error, results) => {
        if(results) {
            res.send({"status":true, "message":"Updated successfully"});
        } else {
            res.send({"status":false, "message":"Updation Failed"});
        } 
    })
});

router.delete('/delete/:id', function (req, res) {
    req.con.query(`DELETE FROM asset_details WHERE id='${req.params.id}'`, (error, results) => {
        if (results) {
            res.send({ status: true, message: "Deleted Successfully" });
        } else {
            res.send({ status: false, message: error });
        }
    })
})


module.exports = router
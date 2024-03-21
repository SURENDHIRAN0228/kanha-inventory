const XLSX = require("xlsx");
const Vendor = require("../models/vendor_details.model");
const outputPath = "storage/outputs";

exports.import = async (req, res) => {

    //Read the imported file
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    //To check given file is empty or not
    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

        const vendor = data.map(row => ({
            vendorShopName: row["vendorShopName"],
            vendorCode: row["vendorCode"],
            shopAddress: row["shopAddress"],
            contactNo: row["contactNo"],
            vendorEmail: row["vendorEmail"],
            vendorPOCName: row["vendorPOCName"],
            vendorPOCContactNo: row["vendorPOCContactNo"]
        }));

        // Insert the data into MySQL
        await Vendor.bulkCreate(vendor);
    }
    
    res.send({ data: "Vendors added successfully" });
};

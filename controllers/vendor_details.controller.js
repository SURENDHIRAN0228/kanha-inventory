const XLSX = require("xlsx");
const Vendor = require("../models/vendor_details.model");
const outputPath = "storage/outputs";


exports.import = async (req, res) => {
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;
    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
        const vendor = data.map(row => ({
            vendor_shop_name: row["vendor_shop_name"],
            vendor_code: row["vendor_code"],
            shop_address: row["shop_address"],
            contact_no: row["contact_no"],
            vendor_email: row["vendor_email"],
            vendor_poc_name: row["vendor_poc_name"],
            vendor_poc_contact_no: row["vendor_poc_contact_no"]
        }));
        await Vendor.bulkCreate(vendor);
    }
    res.send({ data: "added successfully" });
};

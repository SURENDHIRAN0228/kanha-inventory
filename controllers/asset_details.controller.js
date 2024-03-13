const XLSX = require("xlsx");
const AssetDetails = require("../models/asset_details.model");
const outputPath = "storage/outputs";


exports.import = async (req, res) => {
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
        const assetDetails = data.map(row => ({
            asset_name: row["asset_name"],
            asset_code: row["asset_code"],
            asset_classification: row["asset_classification"],
            asset_category: row["asset_category"],
            asset_date_of_inclusion: row["asset_date_of_inclusion"],
            asset_manufactured_by: row["asset_manufactured_by"],
            asset_model: row["asset_model"],
            manufactured_asset_serial_no: row["manufactured_asset_serial_no"],
            asset_capacity: row["asset_capacity"],
            vendor_name: row["vendor_name"]
        }));


        await AssetDetails.bulkCreate(assetDetails);
    }
    res.send({ data: "added successfully" });
};

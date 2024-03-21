const XLSX = require("xlsx");
const AssetDetails = require("../models/asset_details.model");
const outputPath = "storage/outputs";

exports.import = async (req, res) => {

    //Read the imported file
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    //To check given file is empty or not
    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
        
        const assetDetails = data.map(row => ({
            assetName: row["assetName"],
            assetCode: row["assetCode"],
            assetClassification: row["assetClassification"],
            assetCategory: row["assetCategory"],
            assetDateOfInclusion: row["assetDateOfInclusion"],
            assetManufacturedBy: row["assetManufacturedBy"],
            assetModel: row["assetModel"],
            manufacturedAssetSerialNo: row["manufacturedAssetSerialNo"],
            assetCapacity: row["assetCapacity"],
            vendorName: row["vendorName"]
        }));

         // Insert the data into MySQL
        await AssetDetails.bulkCreate(assetDetails);
    }
    res.send({ data: "Assets added successfully" });
};

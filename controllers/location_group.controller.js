const XLSX = require("xlsx");
const LocationGroup = require("../models/location_group.models");
const outputPath = "storage/outputs";

exports.import = async (req, res) => {

    //Read the imported file
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    //To check given file is empty or not
    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

        const locationGroup = data.map(row => ({
            locationGroup : row["locationGroup"],
            locationGroupUnderLocation : row["locationGroupUnderLocation"]
        }));

         // Insert the data into MySQL
        await LocationGroup.bulkCreate(locationGroup);
    }

    res.send({ data: "added successfully" });
};

const XLSX = require("xlsx");
const Location = require("../models/location.model");
const outputPath = "storage/outputs";

exports.import = async (req, res) => {

    //Read the imported file
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    //To check given file is empty or not
    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

        const location = data.map(row => ({
            locationName : row["locationName"],
            locationCode : row["locationCode"],
            departmentName : row["departmentName"],
            locationType : row["locationType"],
            locationGroup : row["locationGroup"],
        }));

         // Insert the data into MySQL
        await Location.bulkCreate(location);
    }

    res.send({ data: "Locations Added Successfully" });
};

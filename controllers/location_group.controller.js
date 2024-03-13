const XLSX = require("xlsx");
const LocationGroup = require("../models/location_group.models");
const outputPath = "storage/outputs";


exports.import = async (req, res) => {
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
        const locationGroup = data.map(row => ({
            location_group : row["location_group"],
            location_group_under_location : row["location_group_under_location"]
        }));
        await LocationGroup.bulkCreate(locationGroup);
    }
    res.send({ data: "added successfully" });
};

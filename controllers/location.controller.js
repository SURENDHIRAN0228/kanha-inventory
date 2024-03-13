const XLSX = require("xlsx");
const Location = require("../models/location.model");
const outputPath = "storage/outputs";


exports.import = async (req, res) => {
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
        const location = data.map(row => ({
            location_name : row["location_name"],
            location_code : row["location_code"],
            department_name : row["department_name"],
            location_type : row["location_type"],
            location_group : row["location_group"],
        }));
        await Location.bulkCreate(location);
    }
    res.send({ data: "added successfully" });
};

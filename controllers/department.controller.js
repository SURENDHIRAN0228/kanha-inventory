const XLSX = require("xlsx");
const Department = require("../models/department.model");
const outputPath = "storage/outputs";


exports.import = async (req, res) => {
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
        const department = data.map(row => ({
            department_name: row["department_name"],
            department_code: row["department_code"],
            department_email: row["department_email"],
            department_hod_name: row["department_hod_name"],
            department_hod_email: row["department_hod_email"],
            department_hod_phone: row["department_hod_phone"]
        }));
        await Department.bulkCreate(department);
    }
    res.send({ data: "added successfully" });
};

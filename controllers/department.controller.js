const XLSX = require("xlsx");
const Department = require("../models/department.model");
const outputPath = "storage/outputs";

exports.import = async (req, res) => {

    //Read the imported file
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    //To check given file is empty or not
    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

        const department = data.map(row => ({
            departmentName: row["departmentName"],
            departmentCode: row["departmentCode"],
            departmentEmail: row["departmentEmail"],
            departmentHODName: row["departmentHODName"],
            departmentHODEmail: row["departmentHODEmail"],
            departmentHODPhone: row["departmentHODPhone"]
        }));

         // Insert the data into MySQL
        await Department.bulkCreate(department);
    }

    res.send({ data: "File Imported! & Departments Added Successfully" });
};

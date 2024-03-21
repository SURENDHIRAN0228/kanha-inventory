const XLSX = require("xlsx");
const Classification = require("../models/classification.model");
const outputPath = "storage/outputs";

exports.import = async (req, res) => {

    //Read the imported file
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    //To check given file is empty or not
    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

        const classification = data.map(row => ({
            classification : row["classification"]
        }));
        
         // Insert the data into MySQL
        await Classification.bulkCreate(classification);
    }

    res.send({ data: "added successfully" });
};

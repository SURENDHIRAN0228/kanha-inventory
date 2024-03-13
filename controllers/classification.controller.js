const XLSX = require("xlsx");
const Classification = require("../models/classification.model");
const outputPath = "storage/outputs";


exports.import = async (req, res) => {
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
        const classification = data.map(row => ({
            classification : row["classification"]
        }));
        await Classification.bulkCreate(classification);
    }
    res.send({ data: "added successfully" });
};

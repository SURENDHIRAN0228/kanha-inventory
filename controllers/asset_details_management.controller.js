const XLSX = require("xlsx");
const AssetDetailsManagement = require("../models/asset_details_management.model");
const outputPath = "storage/outputs";

exports.import = async (req, res) => {

    //console.log('Request body:', req.files.file[0].filename);
    //console.log('Request file:', req.body);

    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
        const assetDetailsManagements = data.map(row => ({
        //const assetDetailsManagement = data.map(row => ({


            asset_name: row["asset_name"],
            asset_code: row["asset_code"],
            asset_classification: row["asset_classification"],
            asset_category: row["asset_category"],
            asset_department: row["asset_department"],
            asset_location: row["asset_location"],
            asset_model: row["asset_model"],
            manufactured_asset_serial_no: row["manufactured_asset_serial_no"],
            date_of_inclusion: row["date_of_inclusion"],
            manufactured_by: row["manufactured_by"],
            asset_capacity: row["asset_capacity"],
            asset_quantity: row["asset_quantity"],
            asset_description: row["asset_description"],
            asset_store_inward_number: row["asset_store_inward_number"],
            department_gatepass_number: row["department_gatepass_number"],
            warranty_number: row["warranty_number"],
            warranty_expiry_date: row["warranty_expiry_date"],
            insurance_number: row["insurance_number"],
            insurance_expiry_date: row["insurance_expiry_date"],
            spare_mrn: row["spare_mrn"],
            scrape_mrn: row["scrape_mrn"],
            asset_working_status: row["asset_working_status"],
            purchase_order_number: row["purchase_order_number"],
            date_of_purchase: row["date_of_purchase"],
            asset_company_purchased: row["asset_company_purchased"],
            invoice_number: row["invoice_number"],
            vendor_name: row["vendor_name"],
            asset_price: row["asset_price"]

           

        }));


        await AssetDetailsManagement.bulkCreate(assetDetailsManagements);
    }
    res.send({ data: "added successfully" });
};

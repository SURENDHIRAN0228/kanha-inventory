const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const AssetDetailsManagement = sequelize.define('asset_details_managements', {
    asset_name: {
        type: DataTypes.STRING
    },
    asset_code: {
        type: DataTypes.STRING
    },
    asset_classification: {
        type: DataTypes.STRING
    },
    asset_category: {
        type: DataTypes.STRING
    },
    asset_department: {
        type: DataTypes.STRING
    },
    asset_location: {
        type: DataTypes.STRING
    },
    asset_model: {
        type: DataTypes.STRING
    },
    manufactured_asset_serial_no: {
        type: DataTypes.STRING
    },
    date_of_inclusion: {
        type: DataTypes.NUMBER
    },
    manufactured_by: {
        type: DataTypes.STRING
    },
    asset_capacity: {
        type: DataTypes.NUMBER
    },
    asset_quantity: {
        type: DataTypes.NUMBER
    },
    asset_description: {
        type: DataTypes.STRING
    },
    asset_store_inward_number: {
        type: DataTypes.STRING
    },
    department_gatepass_number: {
        type: DataTypes.STRING
    },
    warranty_number: {
        type: DataTypes.STRING
    },
    warranty_expiry_date: {
        type: DataTypes.STRING
    },
    insurance_number: {
        type: DataTypes.STRING
    },
    insurance_expiry_date: {
        type: DataTypes.STRING
    },
    spare_mrn: {
        type: DataTypes.STRING
    },
    scrape_mrn: {
        type: DataTypes.STRING
    },
    asset_working_status: {
        type: DataTypes.STRING
    },
    purchase_order_number: {
        type: DataTypes.STRING
    },
    date_of_purchase: {
        type: DataTypes.STRING
    },
    asset_company_purchased: {
        type: DataTypes.STRING
    },
    invoice_number: {
        type: DataTypes.STRING
    },
    vendor_name: {
        type: DataTypes.STRING
    },
    asset_price: {
        type: DataTypes.NUMBER
    }
});

module.exports = AssetDetailsManagement;

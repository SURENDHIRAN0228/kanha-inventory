const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const AssetDetail = sequelize.define('asset_detail', {
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
    asset_date_of_inclusion: {
        type: DataTypes.STRING
    },
    asset_manufactured_by: {
        type: DataTypes.STRING
    },
    asset_model: {
        type: DataTypes.STRING
    },
    manufactured_asset_serial_no: {
        type: DataTypes.STRING
    },
    asset_capacity: {
        type: DataTypes.NUMBER
    },
    vendor_name: {
        type: DataTypes.STRING
    }
});

module.exports = AssetDetail;

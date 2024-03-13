const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const VendorDetail = sequelize.define('vendor_detail', {
    vendor_shop_name: {
        type: DataTypes.STRING
    },
    vendor_code: {
        type: DataTypes.STRING
    },
    shop_address: {
        type: DataTypes.STRING
    },
    contact_no: {
        type: DataTypes.STRING
    },
    vendor_email: {
        type: DataTypes.STRING
    },
    vendor_poc_name: {
        type: DataTypes.STRING
    },
    vendor_poc_contact_no: {
        type: DataTypes.STRING
    }
});

module.exports = VendorDetail;

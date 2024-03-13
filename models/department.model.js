const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const AssetDepartment = sequelize.define('asset_department', {
    department_name: {
        type: DataTypes.STRING
    },
    department_code: {
        type: DataTypes.STRING
    },
    department_email: {
        type: DataTypes.STRING
    },
    department_hod_name: {
        type: DataTypes.STRING
    },
    department_hod_email: {
        type: DataTypes.STRING
    },
    department_hod_phone: {
        type: DataTypes.NUMBER
    }
});

module.exports = AssetDepartment;

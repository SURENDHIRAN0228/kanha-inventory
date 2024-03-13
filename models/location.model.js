const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const AssetLocation = sequelize.define('asset_location', {
    location_name: {
        type: DataTypes.STRING
    },
    location_code: {
        type: DataTypes.STRING
    },
    department_name: {
        type: DataTypes.STRING
    },
    location_type: {
        type: DataTypes.STRING
    },
    location_group: {
        type: DataTypes.STRING
    }
});

module.exports = AssetLocation;

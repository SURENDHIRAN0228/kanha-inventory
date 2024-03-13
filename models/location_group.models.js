const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const AssetLocationGroup = sequelize.define('asset_location_group', {
    location_group: {
        type: DataTypes.STRING
    },
    location_group_under_location: {
        type: DataTypes.STRING
    }
});

module.exports = AssetLocationGroup;

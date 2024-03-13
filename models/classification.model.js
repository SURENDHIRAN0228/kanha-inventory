const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const AssetClassification = sequelize.define('asset_classification', {
    classification: {
        type: DataTypes.STRING
    }    
});

module.exports = AssetClassification;

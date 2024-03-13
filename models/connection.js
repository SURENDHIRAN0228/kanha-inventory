const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("kanha", "root", "", {
    host: "localhost",
    dialect: "mysql",
    operatorsAliases: "false",
    logging: false
});
module.exports=sequelize;

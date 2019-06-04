var mysql = require("mysql");

function createConnection() {
    var connection = mysql.createConnection({
        host: "192.168.43.246",
        port: "3306",
        user: "root",
        password: "wo123456",
        database: "my_blog"
    });
    return connection;
}

module.exports.createConnection = createConnection;
const mysql = require("mysql");
const dotenv = require("dotenv");
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log("db " + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async gethealthDataUser(usr_name) {
        console.log(usr_name);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM healthInfo where username = ?";
                connection.query(query, [usr_name], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            if (response.length > 0) {
                return response;
            } else {
                return { message: "no data found" };
            }
        } catch (error) {
            console.log(error);
            return { message: "error occur" };
        }
    }

    async addhealdata(info) {
        console.log(info);
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    "INSERT INTO healthInfo (name, blood_pressure, blood_oxygen, heartbeat, fall_detection) VALUES(?,?,?,?,?);";
                connection.query(
                    query,
                    [info.usr_name, info.bp, info.bo, info.hb, info.fall],
                    (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result);
                    }
                );
            });
            console.log(response);
            if (response.affectedRows != undefined && response.affectedRows > 0) {
                return { message: "row added" };
            } else {
                return { message: "error occur" };
            }
        } catch (error) {
            console.log(error);
            return { message: "error occur" };
        }
    }

    async getAlldata() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user;";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async createAccount(usr_name, pwd, device_code) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM devices WHERE code = ?";
                connection.query(query, [device_code], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            console.log(response.length);
            if (response.length > 0) {
                try {
                    const createDate = new Date();
                    const response1 = await new Promise((resolve, reject) => {
                        const query =
                            "INSERT INTO user (username, password, device_Code, created_time) VALUES(?,?,?,?);";
                        connection.query(
                            query,
                            [usr_name, pwd, device_code, createDate],
                            (err, result) => {
                                if (err) reject(new Error(err.message));
                                resolve(result);
                            }
                        );
                    });
                    console.log(response1);
                    return { message: "Account Created!!" };
                } catch (error) {
                    console.log(error);
                    return { message: "Error occur please try again!!" };
                }
            } else {
                return { message: "Device code not exist!!" };
            }
        } catch (error) {
            console.log(error);
            return { message: "Error occur please try again!!" };
        }
    }
}

module.exports = DbService;

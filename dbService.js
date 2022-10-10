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

    // async isCodeExist(code) {
    //     try {
    //         const response = await new Promise((resolve, reject) => {
    //             const query = "SELECT * FROM devices WHERE code = ?";
    //             connection.query(query, [code], (err, result) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(result);
    //             });
    //         });
    //         console.log(response.length);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

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

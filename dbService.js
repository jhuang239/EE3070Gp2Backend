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

    async gethealthDataUser(username) {
        console.log(username);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM healthInfo where username = ?";
                connection.query(query, [username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            if (response.length > 0) {
                console.log(response);
                return response;
            } else {
                return { message: "no data found" };
            }
        } catch (error) {
            console.log(error);
            return { message: "error occur" };
        }
    }

    async getLatestHealtData(username) {
        console.log(username);
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    "SELECT * FROM healthInfo where username = ? ORDER BY created_time DESC LIMIT 1";
                connection.query(query, [username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            if (response.length > 0) {
                console.log(response);
                return response[0];
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
            const date = new Date();
            const response = await new Promise((resolve, reject) => {
                const query =
                    "INSERT INTO healthInfo (username, blood_pressure, blood_oxygen, heartbeat, created_time) VALUES(?,?,?,?,?);";
                connection.query(
                    query,
                    [
                        info.username,
                        info.bp_high,
                        info.bp_low,
                        info.bo,
                        info.hb,
                        info.temperature,
                        date,
                    ],
                    (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result);
                    }
                );
            });
            console.log(response);
            if (response.affectedRows != undefined && response.affectedRows > 0) {
                return { success: true, message: "row added" };
            } else {
                return { success: false, message: "cannot insert" };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "error occur" };
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

    async createAccount(username, pwd, device_code) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM devices WHERE code = ?";
                connection.query(query, [device_code], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            console.log(response[0].code);
            //console.log(response.length);
            if (response[0].code == device_code) {
                try {
                    const createDate = new Date();
                    const response1 = await new Promise((resolve, reject) => {
                        const query =
                            "INSERT INTO user (username, password, device_Code, created_time) VALUES(?,?,?,?);";
                        connection.query(
                            query,
                            [username, pwd, device_code, createDate],
                            (err, result) => {
                                if (err) reject(new Error(err.message));
                                resolve(result);
                            }
                        );
                    });
                    console.log(response1);
                    return { success: true, message: "Account Created!!" };
                } catch (error) {
                    console.log(error);
                    return { success: false, message: "Error occur please try again!!" };
                }
            } else {
                return { message: "Device code not exist!!" };
            }
        } catch (error) {
            console.log(error);
            return { message: "Error occur please try again!!" };
        }
    }

    async Login(info) {
        console.log(info);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user WHERE username = ?";
                connection.query(query, [info.username, info.pwd], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            if (response[0].username == info.username && response[0].password == info.pwd) {
                return { success: true, message: "login success" };
            } else {
                return { success: false, message: "wrong account name or password" };
            }
            // console.log(response[0].username);
            // if (response[0].username == info.username && response[0].password == info.pwd) {
            //     const date = new Date();
            //     const code = response[0].device_Code;
            //     const response1 = await new Promise((resolve, reject) => {
            //         const query =
            //             "INSERT INTO LoginRecord (username, active, code, time) VALUES(?,?,?,?);";
            //         connection.query(query, [info.username, 1, code, date], (err, results) => {
            //             if (err) reject(new Error(err.message));
            //             resolve(results);
            //         });
            //     });
            //     //console.log(response1.affectedRows);
            //     return { success: true, message: "successfully login" };
            // } else {
            //     return { success: false, message: "wrong account or password" };
            // }
        } catch (error) {
            console.log(error);
            return { success: false, message: "Error occur please try again!!" };
        }
    }

    // async updateLoginRecord(info) {
    //     try {
    //         const response = await new Promise((resolve, reject) => {
    //             const query = "UPDATE LoginRecord SET active = 0 WHERE username = ? AND code = ?";
    //             connection.query(query, [info.username, info.code], (err, result) => {
    //                 if (err) reject(new Error(error.message));
    //                 resolve(result);
    //             });
    //         });
    //         //console.log(response);
    //         return { success: true, message: "data updated!!" };
    //     } catch (error) {
    //         console.log(error);
    //         return { success: false, message: "Error occur please try again!!" };
    //     }
    // }

    async getLoginByCode(code) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM LoginRecord WHERE code = ? ORDER BY time DESC LIMIT 1";
                connection.query(query, [code], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            if (response[0].active == 1) {
                return { success: true, username: response[0].username };
            } else {
                return { success: false, message: "no latest active login activity" };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "Error occur please try again!!" };
        }
    }
}

module.exports = DbService;

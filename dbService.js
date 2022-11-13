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

    async updateInfo(info) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    "UPDATE user SET password = ?, email = ?, fullname = ?, age = ?, gender = ?, height = ?, weight = ?, device_Code = ? WHERE username = ?;";
                connection.query(
                    query,
                    [
                        info.pwd,
                        info.email,
                        info.fullname,
                        info.age,
                        info.gender,
                        info.height,
                        info.weight,
                        info.device_code,
                        info.username,
                    ],
                    (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result);
                    }
                );
            });
            if (response.affectedRows > 0) {
                return { success: true, message: "row updated" };
            } else {
                return { success: false, message: "can not update" };
            }
        } catch (error) {
            console.log(error.message);
            return { success: false, message: "error occur" };
        }
    }

    async getAllUser() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user;";
                connection.query(query, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error.message);
            return { success: false, message: "error occur" };
        }
    }

    async getUserInfo(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user WHERE username = ?;";
                connection.query(query, [username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response[0];
        } catch (error) {
            console.log(error);
            return { success: false, message: "error occur" };
        }
    }

    async getAllEcg(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT ecg, created_time FROM healthInfo WHERE username = ?;";
                connection.query(query, [username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            if (response.length > 0) {
                console.log(response);
                return response;
            } else {
                return { success: false, message: "no data found" };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "error occur" };
        }
    }

    async getLatestEcg(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    "SELECT ecg FROM healthInfo where username = ? ORDER BY created_time DESC LIMIT 1";
                connection.query(query, [username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            if (response.length > 0) {
                console.log(response);
                return response;
            } else {
                return { success: false, message: "no data found" };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "error occur" };
        }
    }

    async getCode(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT device_Code FROM user WHERE username = ?;";
                connection.query(query, [username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            if (response.length > 0) {
                return response;
            } else {
                return { success: false, message: "no data found" };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "error occur" };
        }
    }

    async gethealthDataUser(username) {
        console.log(username);
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    "SELECT * FROM healthInfo where username = ? ORDER BY created_time DESC";
                connection.query(query, [username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            if (response.length > 0) {
                console.log(response);
                return response;
            } else {
                return { success: false, message: "no data found" };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "error occur" };
        }
    }

    // async getLatestHealtData(username) {
    //     console.log(username);
    //     try {
    //         const response = await new Promise((resolve, reject) => {
    //             const query =
    //                 "SELECT * FROM healthInfo WHERE username = ? ORDER BY created_time DESC LIMIT 2";
    //             connection.query(query, [username], (err, result) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(result);
    //             });
    //         });
    //         if (response.length > 0) {
    //             console.log(response);
    //             return response[0];
    //         } else {
    //             return { success: false, message: "no data found" };
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         return { success: false, message: "error occur" };
    //     }
    // }

    async getSuggestions(username) {
        console.log(username);
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    "SELECT * FROM suggestions WHERE receiver = ? ORDER BY created_time DESC;";
                connection.query(query, [username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error);
            return { success: false, message: "error occur" };
        }
    }

    async sendSuggestion(info) {
        try {
            const date = new Date();
            const response = await new Promise((resolve, reject) => {
                const query =
                    "INSERT INTO suggestions (receiver, sender, topic, content, created_time) VALUES (?,?,?,?,?);";
                connection.query(
                    query,
                    [info.receiver, info.sender, info.topic, info.content, date],
                    (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result);
                    }
                );
            });
            if (response.affectedRows != undefined && response.affectedRows > 0) {
                return { success: true, message: "row added" };
            } else {
                return { success: false, message: "cannot insert" };
            }
        } catch (error) {
            console.log(error.message);
            return { success: false, message: "error occur" };
        }
    }

    async getMessage() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * from messages ORDER BY created_time DESC;";
                connection.query(query, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error.message);
            return { success: false, message: "error occur" };
        }
    }

    async addMessage(info) {
        try {
            const date = new Date();
            const response = await new Promise((resolve, reject) => {
                const query =
                    "INSERT INTO messages (username, topic, content, seen, created_time) VALUES(?,?,?,?,?);";
                connection.query(
                    query,
                    [info.username, info.topic, info.content, false, date],
                    (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result);
                    }
                );
            });
            if (response.affectedRows != undefined && response.affectedRows > 0) {
                return { success: true, message: "row added" };
            } else {
                return { success: false, message: "cannot insert" };
            }
        } catch (error) {
            console.log(error.message);
            return { success: false, message: "error occur" };
        }
    }

    async addhealdata(info) {
        console.log(info);
        try {
            const date = new Date();
            const response = await new Promise((resolve, reject) => {
                const query =
                    "INSERT INTO healthInfo (username, blood_pressure_high, blood_pressure_low, temperature, blood_oxygen, heartbeat, room_temperature, humidity, ecg, created_time) VALUES(?,?,?,?,?,?,?,?,?,?);";
                connection.query(
                    query,
                    [
                        info.username,
                        info.blood_pressure_high,
                        info.blood_pressure_low,
                        info.temperature,
                        info.blood_oxygen,
                        info.heartbeat,
                        info.room_temperature,
                        info.humidity,
                        JSON.stringify(info.ecgData),
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
            return { success: false, message: error };
        }
    }

    async getAlldata() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM healthInfo;";
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

    async createAccount(info) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM devices WHERE code = ?";
                connection.query(query, [info.device_code], (err, result) => {
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
                            "INSERT INTO user (username, password, fullname, age, gender, height, weight, device_Code, email, created_time) VALUES(?,?,?,?,?,?,?,?,?,?);";
                        connection.query(
                            query,
                            [
                                info.username,
                                info.pwd,
                                info.fullname,
                                info.age,
                                info.gender,
                                info.height,
                                info.weight,
                                info.device_code,
                                info.email,
                                createDate,
                            ],
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
        } catch (error) {
            console.log(error);
            return { success: false, message: "Error occur please try again!!" };
        }
    }

    async DrLogin(info) {
        console.log(info);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user_doctor WHERE userid = ?";
                connection.query(query, [info.username, info.pwd], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            if (response[0].username == info.userid && response[0].password == info.pwd) {
                return { success: true, message: "login success" };
            } else {
                return { success: false, message: "wrong account name or password" };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "Error occur please try again!!" };
        }
    }
}

module.exports = DbService;

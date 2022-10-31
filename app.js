const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const DbService = require("./dbService");
const { response } = require("express");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.get("/", (req, res) => res.send("Testing"));

//update login record
// app.post("/updateLoginRecord", (request, response) => {
//     //console.log(request.body);
//     const info = ({ username, code } = request.body);
//     const db = DbService.getDbServiceInstance();
//     const result = db.updateLoginRecord(info);
//     result.then((data) => response.json(data)).catch((err) => console.log(error));
// });

//get login record by device code
// app.get("/getLoginByCode", (request, response) => {
//     const code = request.query.code;
//     console.log(code);
//     const db = DbService.getDbServiceInstance();
//     const result = db.getLoginByCode(code);
//     result.then((data) => response.json(data)).catch((err) => console.log(error));
// });

//login
app.get("/login", (request, response) => {
    const info = ({ username, pwd } = request.body);
    console.log(info);
    // const usr_name = request.query.usr_name;
    // const pwd = request.query.pwd;
    // const info = {usr_name, pwd};

    const db = DbService.getDbServiceInstance();
    const result = db.Login(info);
    result.then((data) => response.json(data)).catch((err) => console.log(error));
});

//create
app.post("/addAccount", (request, response) => {
    const { username, pwd, device_code } = request.body;
    console.log(username, pwd, device_code);
    const db = DbService.getDbServiceInstance();

    const result = db.createAccount(username, pwd, device_code);
    result;
    result.then((data) => response.json(data)).catch((err) => console.log(err));
    //const {usr_name, pwd, device_code} = request.body;
});

//read
app.get("/getAll", (request, response) => {
    const db = DbService.getDbServiceInstance();
    const result = db.getAlldata();
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//insert health data
app.post("/addHealthData", (request, response) => {
    //console.log(request.body);
    const info = ({
        username,
        blood_pressure_high,
        blood_pressure_low,
        temperature,
        blood_oxygen,
        heartbeat,
        room_temperature,
        humidity,
    } = request.body);
    //console.log(info);
    const db = DbService.getDbServiceInstance();
    const result = db.addhealdata(info);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//get health data by username
app.get("/getHealthDataByUser", (request, response) => {
    const { username } = request.body;
    console.log(username);
    const db = DbService.getDbServiceInstance();
    const result = db.gethealthDataUser(username);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//get latest health data by username
app.get("/getLatestDataByUser", (request, response) => {
    console.log(request.body);
    const username = request.query.username;
    const db = DbService.getDbServiceInstance();
    const result = db.getLatestHealtData(username);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

// app.post("/uploadBloodPressure", (request, response) => {
//     const info = ({ username, blood_pressure_high, blood_pressure_low } = request.body);
//     console.log(request.body);
//     const db = DbService.getDbServiceInstance();
//     const result = db.uploadBloodPressure(info);
//     result.then((data) => response.json(data)).catch((err) => console.log(err));
// });

// app.get("/getcode", (request, response) => {
//     const db = DbService.getDbServiceInstance();
//     const { code } = request.body;
//     const result = db.isCodeExist(code);
//     result.then((data) => response.json({ data: data })).catch((err) => console.log(err));
// });

//update

//delete

app.listen(process.env.PORT, () => console.log("app os running"));

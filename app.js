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

//send message
app.post("/sendMessage", (request, response) => {
    const info = ({ username, topic, content } = request.body);
    console.log(info);
    const db = DbService.getDbServiceInstance();
    const result = db.addMessage(info);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//Dr login
app.post("/login/dr", (request, response) => {
    const info = ({ username, pwd } = request.body);
    const db = DbService.getDbServiceInstance();
    const result = db.DrLogin(info);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//login
app.post("/login", (request, response) => {
    const info = ({ username, pwd } = request.body);
    console.log(info);

    const db = DbService.getDbServiceInstance();
    const result = db.Login(info);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//create account
app.post("/addAccount", (request, response) => {
    const info = ({ username, fullname, pwd, device_code, age, height, weight, gender, email } =
        request.body);
    console.log(info);
    const db = DbService.getDbServiceInstance();

    const result = db.createAccount(info);
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
        ecgData,
        room_temperature,
        humidity,
    } = request.body);
    //console.log(info);
    const db = DbService.getDbServiceInstance();
    const result = db.addhealdata(info);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//update user info
app.post("/updateInfo", (request, response) => {
    const info = ({ username, fullname, pwd, device_code, age, height, weight, gender, email } =
        request.body);
    const db = DbService.getDbServiceInstance();
    const result = db.updateInfo(info);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//get user info
app.get("/getUserInfo", (request, response) => {
    const username = request.query.username;
    const db = DbService.getDbServiceInstance();
    const result = db.getUserInfo(username);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//get device code
app.get("/getCode", (request, response) => {
    const username = request.query.username;
    const db = DbService.getDbServiceInstance();
    const result = db.getCode(username);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//get all ecg
app.get("/getEcgByUser", (request, response) => {
    const username = request.query.username;
    const db = DbService.getDbServiceInstance();
    const result = db.getAllEcg(username);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//get latest ecg
app.get("/getLatestEcgByUser", (request, response) => {
    const username = request.query.username;
    const db = DbService.getDbServiceInstance();
    const result = db.getLatestEcg(username);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//get health data by username
app.get("/getHealthDataByUser", (request, response) => {
    console.log(request.query);
    const username = request.query.username;
    console.log(username);
    const db = DbService.getDbServiceInstance();
    const result = db.gethealthDataUser(username);
    result.then((data) => response.json(data)).catch((err) => console.log(err));
});

//get latest health data by username
// app.get("/getLatestDataByUser", (request, response) => {
//     const username = request.query.username;
//     const db = DbService.getDbServiceInstance();
//     const result = db.getLatestHealtData(username);
//     result.then((data) => response.json(data)).catch((err) => console.log(err));
// });

app.listen(process.env.PORT, () => console.log("app os running"));

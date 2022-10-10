const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const DbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post("/insert", (request, response) => {
    const { usr_name, pwd, device_code } = request.body;
    console.log(usr_name, pwd, device_code);
    const db = DbService.getDbServiceInstance();

    const result = db.createAccount(usr_name, pwd, device_code);
    result;
    result.then((data) => response.json({ data: data })).catch((err) => console.log(err));
    //const {usr_name, pwd, device_code} = request.body;
});

//read
app.get("/getAll", (request, response) => {
    const db = DbService.getDbServiceInstance();

    const result = db.getAlldata();
    result.then((data) => response.json({ data: data })).catch((err) => console.log(err));
});

// app.get("/getcode", (request, response) => {
//     const db = DbService.getDbServiceInstance();
//     const { code } = request.body;
//     const result = db.isCodeExist(code);
//     result.then((data) => response.json({ data: data })).catch((err) => console.log(err));
// });

//update

//delete

app.listen(process.env.PORT, () => console.log("app os running"));

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = express_1.default();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.send('<h1>😁 NodeJS team up with MSSQL</h1>');
});
app.use('/api/employees', require('./api/employees'));
app.listen(PORT, () => {
    console.log(`Server started running on ${PORT} and env is ${process.env.NODE_ENV}`);
});

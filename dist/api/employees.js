"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const msnodesqlv8_1 = __importDefault(require("mssql/msnodesqlv8"));
const router = express_1.default.Router();
const connectionString = process.env.CONNECTION_STRING;
// POST: api/employees/
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = req.body;
        const pool = new msnodesqlv8_1.default.ConnectionPool(connectionString);
        yield pool.connect();
        const result = yield pool.request()
            .input('Code', employee.Code)
            .input('Salary', employee.Salary)
            .input('Job', employee.Job)
            .input('Department', employee.Department)
            .input('Name', employee.Name)
            .query(`
                INSERT INTO Employee (Code, Salary, Job, Department, Name) 
                OUTPUT inserted.Id 
                VALUES (@Code, @Salary, @Job, @Department, @Name);
            `);
        employee.Id = result.recordset[0].Id;
        res.json(employee);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
// PUT: api/employees/:id
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = +req.params.id;
        const newEmployee = req.body;
        const pool = new msnodesqlv8_1.default.ConnectionPool(connectionString);
        yield pool.connect();
        const result = yield pool.request()
            .input('Id', Id)
            .query(`SELECT * FROM Employee WHERE Id = @Id`);
        let employee = result.recordset.length ? result.recordset[0] : null;
        if (employee) {
            yield pool.request()
                .input('Id', Id)
                .input('Code', newEmployee.Code)
                .input('Salary', newEmployee.Salary)
                .input('Job', newEmployee.Job)
                .input('Department', newEmployee.Department)
                .input('Name', newEmployee.Name)
                .query(`
                    UPDATE Employee SET
                        Code = @Code, 
                        Salary = @Salary, 
                        Job = @Job, 
                        Department = @Department, 
                        Name = @Name
                    WHERE Id = @Id;
                `);
            employee = Object.assign(Object.assign({}, employee), newEmployee);
            res.json(employee);
        }
        else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
// DELETE: api/employees/:id
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = +req.params.id;
        const pool = new msnodesqlv8_1.default.ConnectionPool(connectionString);
        yield pool.connect();
        const result = yield pool.request()
            .input('Id', Id)
            .query(`SELECT * FROM Employee WHERE Id = @Id`);
        let employee = result.recordset.length ? result.recordset[0] : null;
        if (employee) {
            yield pool.request()
                .input('Id', Id)
                .query(`DELETE FROM Employee WHERE Id = @Id;`);
            res.json(employee);
        }
        else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
// GET: api/employees/:id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = +req.params.id;
        const pool = new msnodesqlv8_1.default.ConnectionPool(connectionString);
        yield pool.connect();
        const result = yield pool.request()
            .input('Id', Id)
            .query(`SELECT * FROM Employee WHERE Id = @Id`);
        const employee = result.recordset.length ? result.recordset[0] : null;
        if (employee) {
            res.json(employee);
        }
        else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
// GET: api/employees
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = new msnodesqlv8_1.default.ConnectionPool(connectionString);
        yield pool.connect();
        const result = yield pool.request().query(`SELECT * FROM Employee ORDER BY Id DESC`);
        const employees = result.recordset;
        res.json(employees);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
module.exports = router;

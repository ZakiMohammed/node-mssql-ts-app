import express, { Router, Request, Response } from 'express';
import client, { ConnectionPool } from 'mssql/msnodesqlv8';
import { Employee } from '../models/employee';
import { Summary, SummaryDetail } from '../models/summary';

const router: Router = express.Router();
const connectionString: string = process.env.CONNECTION_STRING as string;

// POST: api/employees/
router.post('/', async (req: Request, res: Response) => {
    try {

        const employee = req.body as Employee;

        const pool: ConnectionPool = new client.ConnectionPool(connectionString);
        await pool.connect();

        const result = await pool.request()
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
        
        employee.Id = (result.recordset[0] as Employee).Id;
        res.json(employee);

    } catch (error) {
        res.status(500).json(error);
    }
});

// PUT: api/employees/:id
router.put('/:id', async (req: Request, res: Response) => {
    try {

        const Id: number = +req.params.id;
        const newEmployee = req.body as Employee;

        const pool = new client.ConnectionPool(connectionString);
        await pool.connect();

        const result = await pool.request()
            .input('Id', Id)
            .query(`SELECT * FROM Employee WHERE Id = @Id`);

        let employee: Employee = result.recordset.length ? result.recordset[0] : null;
        if (employee) {
            await pool.request()
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

            employee = {...employee, ...newEmployee};

            res.json(employee);

        } else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE: api/employees/:id
router.delete('/:id', async (req: Request, res: Response) => {
    try {

        const Id: number = +req.params.id;

        const pool = new client.ConnectionPool(connectionString);
        await pool.connect();
        
        const result = await pool.request()
            .input('Id', Id)
            .query(`SELECT * FROM Employee WHERE Id = @Id`);
        
        let employee: Employee = result.recordset.length ? result.recordset[0] : null;
        if (employee) {
            await pool.request()
                .input('Id', Id)
                .query(`DELETE FROM Employee WHERE Id = @Id;`);
            res.json(employee);
        } else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET: api/employees/search?name=
router.get('/search', async (req: Request, res: Response) => {
    try {

        const name: string = req.query.name as string;

        const pool = new client.ConnectionPool(connectionString);
        await pool.connect();

        const result = await pool.request()
            .input('Name', name)
            .execute(`SearchEmployee`);
        const employees: Employee[] = result.recordset;

        res.json(employees);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET: api/employees/summary
router.get('/summary', async (req: Request, res: Response) => {
    try {
        const pool = new client.ConnectionPool(connectionString);
        await pool.connect();

        const result = await pool.request()
            .execute(`GetSalarySummary`);

        const summary: Summary = {
            Department: result.recordsets[0] as unknown as SummaryDetail,
            Job: result.recordsets[1] as unknown as SummaryDetail,
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET: api/employees/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {

        const Id: number = +req.params.id;

        const pool = new client.ConnectionPool(connectionString);
        await pool.connect();

        const result = await pool.request()
            .input('Id', Id)
            .query(`SELECT * FROM Employee WHERE Id = @Id`);
        const employee: Employee = result.recordset.length ? result.recordset[0] : null;

        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET: api/employees
router.get('/', async (req: Request, res: Response) => {
    try {
        const pool = new client.ConnectionPool(connectionString);
        await pool.connect();

        const result = await pool.request().query(`SELECT * FROM Employee ORDER BY Id DESC`);
        const employees: Employee[] = result.recordset;

        res.json(employees);

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
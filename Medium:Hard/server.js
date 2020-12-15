const Joi = require("joi");
var express = require("express");
var app = express();
var data = require("./database.json");

app.use(express.json());

// POST::localhost:2000/employees = Inserts new employee into your data
// GET::localhost:2000/employees = Returns json with information from all employees
// GET::localhost:2000/employees/1 = Returns json with the information from that specific employee
// PUT::localhost:2000/employees/1 = Updates information for specified employee
// DELETE::localhost:2000/employees/1 = Removes the employee with that ID from the data

app.get("/employees", (req, res) => {
  if (!data) {
    res.status(404).send("Could not find information");
  }
  res.send(data);
});
// This code from the previous challenge already had an endpoint err for an incorrect employee ID
app.get("/employees/:id", (req, res) => {
  const findEmployee = data.employees.find((employee) => {
    return parseInt(req.params.id) === employee.id;
  });
  if (!findEmployee) {
    res.status(404).send("Could not find employee"); // This is what will happen if the employee can't be found
  }
  res.send(findEmployee);
});

app.post("/employees", (req, res) => {
  const schema = {
    name: Joi.string().min(3).required(),
    salary: Joi.number().required(),
    department: Joi.string().required(),
  };

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const addWorker = {
    id: data.employees.length + 1,
    name: req.body.name,
    salary: req.body.salary,
    department: req.body.department,
  };
  if (!addWorker) {
    res.status(404).send("Could not find information");
  }

  data.employees.push(addWorker);

  res.send(addWorker);
  return;
});

app.put("/employees/:id", (req, res) => {
  const findEmployee = data.employees.find((employee) => {
    return parseInt(req.params.id) === employee.id;
  });
  if (!findEmployee) {
    res.status(404).send("Could not find employee"); // This is what will happen if the employee can't be found
  }

  const { error } = validateEmployee(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  findEmployee.name = req.body.name;
  findEmployee.salary = req.body.salary;
  findEmployee.department = req.body.department;
  res.send(findEmployee);
});

const validateEmployee = (findEmployee) => {
  const schema = {
    name: Joi.string().min(3).required(),
    salary: Joi.number().required(),
    department: Joi.string().required(),
  };

  return Joi.validate(findEmployee, schema);
};

app.delete("/employees/:id", (req, res) => {
  const findEmployee = data.employees.find((employee) => {
    return parseInt(req.params.id) === employee.id;
  });
  if (!findEmployee) {
    res.status(404).send("Could not find employee"); // This is what will happen if the employee can't be found
  }

  const index = data.employees.indexOf(findEmployee);
  data.employees.splice(index, 1);

  res.send(findEmployee);
});

const port = process.env.PORT || 2000;

app.listen(2000);

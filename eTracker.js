const mysql = require("mysql");
const inquirer = require("inquirer");
const pass = require("./config");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: pass,
  database: "employee_DB",
});

function startList() {
  inquirer.prompt(
    {
    type: "list",
    message: "What would you like to do?",
    name: "option",
    choices: [
      "View all Departments",
      "View all Roles",
      "View all Employees",
      "Add Departments",
      "Add Roles",
      "Add Employees",
      "Delete Departments",
      "Delete Employee",
      "Delete Roles",
      "Update Employee Roles",
      "Update Employee Manager",
      "View Employee By Manager",
      "Exit"
    ]
  }).then(answers => {
    switch (answer.option) {
      case "View all Departments":
        viewAllDepartments();
        break;
      
      case "View All Roles":
        viewAllRoles();
        break;
      
      case "View All Employees":
        viewAllEmployees();
        break;
      
      case "Add Department":
        addDepartment();
        break;

      case "Add Roles":
        addRoles();
        break;
      
      case "Add Employees":
        addEmployee();
        break;

      case "Delete Roles":
        deleteRole();
        break;

      case "Update Employee Manager":
        updateManager();
        break
      
      case "View Employee By Manager":
        viewEmployeeByManager();
        break;

      case "Exit":
        connection.end();
        console.log("Good bye");
        break;  
    }
  })
}

// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  startList();
});
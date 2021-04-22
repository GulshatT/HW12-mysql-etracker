const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: pass,
  database: "employee_DB";
});

const start = () {
  inquirer.prompt({
    type: "list",
    message: "What would you like to do?",
    name: "option",
    choices: [
      "View all departments",
      "View all Roles",

    ]
  })
}

// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  start();
});
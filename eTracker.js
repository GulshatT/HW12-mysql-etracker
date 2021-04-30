const mysql = require("mysql");
const inquirer = require("inquirer");
const pass = require("./img/config");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Be sure to update with your own MySQL password!
  password: pass,
  database: "employee_db",
});

//creating list prompt 
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
      "Add department",
      "Add employee",
      "Delete department",
      "Delete employee",
      "Exit"
    ]
  }).then(answer => {
    console.log(answer.option)
    switch (answer.option) {
      case "View all Departments":
        viewAllDepartments();
        break;
      
      case "View all Roles":
        console.log("here")
        viewAllRoles();
        break;
      
      case "View all Employees":
        viewAllEmployees();
        break;
      
      case "Add department":
        console.log(answer.option)
        addDepartment();
        break;
      
      case "Add employee":
        addEmployee();
        break;

      case "Delete employee":
        deleteEmployee();
        break;

      case "Delete department":
        deleteDepartment();
        break

      case "Exit":
        connection.end();
        console.log("Good bye");
        break;  
    }
  })
}

//creating functions
function viewAllDepartments() {
  connection.query(
    "SELECT * FROM Department", (err, res) => {
      if (err) {
        throw err;
      }
      console.table(res);
      startList();
    }
  )
}

function viewAllRoles() {
  console.log("roles")
  connection.query(
    "SELECT * FROM Role", (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    startList();
    }
  )
}

function viewAllEmployees() {
  console.log("employees")
  connection.query(
    "SELECT * FROM Employee", (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    startList();
    }
  )
}

function addDepartment() {
  inquirer.prompt([
    {
      type: "input",
      name:"department",
      message: "Please add a department name:"
    }
  ]).then(answer => {
    console.log(answer);
    connection.query("INSERT INTO department SET?", { name: answer.department }, (err, res) => {
      if (err) throw err;
      console.log("Added new department");
      startList();
    });
  });
}

function addEmployee() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    inquirer.prompt([
     {
       type: "input",
       name: "first_name",
       message: " please add name",
     },
     {
       type: "input",
       name: "last_name",
       message: "please add the last name"
     },
     {
       type: "list",
       name: "role",
       choices:
       function() {
         var roleArray = [];
         for (let i = 0; i < res.length; i++) {
           roleArray.push(res[i].title);
         }
         return roleArray;
       },
       message: "New employee Role"
     }
    ]).then(function (answer) {
      let roleID;
      for (let j=0; j < res.length; j++) {
        if (res[j].title == answer.role) {
          roleID = res[j].id;
          console.log(roleID);
        }
      };
      connection.query("INSERT INTO employee SET?",
      {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: roleID,
      }, 
      function (err) {
        if (err) throw err;
        console.log("added new employee");
        startList();
      })
    })
  }) 
}

//delete functions for employee and department
async function deleteEmployee() {
  connection.query = util.promisify(connection.query);
  const employees = await connection.query("SELECT * FROM employee");
  const employeeArray = employees.map(({first_name, last_name, id}) => ({
    name: first_name + " " + last_name,
    value: id
  }))
  console.log(employees);
  inquirer.prompt({
    type: "list",
    name: "deleteEmployee",
    message: "Please confirm that you want delete this employee",
    choices: employeeArray
  }).then(function (answer) {
    console.log(answer);
    var query = "DELETE FROM employee WHERE ?";
    var newId = answer.deleteEmployee;
    console.log(newId);
    connection.query(query, { id: newId}, function (err, res){
      startList();
    });
  })
}

async function deleteDepartment() {
  connection.query = util.promisify(connection.query);
  const departments = await connection.query("SELECT * FROM department");
  const departmentArray = departments.map(({department_name, id}) => ({
    name: department_name,
    value: id
  }))
  console.log(departments);
  inquirer.prompt({
    type: "list",
    name: "deleteDepartment",
    message: "Please confirm that you want delete this department",
    choices: departmentArray
  }).then(function (answer) {
    console.log(answer);
    var query = "DELETE FROM department WHERE ?";
    var newId = answer.deleteDepartment;
    console.log(newId);
    connection.query(query, { id: newId}, function (err, res){
      startList();
    });
  })
}
// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  startList();
});
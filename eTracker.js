const mysql = require("mysql");
const inquirer = require("inquirer");
const pass = require("./img/config");

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
  }).then(answer => {
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
  connection.query("select ro.title as Role_title, ro.salary as Salary , dept.name as DepartmentName from Role ro left join department as dept on dept.id = ro.department_id", (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    startList();
    }
  )
}
function viewAllEmployees() {
  const sql = 'Select emp.id as EmployeeID, concat(emp.first_name,"  ",emp.last_name ) as EmployeeName , ro.title as Job_tittle, ro.salary as Salary,dept.name as Department_Name,concat(emp2.first_name,"  ",emp2.last_name) as ManagerName from employee_DB.employee as emp left join employee_DB.employee as emp2 on emp2.id=emp.manager_id left join employee_DB.Role as ro on emp.role_id=ro.id left join employee_DB.department as dept on dept.id = ro.department_id';
  connection.query (
    sql, (err, res) => {
      if (err) {
        throw err;
      }
      console.table(res)
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
    connection.query("INSERT INTO department SET?", {name: answer.department}, (err, res) => {
      if (err) throw err;
      console.log("Added new department");
      startList();

    });
  });
}

function addRoles() {
  console.log("add roles");

  connection.promise().query("SELECT * FROM Department")
  .then((res) => {
    //make the choice department arr
    return res[0].map(dept => {
      return {
        name: dept.name,
        value: dept.id
      }
    })
  }).then((departments) => {
    return inquirer.prompt([
      {
        type: "input",
        name: "roles",
        message: "Please add a role"
      },
      {
        type: "input",
        name: "salary",
        message: "Please eneter a salary:"
      },
      {
        type: "list",
        name: "depts",
        choices: departments,
        message: "Please select your department"
      }
    ])
  }).then(answer => {
    console.log(answer);
    return connection.promise().query("INSERT INTO role SET?", {title: answer.roles, salary: answer.salary, department_id: answer.depts});
  }).then(res => {
    console.log("added new Role");
    startList();
  }).catch(err => {
    throw err
  });
}

function selectRole() {
  return connection.promise().query("SELECT * FROM role")
  .then(res => {
    return res[0].map(role => {
      return {
        name: role.title,
        value: role.id
      }
    })
  })
}

function selectManager() {
  return connection.promise().query("SELECT * FROM employee")
  .then(res => {
    return res[0].map(manager=> {
      return {
        name:`${manager.first_name} ${manager.last_name}`,
        value: manager.id,
      }
    })
  })
}

async function addEmployee() {
  const managers = await selectManager();
  inquirer.prompt([
    {
      type: "input",
      name: "firstname",
      message: "Enter their first name"
    }, 
    {
      type: "input",
      name: "lastname", 
      message: "Enter their last name"
    },
    {
      type: "input",
      name: "role",
      message: "what is their role?",
      choices: await selectRole()
    },
    {
      type: "list",
      name: "manager",
      message: "What is their manager's name?",
      choices: managers
    }
  ]).then (function (res) {
    let roleId = res.role
    let managerId = res.manager
    
    console.log({managerId});
    connection.query("INSERT INTO Employee SET?",
    {
      firs_name: res.firstname,
      last_name: res.lastname,
      manager_id: managerId,
      role_id: roleId
    }, 
    
    function (err) {
      if (err) throw err
      console.table(res)
      startList();
})
  })
}

function updateEmployeeRole() {
  connection.promise().query("SELECT * FROM eployee")
  .then((res) => {
    return res[0].map(employee => {
      return {
        name: employee.first_name,
        value: employee.id
      }
    })
  })
  .then(async (employeeList) => {
    return inquirer.prompt([
      {
        type:"list",
        name: "employeeListId",
        choices: employeeList,
        message: "Please select the employee you want to update the role:"
      },
    ])
  }).then(answer => {
    console.log(answer);
    return connection.promise().query("UPDATE employee SET role_id = ? Where id = ?",
    [
      answer.roleId,
      answer.employeeListId,
    ]
    );
  }).then(res => {
    console.log("Updated successfully")
    startList();
  }).catch(err => {
    throw err
  });
}


// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  startList();
});
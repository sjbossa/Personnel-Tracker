//Require
const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

//Set up mysql connection
var connection = mysql.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employee_DB'
    }
);

//Connect mysql server + database
connection.connect(function (err) {
    if (err) console.error("Could not connect to Database");
    //Function to begin the command line interaction
    startPrompts();
});

//Prompts
const startPrompts =() => {
    inquirer.prompt({
    name: "task",
    type: "list",
    message: "Welcome! Where would you like to start?",
    choices: [
        "View all Employees", 
        "Add an Employee",
        "View all Departments", 
        "Add a Department",
        "View all Roles", 
        "Add a Role",
        "Update an Employee Role",
        "Close"]
    
    })
    .then((response) => {
        const {intro} = response;

        if (intro === "View all Employees") {
            viewAllEmployees();
        }

        if (intro === "Add an Employee") {
            addAnEmployee();
        }

        if (intro === "View all Departments") {
            viewAllDepartments();
        }

        if (intro === "Add a Department") {
            addADepartment();
        }

        if (intro === "View all Roles") {
            viewAllRoles();
        }

        if (intro === "Add a Role") {
            addARole();
        }

        if (intro === "Update an Employee Role") {
            updateAnEmployeeRole();
        }

        if (intro === "Close") {
            console.log("Thank's for trying this tracker! Your connection will now terminate for this session.\n")
            db.end();
        }
    });
};

// Choices 

const viewAllEmployees = () => {
    const query = 'SELECT * FROM employee';
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    })
    startPrompts();
}

const addAnEmployee = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) console.log(err);
        roles = roles.map((role) => {
            return {
                name: role.title,
                value: role.id,
            };
        });
        inquirer.prompt(
        [
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter the employee first name!',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter the employee last name!',
            },
            {
                type: 'list',
                name: 'role',
                message: 'Enter the employee role!',
                choices: roles
            },
            {
                type: 'list',
                name: 'managerId',
                message: 'Enter the employees manager id!',
                choices: [1, 4 , 5 , 6]
            }
        ])
        .then ((data) => {
            console.log(data.role);
            db.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    role_id: data.role,
                    manager_id: data.managerId,
                },
                (err) => {
                    if (err) throw err;
                    console.log('Employee has been Added!');
                    viewAllEmployees();
                }
            )
        })
    })
};

const viewAllDepartments = () => {
    const query = 'SELECT * FROM department';
    db.query(query, (err,res) => {
        if (err) throw err;
        console.table(res);
    })
    startPrompts();
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: 'Enter the title of the new department!',
        }
    ])
    .then((data) => {
        db.query('INSERT INTO DEPARTMENT SET ?',
        {
            name: data.newDepartment
        },
        function (err) {
            if (err) throw err;
        }
    );
    console.log('New department has been added!')
    viewAllDepartments();
    });
};

const viewAllRoles = () => {
    const query = 'SELECT * FROM role';
    db.query(query, (err, res) => {
        if (err) throw err; 
        console.table(res);
    })
    startPrompts();
}

const addARole = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) console.log(err);
        departments = departments.map((department) => {
            return {
                name: department.name,
                value: department.id,
            };
        });
        inquirer.prompt([
            {
                type: 'input',
                name: 'newRole',
                message: 'Enter the new emloyee role!',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary associated with this role',
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Enter the department that this new role falls under!',
                choices: departments,
            },
        ])
        .then((data) => {
            db.query('INSERT INTO role SET ?',
            {
                title: data.newRole,
                salary: data.salary,
                department_id: data.departmentId
            },
            function (err) {
                if (err) throw err;
            }
        );
        console.log("The new role has been added!")
        viewAllRoles();
        });
    });
};

const updateAnEmployeeRole = () => {
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) console.log(err);
        employees = employees.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            };
        });
        db.query('SELECT * FROM role', (err, roles) => {
            if (err) console.log(err);
            roles = roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id,
                }
            });
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'currentEmployee',
                    message: 'Choose the employee whose info you would like to update!',
                    choices: employees
                },
                {
                    type: 'list',
                    name: 'chooseNewRole',
                    message: 'Assign the new role for this employee!',
                    choices: roles
                },
            ])
            .then((data) => {
                db.query('UPDATE employee SET ? WHERE ?',
                [
                    {
                        role_id: data.chooseNewRole
                    },
                    {
                        id: data.currentEmployee
                    },
                ],
                function (err) {
                    if (err) throw err;
                }
                );
                console.log ('Employee role updated!');
                viewAllRoles();
                viewAllEmployees();
            });
        });
    });
};
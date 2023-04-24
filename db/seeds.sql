USE employeeDB;

INSERT INTO department(name) VALUES 
("Engineering"), 
("Accounting"), 
("Human Resources"), 
("Sales");

INSERT INTO role (title, salary, department_id) VALUES
("Lead Engineer", 110000, 1),
("Assistant Engineer", 65000, 1),
("Accountant", 85000, 2),
("Human Resources Manager", 93000, 3),
("Sales Manager", 105000, 4),
("Sales Associate", 55000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES
('Steven', 'Bartoski', 1, 1),
('John', 'Hammond', 2, 1),
('Nickolas', 'Moffit', 2, 1),
('Renee', 'Ramos', 3, 5),
('Cynthia', 'Johnston', 4, 5),
('Joshua', 'Redding', 5, 6),
('Shayne', 'Matthews', 6, 6),
('Shelby', 'Livingston', 6, 6),
('Trentin', 'Thomas', 2, 1);


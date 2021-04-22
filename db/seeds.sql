INSERT INTO Department (name)
VALUES
("Finance"),
("Sales"),
("Engineering"),
("Legal");

INSERT INTO Role
(title, salary, department_id)
VALUES 
("Account Manager", 150000, 1),
("Accountant", 100000,  1),

("Sales Manager", 110000, 2),
("Sales Person", 75000, 2),

("Mechanical Engineer", 120000, 3),
("Sofware Engineer", 110000, 3),

("Legal Advisor Lead", 200000, 4), 
("Lawyer", 150000, 4);

INSERT INTO Employee
(first_name, last_name, role_id, manager_id)
VALUES 
("Gulshat", "Tokhtarova", 1, NULL),
("Kamila", "Shams", 2, 1),
("Davron", "Magametov", 3, NULL),
("Nina", "Boruhow", 4, 3),
("Alex", "Mezrakhi", 5, NULL),
("Stephanie", "Martinez", 6, 5),
("Nube", "Rodas", 7, NULL),
("Ketevan", "Cameron", 8,7);




-- SQL Lab Master Database
-- Engine: MySQL 8.0.16+
-- Storage Engine: InnoDB
-- Purpose: Starter dataset for:
-- SELECT, filtering, JOINs, aggregates, subqueries, set operators,
-- DML, CTEs, window functions, CASE, COALESCE, and constraints.
--
-- IMPORTANT:
-- 1. Keep this master file immutable.
-- 2. Create a disposable database copy for each student attempt.
-- 3. MySQL supports GROUP BY WITH ROLLUP.
-- 4. Monetary values are stored as integer cents to avoid rounding errors.
-- 5. Dates use the DATE data type.
--
-- Run with:
-- mysql -u root -p sql_lab < sql-lab-master.sql

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS regions;

START TRANSACTION;

CREATE TABLE regions (
    id INT PRIMARY KEY,
    region_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE departments (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    region_id INT,
    budget_cents BIGINT NOT NULL DEFAULT 0 CHECK (budget_cents >= 0),
    FOREIGN KEY (region_id) REFERENCES regions(id)
) ENGINE=InnoDB;

CREATE TABLE employees (
    id INT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    department_id INT,
    manager_id INT,
    job_title VARCHAR(150) NOT NULL,
    salary_cents BIGINT NOT NULL CHECK (salary_cents >= 0),
    commission_cents BIGINT,
    hire_date DATE NOT NULL,
    birth_date DATE,
    employment_status VARCHAR(30) NOT NULL DEFAULT 'Active'
        CHECK (employment_status IN ('Active', 'On Leave', 'Terminated')),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
) ENGINE=InnoDB;

CREATE TABLE customers (
    id INT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    city VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    signup_date DATE NOT NULL,
    referred_by INT,
    FOREIGN KEY (referred_by) REFERENCES customers(id)
) ENGINE=InnoDB;

CREATE TABLE categories (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    parent_id INT,
    description TEXT,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE products (
    id INT PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    category_id INT,
    unit_price_cents BIGINT NOT NULL CHECK (unit_price_cents >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    discontinued TINYINT NOT NULL DEFAULT 0 CHECK (discontinued IN (0, 1)),
    created_date DATE NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE orders (
    id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    employee_id INT,
    order_date DATE NOT NULL,
    shipped_date DATE,
    status VARCHAR(30) NOT NULL
        CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    ship_city VARCHAR(100),
    ship_country VARCHAR(100),
    notes TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
) ENGINE=InnoDB;

CREATE TABLE order_items (
    id INT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price_cents BIGINT NOT NULL CHECK (unit_price_cents >= 0),
    discount_percent INT NOT NULL DEFAULT 0
        CHECK (discount_percent BETWEEN 0 AND 100),
    UNIQUE (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- Indexes

CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_customers_country ON customers(country);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category_id);

-- Regions

INSERT INTO regions (id, region_name) VALUES
(1, 'North America'),
(2, 'Europe'),
(3, 'Asia Pacific'),
(4, 'South America');

-- Departments

INSERT INTO departments (id, name, region_id, budget_cents) VALUES
(1, 'Executive', 1, 50000000),
(2, 'Engineering', 3, 180000000),
(3, 'Sales', 1, 90000000),
(4, 'Marketing', 2, 65000000),
(5, 'Human Resources', 2, 40000000),
(6, 'Finance', 1, 70000000),
(7, 'Customer Support', 3, 55000000),
(8, 'Research', 3, 120000000),
(9, 'Legal', NULL, 30000000);

-- Employees
-- Managers are inserted before their reports.

INSERT INTO employees
(id, first_name, last_name, email, department_id, manager_id, job_title,
 salary_cents, commission_cents, hire_date, birth_date, employment_status)
VALUES
(1, 'Ava', 'Morgan', 'ava.morgan@example.com', 1, NULL, 'Chief Executive Officer', 24000000, NULL, '2015-01-12', '1980-04-15', 'Active'),
(2, 'Noah', 'Patel', 'noah.patel@example.com', 2, 1, 'Engineering Director', 18000000, NULL, '2016-03-21', '1984-09-02', 'Active'),
(3, 'Mia', 'Chen', 'mia.chen@example.com', 3, 1, 'Sales Director', 16500000, 250000, '2017-06-05', '1985-02-11', 'Active'),
(4, 'Liam', 'Garcia', 'liam.garcia@example.com', 4, 1, 'Marketing Director', 15500000, NULL, '2018-02-19', '1987-07-24', 'Active'),
(5, 'Sophia', 'Brown', 'sophia.brown@example.com', 5, 1, 'HR Director', 14500000, NULL, '2018-09-10', '1986-11-30', 'Active'),
(6, 'Ethan', 'Wilson', 'ethan.wilson@example.com', 6, 1, 'Finance Director', 16000000, NULL, '2017-11-13', '1983-01-08', 'Active'),
(7, 'Isabella', 'Kumar', 'isabella.kumar@example.com', 7, 1, 'Support Director', 13000000, NULL, '2019-04-01', '1988-03-18', 'Active'),
(8, 'Lucas', 'Martin', 'lucas.martin@example.com', 8, 2, 'Research Manager', 14000000, NULL, '2019-07-15', '1989-05-12', 'Active'),
(9, 'Amir', 'Khan', 'amir.khan@example.com', 2, 2, 'Senior Software Engineer', 12500000, NULL, '2020-01-20', '1991-08-09', 'Active'),
(10, 'Emma', 'Davis', 'emma.davis@example.com', 2, 2, 'Software Engineer', 9800000, NULL, '2021-05-17', '1995-12-03', 'Active'),
(11, 'Oliver', 'Singh', 'oliver.singh@example.com', 2, 9, 'Software Engineer', 10200000, NULL, '2022-02-14', '1994-06-21', 'Active'),
(12, 'Charlotte', 'Taylor', 'charlotte.taylor@example.com', 2, 9, 'QA Engineer', 8500000, NULL, '2022-08-08', '1996-10-16', 'Active'),
(13, 'Elijah', 'Anderson', 'elijah.anderson@example.com', 3, 3, 'Account Executive', 7600000, 900000, '2020-06-22', '1992-04-07', 'Active'),
(14, 'Amelia', 'Thomas', 'amelia.thomas@example.com', 3, 3, 'Account Executive', 7200000, 650000, '2021-09-13', '1993-02-28', 'Active'),
(15, 'James', 'Jackson', 'james.jackson@example.com', 3, 3, 'Sales Associate', 5400000, NULL, '2023-01-09', '1999-01-19', 'Active'),
(16, 'Harper', 'White', 'harper.white@example.com', 4, 4, 'Content Strategist', 7800000, NULL, '2020-10-05', '1992-09-25', 'Active'),
(17, 'Benjamin', 'Harris', 'benjamin.harris@example.com', 4, 4, 'SEO Specialist', 6900000, NULL, '2022-03-28', '1997-07-02', 'Active'),
(18, 'Evelyn', 'Clark', 'evelyn.clark@example.com', 5, 5, 'Recruiter', 6500000, NULL, '2021-04-12', '1994-11-11', 'Active'),
(19, 'Henry', 'Lewis', 'henry.lewis@example.com', 6, 6, 'Financial Analyst', 8800000, NULL, '2020-08-31', '1990-03-05', 'Active'),
(20, 'Abigail', 'Walker', 'abigail.walker@example.com', 6, 6, 'Accountant', 7400000, NULL, '2022-06-06', '1995-05-20', 'Active'),
(21, 'Daniel', 'Hall', 'daniel.hall@example.com', 7, 7, 'Support Specialist', 5100000, NULL, '2023-02-20', '2000-12-01', 'Active'),
(22, 'Ella', 'Allen', 'ella.allen@example.com', 7, 7, 'Support Specialist', 5300000, NULL, '2022-11-07', '1998-08-14', 'On Leave'),
(23, 'Jack', 'Young', 'jack.young@example.com', 8, 8, 'Data Scientist', 11800000, NULL, '2020-02-03', '1991-10-10', 'Active'),
(24, 'Grace', 'King', 'grace.king@example.com', 8, 8, 'Research Analyst', 9100000, NULL, '2022-04-18', '1996-01-27', 'Active'),
(25, 'Leo', 'Scott', NULL, 2, 9, 'Intern', 2800000, NULL, '2024-01-08', '2002-06-17', 'Active'),
(26, 'Zoe', 'Green', 'zoe.green@example.com', NULL, 1, 'Consultant', 6800000, NULL, '2023-07-10', '1993-04-22', 'Active'),
(27, 'Wyatt', 'Baker', 'wyatt.baker@example.com', 3, 3, 'Sales Associate', 4900000, 300000, '2024-02-12', '2000-09-09', 'Active'),
(28, 'Nora', 'Adams', 'nora.adams@example.com', 9, 1, 'Legal Counsel', 13500000, NULL, '2021-12-01', '1988-12-12', 'Active');

-- Customers

INSERT INTO customers
(id, first_name, last_name, email, city, country, signup_date, referred_by)
VALUES
(1, 'Arjun', 'Mehta', 'arjun.mehta@example.com', 'Mumbai', 'India', '2023-01-12', NULL),
(2, 'Priya', 'Sharma', 'priya.sharma@example.com', 'Pune', 'India', '2023-02-18', 1),
(3, 'Rohan', 'Verma', 'rohan.verma@example.com', 'Delhi', 'India', '2023-03-05', 1),
(4, 'Ananya', 'Rao', 'ananya.rao@example.com', 'Bengaluru', 'India', '2023-04-22', 2),
(5, 'Kabir', 'Joshi', 'kabir.joshi@example.com', 'Hyderabad', 'India', '2023-05-09', NULL),
(6, 'Emily', 'Johnson', 'emily.johnson@example.com', 'New York', 'USA', '2023-01-28', NULL),
(7, 'Michael', 'Smith', 'michael.smith@example.com', 'Chicago', 'USA', '2023-02-14', 6),
(8, 'Olivia', 'Brown', 'olivia.brown@example.com', 'Austin', 'USA', '2023-06-11', 6),
(9, 'William', 'Jones', 'william.jones@example.com', 'Seattle', 'USA', '2023-07-19', NULL),
(10, 'Sofia', 'Miller', 'sofia.miller@example.com', 'London', 'UK', '2023-03-16', NULL),
(11, 'Oliver', 'Wilson', 'oliver.wilson@example.com', 'Manchester', 'UK', '2023-08-02', 10),
(12, 'Amelie', 'Martin', 'amelie.martin@example.com', 'Paris', 'France', '2023-04-03', NULL),
(13, 'Lucas', 'Bernard', 'lucas.bernard@example.com', 'Lyon', 'France', '2023-09-14', 12),
(14, 'Hana', 'Sato', 'hana.sato@example.com', 'Tokyo', 'Japan', '2023-05-26', NULL),
(15, 'Kenji', 'Tanaka', 'kenji.tanaka@example.com', 'Osaka', 'Japan', '2023-10-01', 14),
(16, 'Chloe', 'Martin', 'chloe.martin@example.com', 'Toronto', 'Canada', '2023-06-30', NULL),
(17, 'Noah', 'Wilson', 'noah.wilson@example.com', 'Vancouver', 'Canada', '2023-11-07', 16),
(18, 'Mateo', 'Garcia', 'mateo.garcia@example.com', 'Madrid', 'Spain', '2023-07-12', NULL),
(19, 'Valentina', 'Rossi', 'valentina.rossi@example.com', 'Rome', 'Italy', '2023-12-05', NULL),
(20, 'Isabella', 'Silva', 'isabella.silva@example.com', 'Sao Paulo', 'Brazil', '2024-01-17', NULL),
(21, 'Unassigned', 'Customer', NULL, NULL, 'India', '2024-02-01', NULL);

-- Categories

INSERT INTO categories (id, name, parent_id, description) VALUES
(1, 'Electronics', NULL, 'Electronic devices and accessories'),
(2, 'Computers', 1, 'Computers and computing devices'),
(3, 'Phones', 1, 'Mobile phones and accessories'),
(4, 'Home', NULL, 'Home and kitchen products'),
(5, 'Books', NULL, 'Printed and digital books'),
(6, 'Office', NULL, 'Office supplies'),
(7, 'Laptops', 2, 'Portable computers'),
(8, 'Accessories', 2, 'Computer accessories'),
(9, 'Clearance', NULL, 'Clearance items with no current products');

-- Products

INSERT INTO products
(id, product_name, category_id, unit_price_cents, stock_quantity, discontinued, created_date)
VALUES
(1, 'Laptop Pro 14', 7, 129999, 25, 0, '2023-01-15'),
(2, 'Laptop Air 13', 7, 99999, 40, 0, '2023-02-10'),
(3, 'Wireless Mouse', 8, 2499, 150, 0, '2023-02-18'),
(4, 'Mechanical Keyboard', 8, 8999, 75, 0, '2023-03-02'),
(5, 'Smartphone X', 3, 79999, 35, 0, '2023-03-20'),
(6, 'Smartphone Mini', 3, 59999, 50, 0, '2023-04-01'),
(7, 'USB-C Hub', 8, 4599, 90, 0, '2023-04-14'),
(8, 'Noise-Cancelling Headphones', 1, 19999, 45, 0, '2023-05-05'),
(9, 'Desk Lamp', 4, 3499, 60, 0, '2023-05-22'),
(10, 'Coffee Maker', 4, 7499, 30, 0, '2023-06-11'),
(11, 'SQL Fundamentals', 5, 2999, 200, 0, '2023-06-25'),
(12, 'Data Engineering Guide', 5, 4599, 120, 0, '2023-07-08'),
(13, 'Notebook Pack', 6, 899, 300, 0, '2023-07-19'),
(14, 'Office Chair', 4, 15999, 18, 0, '2023-08-02'),
(15, 'Old USB Drive', 8, 999, 0, 1, '2022-09-01'),
(16, 'Webcam HD', 1, 6999, 55, 0, '2023-09-14'),
(17, 'Monitor 27', 2, 27999, 22, 0, '2023-10-03'),
(18, 'Tablet Plus', 1, 44999, 28, 0, '2023-10-29'),
(19, 'Standing Desk', 4, 32999, 12, 0, '2023-11-12'),
(20, 'Gift Card', NULL, 2500, 999, 0, '2023-12-01');

-- Orders

INSERT INTO orders
(id, customer_id, employee_id, order_date, shipped_date, status, ship_city, ship_country, notes)
VALUES
(1, 1, 13, '2024-01-03', '2024-01-05', 'Delivered', 'Mumbai', 'India', NULL),
(2, 2, 14, '2024-01-08', '2024-01-10', 'Delivered', 'Pune', 'India', 'Gift wrap'),
(3, 6, 13, '2024-01-15', '2024-01-18', 'Shipped', 'New York', 'USA', NULL),
(4, 7, 27, '2024-01-22', NULL, 'Processing', 'Chicago', 'USA', NULL),
(5, 10, 14, '2024-02-02', '2024-02-06', 'Delivered', 'London', 'UK', NULL),
(6, 12, 13, '2024-02-10', '2024-02-12', 'Delivered', 'Paris', 'France', NULL),
(7, 14, 27, '2024-02-19', NULL, 'Pending', 'Tokyo', 'Japan', 'Call before delivery'),
(8, 3, 15, '2024-03-01', '2024-03-04', 'Delivered', 'Delhi', 'India', NULL),
(9, 8, 14, '2024-03-11', '2024-03-14', 'Shipped', 'Austin', 'USA', NULL),
(10, 16, 13, '2024-03-18', NULL, 'Cancelled', 'Toronto', 'Canada', 'Customer cancelled'),
(11, 4, 27, '2024-04-02', '2024-04-05', 'Delivered', 'Bengaluru', 'India', NULL),
(12, 11, 15, '2024-04-17', '2024-04-20', 'Delivered', 'Manchester', 'UK', NULL),
(13, 15, 14, '2024-05-03', NULL, 'Processing', 'Osaka', 'Japan', NULL),
(14, 18, 13, '2024-05-16', '2024-05-19', 'Delivered', 'Madrid', 'Spain', NULL),
(15, 19, 27, '2024-06-04', NULL, 'Pending', 'Rome', 'Italy', NULL),
(16, 1, 14, '2024-06-15', '2024-06-18', 'Delivered', 'Mumbai', 'India', 'Repeat customer'),
(17, 5, 15, '2024-07-01', '2024-07-03', 'Delivered', 'Hyderabad', 'India', NULL),
(18, 9, 13, '2024-07-19', NULL, 'Processing', 'Seattle', 'USA', NULL),
(19, 17, 14, '2024-08-08', '2024-08-11', 'Delivered', 'Vancouver', 'Canada', NULL),
(20, 20, 27, '2024-08-21', NULL, 'Pending', 'Sao Paulo', 'Brazil', NULL),
(21, 2, 13, '2024-09-02', '2024-09-05', 'Delivered', 'Pune', 'India', NULL),
(22, 6, 14, '2024-09-14', NULL, 'Cancelled', 'New York', 'USA', NULL),
(23, 13, 15, '2024-10-01', '2024-10-04', 'Delivered', 'Lyon', 'France', NULL),
(24, 3, 27, '2024-10-20', NULL, 'Processing', 'Delhi', 'India', NULL),
(25, 21, NULL, '2024-11-11', NULL, 'Pending', NULL, 'India', 'Missing shipping city is intentional');

-- Order Items

INSERT INTO order_items
(id, order_id, product_id, quantity, unit_price_cents, discount_percent)
VALUES
(1, 1, 1, 1, 129999, 0),
(2, 1, 3, 2, 2499, 0),
(3, 2, 11, 2, 2999, 10),
(4, 2, 13, 5, 899, 0),
(5, 3, 5, 1, 79999, 5),
(6, 3, 8, 1, 19999, 0),
(7, 4, 4, 1, 8999, 0),
(8, 4, 7, 2, 4599, 0),
(9, 5, 2, 1, 99999, 0),
(10, 5, 3, 1, 2499, 0),
(11, 6, 12, 1, 4599, 0),
(12, 6, 11, 1, 2999, 0),
(13, 7, 6, 1, 59999, 0),
(14, 8, 14, 1, 15999, 15),
(15, 8, 9, 2, 3499, 0),
(16, 9, 8, 1, 19999, 0),
(17, 9, 16, 1, 6999, 0),
(18, 10, 17, 1, 27999, 0),
(19, 11, 18, 1, 44999, 0),
(20, 11, 7, 1, 4599, 0),
(21, 12, 10, 1, 7499, 0),
(22, 12, 9, 1, 3499, 0),
(23, 13, 1, 1, 129999, 10),
(24, 13, 4, 1, 8999, 0),
(25, 14, 19, 1, 32999, 0),
(26, 14, 13, 10, 899, 0),
(27, 15, 5, 2, 79999, 10),
(28, 16, 2, 1, 99999, 0),
(29, 16, 3, 1, 2499, 0),
(30, 17, 11, 3, 2999, 0),
(31, 17, 12, 1, 4599, 5),
(32, 18, 17, 2, 27999, 0),
(33, 19, 6, 1, 59999, 0),
(34, 19, 8, 1, 19999, 10),
(35, 20, 20, 2, 2500, 0),
(36, 21, 14, 1, 15999, 0),
(37, 21, 9, 1, 3499, 0),
(38, 22, 18, 1, 44999, 0),
(39, 23, 12, 2, 4599, 0),
(40, 23, 11, 1, 2999, 0),
(41, 24, 5, 1, 79999, 0),
(42, 24, 16, 1, 6999, 0),
(43, 25, 13, 2, 899, 0);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

-- Verification queries:
-- SELECT COUNT(*) AS employee_count FROM employees;
-- SELECT COUNT(*) AS customer_count FROM customers;
-- SELECT COUNT(*) AS order_count FROM orders;
-- SELECT COUNT(*) AS product_count FROM products;
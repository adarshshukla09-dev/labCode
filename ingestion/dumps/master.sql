-- MySQL dump 10.13  Distrib 26.10.0, for Linux (x86_64)
--
-- Host: localhost    Database: sqllab
-- ------------------------------------------------------
-- Server version	26.10.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `parent_id` int DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Electronics',NULL,'Electronic devices and accessories'),(2,'Computers',1,'Computers and computing devices'),(3,'Phones',1,'Mobile phones and accessories'),(4,'Home',NULL,'Home and kitchen products'),(5,'Books',NULL,'Printed and digital books'),(6,'Office',NULL,'Office supplies'),(7,'Laptops',2,'Portable computers'),(8,'Accessories',2,'Computer accessories'),(9,'Clearance',NULL,'Clearance items with no current products');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) NOT NULL,
  `signup_date` date NOT NULL,
  `referred_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `referred_by` (`referred_by`),
  KEY `idx_customers_country` (`country`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`referred_by`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Arjun','Mehta','arjun.mehta@example.com','Mumbai','India','2023-01-12',NULL),(2,'Priya','Sharma','priya.sharma@example.com','Pune','India','2023-02-18',1),(3,'Rohan','Verma','rohan.verma@example.com','Delhi','India','2023-03-05',1),(4,'Ananya','Rao','ananya.rao@example.com','Bengaluru','India','2023-04-22',2),(5,'Kabir','Joshi','kabir.joshi@example.com','Hyderabad','India','2023-05-09',NULL),(6,'Emily','Johnson','emily.johnson@example.com','New York','USA','2023-01-28',NULL),(7,'Michael','Smith','michael.smith@example.com','Chicago','USA','2023-02-14',6),(8,'Olivia','Brown','olivia.brown@example.com','Austin','USA','2023-06-11',6),(9,'William','Jones','william.jones@example.com','Seattle','USA','2023-07-19',NULL),(10,'Sofia','Miller','sofia.miller@example.com','London','UK','2023-03-16',NULL),(11,'Oliver','Wilson','oliver.wilson@example.com','Manchester','UK','2023-08-02',10),(12,'Amelie','Martin','amelie.martin@example.com','Paris','France','2023-04-03',NULL),(13,'Lucas','Bernard','lucas.bernard@example.com','Lyon','France','2023-09-14',12),(14,'Hana','Sato','hana.sato@example.com','Tokyo','Japan','2023-05-26',NULL),(15,'Kenji','Tanaka','kenji.tanaka@example.com','Osaka','Japan','2023-10-01',14),(16,'Chloe','Martin','chloe.martin@example.com','Toronto','Canada','2023-06-30',NULL),(17,'Noah','Wilson','noah.wilson@example.com','Vancouver','Canada','2023-11-07',16),(18,'Mateo','Garcia','mateo.garcia@example.com','Madrid','Spain','2023-07-12',NULL),(19,'Valentina','Rossi','valentina.rossi@example.com','Rome','Italy','2023-12-05',NULL),(20,'Isabella','Silva','isabella.silva@example.com','Sao Paulo','Brazil','2024-01-17',NULL),(21,'Unassigned','Customer',NULL,NULL,'India','2024-02-01',NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `region_id` int DEFAULT NULL,
  `budget_cents` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `region_id` (`region_id`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`),
  CONSTRAINT `departments_chk_1` CHECK ((`budget_cents` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Executive',1,50000000),(2,'Engineering',3,180000000),(3,'Sales',1,90000000),(4,'Marketing',2,65000000),(5,'Human Resources',2,40000000),(6,'Finance',1,70000000),(7,'Customer Support',3,55000000),(8,'Research',3,120000000),(9,'Legal',NULL,30000000);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `job_title` varchar(150) NOT NULL,
  `salary_cents` bigint NOT NULL,
  `commission_cents` bigint DEFAULT NULL,
  `hire_date` date NOT NULL,
  `birth_date` date DEFAULT NULL,
  `employment_status` varchar(30) NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_employees_department` (`department_id`),
  KEY `idx_employees_manager` (`manager_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `employees_chk_1` CHECK ((`salary_cents` >= 0)),
  CONSTRAINT `employees_chk_2` CHECK ((`employment_status` in (_utf8mb4'Active',_utf8mb4'On Leave',_utf8mb4'Terminated')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Ava','Morgan','ava.morgan@example.com',1,NULL,'Chief Executive Officer',24000000,NULL,'2015-01-12','1980-04-15','Active'),(2,'Noah','Patel','noah.patel@example.com',2,1,'Engineering Director',18000000,NULL,'2016-03-21','1984-09-02','Active'),(3,'Mia','Chen','mia.chen@example.com',3,1,'Sales Director',16500000,250000,'2017-06-05','1985-02-11','Active'),(4,'Liam','Garcia','liam.garcia@example.com',4,1,'Marketing Director',15500000,NULL,'2018-02-19','1987-07-24','Active'),(5,'Sophia','Brown','sophia.brown@example.com',5,1,'HR Director',14500000,NULL,'2018-09-10','1986-11-30','Active'),(6,'Ethan','Wilson','ethan.wilson@example.com',6,1,'Finance Director',16000000,NULL,'2017-11-13','1983-01-08','Active'),(7,'Isabella','Kumar','isabella.kumar@example.com',7,1,'Support Director',13000000,NULL,'2019-04-01','1988-03-18','Active'),(8,'Lucas','Martin','lucas.martin@example.com',8,2,'Research Manager',14000000,NULL,'2019-07-15','1989-05-12','Active'),(9,'Amir','Khan','amir.khan@example.com',2,2,'Senior Software Engineer',12500000,NULL,'2020-01-20','1991-08-09','Active'),(10,'Emma','Davis','emma.davis@example.com',2,2,'Software Engineer',9800000,NULL,'2021-05-17','1995-12-03','Active'),(11,'Oliver','Singh','oliver.singh@example.com',2,9,'Software Engineer',10200000,NULL,'2022-02-14','1994-06-21','Active'),(12,'Charlotte','Taylor','charlotte.taylor@example.com',2,9,'QA Engineer',8500000,NULL,'2022-08-08','1996-10-16','Active'),(13,'Elijah','Anderson','elijah.anderson@example.com',3,3,'Account Executive',7600000,900000,'2020-06-22','1992-04-07','Active'),(14,'Amelia','Thomas','amelia.thomas@example.com',3,3,'Account Executive',7200000,650000,'2021-09-13','1993-02-28','Active'),(15,'James','Jackson','james.jackson@example.com',3,3,'Sales Associate',5400000,NULL,'2023-01-09','1999-01-19','Active'),(16,'Harper','White','harper.white@example.com',4,4,'Content Strategist',7800000,NULL,'2020-10-05','1992-09-25','Active'),(17,'Benjamin','Harris','benjamin.harris@example.com',4,4,'SEO Specialist',6900000,NULL,'2022-03-28','1997-07-02','Active'),(18,'Evelyn','Clark','evelyn.clark@example.com',5,5,'Recruiter',6500000,NULL,'2021-04-12','1994-11-11','Active'),(19,'Henry','Lewis','henry.lewis@example.com',6,6,'Financial Analyst',8800000,NULL,'2020-08-31','1990-03-05','Active'),(20,'Abigail','Walker','abigail.walker@example.com',6,6,'Accountant',7400000,NULL,'2022-06-06','1995-05-20','Active'),(21,'Daniel','Hall','daniel.hall@example.com',7,7,'Support Specialist',5100000,NULL,'2023-02-20','2000-12-01','Active'),(22,'Ella','Allen','ella.allen@example.com',7,7,'Support Specialist',5300000,NULL,'2022-11-07','1998-08-14','On Leave'),(23,'Jack','Young','jack.young@example.com',8,8,'Data Scientist',11800000,NULL,'2020-02-03','1991-10-10','Active'),(24,'Grace','King','grace.king@example.com',8,8,'Research Analyst',9100000,NULL,'2022-04-18','1996-01-27','Active'),(25,'Leo','Scott',NULL,2,9,'Intern',2800000,NULL,'2024-01-08','2002-06-17','Active'),(26,'Zoe','Green','zoe.green@example.com',NULL,1,'Consultant',6800000,NULL,'2023-07-10','1993-04-22','Active'),(27,'Wyatt','Baker','wyatt.baker@example.com',3,3,'Sales Associate',4900000,300000,'2024-02-12','2000-09-09','Active'),(28,'Nora','Adams','nora.adams@example.com',9,1,'Legal Counsel',13500000,NULL,'2021-12-01','1988-12-12','Active');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price_cents` bigint NOT NULL,
  `discount_percent` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_order_items_order` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `order_items_chk_1` CHECK ((`quantity` > 0)),
  CONSTRAINT `order_items_chk_2` CHECK ((`unit_price_cents` >= 0)),
  CONSTRAINT `order_items_chk_3` CHECK ((`discount_percent` between 0 and 100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,1,129999,0),(2,1,3,2,2499,0),(3,2,11,2,2999,10),(4,2,13,5,899,0),(5,3,5,1,79999,5),(6,3,8,1,19999,0),(7,4,4,1,8999,0),(8,4,7,2,4599,0),(9,5,2,1,99999,0),(10,5,3,1,2499,0),(11,6,12,1,4599,0),(12,6,11,1,2999,0),(13,7,6,1,59999,0),(14,8,14,1,15999,15),(15,8,9,2,3499,0),(16,9,8,1,19999,0),(17,9,16,1,6999,0),(18,10,17,1,27999,0),(19,11,18,1,44999,0),(20,11,7,1,4599,0),(21,12,10,1,7499,0),(22,12,9,1,3499,0),(23,13,1,1,129999,10),(24,13,4,1,8999,0),(25,14,19,1,32999,0),(26,14,13,10,899,0),(27,15,5,2,79999,10),(28,16,2,1,99999,0),(29,16,3,1,2499,0),(30,17,11,3,2999,0),(31,17,12,1,4599,5),(32,18,17,2,27999,0),(33,19,6,1,59999,0),(34,19,8,1,19999,10),(35,20,20,2,2500,0),(36,21,14,1,15999,0),(37,21,9,1,3499,0),(38,22,18,1,44999,0),(39,23,12,2,4599,0),(40,23,11,1,2999,0),(41,24,5,1,79999,0),(42,24,16,1,6999,0),(43,25,13,2,899,0);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL,
  `customer_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `order_date` date NOT NULL,
  `shipped_date` date DEFAULT NULL,
  `status` varchar(30) NOT NULL,
  `ship_city` varchar(100) DEFAULT NULL,
  `ship_country` varchar(100) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `idx_orders_customer` (`customer_id`),
  KEY `idx_orders_date` (`order_date`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `orders_chk_1` CHECK ((`status` in (_utf8mb4'Pending',_utf8mb4'Processing',_utf8mb4'Shipped',_utf8mb4'Delivered',_utf8mb4'Cancelled')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,13,'2024-01-03','2024-01-05','Delivered','Mumbai','India',NULL),(2,2,14,'2024-01-08','2024-01-10','Delivered','Pune','India','Gift wrap'),(3,6,13,'2024-01-15','2024-01-18','Shipped','New York','USA',NULL),(4,7,27,'2024-01-22',NULL,'Processing','Chicago','USA',NULL),(5,10,14,'2024-02-02','2024-02-06','Delivered','London','UK',NULL),(6,12,13,'2024-02-10','2024-02-12','Delivered','Paris','France',NULL),(7,14,27,'2024-02-19',NULL,'Pending','Tokyo','Japan','Call before delivery'),(8,3,15,'2024-03-01','2024-03-04','Delivered','Delhi','India',NULL),(9,8,14,'2024-03-11','2024-03-14','Shipped','Austin','USA',NULL),(10,16,13,'2024-03-18',NULL,'Cancelled','Toronto','Canada','Customer cancelled'),(11,4,27,'2024-04-02','2024-04-05','Delivered','Bengaluru','India',NULL),(12,11,15,'2024-04-17','2024-04-20','Delivered','Manchester','UK',NULL),(13,15,14,'2024-05-03',NULL,'Processing','Osaka','Japan',NULL),(14,18,13,'2024-05-16','2024-05-19','Delivered','Madrid','Spain',NULL),(15,19,27,'2024-06-04',NULL,'Pending','Rome','Italy',NULL),(16,1,14,'2024-06-15','2024-06-18','Delivered','Mumbai','India','Repeat customer'),(17,5,15,'2024-07-01','2024-07-03','Delivered','Hyderabad','India',NULL),(18,9,13,'2024-07-19',NULL,'Processing','Seattle','USA',NULL),(19,17,14,'2024-08-08','2024-08-11','Delivered','Vancouver','Canada',NULL),(20,20,27,'2024-08-21',NULL,'Pending','Sao Paulo','Brazil',NULL),(21,2,13,'2024-09-02','2024-09-05','Delivered','Pune','India',NULL),(22,6,14,'2024-09-14',NULL,'Cancelled','New York','USA',NULL),(23,13,15,'2024-10-01','2024-10-04','Delivered','Lyon','France',NULL),(24,3,27,'2024-10-20',NULL,'Processing','Delhi','India',NULL),(25,21,NULL,'2024-11-11',NULL,'Pending',NULL,'India','Missing shipping city is intentional');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `category_id` int DEFAULT NULL,
  `unit_price_cents` bigint NOT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `discontinued` tinyint NOT NULL DEFAULT '0',
  `created_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_products_category` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `products_chk_1` CHECK ((`unit_price_cents` >= 0)),
  CONSTRAINT `products_chk_2` CHECK ((`stock_quantity` >= 0)),
  CONSTRAINT `products_chk_3` CHECK ((`discontinued` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Laptop Pro 14',7,129999,25,0,'2023-01-15'),(2,'Laptop Air 13',7,99999,40,0,'2023-02-10'),(3,'Wireless Mouse',8,2499,150,0,'2023-02-18'),(4,'Mechanical Keyboard',8,8999,75,0,'2023-03-02'),(5,'Smartphone X',3,79999,35,0,'2023-03-20'),(6,'Smartphone Mini',3,59999,50,0,'2023-04-01'),(7,'USB-C Hub',8,4599,90,0,'2023-04-14'),(8,'Noise-Cancelling Headphones',1,19999,45,0,'2023-05-05'),(9,'Desk Lamp',4,3499,60,0,'2023-05-22'),(10,'Coffee Maker',4,7499,30,0,'2023-06-11'),(11,'SQL Fundamentals',5,2999,200,0,'2023-06-25'),(12,'Data Engineering Guide',5,4599,120,0,'2023-07-08'),(13,'Notebook Pack',6,899,300,0,'2023-07-19'),(14,'Office Chair',4,15999,18,0,'2023-08-02'),(15,'Old USB Drive',8,999,0,1,'2022-09-01'),(16,'Webcam HD',1,6999,55,0,'2023-09-14'),(17,'Monitor 27',2,27999,22,0,'2023-10-03'),(18,'Tablet Plus',1,44999,28,0,'2023-10-29'),(19,'Standing Desk',4,32999,12,0,'2023-11-12'),(20,'Gift Card',NULL,2500,999,0,'2023-12-01');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regions` (
  `id` int NOT NULL,
  `region_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `region_name` (`region_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regions`
--

LOCK TABLES `regions` WRITE;
/*!40000 ALTER TABLE `regions` DISABLE KEYS */;
INSERT INTO `regions` VALUES (3,'Asia Pacific'),(2,'Europe'),(1,'North America'),(4,'South America');
/*!40000 ALTER TABLE `regions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-31 10:51:10

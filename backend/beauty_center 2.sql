-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 17, 2023 at 06:33 PM
-- Server version: 5.7.31
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `beauty_center`
--

-- --------------------------------------------------------


--
-- Table structure for table `treatments`
--

DROP TABLE IF EXISTS `treatments`;
CREATE TABLE IF NOT EXISTS `treatments` (
  `id` varchar(9) NOT NULL,
  `duration` int(3) NOT NULL,
  `price` double NOT NULL,
  `treatmentType` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `treatment`
--

INSERT INTO `treatments` (`id`, `duration`, `price`, `treatmentType`) VALUES
('1', 90, 200, 'makeup'),
('2', 120, 500, 'laser'),
('3', 30, 60, 'hair cut'),
('4', 60, 150, 'hair spa'),
('5', 40, 200, 'hairstyle'),
('6', 150, 300, 'hair treatment'),
('7', 120, 120, 'hair color');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(5) NOT NULL PRIMARY KEY,
  `name` varchar(50) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `phoneNumber` varchar(10) NOT NULL,
  `address` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL,
  `isEmployee` tinyint(1) NOT NULL DEFAULT 0,
  `resetPasswordCode` varchar(5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--
INSERT INTO `users` (`id`, `name`, `mail`, `phoneNumber`, `address`, `password`, `isEmployee`) VALUES
('1', 'yossi', 'yossi1316@gmail.com', '0542222222', 'Petach Tikva', '12345678', 0),
('2', 'baruch', 'bbaruch@mailinator.com', '0523333333', 'Tel Aviv', '12345678', 0),
('3', 'rame', 'rame123@gmail.com', '0507777777', 'Haifa', 'ra124524', 1),
('4', 'noor', 'nourgbareen2001@gmail.com', '0502222222', 'om alfahem', 'Noor1234', 1),
('5', 'eman', 'ghanome427@gmail.com', '0548167256', 'Nazreth', '234567eman', 1),
('6', 'ben', 'bengold789@gmail.com', '0541234567', 'Petach Tikva', '12345678', 0),
('7', 'dan', 'dansilver@gmail.com', '0531234567', 'Petach Tikva', '12345678', 0),
('8', 'nissim', 'nissimb@gmail.com', '0521234567', 'Eilat', '12345678', 0);

--
-- Table structure for table `employees_treatments`
--

DROP TABLE IF EXISTS `employee_treatments`;
CREATE TABLE IF NOT EXISTS `employee_treatments` (
  `employeeId` varchar(9) NOT NULL,
  `treatmentId` varchar(9) NOT NULL,
  PRIMARY KEY (`employeeId`, `treatmentId`),
  FOREIGN KEY (`employeeId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`treatmentId`) REFERENCES `treatments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `employee_treatments`
--

INSERT INTO `employee_treatments` (`employeeId`, `treatmentId`) VALUES
-- Employee with ID 3 offers treatments 3, 4, 5, 6 and 7
('3', '3'),
('3', '4'),
('3', '5'),
('3', '6'),
('3', '7'),

-- Employee with ID 4 offers treatments 2, 5, and 7
('4', '1'),
('4', '2'),

-- Employee with ID 5 offers treatments 3 and 7
('5', '3'),
('5', '5'),
('5', '6'),
('5', '7');

-- --------------------------------------------------------

--
-- Table structure for table `employee_available_hours`
--

DROP TABLE IF EXISTS `employee_available_hours`;
CREATE TABLE IF NOT EXISTS `employee_available_hours` (
  `employeeId` varchar(9) NOT NULL,
  `treatmentId` varchar(9) NOT NULL,
  `day` int NOT NULL,
  `patientAcceptStart` varchar(5) NOT NULL,
  `patientAcceptEnd` varchar(5) NOT NULL,
  PRIMARY KEY (`employeeId`, `treatmentId`, `day`),
  FOREIGN KEY (`employeeId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`treatmentId`) REFERENCES `treatments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




--
-- Dumping data for table `employee_treatments`
--
INSERT INTO `employee_available_hours` (`employeeId`, `treatmentId`, `day`, `patientAcceptStart`, `patientAcceptEnd`) VALUES
('3', '3', 0, '09:00', '18:00'),
('3', '3', 1, '09:00', '18:00'),
('3', '3', 2, '10:00', '18:00'),
('3', '3', 3, '09:00', '18:00'),
('3', '3', 4, '09:00', '18:00'),
('3', '4', 0, '08:00', '16:00'),
('3', '4', 1, '08:00', '16:00'),
('3', '4', 2, '08:00', '16:00'),
('3', '4', 3, '08:00', '16:00'),
('3', '4', 4, '08:00', '16:00'),
('3', '4', 5, '08:00', '16:00'),
('3', '5', 0, '11:00', '18:00'),
('3', '6', 0, '12:00', '18:00'),
('3', '7', 0, '10:00', '18:00'),
('4', '1', 0, '10:00', '19:00'),
('4', '1', 1, '10:00', '19:00'),
('4', '1', 2, '10:00', '19:00'),
('4', '2', 3, '14:00', '19:00'),
('4', '2', 4, '14:00', '19:00'),
('4', '2', 5, '14:00', '19:00'),
('4', '4', 3, '14:00', '19:00'),
('5', '3', 0, '10:00', '17:00'),
('5', '5', 0, '12:00', '17:00'),
('5', '6', 5, '10:00', '14:00'),
('5', '3', 3, '10:00', '16:00');
('5', '4', 2, '10:00', '16:00');
('5', '7', 4, '10:00', '16:00');
('5', '7', 1, '10:00', '16:00');

-- --------------------------------------------------------

--
-- Table structure for table `employee_constraints`
--

DROP TABLE IF EXISTS `employee_constraints`;
CREATE TABLE IF NOT EXISTS `employee_constraints` (
  `employeeId` varchar(9) NOT NULL,
  `date` varchar(10) NOT NULL,
  `constraintStart` varchar(5) NOT NULL,
  `constraintEnd` varchar(5) NOT NULL,
  `description` varchar(200) NOT NULL,
  PRIMARY KEY (`employeeId`, `date`),
  FOREIGN KEY (`employeeId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `employee_constraints`
--

INSERT INTO `employee_constraints` (`employeeId`, `date`, `constraintStart`, `constraintEnd`, `description`) VALUES
('3', '2023-08-25' ,'12:00', '13:00', 'company meal');


--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `appointmentDateTime` datetime NOT NULL,
  `employeeId` varchar(9) NOT NULL,
  `customerId` varchar(9) NOT NULL,
  `treatmentId` varchar(9) DEFAULT NULL,
  FOREIGN KEY (`employeeId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`customerId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`treatmentId`) REFERENCES `treatments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;


--
-- Dumping data for table `appointment`
--

INSERT INTO `appointments` (`id`, `appointmentDateTime`, `employeeId`, `customerId`, `treatmentId`) VALUES
(1, '2023-08-17 10:00:00', '3', '1', 1),
(2, '2023-08-17 11:00:00', '3', '2', 2),
(3, '2023-08-17 12:00:00', '4', '6', 3),
(4, '2023-08-18 11:00:00', '4', '7', 4),
(5, '2023-08-18 12:00:00', '3', '1', 4),
(6, '2023-08-18 13:00:00', '5', '8', 4),
(7, '2023-08-06 10:00:00', '3', '1', 3),
(8, '2023-08-06 11:00:00', '3', '2', 3);

DROP TABLE IF EXISTS `canceled_appointments`;
CREATE TABLE IF NOT EXISTS `canceled_appointments` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `appointmentDateTime` datetime NOT NULL,
  `employeeId` varchar(9) NOT NULL,
  `customerId` varchar(9) NOT NULL,
  `treatmentId` varchar(9) DEFAULT NULL,
  FOREIGN KEY (`employeeId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`customerId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`treatmentId`) REFERENCES `treatments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;



--
-- Table structure for table `pendding-appointments`
--

DROP TABLE IF EXISTS `pendding_appointments`;
CREATE TABLE IF NOT EXISTS `pendding_appointments` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `appointmentId` INT NOT NULL,
  `appointmentDateTime` datetime NOT NULL,
  `employeeId` varchar(9) NOT NULL,
  `customerId` varchar(9) NOT NULL,
  `treatmentId` varchar(9) DEFAULT NULL,
  FOREIGN KEY (`appointmentId`) REFERENCES `appointments` (`id`),
  FOREIGN KEY (`employeeId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`customerId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`treatmentId`) REFERENCES `treatments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

INSERT INTO `pendding_appointments` (`appointmentId`, `appointmentDateTime`, `employeeId`, `customerId`, `treatmentId`) VALUES
(1, '2023-08-17 10:00:00', '3', '1', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

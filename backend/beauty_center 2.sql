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
  `id` varchar(9) NOT NULL,
  `name` varchar(50) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `phoneNumber` varchar(10) NOT NULL,
  `address` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL,
  `isEmployee` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--
INSERT INTO `users` (`id`, `name`, `mail`, `phoneNumber`, `address`, `password`, `isEmployee`) VALUES
('1', 'ss', 'yossi1316@gmail.com', '0542222222', 'Petach Tikva', '12345678', 0),
('2', 'dd', 'bbb@mailinator.com', '0523333333', 'Tel Aviv', '12345678', 0),
('3', 'rame', 'rame123@gmail.com', '0507777777', 'hefa', 'ra124524', 1),
('4', 'noor', 'nourgbareen2001@gmail.com', '0502222222', 'om alfahem', 'Noor1234', 1),
('5', 'eman', 'ghanome427@gmail.com', '0548167256', 'Nazreth', '234567eman', 1),
('6', 'ss', 'bengold789@gmail.com', '0501111111', 'Petach Tikva', '12345678', 0),
('7', 'ss', 'yossi1316@gmail.com', '0531234567', 'Petach Tikva', '12345678', 0),
('8', 'a', 'bengold789@gmail.com', '0521234567', 'Petach Tikva', '87654321', 0),
('9', 'a', 'bbb@gmail.com', '0501234567', 'Nazreth', '87654321', 0);
COMMIT;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `id` varchar(9) NOT NULL,
  `treatmentId` int(20) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `treatmentId`) VALUES
('3', 4),
('4', 5),
('5', 3);

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE IF NOT EXISTS `appointments` (
  `appointmentId` int(11) NOT NULL AUTO_INCREMENT,
  `appointmentDateTime` datetime NOT NULL,
  `employeeId` varchar(9) NOT NULL,
  `customerId` varchar(9) NOT NULL,
  `treatmentId` varchar(9) DEFAULT NULL,
  PRIMARY KEY (`appointmentId`),
  FOREIGN KEY (`employeeId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`customerId`) REFERENCES `users` (`id`),
  FOREIGN KEY (`treatmentId`) REFERENCES `treatments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;


--
-- Dumping data for table `appointment`
--

INSERT INTO `appointments` (`appointmentId`, `appointmentDateTime`, `employeeId`, `customerId`, `treatmentId`) VALUES
(1, '2023-08-17 10:00:00', '3', '1', 1),
(2, '2023-08-17 11:00:00', '3', '2', 2),
(3, '2023-08-17 12:00:00', '4', '6', 3),
(4, '2023-08-18 11:00:00', '4', '7', 4),
(5, '2023-08-18 12:00:00', '3', '1', 4),
(6, '2023-08-18 13:00:00', '5', '8', 4);


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


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
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE IF NOT EXISTS `appointments` (
  `appointmentId` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `employeeId` varchar(9) NOT NULL,
  `customerId` varchar(9) NOT NULL,
  `treatmentId` int(11) DEFAULT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  PRIMARY KEY (`appointmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointments` (`appointmentId`, `date`, `employeeId`, `customerId`, `treatmentId`, `startTime`, `endTime`) VALUES
(17, '2023-06-17 00:00:00', '12177894', '11', 4, '21:21:00', '21:21:00');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `id` varchar(9) NOT NULL,
  `customerType` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customerType`) VALUES
('12177894', 'new');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `id` varchar(9) NOT NULL,
  `treatmentId` int(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `treatmentId`) VALUES
('12177894', 4),
('212003156', 5),
('322965765', 3);

-- --------------------------------------------------------

--
-- Table structure for table `treatments`
--

DROP TABLE IF EXISTS `treatments`;
CREATE TABLE IF NOT EXISTS `treatments` (
  `treatmentId` varchar(9) NOT NULL,
  `time` int(3) NOT NULL,
  `price` double NOT NULL,
  `treatmentType` varchar(20) NOT NULL,
  PRIMARY KEY (`treatmentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `treatment`
--

INSERT INTO `treatments` (`treatmentId`, `time`, `price`, `treatmentType`) VALUES
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
('11', 'ss', 'yossi1316@gmail.com', '922222222', 'Petach Tikva', '12345678', 0),
('111', 'dd', 'bbb@mailinator.com', 'tt', '333', '12345678', 0),
('12177894', 'rame', 'rame123@gmail.com', '0507782435', 'hefa', 'ra124524', 1),
('123456789', 'ss', 'bengold789@gmail.com', '922222222', 'petach tikva', '12345678', 0),
('212003156', 'noor', 'nourgbareen2001@gmail.com', '0507782341', 'om alfahem', 'Noor1234', 1),
('322965765', 'eman', 'ghanome427@gmail.com', '0548167256', 'nazreth', '234567eman', 1),
('345556', 'ss', 'yossi1316@gmail.com', '922222222', 'Petach Tikva', '12345678', 0),
('65343', 'a', 'bengold789@gmail.com', '922222222', 'petach tikva', '87654321', 0),
('653435', 'a', 'bbb@gmail.com', '987654321', '4', '87654321', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

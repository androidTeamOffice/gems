-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 12, 2024 at 05:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gems`
--

-- --------------------------------------------------------

--
-- Table structure for table `civdatas`
--

CREATE TABLE `civdatas` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `cnic` varchar(18) NOT NULL,
  `occupation` varchar(255) NOT NULL,
  `category` varchar(500) NOT NULL,
  `type` varchar(255) NOT NULL,
  `status` enum('New','Rejected','Verified','') NOT NULL DEFAULT 'New',
  `remarks` varchar(1000) NOT NULL,
  `Card_Duration` varchar(500) NOT NULL,
  `Vehicle_Registration_No` int(255) NOT NULL,
  `Mobile_no` int(255) NOT NULL,
  `Home_phone_no` int(255) NOT NULL,
  `FCNIC` text NOT NULL,
  `Father_Husband_Name` varchar(500) NOT NULL,
  `Gaurdian_Contact` int(255) NOT NULL,
  `Gaurdian_CNIC` int(255) NOT NULL,
  `Gaurdian_Occupation` varchar(500) NOT NULL,
  `Present_Address` varchar(500) NOT NULL,
  `Permanent_Address` varchar(500) NOT NULL,
  `Profile_Picture` text NOT NULL,
  `Disability` int(255) NOT NULL,
  `Description` varchar(500) NOT NULL,
  `Vehicle_Make` varchar(500) NOT NULL,
  `Vehicle_Model` varchar(500) NOT NULL,
  `Vehicle_Type` varchar(500) NOT NULL,
  `Previous_Card_Picture` text DEFAULT NULL,
  `BCNIC` text NOT NULL,
  `Vehicle_Documents` text NOT NULL,
  `Police_Verification_Document` text NOT NULL,
  `Appointment_Day` varchar(255) NOT NULL,
  `Appointment_Time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `civdatas`
--

INSERT INTO `civdatas` (`id`, `userId`, `name`, `cnic`, `occupation`, `category`, `type`, `status`, `remarks`, `Card_Duration`, `Vehicle_Registration_No`, `Mobile_no`, `Home_phone_no`, `FCNIC`, `Father_Husband_Name`, `Gaurdian_Contact`, `Gaurdian_CNIC`, `Gaurdian_Occupation`, `Present_Address`, `Permanent_Address`, `Profile_Picture`, `Disability`, `Description`, `Vehicle_Make`, `Vehicle_Model`, `Vehicle_Type`, `Previous_Card_Picture`, `BCNIC`, `Vehicle_Documents`, `Police_Verification_Document`, `Appointment_Day`, `Appointment_Time`) VALUES
(22, 12, 'shabban', '123456789222', 'ADSads', 'Resident', 'New', 'Verified', '', '1 Year', 0, 2147483647, 2147483647, '123456789222shabban5051_fcnic.jpg', 'ADSasd', 2147483647, 2147483647, 'ADF ', 'House near zam zam plaza, adyala road rawalpindi', 'House near zam zam plaza, adyala road rawalpindi', '123456789222shabban5051_profile.jpg', 0, 'asdfasdfasdf', 'asdfasdfasdf', 'asdfasdfasdf', 'asdfasdfasdf', '123456789222shabban5051_previous_card_picture.jpg', '123456789222shabban5051_bcnic.jpg', '123456789222shabban5051_vehicle_docs.jpg', '123456789222shabban5051_police_verification.jpg', '2024-11-01', '8:00 AM - 8:30 AM'),
(23, 12, 'zxcZcxvzx', 'zxcvzxcvsadf', 'asdfa', 'Resident', 'New', 'Rejected', 'remarks are these', '1 Year', 0, 0, 0, 'zxcvzxcvsadfzxcZcxvzx9548_fcnic.jpg', 'asdf', 0, 0, 'ADF ', 'asdf', 'asdfasdf', 'zxcvzxcvsadfzxcZcxvzx9548_profile.jpg', 0, 'asdfasdf', 'ADF ', ' ADF', ' ADF', 'ADSF', 'zxcvzxcvsadfzxcZcxvzx9548_bcnic.jpg', 'zxcvzxcvsadfzxcZcxvzx9548_vehicle_docs.jpg', 'zxcvzxcvsadfzxcZcxvzx9548_police_verification.jpg', '2024-11-01', '8:00 AM - 8:30 AM'),
(24, 11, 'Ali', '1234567890888', 'JSKQJSKJ', 'Visitor', 'New', 'Rejected', 'remarks are these', '1 Year', 0, 2147483647, 2147483647, '1234567890888Ali4437_fcnic.jpg', 'WSQJSKJKK', 2147483647, 2147483647, 'ADF ', 'House near zam zam plaza, adyala road rawalpindi', 'House near zam zam plaza, adyala road rawalpindi', '1234567890888Ali4437_profile.jpg', 0, 'DFAD ', 'AA', 'AA', 'AA', 'ADSF', '1234567890888Ali4437_bcnic.jpg', '1234567890888Ali4437_vehicle_docs.jpg', '1234567890888Ali4437_police_verification.jpg', '2024-11-02', '8:00 AM - 8:30 AM'),
(25, 12, 'AHMED', '1234567890333', 'HKJKJK', 'Visitor', 'For Renewal', 'Rejected', 'Vehicle documents are not correct', '1 Year', 0, 2147483647, 2147483647, '1234567890333AHMED8138_fcnic.jpg', 'NMJNNKSD', 2147483647, 2147483647, 'ADF ', 'House near zam zam plaza, adyala road rawalpindi', 'House near zam zam plaza, adyala road rawalpindi', '1234567890333AHMED8138_profile.jpg', 0, 'asdfasdfasdf', 'nil', 'nil', 'nil', '1234567890333AHMED8138_previous_card_picture.jpg', '1234567890333AHMED8138_bcnic.jpg', '1234567890333AHMED8138_vehicle_docs.jpg', '1234567890333AHMED8138_police_verification.jpg', '2024-10-17', '4:00 PM - 4:30 PM'),
(26, 12, 'hjjhj', '6576555', 'bjhjhk', 'Visitor', 'New', 'Verified', '', '1 Year', 0, 567556, 76757, '6576555hjjhj7069_fcnic.jpg', 'ikuiyi', 98765, 98765, 'ADF ', 'ftghjk', 'kjhkjh', '6576555hjjhj7069_profile.jpg', 0, 'DFAD ', 'nil', 'nil', 'nil', '6576555hjjhj7069_previous_card_picture.jpg', '6576555hjjhj7069_bcnic.jpg', '6576555hjjhj7069_vehicle_docs.jpg', '6576555hjjhj7069_police_verification.jpg', '2024-12-11', '9:00 AM - 9:30 AM'),
(27, 12, 'qwertyui', '1234567890123', 'nnnn', 'Visitor', 'New', 'Rejected', 'remarks are these', '2 Year', 0, 2147483647, 2147483647, '1234567890123qwertyui3085_fcnic.jpg', 'jhgf', 2147483647, 2147483647, 'ADF ', 'House near zam zam plaza, adyala road rawalpindi', 'House near zam zam plaza, adyala road rawalpindi', '1234567890123qwertyui3085_profile.jpg', 0, 'broken leg', 'nil', 'nil', 'nil', '1234567890123qwertyui3085_previous_card_picture.jpg', '1234567890123qwertyui3085_bcnic.jpg', '1234567890123qwertyui3085_vehicle_docs.jpg', '1234567890123qwertyui3085_police_verification.jpg', '2024-12-11', '8:00 AM - 8:30 AM'),
(28, 0, 'qwertyui', '1234567891234', 'qwertyui', 'Visitor', 'New', 'Rejected', 'fake applicant, pledgirised data', '2 Year', 0, 2147483647, 2147483647, '1234567891234qwertyui8482_fcnic.jpg', 'sdfghjk', 2147483647, 2147483647, 'ADF ', 'House near zam zam plaza, adyala road rawalpindi', 'qwertyui', '1234567891234qwertyui8482_profile.jpg', 0, 'sdfghjkl', 'asdfghjk', 'wsdergthjk', 'asdfghjkl', '1234567891234qwertyui8482_previous_card_picture.jpg', '1234567891234qwertyui8482_bcnic.jpg', '1234567891234qwertyui8482_vehicle_docs.jpg', '1234567891234qwertyui8482_police_verification.jpg', '2024-12-28', '9:00 AM - 9:30 AM'),
(29, 0, 'sa', '12341234123411', 'qwertyu', 'Non-Resident', 'New', 'Rejected', 'Not allowed due to lessser docus', '2 Year', 0, 2147483647, 2147483647, '12341234123411sa4701_fcnic.jpg', 'qwertyuio', 2147483647, 2147483647, 'ADF ', 'House near zam zam plaza, adyala road rawalpindi', 'ear zam zam plaza, adyala road rawalpindi', '12341234123411sa4701_profile.jpg', 0, 'DFAD ', 'ADF ', ' ADF', ' ADF', 'ADSF', '12341234123411sa4701_bcnic.jpg', '12341234123411sa4701_vehicle_docs.jpg', '12341234123411sa4701_police_verification.jpg', '2024-12-14', '8:30 AM - 9:00 AM'),
(30, 0, 'qwertyui', '123412341234', 'werftgyhujik', 'Non-Resident', 'New', 'New', 'ADSF ', '2 Year', 0, 2147483647, 2147483647, '123412341234qwertyui5585_fcnic.jpg', 'wertyuio', 2147483647, 2147483647, 'ADF ', 'House near zam zam plaza, adyala road rawalpindi', 'House near zam zam plaza, adyala road rawalpindi', '123412341234qwertyui5585_profile.jpg', 0, 'DFAD ', 'ADF ', ' ADF', ' ADF', 'ADSF', '123412341234qwertyui5585_bcnic.jpg', 'ADF ', '123412341234qwertyui5585_police_verification.jpg', '2024-12-14', '8:00 AM - 8:30 AM'),
(31, 0, 'Ali', '351241743184571349', 'Student', 'Non-Resident', 'For Renewal', 'Verified', '', '2 Year', 0, 924732435, 2147483647, '3512417431845713491395315787432857235Ali543_fcnic.jpg', 'Ali', 2147483647, 2147483647, 'ADF ', 'hoiuse num ber sdnfdsgs', 'Qta Cantt', '3512417431845713491395315787432857235Ali543_profile.jpg', 0, 'DFAD ', 'ADF ', 'sfdf', ' ADF', '3512417431845713491395315787432857235Ali543_previous_card_picture.jpg', '3512417431845713491395315787432857235Ali543_bcnic.jpg', '3512417431845713491395315787432857235Ali543_vehicle_docs.jpg', '3512417431845713491395315787432857235Ali543_police_verification.jpg', '2024-12-13', '9:00 AM - 9:30 AM'),
(32, 0, 'qwertyui', '1234567890222', 'sadfasdf', 'Resident', 'New', 'Verified', '', '2 Year', 0, 2147483647, 2147483647, '1234567890222qwertyui1026_fcnic.jpg', 'sdfasfdasdf', 2147483647, 2147483647, 'ADF ', 'House near zam zam plaza, adyala road rawalpindi', 'asdfghnjmk', '1234567890222qwertyui1026_profile.jpg', 0, 'DFAD ', 'asdfghjk', 'qwertyuio', 'sdfghjk', '1234567890222qwertyui1026_previous_card_picture.jpg', '1234567890222qwertyui1026_bcnic.jpg', '1234567890222qwertyui1026_vehicle_docs.jpg', '1234567890222qwertyui1026_police_verification.jpg', '2024-12-13', '8:00 AM - 8:30 AM'),
(33, 0, 'Asif', '3840341252189', 'Student', 'Student', 'New', 'Rejected', 'fake docus', '2 Year', 123456, 12345678, 2147483647, '3840341252189Asif2440_fcnic.jpg', 'Ali', 2147483647, 2147483647, 'ADF ', 'ASDFGHH', 'ASFDSGSFHDFHDFGJ', '3840341252189Asif2440_profile.jpg', 0, 'DFAD ', 'Alto', '2023', '2024', 'ADSF', '3840341252189Asif2440_bcnic.jpg', '3840341252189Asif2440_vehicle_docs.jpg', '3840341252189Asif2440_police_verification.jpg', '2024-12-16', '10:00 AM - 10:30 AM'),
(34, 0, 'Asif', '532345327832563265', 'labour', 'Non-Resident', 'For Renewal', 'New', 'ADSF ', '1 Year', 0, 2147483647, 2147483647, '532345327832563265Asif2011_fcnic.jpg', 'ali', 2147483647, 123456, 'ADF ', 'ashgfgadsfgadsfkjjj', 'shfagfafgdgfdfgdgdgdgg', '532345327832563265Asif2011_profile.jpg', 0, 'DFAD ', 'ADF ', '2007', ' ADF', 'ADSF', '532345327832563265Asif2011_bcnic.jpg', '532345327832563265Asif2011_vehicle_docs.jpg', '532345327832563265Asif2011_police_verification.jpg', '2024-12-15', '8:30 AM - 9:00 AM');

-- --------------------------------------------------------

--
-- Table structure for table `disabled_dates`
--

CREATE TABLE `disabled_dates` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disabled_dates`
--

INSERT INTO `disabled_dates` (`id`, `date`) VALUES
(1, '2024-12-03'),
(2, '2024-12-11'),
(3, '2024-12-12'),
(4, '2024-12-19'),
(5, '2024-12-19'),
(6, '2024-12-12'),
(7, '2024-12-28'),
(8, '2024-12-20'),
(9, '2024-12-20'),
(10, '2024-12-20'),
(11, '2024-12-20'),
(12, '2024-12-20'),
(13, '2024-12-15'),
(14, '2024-12-20'),
(15, '2024-12-19'),
(16, '2024-12-15');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','manager','admin') NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `refresh_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `created_at`, `updated_at`, `refresh_token`) VALUES
(6, 'manager', '$2a$10$0IS33ixGsFjG6WdEnQq3DeK9YSOCapnOYrJFMOA36NwkBXJVlouQq', 'manager', '2024-04-24 22:49:03', '2024-12-12 20:57:58', 'f0xtqdy2wa9qjasfyl3j5'),
(7, 'admin', '$2a$10$0IS33ixGsFjG6WdEnQq3DeK9YSOCapnOYrJFMOA36NwkBXJVlouQq', 'admin', '2024-04-28 22:24:09', '2024-12-12 20:51:41', 'uhnr3amtngkqpwlexryi'),
(11, 'samaviarasool888@gmail.com', '$2a$10$0IS33ixGsFjG6WdEnQq3DeK9YSOCapnOYrJFMOA36NwkBXJVlouQq', 'user', '2024-10-30 12:08:38', '2024-12-03 13:25:49', 'rbyfwpbcti9pe0q10we3hq'),
(12, 'wardah', '$2y$10$TnAUEVcQ94krLuA4g9vfSuSQgkyZQqRWjSmnwC2OcPX3EUdw1BhrK', 'user', '2024-11-04 11:41:51', '2024-12-12 21:22:55', '6tdihtesnsiewtwcrdkkan'),
(13, 'jasa@gmail.com', '$2a$10$cFOfkYXeeN9IuAc8X3PqWej2ksZAFh8Mt/c1Uw/a1bqo4QfeXowau', 'user', '2024-12-10 20:28:59', '2024-12-10 20:30:15', '2ywjnb6x96oyms4xvgf28'),
(14, 'samavia@gmail.com', '$2a$10$4JeEkOTLeAK3xDqG1HEzTORF5jRGhGo/mm4ETnaKLXZF.XALa2.PK', 'user', '2024-12-10 21:37:11', '2024-12-10 21:42:15', 't4nv72eoqoabyhebcukzqm'),
(15, 'jasa1@gmail.com', '$2a$10$PqiuNPpp0KyLnum1m9OwRutYNzf9QQdOLTQrlDnFPicq0hV9MZbxO', 'user', '2024-12-11 18:53:38', '2024-12-11 18:53:38', NULL),
(16, 'razasif739@yahoo.com', '$2a$10$AcosFiAarZgzU523BQqwd.lfx47/xPGlid9eW2hGRXSw33mXNp3S2', 'user', '2024-12-11 19:07:30', '2024-12-11 19:10:40', 'hhg46y2avjdah2xxrlf50l'),
(17, 'raza@gmail.com', '$2a$10$U1gpLPQn9ncbZ7sOTRG/cO7Kztmr.B6jxxKGMGu54amzmJvBCADBK', 'user', '2024-12-11 19:27:16', '2024-12-12 21:00:55', 'i0m2ri2nnlwks1ge3rfp');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `civdatas`
--
ALTER TABLE `civdatas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `disabled_dates`
--
ALTER TABLE `disabled_dates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `civdatas`
--
ALTER TABLE `civdatas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `disabled_dates`
--
ALTER TABLE `disabled_dates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

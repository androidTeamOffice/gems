-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 24, 2024 at 09:17 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sms`
--

-- --------------------------------------------------------

--
-- Table structure for table `bio_data`
--

CREATE TABLE `bio_data` (
  `Army_No` varchar(20) NOT NULL,
  `Rank` varchar(20) NOT NULL,
  `Trade` varchar(50) DEFAULT NULL,
  `Name` varchar(255) NOT NULL,
  `CNIC_Indl` varchar(20) DEFAULT NULL,
  `Father_Name` varchar(255) DEFAULT NULL,
  `Med_Cat` int(11) DEFAULT NULL,
  `Bdr_Dist` varchar(50) DEFAULT NULL,
  `Sect` varchar(20) DEFAULT NULL,
  `Md_Unmd` varchar(10) DEFAULT NULL,
  `Blood_Gp` varchar(5) DEFAULT NULL,
  `Cl_Cast` varchar(50) DEFAULT NULL,
  `Svc_Bkt_Years` int(11) DEFAULT NULL,
  `Total_Svc` int(11) DEFAULT NULL,
  `Remaining_Svc` int(11) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `DOE` date DEFAULT NULL,
  `DOPR` date DEFAULT NULL,
  `TOS` varchar(20) DEFAULT NULL,
  `SOS` varchar(20) DEFAULT NULL,
  `Civ_Edn` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cadredutymapping`
--

CREATE TABLE `cadredutymapping` (
  `employee_id` int(11) NOT NULL,
  `duty_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cadres`
--

CREATE TABLE `cadres` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `cadres`
--

INSERT INTO `cadres` (`id`, `name`) VALUES
(1, 'A'),
(2, 'B'),
(3, 'C'),
(6, 'Clerk'),
(7, 'Cook'),
(4, 'D'),
(5, 'E'),
(8, 'S/W');

-- --------------------------------------------------------

--
-- Table structure for table `contact_address`
--

CREATE TABLE `contact_address` (
  `soldier_id` varchar(20) NOT NULL,
  `Vill` varchar(255) DEFAULT NULL,
  `P_O` varchar(255) DEFAULT NULL,
  `Teh` varchar(255) DEFAULT NULL,
  `Dist` varchar(255) DEFAULT NULL,
  `Contact_No` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `for_trade` varchar(50) DEFAULT NULL,
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_completion`
--

CREATE TABLE `course_completion` (
  `id` int(11) NOT NULL,
  `soldier_id` varchar(20) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `rank_id` int(11) DEFAULT NULL,
  `trade_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `course_name` varchar(255) DEFAULT NULL,
  `lacking_course_cls` varchar(255) DEFAULT NULL,
  `course_from` date DEFAULT NULL,
  `course_to` date DEFAULT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `duties`
--

CREATE TABLE `duties` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `cadre_specific` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `cadre_id` int(11) NOT NULL,
  `rank_id` int(11) NOT NULL,
  `medical_status_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `leave_type_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leavetypes`
--

CREATE TABLE `leavetypes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `leavetypes`
--

INSERT INTO `leavetypes` (`id`, `name`) VALUES
(2, 'Causal Leave'),
(1, 'Privilege Leave'),
(3, 'Weekend');

-- --------------------------------------------------------

--
-- Table structure for table `medicalstatuses`
--

CREATE TABLE `medicalstatuses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `medicalstatuses`
--

INSERT INTO `medicalstatuses` (`id`, `name`) VALUES
(1, 'A'),
(2, 'B'),
(3, 'C');

-- --------------------------------------------------------

--
-- Table structure for table `nok_info`
--

CREATE TABLE `nok_info` (
  `id` int(11) NOT NULL,
  `soldier_id` varchar(20) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `relation` varchar(50) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promotion_status`
--

CREATE TABLE `promotion_status` (
  `id` int(11) NOT NULL,
  `soldier_id` varchar(20) DEFAULT NULL,
  `trade_cl` varchar(50) DEFAULT NULL,
  `other_trade_cl` varchar(50) DEFAULT NULL,
  `mr` varchar(20) DEFAULT NULL,
  `estm_i` varchar(10) DEFAULT NULL,
  `estm_ii` varchar(10) DEFAULT NULL,
  `estm_adv` varchar(10) DEFAULT NULL,
  `bcc` varchar(10) DEFAULT NULL,
  `blc` varchar(10) DEFAULT NULL,
  `jnc` varchar(10) DEFAULT NULL,
  `pc` varchar(10) DEFAULT NULL,
  `jncoc` varchar(10) DEFAULT NULL,
  `jnac` varchar(10) DEFAULT NULL,
  `fceic` varchar(10) DEFAULT NULL,
  `commic` varchar(10) DEFAULT NULL,
  `ogmic` varchar(10) DEFAULT NULL,
  `jnmt` varchar(10) DEFAULT NULL,
  `jnbic` varchar(10) DEFAULT NULL,
  `jlc` varchar(10) DEFAULT NULL,
  `jla` varchar(10) DEFAULT NULL,
  `snc` varchar(10) DEFAULT NULL,
  `allc` varchar(10) DEFAULT NULL,
  `adm_course` varchar(255) DEFAULT NULL,
  `qual_course` varchar(255) DEFAULT NULL,
  `other_adventure_course` varchar(255) DEFAULT NULL,
  `lacking_cl` varchar(255) DEFAULT NULL,
  `qual_unqual` varchar(10) DEFAULT NULL,
  `financial_disc` varchar(10) DEFAULT NULL,
  `ere_att_dates` date DEFAULT NULL,
  `red_ink_entry` varchar(10) DEFAULT NULL,
  `indl_sign` varchar(255) DEFAULT NULL,
  `date_prom_postinf_sos` date DEFAULT NULL,
  `unit_comd_sign` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ranks`
--

CREATE TABLE `ranks` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ranks`
--

INSERT INTO `ranks` (`id`, `name`) VALUES
(1, 'Manager'),
(2, 'Worker');

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `assigned_duties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`assigned_duties`))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trades`
--

CREATE TABLE `trades` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','manager') NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `refresh_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `created_at`, `updated_at`, `refresh_token`) VALUES
(6, 'admin', '$2a$10$JMJvUWEQ9Fql1OSZ/z5TRe4sQqJ0EVIlbAaAauMvoNULS47I5A7.u', 'manager', '2024-04-24 22:49:03', '2024-04-24 23:57:30', '9ip5uw7kdfv2zrf1dpic');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bio_data`
--
ALTER TABLE `bio_data`
  ADD PRIMARY KEY (`Army_No`),
  ADD KEY `fk_med_cat` (`Med_Cat`);

--
-- Indexes for table `cadredutymapping`
--
ALTER TABLE `cadredutymapping`
  ADD PRIMARY KEY (`employee_id`,`duty_id`),
  ADD KEY `duty_id` (`duty_id`);

--
-- Indexes for table `cadres`
--
ALTER TABLE `cadres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `contact_address`
--
ALTER TABLE `contact_address`
  ADD PRIMARY KEY (`soldier_id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course_completion`
--
ALTER TABLE `course_completion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `soldier_id` (`soldier_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `rank_id` (`rank_id`),
  ADD KEY `trade_id` (`trade_id`);

--
-- Indexes for table `duties`
--
ALTER TABLE `duties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cadre_id` (`cadre_id`),
  ADD KEY `rank_id` (`rank_id`),
  ADD KEY `medical_status_id` (`medical_status_id`);

--
-- Indexes for table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `leave_type_id` (`leave_type_id`);

--
-- Indexes for table `leavetypes`
--
ALTER TABLE `leavetypes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `medicalstatuses`
--
ALTER TABLE `medicalstatuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `nok_info`
--
ALTER TABLE `nok_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `soldier_id` (`soldier_id`);

--
-- Indexes for table `promotion_status`
--
ALTER TABLE `promotion_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `soldier_id` (`soldier_id`);

--
-- Indexes for table `ranks`
--
ALTER TABLE `ranks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `trades`
--
ALTER TABLE `trades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

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
-- AUTO_INCREMENT for table `cadres`
--
ALTER TABLE `cadres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_completion`
--
ALTER TABLE `course_completion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `duties`
--
ALTER TABLE `duties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leavetypes`
--
ALTER TABLE `leavetypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `medicalstatuses`
--
ALTER TABLE `medicalstatuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `nok_info`
--
ALTER TABLE `nok_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promotion_status`
--
ALTER TABLE `promotion_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ranks`
--
ALTER TABLE `ranks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trades`
--
ALTER TABLE `trades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bio_data`
--
ALTER TABLE `bio_data`
  ADD CONSTRAINT `fk_med_cat` FOREIGN KEY (`Med_Cat`) REFERENCES `medicalstatuses` (`id`);

--
-- Constraints for table `cadredutymapping`
--
ALTER TABLE `cadredutymapping`
  ADD CONSTRAINT `cadredutymapping_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `cadredutymapping_ibfk_2` FOREIGN KEY (`duty_id`) REFERENCES `duties` (`id`);

--
-- Constraints for table `contact_address`
--
ALTER TABLE `contact_address`
  ADD CONSTRAINT `contact_address_ibfk_1` FOREIGN KEY (`soldier_id`) REFERENCES `bio_data` (`Army_No`);

--
-- Constraints for table `course_completion`
--
ALTER TABLE `course_completion`
  ADD CONSTRAINT `course_completion_ibfk_1` FOREIGN KEY (`soldier_id`) REFERENCES `bio_data` (`Army_No`),
  ADD CONSTRAINT `course_completion_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `course_completion_ibfk_3` FOREIGN KEY (`rank_id`) REFERENCES `ranks` (`id`),
  ADD CONSTRAINT `course_completion_ibfk_4` FOREIGN KEY (`trade_id`) REFERENCES `trades` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`cadre_id`) REFERENCES `cadres` (`id`),
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`rank_id`) REFERENCES `ranks` (`id`),
  ADD CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`medical_status_id`) REFERENCES `medicalstatuses` (`id`);

--
-- Constraints for table `leaves`
--
ALTER TABLE `leaves`
  ADD CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `leaves_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `leavetypes` (`id`);

--
-- Constraints for table `nok_info`
--
ALTER TABLE `nok_info`
  ADD CONSTRAINT `nok_info_ibfk_1` FOREIGN KEY (`soldier_id`) REFERENCES `bio_data` (`Army_No`);

--
-- Constraints for table `promotion_status`
--
ALTER TABLE `promotion_status`
  ADD CONSTRAINT `promotion_status_ibfk_1` FOREIGN KEY (`soldier_id`) REFERENCES `bio_data` (`Army_No`);

--
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

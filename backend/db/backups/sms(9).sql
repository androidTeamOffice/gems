-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 10, 2024 at 02:42 PM
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
-- Table structure for table `batteries`
--

CREATE TABLE `batteries` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `loc_id` int(11) NOT NULL,
  `capacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `batteries`
--

INSERT INTO `batteries` (`id`, `name`, `loc_id`, `capacity`) VALUES
(1, 'Bty A', 1, 15),
(2, 'Bty B', 1, 55);

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
  `Total_Svc` varchar(255) DEFAULT NULL,
  `Remaining_Svc` varchar(255) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `DOE` date DEFAULT NULL,
  `DOPR` date DEFAULT NULL,
  `TOS` varchar(20) DEFAULT NULL,
  `SOS` varchar(20) DEFAULT NULL,
  `Civ_Edn` varchar(50) DEFAULT NULL,
  `qual_unqual` varchar(50) DEFAULT NULL,
  `bty_id` int(11) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `district` varchar(255) NOT NULL,
  `lve_circle` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `bio_data`
--

INSERT INTO `bio_data` (`Army_No`, `Rank`, `Trade`, `Name`, `CNIC_Indl`, `Father_Name`, `Med_Cat`, `Bdr_Dist`, `Sect`, `Md_Unmd`, `Blood_Gp`, `Cl_Cast`, `Svc_Bkt_Years`, `Total_Svc`, `Remaining_Svc`, `DOB`, `DOE`, `DOPR`, `TOS`, `SOS`, `Civ_Edn`, `qual_unqual`, `bty_id`, `image`, `district`, `lve_circle`) VALUES
('123456', '4', '7', 'Awais', '123456464', 'asdajlskdja', 4, '234', 'asaf', 'single', 'AB-', 'ljasdf', 26, '0 years, 0 months, 0 days', '25 years, 12 months, 4 days', '2024-07-16', '2024-07-16', '2024-07-16', '2024-07-16T13:23:53.', '2024-07-16T13:23:53.', '32', 'Unqual', 1, '../uploads/123456.jpg', '1', 1),
('29914', '2', '1', 'Umair Jasa', '8130239425345', 'Javed Akhtar', 4, '536', 'Sunni', 'married', 'O+', 'Jasa', 26, '12 years, 0 months, 6 days', '13 years, 11 months, 28 days', '1994-01-14', '2012-06-12', '2020-04-12', '2035-09-12', '2030-05-16', 'BSCS Computer Science', 'Qual', 2, '../uploads/asdad.jpg', '', 1),
('29915', '4', '1', 'Ozair Javaid', '80132-3942534-6', 'Javaid Akhtar', 4, '258', 'Shia', 'single', 'AB+', 'Mughal', 18, '7 years, 0 months, 13 days', '10 years, 11 months, 21 days', '1995-11-11', '2017-06-07', '2026-06-22', '2045-07-25', '2024-06-16T09:53:21.', 'BSC Maths', 'Unqual', 1, '../uploads/asdad.jpg', '', 1),
('29916', '1', '1', 'Anas Javaid', '81302-3942534-7', 'Javaid Akhtar', 4, '550', 'Sikh', 'single', 'B+', 'Shykh', 23, '4 years, 0 months, 0 days', '18 years, 12 months, 4 days', '2004-01-16', '2020-06-18', '2026-06-22', '2052-06-05', '2029-06-20', 'F.Sc', 'Unqual', 2, '../uploads/asdad.jpg', '', 1),
('29917', '4', '1', 'Sarmad Javaid', '80132-3942534-8', 'Javaid Akhtar', 4, '255', 'Maliki', 'single', 'AB-', 'Mughal', 18, '7 years, 9 months, 24 days', '10 years, 2 months, 10 days', '2001-10-10', '2016-08-30', '2024-06-26', '2054-08-30', '2024-07-06', 'F.Sc', 'Unqual', 2, '../uploads/asdad.jpg', '', 1),
('321321', '5', '6', 'Aness', '325625874115', 'Aness Ahmed', 4, 'asd', 'asfd', 'single', 'asdf', 'sdf', 18, '0 years, 0 months, 0 days', '17 years, 12 months, 4 days', '2015-07-01', '2024-07-16', '2024-07-16', '2024-07-16T13:26:26.', '2024-07-16T13:26:26.', '1', 'Unqual', 2, '../uploads/321321.jpg', '1', 1),
('333399999', '4', '6', 'Aslam', '09320894094', 'askdjadfsn', 4, '2342', 'vsdffd', 'single', 'O+', 'asdf', 18, '0 years, 0 months, 0 days', '17 years, 12 months, 4 days', '2017-07-12', '2024-07-16', '2024-07-16', '2024-07-16T13:45:41.', '2024-07-16T13:45:41.', '554', 'Unqual', 2, '../uploads/333399999.jpg', '5', 1),
('564645654', '2', '1', 'asdasa', '464646465', 'asdas', 4, '6465', '5464asd', 'single', 'OP+', 'asad', 26, '0 years, 0 months, 1 days', '25 years, 12 months, 3 days', '2024-06-01', '2024-06-20', '2024-06-20', '2024-06-25', '2024-07-04', 'asd', 'Unqual', 1, '../uploads/564645654.jpg', '', 1),
('7878789', '4', '1', 'Bilal', '645235235', 'Ahmed', 4, 'asdkjad', 'kjasdfakjsdf', 'single', 'O-', 'sdfj', 18, '0 years, 0 months, 0 days', '17 years, 12 months, 4 days', '2024-07-16', '2024-07-16', '2024-07-16', '2024-07-16T14:11:12.', '2024-07-16T14:11:12.', '1', 'Unqual', 2, '../uploads/7878789.jpg', '1', 1),
('asdad', '2', '6', 'aasfd', '234234', 'sdfasfdafs', 4, 'sddfsad', 'assdsfadsfsa', 'single', 'jd', 'sdfkjlf', 26, '0 years, 0 months, 0 days', '25 years, 12 months, 4 days', '2024-07-08', '2024-07-15', '2024-07-15', '2024-07-15T11:36:22.', '2024-07-15T11:36:22.', 'kljkl', 'Unqual', 1, '../uploads/asdad.jpg', 'lkmkl', 1);

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
(6, 'Clerk'),
(7, 'Cook'),
(3, 'Gunman'),
(1, 'Opr'),
(8, 'Sanitary Worker');

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
  `Contact_No` varchar(20) DEFAULT NULL,
  `id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `contact_address`
--

INSERT INTO `contact_address` (`soldier_id`, `Vill`, `P_O`, `Teh`, `Dist`, `Contact_No`, `id`) VALUES
('29914', 'xcv', '46000', 'qwee', 'were', '03331930462', 1),
('29914', 'asdas', 'asdasd', 'asdasd', 'asasda', 'dasdas', 2),
('29914', 'wqreq', 'eacaswr', 'adsrsfcwcea', '2343rfsdc', '033319304622', 3),
('29915', '56as65as4', 'ass654as456asa65', '564as645a546', '654sd654ad546d', 'sd456sd654asd', 4);

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `for_cadre` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `name`, `for_cadre`, `details`) VALUES
(1, 'BCC', 7, 'BCC');

-- --------------------------------------------------------

--
-- Table structure for table `course_completion`
--

CREATE TABLE `course_completion` (
  `id` int(11) NOT NULL,
  `army_no` varchar(20) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `rank_id` int(11) DEFAULT NULL,
  `course_serial` varchar(255) DEFAULT NULL,
  `course_status` varchar(255) DEFAULT NULL,
  `course_from` date DEFAULT NULL,
  `course_to` date DEFAULT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `grade` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `course_completion`
--

INSERT INTO `course_completion` (`id`, `army_no`, `course_id`, `rank_id`, `course_serial`, `course_status`, `course_from`, `course_to`, `institution`, `remarks`, `grade`) VALUES
(2, '29914', 1, NULL, '41', 'InProgess', '2024-05-13', '2024-05-22', 'SAAD', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `duties`
--

CREATE TABLE `duties` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `cadre_specific` tinyint(1) NOT NULL DEFAULT 0,
  `location_id` int(11) DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `emp_req` int(11) NOT NULL,
  `occurance_in_day` int(11) NOT NULL,
  `appt_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `duties`
--

INSERT INTO `duties` (`id`, `name`, `description`, `cadre_specific`, `location_id`, `duration`, `emp_req`, `occurance_in_day`, `appt_id`) VALUES
(5, 'Kote Day', 'Kote', 1, 1, 12, 2, 2, 1),
(6, 'Kote Night', 'Kote', 1, 1, 2, 3, 12, 2);

-- --------------------------------------------------------

--
-- Table structure for table `duty_appts`
--

CREATE TABLE `duty_appts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `duty_appts`
--

INSERT INTO `duty_appts` (`id`, `name`) VALUES
(1, 'Guard Commander'),
(2, 'Sentary');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `cadre_id` int(11) NOT NULL,
  `rank_id` int(11) NOT NULL,
  `medical_status_id` int(11) DEFAULT NULL,
  `Army_No` varchar(20) DEFAULT NULL,
  `loc_id` int(11) DEFAULT NULL,
  `available` varchar(1) NOT NULL DEFAULT 'Y',
  `remarks` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `cadre_id`, `rank_id`, `medical_status_id`, `Army_No`, `loc_id`, `available`, `remarks`) VALUES
(1, 'Umair Jasa', 1, 1, 4, '29914', 1, 'Y', NULL),
(3, 'Ozair Javaid', 1, 2, 4, '29915', 1, 'Y', ''),
(4, 'Anas Javaid', 1, 4, 2, '29916', 1, 'Y', NULL),
(5, 'Sarmad Javaid', 1, 4, 2, '29917', 1, 'Y', NULL),
(10, 'Ahsan', 1, 5, 2, '564645654', 1, 'Y', NULL),
(11, 'Jalal', 6, 5, 2, 'asdad', 1, 'Y', NULL),
(12, 'Awais', 7, 4, 4, '123456', 1, 'y', NULL),
(13, 'Aness', 6, 5, 2, '321321', 1, 'y', NULL),
(14, 'Aslam', 6, 4, NULL, '333399999', 1, 'Y', NULL),
(15, 'Bilal', 1, 4, NULL, '7878789', 1, 'Y', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `leave_type_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `avail_till_date` date DEFAULT NULL,
  `loc_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `leaves`
--

INSERT INTO `leaves` (`id`, `employee_id`, `leave_type_id`, `start_date`, `end_date`, `avail_till_date`, `loc_id`) VALUES
(1, 1, 2, '2024-05-12', '2024-05-22', '2024-05-20', 1),
(2, 5, 1, '2024-06-15', '2024-06-20', '2024-06-17', 1),
(3, 3, 2, '2024-06-16', '2024-06-25', '2024-06-25', 1),
(4, 1, 4, '2024-06-25', '2024-06-25', '2024-06-25', 1),
(5, 3, 4, '2024-06-26', '2024-06-30', '2024-06-28', 1),
(6, 1, 3, '2024-07-26', '2024-07-27', '2024-07-27', 1),
(7, 1, 1, '2024-08-10', '2024-08-19', '2024-08-19', 1),
(8, 3, 2, '2024-08-10', '2024-08-12', '2024-08-12', 1),
(9, 12, 4, '2024-08-10', '2024-08-11', '2024-08-11', 1);

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
(4, 'Ex-Pak Leave'),
(1, 'Privilege Leave'),
(3, 'Weekend');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `description`, `capacity`) VALUES
(1, 'Ogri Camp', 'HQ', 50);

-- --------------------------------------------------------

--
-- Table structure for table `lve_circles`
--

CREATE TABLE `lve_circles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `distance` varchar(255) NOT NULL,
  `lveGt` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `lve_circles`
--

INSERT INTO `lve_circles` (`id`, `name`, `distance`, `lveGt`) VALUES
(1, 'A', '200', '2');

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
(4, 'Ave'),
(2, 'B'),
(3, 'C');

-- --------------------------------------------------------

--
-- Table structure for table `nok_info`
--

CREATE TABLE `nok_info` (
  `id` int(11) NOT NULL,
  `army_no` varchar(20) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `relation` varchar(50) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `nok_info`
--

INSERT INTO `nok_info` (`id`, `army_no`, `name`, `relation`, `address`, `contact_no`) VALUES
(1, '29914', 'Ahaan Fatime', 'Daughter', 'Same', '03331930461'),
(2, '29914', 'Ameara Maryam', 'Daughter', 'Same', '03331930461');

-- --------------------------------------------------------

--
-- Table structure for table `promotion_status`
--

CREATE TABLE `promotion_status` (
  `id` int(11) NOT NULL,
  `army_no` varchar(20) DEFAULT NULL,
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
  `name` varchar(255) NOT NULL,
  `duty_appt` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ranks`
--

INSERT INTO `ranks` (`id`, `name`, `duty_appt`) VALUES
(1, 'Nk', 1),
(2, 'Hav', 1),
(4, 'Lnk', 2),
(5, 'Sep', 2),
(6, 'N Hav', 2);

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
  `duty_id` int(11) NOT NULL,
  `end_date` date DEFAULT NULL
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
(6, 'admin', '$2a$10$NyAIdJlDZwI2vHsh36fP2uu1WGF9NgxCJoE1ETF.6yevaVAmkXgY6', 'manager', '2024-04-24 22:49:03', '2024-08-10 17:11:40', 'omborq1ewtfy2pcdbjrht'),
(7, 'user', '$2a$10$E.S3AustyttbC/WngFJVRu6Sp/WFYfRiWazEZKc2V/iszU5J8qgkS', 'user', '2024-04-28 22:24:09', '2024-04-30 00:00:29', 'cxz38k939xjszohm45iv2a');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `batteries`
--
ALTER TABLE `batteries`
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`id`);

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
  ADD KEY `course_id` (`course_id`),
  ADD KEY `army_no` (`army_no`) USING BTREE;

--
-- Indexes for table `duties`
--
ALTER TABLE `duties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_duty_location` (`location_id`);

--
-- Indexes for table `duty_appts`
--
ALTER TABLE `duty_appts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cadre_id` (`cadre_id`),
  ADD KEY `rank_id` (`rank_id`),
  ADD KEY `medical_status_id` (`medical_status_id`),
  ADD KEY `fk_employee_bio_data` (`Army_No`),
  ADD KEY `fk_loc_id1` (`loc_id`);

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
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lve_circles`
--
ALTER TABLE `lve_circles`
  ADD PRIMARY KEY (`id`);

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
  ADD KEY `army_no` (`army_no`) USING BTREE;

--
-- Indexes for table `promotion_status`
--
ALTER TABLE `promotion_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `army_no` (`army_no`) USING BTREE;

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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `batteries`
--
ALTER TABLE `batteries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cadres`
--
ALTER TABLE `cadres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `contact_address`
--
ALTER TABLE `contact_address`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `course_completion`
--
ALTER TABLE `course_completion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `duties`
--
ALTER TABLE `duties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `duty_appts`
--
ALTER TABLE `duty_appts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `leavetypes`
--
ALTER TABLE `leavetypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lve_circles`
--
ALTER TABLE `lve_circles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `medicalstatuses`
--
ALTER TABLE `medicalstatuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `nok_info`
--
ALTER TABLE `nok_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `promotion_status`
--
ALTER TABLE `promotion_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ranks`
--
ALTER TABLE `ranks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=569;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
  ADD CONSTRAINT `course_completion_ibfk_1` FOREIGN KEY (`army_no`) REFERENCES `bio_data` (`Army_No`),
  ADD CONSTRAINT `course_completion_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `course_completion_ibfk_3` FOREIGN KEY (`rank_id`) REFERENCES `ranks` (`id`),
  ADD CONSTRAINT `course_completion_ibfk_4` FOREIGN KEY (`grade`) REFERENCES `trades` (`id`),
  ADD CONSTRAINT `fk_cadre_id` FOREIGN KEY (`grade`) REFERENCES `cadres` (`id`),
  ADD CONSTRAINT `fk_cadre_id1` FOREIGN KEY (`grade`) REFERENCES `cadres` (`id`);

--
-- Constraints for table `duties`
--
ALTER TABLE `duties`
  ADD CONSTRAINT `fk_duty_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`cadre_id`) REFERENCES `cadres` (`id`),
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`rank_id`) REFERENCES `ranks` (`id`),
  ADD CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`medical_status_id`) REFERENCES `medicalstatuses` (`id`),
  ADD CONSTRAINT `fk_employee_bio_data` FOREIGN KEY (`Army_No`) REFERENCES `bio_data` (`Army_No`),
  ADD CONSTRAINT `fk_loc_id1` FOREIGN KEY (`loc_id`) REFERENCES `locations` (`id`);

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
  ADD CONSTRAINT `nok_info_ibfk_1` FOREIGN KEY (`army_no`) REFERENCES `bio_data` (`Army_No`);

--
-- Constraints for table `promotion_status`
--
ALTER TABLE `promotion_status`
  ADD CONSTRAINT `promotion_status_ibfk_1` FOREIGN KEY (`army_no`) REFERENCES `bio_data` (`Army_No`);

--
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 22, 2024 at 06:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `empdatabase1`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id` int(11) NOT NULL,
  `u_name` varchar(255) NOT NULL,
  `u_pass` varchar(255) NOT NULL,
  `f_name` varchar(255) DEFAULT NULL,
  `l_name` varchar(255) DEFAULT NULL,
  `n_name` varchar(255) DEFAULT NULL,
  `tel` varchar(10) DEFAULT NULL,
  `u_type_name_id` int(1) NOT NULL,
  `u_namebank` varchar(255) DEFAULT NULL,
  `u_idbook` varchar(11) DEFAULT NULL,
  `u_status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `u_name`, `u_pass`, `f_name`, `l_name`, `n_name`, `tel`, `u_type_name_id`, `u_namebank`, `u_idbook`, `u_status`) VALUES
(1, 'Kris', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 'Kitsana', 'T', 'Top', '0888888888', 0, 'ธนาคารกสิกรไทย', '0311452673', 1),
(2, 'June', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 'Pornpailin', 'B', 'June', '0622222222', 1, 'ธนาคารกรุงไทย', '2147483647', 1),
(3, 'Make', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 'Bunyakorn', 'K', 'Make', '0999999999', 2, 'ธนาคารออมสิน', '1234567890', 1),
(4, 'Noon', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 'Wisutta', 'P', 'Noon', '0870551690', 2, 'ธนาคารกรุงเทพ', '7234567899', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

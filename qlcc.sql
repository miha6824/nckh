-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 02, 2024 lúc 09:05 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `qlcc`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `account`
--

CREATE TABLE `account` (
  `ID` int(11) NOT NULL,
  `Email` varchar(200) NOT NULL,
  `Password` varchar(200) NOT NULL,
  `ID_User` int(11) NOT NULL,
  `Role` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `account`
--

INSERT INTO `account` (`ID`, `Email`, `Password`, `ID_User`, `Role`) VALUES
(16, 'nguyenpham6273@gmail.com', '12345', 30, 'user'),
(49, 'admin1@gmail.com', '12345', 79, 'admin'),
(248, 'Zac Efron@gmail.com', '12345', 335, 'user');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attendance`
--

CREATE TABLE `attendance` (
  `ID` int(11) NOT NULL,
  `ID_User` int(11) NOT NULL,
  `FullName` varchar(300) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Status` varchar(300) NOT NULL,
  `Image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `attendance`
--

INSERT INTO `attendance` (`ID`, `ID_User`, `FullName`, `timestamp`, `Status`, `Image`) VALUES
(157, 79, 'admin', '2024-06-29 16:59:00', 'nghỉ làm', 'nghỉ làm'),
(670, 335, 'Zac Efron', '2024-07-27 01:15:00', 'Check In', 'Zac Efron_4.jpg'),
(671, 335, 'Zac Efron', '2024-07-27 09:56:00', 'Check Out', 'Zac Efron_4.jpg'),
(672, 335, 'Zac Efron', '2024-07-27 01:15:00', 'Check In', 'Zac Efron_45.jpg'),
(673, 335, 'Zac Efron', '2024-07-27 09:56:00', 'Check Out', 'Zac Efron_45.jpg'),
(674, 335, 'Zac Efron', '2024-07-30 01:17:00', 'Check In', 'Zac Efron_4.jpg'),
(675, 335, 'Zac Efron', '2024-07-30 09:58:00', 'Check Out', 'Zac Efron_4.jpg'),
(676, 335, 'Zac Efron', '2024-07-30 01:17:00', 'Check In', 'Zac Efron_45.jpg'),
(677, 335, 'Zac Efron', '2024-07-30 09:58:00', 'Check Out', 'Zac Efron_45.jpg'),
(678, 335, 'Zac Efron', '2024-07-16 01:09:00', 'Check In', 'Zac Efron_4.jpg'),
(679, 335, 'Zac Efron', '2024-07-16 09:44:00', 'Check Out', 'Zac Efron_4.jpg'),
(680, 335, 'Zac Efron', '2024-07-16 01:09:00', 'Check In', 'Zac Efron_45.jpg'),
(681, 335, 'Zac Efron', '2024-07-16 09:44:00', 'Check Out', 'Zac Efron_45.jpg'),
(682, 335, 'Zac Efron', '2024-07-03 01:00:00', 'Check In', 'Zac Efron_4.jpg'),
(683, 335, 'Zac Efron', '2024-07-03 09:38:00', 'Check Out', 'Zac Efron_4.jpg'),
(684, 335, 'Zac Efron', '2024-07-03 01:00:00', 'Check In', 'Zac Efron_45.jpg'),
(685, 335, 'Zac Efron', '2024-07-03 09:38:00', 'Check Out', 'Zac Efron_45.jpg'),
(686, 335, 'Zac Efron', '2024-07-04 01:04:00', 'Check In', 'Zac Efron_4.jpg'),
(687, 335, 'Zac Efron', '2024-07-04 09:52:00', 'Check Out', 'Zac Efron_4.jpg'),
(688, 335, 'Zac Efron', '2024-07-04 01:04:00', 'Check In', 'Zac Efron_45.jpg'),
(689, 335, 'Zac Efron', '2024-07-04 09:52:00', 'Check Out', 'Zac Efron_45.jpg'),
(690, 335, 'Zac Efron', '2024-07-09 01:13:00', 'Check In', 'Zac Efron_4.jpg'),
(691, 335, 'Zac Efron', '2024-07-09 09:57:00', 'Check Out', 'Zac Efron_4.jpg'),
(692, 335, 'Zac Efron', '2024-07-09 01:13:00', 'Check In', 'Zac Efron_45.jpg'),
(693, 335, 'Zac Efron', '2024-07-09 09:57:00', 'Check Out', 'Zac Efron_45.jpg'),
(694, 335, 'Zac Efron', '2024-07-21 01:05:00', 'Check In', 'Zac Efron_4.jpg'),
(695, 335, 'Zac Efron', '2024-07-21 09:58:00', 'Check Out', 'Zac Efron_4.jpg'),
(696, 335, 'Zac Efron', '2024-07-21 01:05:00', 'Check In', 'Zac Efron_45.jpg'),
(697, 335, 'Zac Efron', '2024-07-21 09:58:00', 'Check Out', 'Zac Efron_45.jpg'),
(698, 335, 'Zac Efron', '2024-07-26 01:04:00', 'Check In', 'Zac Efron_4.jpg'),
(699, 335, 'Zac Efron', '2024-07-26 09:38:00', 'Check Out', 'Zac Efron_4.jpg'),
(700, 335, 'Zac Efron', '2024-07-26 01:04:00', 'Check In', 'Zac Efron_45.jpg'),
(701, 335, 'Zac Efron', '2024-07-26 09:38:00', 'Check Out', 'Zac Efron_45.jpg'),
(702, 335, 'Zac Efron', '2024-07-13 01:11:00', 'Check In', 'Zac Efron_4.jpg'),
(703, 335, 'Zac Efron', '2024-07-13 09:50:00', 'Check Out', 'Zac Efron_4.jpg'),
(704, 335, 'Zac Efron', '2024-07-13 01:11:00', 'Check In', 'Zac Efron_45.jpg'),
(705, 335, 'Zac Efron', '2024-07-13 09:50:00', 'Check Out', 'Zac Efron_45.jpg'),
(706, 335, 'Zac Efron', '2024-07-24 01:26:00', 'Check In', 'Zac Efron_4.jpg'),
(707, 335, 'Zac Efron', '2024-07-24 09:43:00', 'Check Out', 'Zac Efron_4.jpg'),
(708, 335, 'Zac Efron', '2024-07-24 01:26:00', 'Check In', 'Zac Efron_45.jpg'),
(709, 335, 'Zac Efron', '2024-07-24 09:43:00', 'Check Out', 'Zac Efron_45.jpg'),
(710, 335, 'Zac Efron', '2024-07-11 01:11:00', 'Check In', 'Zac Efron_4.jpg'),
(711, 335, 'Zac Efron', '2024-07-11 09:42:00', 'Check Out', 'Zac Efron_4.jpg'),
(712, 335, 'Zac Efron', '2024-07-11 01:11:00', 'Check In', 'Zac Efron_45.jpg'),
(713, 335, 'Zac Efron', '2024-07-11 09:42:00', 'Check Out', 'Zac Efron_45.jpg'),
(714, 335, 'Zac Efron', '2024-07-20 01:17:00', 'Check In', 'Zac Efron_4.jpg'),
(715, 335, 'Zac Efron', '2024-07-20 10:00:00', 'Check Out', 'Zac Efron_4.jpg'),
(716, 335, 'Zac Efron', '2024-07-20 01:17:00', 'Check In', 'Zac Efron_45.jpg'),
(717, 335, 'Zac Efron', '2024-07-20 10:00:00', 'Check Out', 'Zac Efron_45.jpg'),
(718, 335, 'Zac Efron', '2024-07-12 01:13:00', 'Check In', 'Zac Efron_4.jpg'),
(719, 335, 'Zac Efron', '2024-07-12 09:36:00', 'Check Out', 'Zac Efron_4.jpg'),
(720, 335, 'Zac Efron', '2024-07-12 01:13:00', 'Check In', 'Zac Efron_45.jpg'),
(721, 335, 'Zac Efron', '2024-07-12 09:36:00', 'Check Out', 'Zac Efron_45.jpg'),
(722, 335, 'Zac Efron', '2024-07-10 01:13:00', 'Check In', 'Zac Efron_4.jpg'),
(723, 335, 'Zac Efron', '2024-07-10 09:51:00', 'Check Out', 'Zac Efron_4.jpg'),
(724, 335, 'Zac Efron', '2024-07-10 01:13:00', 'Check In', 'Zac Efron_45.jpg'),
(725, 335, 'Zac Efron', '2024-07-10 09:51:00', 'Check Out', 'Zac Efron_45.jpg'),
(726, 335, 'Zac Efron', '2024-07-06 01:12:00', 'Check In', 'Zac Efron_4.jpg'),
(727, 335, 'Zac Efron', '2024-07-06 10:00:00', 'Check Out', 'Zac Efron_4.jpg'),
(728, 335, 'Zac Efron', '2024-07-06 01:12:00', 'Check In', 'Zac Efron_45.jpg'),
(729, 335, 'Zac Efron', '2024-07-06 10:00:00', 'Check Out', 'Zac Efron_45.jpg'),
(730, 335, 'Zac Efron', '2024-07-02 01:11:00', 'Check In', 'Zac Efron_4.jpg'),
(731, 335, 'Zac Efron', '2024-07-02 09:43:00', 'Check Out', 'Zac Efron_4.jpg'),
(732, 335, 'Zac Efron', '2024-07-02 01:11:00', 'Check In', 'Zac Efron_45.jpg'),
(733, 335, 'Zac Efron', '2024-07-02 09:43:00', 'Check Out', 'Zac Efron_45.jpg'),
(734, 335, 'Zac Efron', '2024-07-08 01:03:00', 'Check In', 'Zac Efron_4.jpg'),
(735, 335, 'Zac Efron', '2024-07-08 09:57:00', 'Check Out', 'Zac Efron_4.jpg'),
(736, 335, 'Zac Efron', '2024-07-08 01:03:00', 'Check In', 'Zac Efron_45.jpg'),
(737, 335, 'Zac Efron', '2024-07-08 09:57:00', 'Check Out', 'Zac Efron_45.jpg'),
(738, 335, 'Zac Efron', '2024-07-29 01:20:00', 'Check In', 'Zac Efron_4.jpg'),
(739, 335, 'Zac Efron', '2024-07-29 09:48:00', 'Check Out', 'Zac Efron_4.jpg'),
(740, 335, 'Zac Efron', '2024-07-29 01:20:00', 'Check In', 'Zac Efron_45.jpg'),
(741, 335, 'Zac Efron', '2024-07-29 09:48:00', 'Check Out', 'Zac Efron_45.jpg'),
(742, 335, 'Zac Efron', '2024-07-25 01:02:00', 'Check In', 'Zac Efron_4.jpg'),
(743, 335, 'Zac Efron', '2024-07-25 09:31:00', 'Check Out', 'Zac Efron_4.jpg'),
(744, 335, 'Zac Efron', '2024-07-25 01:02:00', 'Check In', 'Zac Efron_45.jpg'),
(745, 335, 'Zac Efron', '2024-07-25 09:31:00', 'Check Out', 'Zac Efron_45.jpg'),
(746, 335, 'Zac Efron', '2024-07-14 01:04:00', 'Check In', 'Zac Efron_4.jpg'),
(747, 335, 'Zac Efron', '2024-07-14 09:32:00', 'Check Out', 'Zac Efron_4.jpg'),
(748, 335, 'Zac Efron', '2024-07-14 01:04:00', 'Check In', 'Zac Efron_45.jpg'),
(749, 335, 'Zac Efron', '2024-07-14 09:32:00', 'Check Out', 'Zac Efron_45.jpg'),
(750, 335, 'Zac Efron', '2024-07-17 01:08:00', 'Check In', 'Zac Efron_4.jpg'),
(751, 335, 'Zac Efron', '2024-07-17 09:47:00', 'Check Out', 'Zac Efron_4.jpg'),
(752, 335, 'Zac Efron', '2024-07-17 01:08:00', 'Check In', 'Zac Efron_45.jpg'),
(753, 335, 'Zac Efron', '2024-07-17 09:47:00', 'Check Out', 'Zac Efron_45.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `department`
--

CREATE TABLE `department` (
  `ID` int(11) NOT NULL,
  `KHPhongBan` varchar(200) NOT NULL,
  `TenPhongBan` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `department`
--

INSERT INTO `department` (`ID`, `KHPhongBan`, `TenPhongBan`) VALUES
(2, 'IT', 'Công nghệ thông tin'),
(3, 'SL', 'Sale'),
(4, 'HR', 'Quản lý nhân sự'),
(5, 'Mk', 'Maketing'),
(6, 'CSKH', 'Chăm sóc khách hàng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `position`
--

CREATE TABLE `position` (
  `ID` int(11) NOT NULL,
  `TenCV` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `position details`
--

CREATE TABLE `position details` (
  `MaCTChucvu` varchar(100) NOT NULL,
  `MaCV` int(11) NOT NULL,
  `ID_User` int(11) NOT NULL,
  `NgayBatDau` date NOT NULL,
  `NgayKetThuc` date NOT NULL,
  `LyDo` varchar(2000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `salary`
--

CREATE TABLE `salary` (
  `HSLuong` float NOT NULL,
  `BaseSalary` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `salary`
--

INSERT INTO `salary` (`HSLuong`, `BaseSalary`) VALUES
(2.34, 4212000),
(2.67, 4806000),
(3, 5400000),
(3.33, 5994000),
(3.66, 6588000),
(3.99, 7182000),
(4.32, 7776000),
(4.65, 8370000),
(4.98, 8964000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `standard_times`
--

CREATE TABLE `standard_times` (
  `date` date NOT NULL,
  `checkin_time` time DEFAULT NULL,
  `checkout_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `standard_times`
--

INSERT INTO `standard_times` (`date`, `checkin_time`, `checkout_time`) VALUES
('2024-06-23', '17:50:00', '17:51:00'),
('2024-06-24', '19:21:00', '20:21:00'),
('2024-06-25', '10:10:00', '17:12:00'),
('2024-06-26', '01:38:00', '01:40:00'),
('2024-06-27', '01:01:00', '01:05:00'),
('2024-06-28', '01:25:00', '01:27:00'),
('2024-06-29', '22:06:00', '22:16:00'),
('2024-06-30', '04:30:00', '18:30:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `ID` int(11) NOT NULL,
  `Email` varchar(200) NOT NULL,
  `FullName` varchar(200) NOT NULL,
  `Sex` varchar(4) NOT NULL,
  `BirthDay` date NOT NULL,
  `Telephone` int(10) NOT NULL,
  `Address` varchar(300) NOT NULL,
  `ID_Department` int(100) DEFAULT NULL,
  `HSLuong` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`ID`, `Email`, `FullName`, `Sex`, `BirthDay`, `Telephone`, `Address`, `ID_Department`, `HSLuong`) VALUES
(30, 'nguyenpham6273@gmail.com', 'Nguyễn Phạm Nguyên Anh', 'Nam', '2023-12-24', 972385659, 'Hà Nội', 2, 3.99),
(79, 'admin1@gmail.com', 'admin', 'Nam', '0000-00-00', 4234, 'admin', NULL, NULL),
(335, 'Zac Efron@gmail.com', 'Zac Efron', '', '0000-00-00', 0, 'Hà Nội', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `userimage`
--

CREATE TABLE `userimage` (
  `ID` int(11) NOT NULL,
  `UserName` varchar(200) NOT NULL,
  `Image` varchar(300) NOT NULL,
  `ID_User` int(11) NOT NULL,
  `FaceDescriptor` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`FaceDescriptor`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `userimage`
--

INSERT INTO `userimage` (`ID`, `UserName`, `Image`, `ID_User`, `FaceDescriptor`) VALUES
(293, 'Zac Efron', '1719946253660.jpg', 335, '[-0.1522746980190277,0.08945895731449127,0.06187715753912926,-0.11273903399705887,-0.12973393499851227,-0.059026606380939484,-0.06205335259437561,-0.04766024649143219,0.16124120354652405,0.0049528032541275024,0.21066738665103912,-0.005093592684715986,-0.2532041370868683,0.0491199865937233,-0.11817168444395065,-0.011556395329535007,-0.15174801647663116,-0.11541491746902466,-0.10711124539375305,-0.044424839317798615,0.051117438822984695,0.04265731945633888,0.01738986372947693,0.09974990785121918,-0.16100642085075378,-0.194319948554039,-0.0907575786113739,-0.1626116931438446,0.06010504439473152,-0.18712769448757172,0.05816884711384773,0.03826260194182396,-0.25699955224990845,-0.17817622423171997,-0.010223940014839172,0.01581665500998497,-0.07693005353212357,-0.11963040381669998,0.23411042988300323,0.019069183617830276,-0.06511387974023819,-0.07658295333385468,0.0759185403585434,0.2931799590587616,0.1274382621049881,0.06417709589004517,0.010135184042155743,-0.0520278625190258,0.0635911300778389,-0.2643525004386902,0.06530347466468811,0.2236889898777008,0.12181220203638077,0.13032367825508118,0.09875883162021637,-0.1899898201227188,0.11558065563440323,0.17402563989162445,-0.2258981168270111,0.14470723271369934,0.023669160902500153,0.06992746889591217,0.02007036842405796,-0.059355977922677994,0.20340421795845032,0.05784408003091812,-0.09297309815883636,-0.08209525048732758,0.12019462138414383,-0.14247502386569977,-0.05730368196964264,0.15830525755882263,-0.1306643784046173,-0.203098326921463,-0.18939703702926636,0.05881744250655174,0.36581435799598694,0.16063192486763,-0.0970778688788414,0.011094591580331326,-0.064274363219738,-0.18304617702960968,-0.08253254741430283,0.007373965345323086,-0.15910395979881287,0.008948964066803455,-0.0006126997177489102,0.07981294393539429,0.17242585122585297,0.08788438886404037,0.023355061188340187,0.23189271986484528,0.030361752957105637,-0.11008821427822113,0.05932093784213066,0.015468425117433071,-0.12460657209157944,-0.008751380257308483,-0.08988989889621735,0.05142582952976227,0.004694137256592512,-0.1008787602186203,-0.03799650818109512,0.11362935602664948,-0.14868998527526855,0.04141984507441521,-0.02296379581093788,-0.13088195025920868,-0.12515203654766083,-0.06417185813188553,-0.1466156244277954,-0.06641902029514313,0.20925922691822052,-0.24267049133777618,0.16724398732185364,0.16459742188453674,0.05881324037909508,0.08237062394618988,0.04055643081665039,0.023027770221233368,0.053470950573682785,0.04622001573443413,-0.09195404499769211,-0.08263952285051346,0.09488359093666077,-0.10040220618247986,0.02513313852250576,-0.029828933998942375]'),
(294, 'Zac Efron', '1719946272047.jpg', 335, '[-0.11313475668430328,0.10632764548063278,0.09582854062318802,-0.11864499747753143,-0.12129376828670502,-0.0732952281832695,-0.09961901605129242,0.005493404343724251,0.1181207001209259,0.020473578944802284,0.19149164855480194,-0.05636931583285332,-0.2700006365776062,0.07808639109134674,-0.10676856338977814,0.01998995803296566,-0.17140863835811615,-0.09419213980436325,-0.09778616577386856,-0.09028834849596024,0.04885995015501976,0.10619329661130905,0.013350197114050388,0.0746411606669426,-0.13901884853839874,-0.2464117854833603,-0.09381021559238434,-0.12453509122133255,0.0815880298614502,-0.18720416724681854,-0.008203085511922836,0.05512073636054993,-0.2449406385421753,-0.12465733289718628,0.03285147249698639,0.0351620577275753,-0.07940623909235,-0.1529732346534729,0.19110658764839172,0.0694378986954689,-0.0015442583244293928,-0.018463561311364174,0.057783350348472595,0.341747909784317,0.18890076875686646,0.08754552900791168,0.002356430981308222,-0.06109857186675072,0.06408342719078064,-0.27532336115837097,0.09711603075265884,0.24196107685565948,0.14989019930362701,0.09902123361825943,0.12387165427207947,-0.183164581656456,0.13422879576683044,0.12648221850395203,-0.2349267154932022,0.14676514267921448,0.07298098504543304,0.05199037119746208,0.018994471058249474,-0.07416673749685287,0.18376658856868744,0.030850501731038094,-0.0813375934958458,-0.07838127762079239,0.11250465363264084,-0.13239894807338715,-0.025309892371296883,0.1178751289844513,-0.12975963950157166,-0.19617876410484314,-0.15684813261032104,0.03374648839235306,0.33780354261398315,0.20356741547584534,-0.1427670568227768,0.0470140278339386,-0.06622343510389328,-0.1524122953414917,-0.016599174588918686,-0.029361000284552574,-0.17297503352165222,-0.03687867894768715,-0.08427708595991135,0.12494931370019913,0.18764877319335938,0.041719138622283936,0.016347739845514297,0.24562497437000275,0.029339836910367012,-0.09295367449522018,0.04895787313580513,-0.033474139869213104,-0.14728505909442902,-0.006684316322207451,-0.08997797220945358,0.021055467426776886,0.006464650388807058,-0.1173444539308548,-0.07767371088266373,0.10865071415901184,-0.1711781769990921,0.06582077592611313,-0.010394583456218243,-0.11978842318058014,-0.12926709651947021,-0.11418762058019638,-0.1713668406009674,-0.016121912747621536,0.21471983194351196,-0.2580016553401947,0.1383146494626999,0.16740737855434418,0.07590985298156738,0.09658410400152206,0.036455001682043076,0.005455430597066879,0.051978062838315964,-0.02128862589597702,-0.1236872673034668,-0.0838179960846901,0.06591393798589706,-0.06523828208446503,0.02902131900191307,0.008295605890452862]');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_User` (`ID_User`);

--
-- Chỉ mục cho bảng `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_User` (`ID_User`);

--
-- Chỉ mục cho bảng `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`ID`);

--
-- Chỉ mục cho bảng `position`
--
ALTER TABLE `position`
  ADD PRIMARY KEY (`ID`);

--
-- Chỉ mục cho bảng `position details`
--
ALTER TABLE `position details`
  ADD PRIMARY KEY (`MaCTChucvu`),
  ADD KEY `ID_User` (`ID_User`),
  ADD KEY `MaCV` (`MaCV`);

--
-- Chỉ mục cho bảng `salary`
--
ALTER TABLE `salary`
  ADD PRIMARY KEY (`HSLuong`);

--
-- Chỉ mục cho bảng `standard_times`
--
ALTER TABLE `standard_times`
  ADD PRIMARY KEY (`date`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_Department` (`ID_Department`),
  ADD KEY `HSLuong` (`HSLuong`);

--
-- Chỉ mục cho bảng `userimage`
--
ALTER TABLE `userimage`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_User` (`ID_User`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `account`
--
ALTER TABLE `account`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=249;

--
-- AUTO_INCREMENT cho bảng `attendance`
--
ALTER TABLE `attendance`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=754;

--
-- AUTO_INCREMENT cho bảng `department`
--
ALTER TABLE `department`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `position`
--
ALTER TABLE `position`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=336;

--
-- AUTO_INCREMENT cho bảng `userimage`
--
ALTER TABLE `userimage`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=295;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `account_ibfk_1` FOREIGN KEY (`ID_User`) REFERENCES `user` (`ID`);

--
-- Các ràng buộc cho bảng `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`ID_User`) REFERENCES `user` (`ID`);

--
-- Các ràng buộc cho bảng `position details`
--
ALTER TABLE `position details`
  ADD CONSTRAINT `position details_ibfk_1` FOREIGN KEY (`ID_User`) REFERENCES `user` (`ID`),
  ADD CONSTRAINT `position details_ibfk_2` FOREIGN KEY (`MaCV`) REFERENCES `position` (`ID`);

--
-- Các ràng buộc cho bảng `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`ID_Department`) REFERENCES `department` (`ID`),
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`HSLuong`) REFERENCES `salary` (`HSLuong`);

--
-- Các ràng buộc cho bảng `userimage`
--
ALTER TABLE `userimage`
  ADD CONSTRAINT `userimage_ibfk_1` FOREIGN KEY (`ID_User`) REFERENCES `user` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

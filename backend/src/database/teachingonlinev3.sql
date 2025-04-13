-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: mysql-f085f95-nguyen-doanvo5403.h.aivencloud.com    Database: teaching
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '1caf7756-ea87-11ef-98be-ea0d53c0fe3a:1-2165';

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text,
  `due_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`assignment_id`),
  KEY `FK_951fd419e8486c10ba6302a934b` (`class_id`),
  CONSTRAINT `FK_951fd419e8486c10ba6302a934b` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `class_name` varchar(100) NOT NULL,
  `description` text,
  `teacher_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `class_code` char(7) NOT NULL,
  PRIMARY KEY (`class_id`),
  KEY `FK_b34c92e413c4debb6e0f23fed46` (`teacher_id`),
  CONSTRAINT `FK_b34c92e413c4debb6e0f23fed46` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (17,'NodeJS','NodeJS is a env for js in backend',46,'2025-02-27 14:10:21.295642','2025-02-27 14:10:21.295642','LfH Lrw'),(19,'Cấu trúc dữ liệu','Cấu trúc dữ liệu',46,'2025-02-27 15:11:21.319233','2025-02-27 15:11:21.319233','ytC qm9'),(21,'Lớp học lập trình cơ bản','Đây là lớp học lập trình cơ bản',46,'2025-02-27 15:15:50.896109','2025-02-27 15:15:50.896109','rny LaS'),(22,'Lập trình cơ bản','Lập trình cơ bản',50,'2025-02-27 15:36:54.217509','2025-02-27 15:36:54.217509','U71 ggI'),(23,'NodeJS Basic','Đây là lớp Nodejs cơ bản',46,'2025-02-27 16:01:07.106471','2025-02-27 16:01:07.106471','Roh ZEO'),(24,'Kĩ thuật lập trình 4','Đây là lớp kĩ thuật lập trình 4',46,'2025-02-27 16:04:12.414674','2025-02-27 16:04:12.414674','6qa Cr4'),(25,'Basic eng','Basic eng',46,'2025-02-27 16:07:49.931000','2025-02-27 16:07:49.931000','BeR MFx'),(26,'Basic Programming Class','This is a basic programming class',46,'2025-02-27 16:08:30.727882','2025-02-27 16:08:30.727882','YaA eNa'),(29,'Basic Programming Classssss','This is a basic programming classssss',46,'2025-02-27 16:16:54.963567','2025-02-27 16:16:54.963567','MoA z7C'),(40,'Quản trị mạng','yỵthrgfedws',51,'2025-02-28 01:33:39.077782','2025-02-28 01:33:39.077782','gUD PTx'),(41,'Kĩ thuật lập trình','Kĩ thuật lập trình',50,'2025-02-28 01:34:14.456980','2025-02-28 01:34:14.456980','caq oSl'),(42,'Trí tuệ nhân tạo','Đây là lớp trí tuệ nhân tạo test',50,'2025-02-28 01:34:51.725129','2025-02-28 01:34:51.725129','jJW MP1'),(43,'Nhập môn trí tuệ nhân tạo','Nhập môn trí tuệ nhân tạo',50,'2025-02-28 05:45:16.742509','2025-02-28 05:45:16.742509','QZr 9KE'),(48,'Cấu trúc dữ liệu 44B','Đây là lớp học cấu trúc dữ liệu 44B\n',59,'2025-03-28 03:03:51.696989','2025-03-28 03:03:51.696989','zPw mTa'),(57,'Cấu trúc dữ liệu ','ádasdasdasdasdad',50,'2025-03-29 11:07:47.686279','2025-03-29 11:07:47.686279','z8o Vlk'),(58,'Cấu trúc dữ liệu 3','ádsadasdadasdsadasdasd',51,'2025-03-29 11:08:09.103337','2025-03-29 11:08:09.103337','vxy lgs'),(60,'Cấu trúc dữ liệu 4','Cấu trúc dữ liệu 4',50,'2025-04-10 13:40:58.873398','2025-04-10 13:40:58.873398','HJL rAo'),(62,'Lớp học 1','Lớp học 1 Lớp học 1',50,'2025-04-10 14:22:08.257908','2025-04-10 14:22:08.257908','XC0 Wdk'),(64,'Lập trình C++','Đây là lớp học C++',50,'2025-04-11 01:13:57.892851','2025-04-11 01:13:57.892851','B6u 8ro');
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam` (
  `exam_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text,
  `due_date` datetime NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `type` enum('quiz','test','midterm','final') DEFAULT NULL,
  `type_student` enum('common','it') DEFAULT NULL,
  PRIMARY KEY (`exam_id`),
  KEY `FK_bb0ccb87dccd75cc8f143e301df` (`class_id`),
  CONSTRAINT `FK_bb0ccb87dccd75cc8f143e301df` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam`
--

LOCK TABLES `exam` WRITE;
/*!40000 ALTER TABLE `exam` DISABLE KEYS */;
INSERT INTO `exam` VALUES (13,42,'Kiểm tra cuối kì','https://res.cloudinary.com/dbnofh9a8/raw/upload/v1741014019/Hu%E1%BB%B3nh_Long_Nh%E1%BA%ADt_-_X%E1%BA%BFp_r%C3%A8n_luy%E1%BB%87n.doc','2025-03-25 02:11:00','2025-03-04 02:11:56.822591','2025-03-04 02:11:56.822591','final',NULL),(17,42,'Bài kiểm tra 1','các em k được tra chatGPT \n','2025-03-05 16:58:00','2025-03-05 16:59:02.230374','2025-03-05 16:59:02.230374','test',NULL),(18,42,'Bài kiểm tra 2','Bài kiểm tra 2','2025-03-30 09:13:00','2025-03-15 08:13:33.782128','2025-03-15 08:13:33.782128','test',NULL),(19,43,'Sum of a and b','Tinh tong cua 2 so a va b','2025-03-19 05:10:01','2025-03-19 03:03:07.303363','2025-03-19 03:03:07.303363','final',NULL),(22,40,'Violet-1','Ssasadsadadadsasa','2025-03-30 06:40:00','2025-03-29 06:40:37.654416','2025-03-29 06:40:37.654416','final',NULL),(25,42,'Bài kiểm tra cuối kì','Cho 2 số a và b , tính tổng 2 số','2025-03-29 06:58:00','2025-03-29 06:58:10.531398','2025-03-29 06:58:10.531398','final','it'),(26,42,'Bài kiểm tra giữa kì','Bài kiểm tra giữa kì\n','2025-04-04 07:08:00','2025-03-29 07:08:53.813932','2025-03-29 07:08:53.813932','midterm','common'),(27,40,'Violet-1','123213213','2025-03-31 09:13:00','2025-03-29 09:13:37.614574','2025-03-29 09:13:37.614574','final',NULL),(28,57,'bài tập kiểm tra giữa kì','test','2025-03-30 09:11:00','2025-03-29 17:12:18.544796','2025-03-29 17:12:18.544796','midterm','it'),(32,60,'bai thuc hanh 1','khong sai chat','2025-04-30 20:44:00','2025-04-10 13:44:52.046246','2025-04-10 13:44:52.046246','final','it'),(33,42,'Thực hành 1','Đây là bài hực hành 1','2025-04-11 08:59:00','2025-04-10 13:59:32.393575','2025-04-10 13:59:32.393575','test','it'),(34,62,'Thực hành 1','Thực hành 1 Thực hành 1 ','2025-04-11 14:23:00','2025-04-10 14:24:02.524148','2025-04-10 14:24:02.524148','test','it'),(35,64,'Bai thuc hanh 1','Bai thuc hanh 1','2025-04-30 09:20:00','2025-04-11 02:20:53.461250','2025-04-11 02:20:53.461250','test','it');
/*!40000 ALTER TABLE `exam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_content`
--

DROP TABLE IF EXISTS `exam_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `description` text,
  `title` text,
  PRIMARY KEY (`id`),
  KEY `FK_c6654fff45a595bfe10fd00846e` (`exam_id`),
  CONSTRAINT `FK_c6654fff45a595bfe10fd00846e` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_content`
--

LOCK TABLES `exam_content` WRITE;
/*!40000 ALTER TABLE `exam_content` DISABLE KEYS */;
INSERT INTO `exam_content` VALUES (54,26,'2025-03-30 10:26:45.376806','This is the first exam',NULL),(56,25,'2025-03-30 13:15:28.212714','This is the first exam update','Bài 1'),(57,25,'2025-03-30 14:35:48.673764','\n# Bài Tập C++: Kiểm Tra Chuỗi Palindrome\n\n## Mô Tả Bài Tập\n\n\nViết một chương trình C++ để kiểm tra xem một chuỗi nhập vào có phải là chuỗi palindrome hay không.\nChuỗi palindrome là chuỗi mà khi đảo ngược lại, nó vẫn giống với chuỗi ban đầu.\n\nYêu Cầu\nNhận đầu vào: Một chuỗi từ người dùng.\n\nXử lý:\n\nLoại bỏ các ký tự không phải chữ số hoặc chữ cái (ví dụ: khoảng trắng, dấu câu).\n\nChuyển tất cả ký tự về dạng chữ thường.\n\nKiểm tra: So sánh chuỗi đã xử lý với phiên bản đảo ngược của nó.\n\nIn kết quả: In ra “Palindrome” nếu chuỗi là palindrome, ngược lại in “Not Palindrome”.\n\nHướng Dẫn\nSử dụng std::string để lưu chuỗi.\n\nSử dụng thư viện <cctype> để xử lý chữ hoa, chữ thường và kiểm tra ký tự.\n\nSử dụng vòng lặp hoặc thuật toán hai đầu để so sánh ký tự đầu và ký tự cuối của chuỗi.','Bài 2'),(58,25,'2025-03-30 14:36:30.301047','bài tập 3','Bài 3'),(61,25,'2025-03-30 15:59:27.857677','# Bài Tập C++: Tìm Tổng Các Số Nguyên Tố\n\n## Mô Tả Bài Tập\n\nViết một chương trình C++ để tính tổng các số nguyên tố trong một dãy số cho trước.  \nMột số nguyên tố là số chỉ chia hết cho 1 và chính nó.\n\n## Yêu Cầu\n\n- **Đầu vào:**  \n  - Số lượng phần tử của dãy số.\n  - Dãy các số nguyên được nhập từ bàn phím.\n\n- **Xử lý:**  \n  - Kiểm tra từng số trong dãy để xác định số nguyên tố.\n  - Tính tổng các số nguyên tố tìm được.\n\n- **Đầu ra:**  \n  - In ra tổng của các số nguyên tố.\n  - Nếu không có số nguyên tố nào, in ra thông báo phù hợp.\n\n## Hướng Dẫn\n\n1. **Kiểm tra số nguyên tố:**  \n   Viết hàm `bool isPrime(int n)` để kiểm tra một số `n` có phải là số nguyên tố hay không.\n\n2. **Nhập dữ liệu:**  \n   Sử dụng `std::cin` để nhập số lượng phần tử và dãy số.\n\n3. **Tính tổng:**  \n   Duyệt qua dãy số, nếu một số là nguyên tố thì cộng dồn vào tổng.\n\n4. **In kết quả:**  \n   Sử dụng `std::cout` để in tổng các số nguyên tố hoặc thông báo không tìm thấy số nguyên tố.\n\n\n','Bài 4'),(62,25,'2025-04-01 06:33:45.234198','Bài tập 6','Bài 5'),(63,26,'2025-04-02 03:40:11.699855','https://res.cloudinary.com/dbnofh9a8/raw/upload/v1743565210/saved_resource.html',NULL),(64,26,'2025-04-02 03:42:42.826945','https://res.cloudinary.com/dbnofh9a8/raw/upload/v1743565361/index.css',NULL),(65,25,'2025-04-10 07:12:55.823274','Bài tập 7','Bài 6'),(66,32,'2025-04-10 13:47:05.474720','sum','Sum of a and b'),(67,33,'2025-04-10 14:00:27.101104','Tính tổng 2 số a và b','Tổng 2 số'),(68,34,'2025-04-10 14:24:41.043472','Bài tập 1 Bài tập 1','Bài tập 1'),(69,35,'2025-04-11 02:21:10.189105','bac 2','Phuong trinh bac 2'),(70,25,'2025-04-11 04:45:01.355494','# Bài Tập: Giải Phương Trình Bậc Hai\n\n## 1\\. Mô Tả Bài Tập\n\nViết một chương trình cho phép người dùng nhập 3 hệ số aaa, bbb, ccc của phương trình bậc hai:\n\nax2+bx+c\\=0ax^2 + bx + c = 0ax2+bx+c\\=0\n\nChương trình cần:\n\n*   Kiểm tra và xử lý các trường hợp đặc biệt:\n    \n    *   Nếu a≠0a \\\\neq 0a\\=0 (phương trình bậc hai):\n        \n        *   Tính delta: Δ\\=b2−4ac\\\\Delta = b^2 - 4acΔ\\=b2−4ac\n            \n        *   Nếu Δ\\>0\\\\Delta > 0Δ\\>0: phương trình có 2 nghiệm phân biệt\n            \n        *   Nếu Δ\\=0\\\\Delta = 0Δ\\=0: phương trình có nghiệm kép\n            \n        *   Nếu Δ<0\\\\Delta < 0Δ<0: phương trình vô nghiệm\n            \n    *   Nếu a\\=0a = 0a\\=0 (trở thành phương trình bậc nhất):\n        \n        *   Nếu b≠0b \\\\neq 0b\\=0: giải phương trình bậc nhất bx+c\\=0bx + c = 0bx+c\\=0\n            \n        *   Nếu b\\=0b = 0b\\=0:\n            \n            *   Nếu c\\=0c = 0c\\=0: phương trình có vô số nghiệm\n                \n            *   Nếu c≠0c \\\\neq 0c\\=0: phương trình vô nghiệm\n                \n\n## 2\\. Yêu Cầu Bài Tập\n\n*   **Nhập dữ liệu:** Nhập hệ số aaa, bbb, ccc từ bàn phím.\n    \n*   **Xử lý logic:** Kiểm tra trường hợp của phương trình (bậc hai hay bậc nhất) và tính nghiệm tương ứng.\n    \n*   **In kết quả:** Hiển thị nghiệm ra màn hình với định dạng rõ ràng.','Phương trình bậc 2');
/*!40000 ALTER TABLE `exam_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_content_details`
--

DROP TABLE IF EXISTS `exam_content_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_content_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_content_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `content` text,
  PRIMARY KEY (`id`),
  KEY `FK_618a97221b0f52a1b34ae8ca26a` (`exam_content_id`),
  CONSTRAINT `FK_618a97221b0f52a1b34ae8ca26a` FOREIGN KEY (`exam_content_id`) REFERENCES `exam_content` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_content_details`
--

LOCK TABLES `exam_content_details` WRITE;
/*!40000 ALTER TABLE `exam_content_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_content_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_submission`
--

DROP TABLE IF EXISTS `exam_submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_submission` (
  `exam_submission_id` int NOT NULL AUTO_INCREMENT,
  `exam_id` int NOT NULL,
  `student_class_id` int NOT NULL,
  `submitted_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `grade` decimal(5,2) DEFAULT NULL,
  `feed_back` text,
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `run_code_result` text,
  PRIMARY KEY (`exam_submission_id`),
  KEY `FK_ed47de50c75f8b0af3b489c58e4` (`exam_id`),
  KEY `FK_87b03c2d40d64af96eeb8e539d3` (`student_class_id`),
  CONSTRAINT `FK_87b03c2d40d64af96eeb8e539d3` FOREIGN KEY (`student_class_id`) REFERENCES `student_classes` (`student_class_id`),
  CONSTRAINT `FK_ed47de50c75f8b0af3b489c58e4` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_submission`
--

LOCK TABLES `exam_submission` WRITE;
/*!40000 ALTER TABLE `exam_submission` DISABLE KEYS */;
INSERT INTO `exam_submission` VALUES (9,17,29,'2025-03-16 05:31:29.707058',NULL,NULL,'2025-03-29 01:20:57.374024',NULL),(34,17,29,'2025-03-18 23:25:06.504000',0.00,'','2025-03-29 01:20:57.374024',NULL),(35,17,29,'2025-03-18 23:28:15.351000',NULL,NULL,'2025-03-29 01:20:57.374024',NULL),(39,17,29,'2025-03-22 23:03:45.651000',NULL,NULL,'2025-03-29 01:20:57.374024',NULL),(46,17,29,'2025-03-23 18:59:20.081000',0.00,'Waiting for judge','2025-03-29 01:20:57.374024',NULL),(47,17,29,'2025-03-23 19:03:54.219000',0.00,'Waiting for judge','2025-03-29 01:20:57.374024',NULL),(48,13,29,'2025-03-25 01:22:57.175000',NULL,NULL,'2025-03-29 01:20:57.374024',NULL),(49,18,38,'2025-03-26 20:23:53.825000',NULL,NULL,'2025-03-29 01:20:57.374024',NULL),(52,18,37,'2025-03-27 03:44:49.507000',10.00,'Tốt','2025-03-29 01:20:57.374024',NULL),(53,18,37,'2025-03-27 03:44:49.514000',NULL,NULL,'2025-03-29 01:20:57.374024',NULL),(54,18,37,'2025-03-27 03:44:49.517000',NULL,NULL,'2025-03-29 01:20:57.374024',NULL),(55,26,37,'2025-03-31 02:09:48.926000',9.00,'Tốt, Giỏi','2025-04-03 06:59:58.844000',NULL),(56,26,37,'2025-03-31 02:09:48.927000',NULL,NULL,'2025-03-31 02:09:48.927000',NULL),(57,26,29,'2025-04-03 06:50:15.485000',10.00,'Tuyệt vời','2025-04-03 07:14:04.594000',NULL),(58,25,37,'2025-04-10 07:30:11.690000',18.00,'','2025-04-11 15:41:17.929000',NULL),(59,25,51,'2025-04-11 10:30:42.795000',8.00,'Chưa được tốt lắm','2025-04-11 07:04:34.559000',NULL),(60,25,52,'2025-04-11 11:49:53.292000',7.00,NULL,'2025-04-11 11:55:58.783000',NULL),(61,25,52,'2025-04-11 11:49:53.292000',8.00,NULL,'2025-04-11 11:49:53.292000',NULL),(62,25,29,'2025-04-11 11:49:53.292000',8.00,NULL,'2025-04-11 11:49:53.292000',NULL),(63,25,51,'2025-04-11 11:49:53.292000',5.00,NULL,'2025-04-11 11:49:53.292000',NULL),(64,25,62,'2025-04-11 11:49:53.292000',6.00,NULL,'2025-04-11 11:49:53.292000',NULL),(65,25,64,'2025-04-11 11:49:53.292000',2.00,NULL,'2025-04-11 11:49:53.292000',NULL),(66,25,65,'2025-04-11 11:49:53.292000',4.00,NULL,'2025-04-11 11:49:53.292000',NULL),(67,25,66,'2025-04-11 11:49:53.292000',6.50,NULL,'2025-04-11 11:49:53.292000',NULL),(68,25,67,'2025-04-11 11:49:53.292000',4.00,NULL,'2025-04-11 11:49:53.292000',NULL),(69,25,68,'2025-04-11 11:49:53.292000',5.00,NULL,'2025-04-11 11:49:53.292000',NULL),(70,25,69,'2025-04-11 11:49:53.292000',7.00,NULL,'2025-04-11 11:49:53.292000',NULL),(71,25,70,'2025-04-11 11:49:53.292000',6.00,NULL,'2025-04-11 11:49:53.292000',NULL),(72,25,71,'2025-04-11 11:49:53.292000',9.00,NULL,'2025-04-11 11:49:53.292000',NULL);
/*!40000 ALTER TABLE `exam_submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_submission_content`
--

DROP TABLE IF EXISTS `exam_submission_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_submission_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_submission_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `file_content` text,
  PRIMARY KEY (`id`),
  KEY `FK_2a50aa91b44b3dc3518f3057b87` (`exam_submission_id`),
  CONSTRAINT `FK_2a50aa91b44b3dc3518f3057b87` FOREIGN KEY (`exam_submission_id`) REFERENCES `exam_submission` (`exam_submission_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_submission_content`
--

LOCK TABLES `exam_submission_content` WRITE;
/*!40000 ALTER TABLE `exam_submission_content` DISABLE KEYS */;
INSERT INTO `exam_submission_content` VALUES (1,34,'2025-03-18 23:25:06.831000','docs5.docx'),(2,35,'2025-03-18 23:28:15.681000','docs6.docx'),(6,39,'2025-03-22 23:03:45.922000','d.docs'),(12,46,'2025-03-23 18:59:20.480000','docs12.docs'),(13,47,'2025-03-23 19:03:54.625000','docs12.docs'),(14,9,'2025-03-23 19:15:27.998000','docs12.docs'),(15,9,'2025-03-23 19:15:28.440000','docs12.docs'),(16,9,'2025-03-23 19:21:32.177000','docs13.docs'),(17,9,'2025-03-23 19:21:32.643000','docs13.docs'),(18,9,'2025-03-23 20:04:20.903000',NULL),(19,9,'2025-03-23 20:04:21.211000',NULL),(75,48,'2025-03-25 01:26:33.670000','https://res.cloudinary.com/dbnofh9a8/raw/upload/v1742779899/database_health_care.docx'),(78,9,'2025-03-25 21:37:54.031000','docs3.docs'),(88,52,'2025-03-27 03:46:48.970000','https://res.cloudinary.com/dbnofh9a8/raw/upload/v1742779899/database_health_care.docx'),(93,52,'2025-03-27 04:06:55.027000','https://res.cloudinary.com/dbnofh9a8/raw/upload/v1742037209/solution_1.js'),(94,52,'2025-03-27 04:06:55.029000','https://res.cloudinary.com/dbnofh9a8/raw/upload/v1743048411/solution_2.cpp'),(95,52,'2025-03-29 06:20:44.397000','https://res.cloudinary.com/dbnofh9a8/image/upload/v1743229242/screencapture-localhost-5173-admin-users-59-2025-03-29-13_15_27.png'),(96,52,'2025-03-29 06:20:44.482000','https://res.cloudinary.com/dbnofh9a8/image/upload/v1743229243/screencapture-localhost-5173-classes-42-lectures-41-2025-03-29-13_02_32.png'),(97,55,'2025-03-31 02:15:24.925000','https://res.cloudinary.com/dbnofh9a8/raw/upload/v1742780054/database_health_care.txt'),(98,55,'2025-04-01 14:01:44.421000','https://res.cloudinary.com/dbnofh9a8/raw/upload/v1741054463/2._M%E1%BA%ABu_nh%E1%BA%ADt_k%C3%BD_th%E1%BB%B1c_t%E1%BA%ADp.doc'),(99,55,'2025-04-03 07:07:27.180000','https://res.cloudinary.com/dbnofh9a8/raw/upload/v1743663014/main.jsx'),(100,57,'2025-04-03 07:08:26.446000','https://res.cloudinary.com/dbnofh9a8/raw/upload/v1743663014/main.jsx'),(101,57,'2025-04-03 07:13:19.283000','https://res.cloudinary.com/dbnofh9a8/raw/upload/v1743565361/index.css'),(102,58,'2025-04-10 07:30:11.706000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(103,58,'2025-04-10 08:40:51.056000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(104,58,'2025-04-10 09:56:42.220000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(105,58,'2025-04-10 09:56:42.971000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(106,58,'2025-04-10 09:56:43.137000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(107,58,'2025-04-10 09:56:43.276000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(108,58,'2025-04-10 12:59:39.138000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(109,58,'2025-04-10 13:00:05.570000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(110,58,'2025-04-10 13:00:14.210000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(111,58,'2025-04-10 13:01:06.087000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(112,58,'2025-04-10 17:02:44.013000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(113,58,'2025-04-10 17:03:15.254000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(114,58,'2025-04-11 00:45:57.961000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(115,58,'2025-04-10 17:47:16.305000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(116,58,'2025-04-11 00:54:07.977000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(117,58,'2025-04-11 00:55:21.317000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(118,58,'2025-04-11 00:57:03.740000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(119,58,'2025-04-10 17:58:19.979000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(120,58,'2025-04-10 17:58:25.769000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(121,58,'2025-04-11 00:58:53.616000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(122,58,'2025-04-11 00:59:58.768000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(123,58,'2025-04-11 01:02:33.282000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(124,58,'2025-04-11 01:11:36.893000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(125,58,'2025-04-10 18:15:03.963000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(126,58,'2025-04-11 01:18:01.271000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(127,58,'2025-04-11 01:20:45.749000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(128,58,'2025-04-10 18:25:27.702000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(129,58,'2025-04-11 08:34:52.438000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(130,58,'2025-04-11 03:21:56.609000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(131,58,'2025-04-11 03:25:39.972000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(132,58,'2025-04-11 03:26:31.543000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(133,58,'2025-04-11 03:27:31.140000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(134,59,'2025-04-11 10:30:43.110000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(135,59,'2025-04-11 10:50:49.450000','#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(136,59,'2025-04-11 11:08:28.476000','#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(137,59,'2025-04-11 11:11:27.800000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(138,59,'2025-04-11 11:15:20.419000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(139,59,'2025-04-11 11:21:46.056000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(140,59,'2025-04-11 11:23:56.102000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(141,59,'2025-04-11 11:27:41.303000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(142,59,'2025-04-11 11:31:32.830000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(143,59,'2025-04-11 11:33:51.190000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(144,59,'2025-04-11 11:34:12.930000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(145,59,'2025-04-11 11:34:45.416000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(146,59,'2025-04-11 11:46:25.192000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(147,60,'2025-04-11 11:49:53.616000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(148,60,'2025-04-11 11:50:30.023000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(149,60,'2025-04-11 11:55:57.774000','// C++ solution: Tính tổng hai số a và b\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}'),(150,58,'2025-04-11 15:41:16.570000','#include <iostream>\n#include <cmath>\n\nusing namespace std;\n\nint main() {\n    float a, b, c;\n    float delta, x1, x2;\n    cin >> a;\n    cin >> b;\n    cin >> c;\n    \n    if (a == 0) {\n        if (b == 0) {\n            if (c == 0) {\n                cout << \"Phuong trinh co vo so nghiem\" << endl;\n            } else {\n                cout << \"Phuong trinh vo nghiem\" << endl;\n            }\n        } else {\n            cout << -c / b << endl;\n        }\n    } else {\n\n\nTheme\n\nC++\n\n\nRun\nSubmit\n1920212223242526272829303132333435361718141516\n        \\} else {\n            x1 = (-b + sqrt(delta)) / (2 * a);\n            x2 = (-b - sqrt(delta)) / (2 * a);\n            cout << x1 << endl;\n            cout << x2 << endl;\n        \\}\n    \\}\n    \n    return 0;\n\\}\n6131417int main() {    if (a == 0) {        if (b == 0) {            \\} else {\nTest Cases & Output\n3/3 passing\n\nInput\n\nOutput\n\nTestcases\nTest Cases\n\nTestcase 1\n+3\nInput:\n1\n-5\n6\nExpected Output:\n3\n2\nActual Output:\n3\n2$0\n        delta = b * b - 4 * a * c;\n        \n        if (delta < 0) {\n            cout << \"Phuong trinh vo nghiem\" << endl;\n        } else if (delta == 0) {\n            x1 = -b / (2 * a);\n            cout << x1 << endl;\n        } else {\n            x1 = (-b + sqrt(delta)) / (2 * a);\n            x2 = (-b - sqrt(delta)) / (2 * a);\n            cout << x1 << endl;\n            cout << x2 << endl;\n        }\n    }\n    \n    return 0;\n}');
/*!40000 ALTER TABLE `exam_submission_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_submission_content_details`
--

DROP TABLE IF EXISTS `exam_submission_content_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_submission_content_details` (
  `exam_submission_content_details_id` int NOT NULL AUTO_INCREMENT,
  `exam_submission_content_id` int NOT NULL,
  `testcase_id` int NOT NULL,
  `submitted_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `score` decimal(5,2) DEFAULT NULL,
  `status` text,
  `output` text,
  `error` text,
  `exam_content_id` int NOT NULL,
  PRIMARY KEY (`exam_submission_content_details_id`),
  KEY `FK_285b277f81315018120593cbbb0` (`exam_submission_content_id`),
  KEY `FK_76f4b3ad12632206adcadf8b436` (`testcase_id`),
  KEY `FK_8ad3d6ceb851e33c2aafdf5288e` (`exam_content_id`),
  CONSTRAINT `FK_285b277f81315018120593cbbb0` FOREIGN KEY (`exam_submission_content_id`) REFERENCES `exam_submission_content` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_76f4b3ad12632206adcadf8b436` FOREIGN KEY (`testcase_id`) REFERENCES `test_case` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_8ad3d6ceb851e33c2aafdf5288e` FOREIGN KEY (`exam_content_id`) REFERENCES `exam_content` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_submission_content_details`
--

LOCK TABLES `exam_submission_content_details` WRITE;
/*!40000 ALTER TABLE `exam_submission_content_details` DISABLE KEYS */;
INSERT INTO `exam_submission_content_details` VALUES (12,126,31,'2025-04-10 18:18:00.854431','2025-04-10 18:18:00.854431',0.00,'Failed','','',61),(13,126,32,'2025-04-10 18:18:01.081776','2025-04-10 18:18:01.081776',0.00,'Failed','','',61),(14,126,34,'2025-04-10 18:18:01.308210','2025-04-10 18:18:01.308210',0.00,'Failed','','',61),(15,127,31,'2025-04-10 18:20:45.324204','2025-04-10 18:20:45.324204',10.00,'passed','','',61),(16,127,32,'2025-04-10 18:20:45.557137','2025-04-10 18:20:45.557137',10.00,'passed','','',61),(17,127,34,'2025-04-10 18:20:45.788954','2025-04-10 18:20:45.788954',0.00,'failed','','',61),(18,128,31,'2025-04-10 18:25:27.770220','2025-04-10 18:25:27.770220',0.00,'Failed','','',61),(19,128,32,'2025-04-10 18:25:27.781189','2025-04-10 18:25:27.781189',0.00,'Failed','','',61),(20,128,34,'2025-04-10 18:25:27.792375','2025-04-10 18:25:27.792375',0.00,'Failed','','',61),(21,129,31,'2025-04-11 01:34:54.951994','2025-04-11 01:34:54.951994',10.00,'passed','','',61),(22,129,32,'2025-04-11 01:34:55.210410','2025-04-11 01:34:55.210410',10.00,'passed','','',61),(23,129,34,'2025-04-11 01:34:55.467875','2025-04-11 01:34:55.467875',0.00,'failed','','',61),(24,130,31,'2025-04-11 03:21:56.713939','2025-04-11 03:21:56.713939',0.00,'Failed','','',61),(25,130,32,'2025-04-11 03:21:56.805089','2025-04-11 03:21:56.805089',0.00,'Failed','','',61),(26,130,34,'2025-04-11 03:21:56.819240','2025-04-11 03:21:56.819240',0.00,'Failed','','',61),(27,131,31,'2025-04-11 03:25:39.993048','2025-04-11 03:25:39.993048',0.00,'Failed','','',61),(28,131,32,'2025-04-11 03:25:40.003482','2025-04-11 03:25:40.003482',0.00,'Failed','','',61),(29,131,34,'2025-04-11 03:25:40.015021','2025-04-11 03:25:40.015021',0.00,'Failed','','',61),(30,132,31,'2025-04-11 03:26:31.593262','2025-04-11 03:26:31.593262',0.00,'Failed','','',61),(31,132,32,'2025-04-11 03:26:31.605198','2025-04-11 03:26:31.605198',0.00,'Failed','','',61),(32,132,34,'2025-04-11 03:26:31.617093','2025-04-11 03:26:31.617093',0.00,'Failed','','',61),(33,133,31,'2025-04-11 03:27:31.160210','2025-04-11 03:27:31.160210',0.00,'Failed','','',61),(34,133,32,'2025-04-11 03:27:31.193536','2025-04-11 03:27:31.193536',0.00,'Failed','','',61),(35,133,34,'2025-04-11 03:27:31.204561','2025-04-11 03:27:31.204561',0.00,'Failed','','',61),(36,134,30,'2025-04-11 03:30:45.450435','2025-04-11 03:30:45.450435',0.00,'Failed','','',57),(37,135,30,'2025-04-11 03:50:51.798248','2025-04-11 03:50:51.798248',10.00,'passed','','',57),(38,136,30,'2025-04-11 04:08:30.739893','2025-04-11 04:08:30.739893',10.00,'passed','','',57),(39,137,7,'2025-04-11 04:11:30.067283','2025-04-11 04:11:30.067283',10.00,'passed','','',58),(40,138,31,'2025-04-11 04:15:22.701016','2025-04-11 04:15:22.701016',10.00,'passed','','',61),(41,138,32,'2025-04-11 04:15:22.938280','2025-04-11 04:15:22.938280',10.00,'passed','','',61),(42,138,34,'2025-04-11 04:15:23.175580','2025-04-11 04:15:23.175580',0.00,'failed','','',61),(43,139,37,'2025-04-11 04:21:48.341478','2025-04-11 04:21:48.341478',10.00,'passed','','',65),(44,140,31,'2025-04-11 04:23:58.366543','2025-04-11 04:23:58.366543',10.00,'passed','','',61),(45,140,32,'2025-04-11 04:23:58.606927','2025-04-11 04:23:58.606927',10.00,'passed','','',61),(46,140,34,'2025-04-11 04:23:58.845262','2025-04-11 04:23:58.845262',0.00,'failed','','',61),(47,141,30,'2025-04-11 04:27:43.574879','2025-04-11 04:27:43.574879',10.00,'passed','','',57),(48,142,31,'2025-04-11 04:31:35.104141','2025-04-11 04:31:35.104141',10.00,'passed','','',61),(49,142,32,'2025-04-11 04:31:35.347406','2025-04-11 04:31:35.347406',10.00,'passed','','',61),(50,142,34,'2025-04-11 04:31:35.589817','2025-04-11 04:31:35.589817',0.00,'failed','','',61),(51,143,31,'2025-04-11 04:33:53.458522','2025-04-11 04:33:53.458522',10.00,'passed','','',61),(52,143,32,'2025-04-11 04:33:53.704881','2025-04-11 04:33:53.704881',10.00,'passed','','',61),(53,143,34,'2025-04-11 04:33:53.946147','2025-04-11 04:33:53.946147',0.00,'failed','','',61),(54,144,37,'2025-04-11 04:34:15.187796','2025-04-11 04:34:15.187796',10.00,'passed','','',65),(55,145,37,'2025-04-11 04:34:47.669398','2025-04-11 04:34:47.669398',10.00,'passed','','',65),(56,146,50,'2025-04-11 04:46:27.475116','2025-04-11 04:46:27.475116',1.00,'passed','','',70),(57,146,51,'2025-04-11 04:46:27.733618','2025-04-11 04:46:27.733618',1.00,'passed','','',70),(58,147,31,'2025-04-11 04:49:55.887744','2025-04-11 04:49:55.887744',1.00,'passed','','',61),(59,147,32,'2025-04-11 04:49:56.147201','2025-04-11 04:49:56.147201',1.00,'passed','','',61),(60,147,34,'2025-04-11 04:49:56.404548','2025-04-11 04:49:56.404548',0.00,'failed','','',61),(61,148,33,'2025-04-11 04:50:32.283484','2025-04-11 04:50:32.283484',1.00,'passed','','',62),(62,149,50,'2025-04-11 04:56:00.002528','2025-04-11 04:56:00.002528',1.00,'passed','','',70),(63,149,51,'2025-04-11 04:56:00.235811','2025-04-11 04:56:00.235811',1.00,'passed','','',70),(64,150,50,'2025-04-11 08:41:16.766657','2025-04-11 08:41:16.766657',3.00,'passed','','',70),(65,150,51,'2025-04-11 08:41:17.023621','2025-04-11 08:41:17.023621',3.00,'passed','','',70),(66,150,52,'2025-04-11 08:41:17.274227','2025-04-11 08:41:17.274227',4.00,'passed','','',70);
/*!40000 ALTER TABLE `exam_submission_content_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `language_code`
--

DROP TABLE IF EXISTS `language_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `language_code` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `language_code`
--

LOCK TABLES `language_code` WRITE;
/*!40000 ALTER TABLE `language_code` DISABLE KEYS */;
INSERT INTO `language_code` VALUES (43,'Plain Text'),(44,'Executable'),(45,'Assembly (NASM 2.14.02)'),(46,'Bash (5.0.0)'),(47,'Basic (FBC 1.07.1)'),(48,'C (GCC 7.4.0)'),(49,'C (GCC 8.3.0)'),(50,'C (GCC 9.2.0)'),(51,'C# (Mono 6.6.0.161)'),(52,'C++ (GCC 7.4.0)'),(53,'C++ (GCC 8.3.0)'),(54,'C++ (GCC 9.2.0)'),(55,'Common Lisp (SBCL 2.0.0)'),(56,'D (DMD 2.089.1)'),(57,'Elixir (1.9.4)'),(58,'Erlang (OTP 22.2)'),(59,'Fortran (GFortran 9.2.0)'),(60,'Go (1.13.5)'),(61,'Haskell (GHC 8.8.1)'),(62,'Java (OpenJDK 13.0.1)'),(63,'JavaScript (Node.js 12.14.0)'),(64,'Lua (5.3.5)'),(65,'OCaml (4.09.0)'),(66,'Octave (5.1.0)'),(67,'Pascal (FPC 3.0.4)'),(68,'PHP (7.4.1)'),(69,'Prolog (GNU Prolog 1.4.5)'),(70,'Python (2.7.17)'),(71,'Python (3.8.1)'),(72,'Ruby (2.7.0)'),(73,'Rust (1.40.0)'),(74,'TypeScript (3.7.4)');
/*!40000 ALTER TABLE `language_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lectures`
--

DROP TABLE IF EXISTS `lectures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lectures` (
  `lecture_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`lecture_id`),
  KEY `FK_e682b33892d0be41ee7226500b5` (`class_id`),
  CONSTRAINT `FK_e682b33892d0be41ee7226500b5` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lectures`
--

LOCK TABLES `lectures` WRITE;
/*!40000 ALTER TABLE `lectures` DISABLE KEYS */;
INSERT INTO `lectures` VALUES (3,19,'ửerwrw','2025-02-28 08:03:10.201399','2025-02-28 08:03:10.201399'),(4,19,'test update','2025-02-28 08:05:52.583479','2025-02-28 08:05:52.583479'),(5,19,'ửerwrw','2025-02-28 08:08:05.056552','2025-02-28 08:08:05.056552'),(7,42,'Trí tuệ nhân tạo: Giới thiệu và Ứng dụng','2025-03-02 07:50:08.727154','2025-03-02 07:50:08.727154'),(8,42,'Nguyên lý và Phương pháp của Trí tuệ nhân tạo','2025-03-02 07:52:32.511864','2025-03-02 07:52:32.511864'),(9,42,'Trí tuệ nhân tạo trong Kỷ nguyên Số','2025-03-02 07:54:11.221021','2025-03-02 07:54:11.221021'),(11,42,'Ứng dụng AI: Từ Lý thuyết đến Thực tiễn','2025-03-02 07:57:04.439417','2025-03-02 07:57:04.439417'),(34,43,'test','2025-03-05 06:47:28.293654','2025-03-05 06:47:28.293654'),(35,43,'test','2025-03-05 06:47:44.903558','2025-03-05 06:47:44.903558'),(42,41,'Bài thực hành','2025-04-04 04:31:53.333839','2025-04-04 04:31:53.333839'),(43,42,'Bài giảng 1','2025-04-10 14:34:01.052941','2025-04-10 14:34:01.052941');
/*!40000 ALTER TABLE `lectures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lectures_content`
--

DROP TABLE IF EXISTS `lectures_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lectures_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lecture_id` int NOT NULL,
  `content` text,
  `type` enum('documents','videos') DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_2f0c25d59f47b41d862ddcdb25b` (`lecture_id`),
  CONSTRAINT `FK_2f0c25d59f47b41d862ddcdb25b` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`lecture_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lectures_content`
--

LOCK TABLES `lectures_content` WRITE;
/*!40000 ALTER TABLE `lectures_content` DISABLE KEYS */;
INSERT INTO `lectures_content` VALUES (34,42,'https://res.cloudinary.com/dbnofh9a8/image/upload/v1743741148/17-1_GIAY_GIOI_THIEU_THUC_TAP_TOT_NGHIEP-58.pdf',NULL,'2025-04-04 04:32:29.096785','2025-04-04 04:32:29.096785'),(36,11,'https://res.cloudinary.com/dbnofh9a8/raw/upload/v1744262299/english.txt',NULL,'2025-04-10 05:18:20.555665','2025-04-10 05:18:20.555665'),(37,43,'https://res.cloudinary.com/dbnofh9a8/raw/upload/v1744295720/Audio_mp3cut.net.docx',NULL,'2025-04-10 14:35:21.333048','2025-04-10 14:35:21.333048'),(38,43,'https://res.cloudinary.com/dbnofh9a8/raw/upload/v1744262299/english.txt',NULL,'2025-04-10 14:35:21.544174','2025-04-10 14:35:21.544174');
/*!40000 ALTER TABLE `lectures_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meet`
--

DROP TABLE IF EXISTS `meet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `room_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_4debb523d9a0626940c3c4ae28c` (`class_id`),
  CONSTRAINT `FK_4debb523d9a0626940c3c4ae28c` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meet`
--

LOCK TABLES `meet` WRITE;
/*!40000 ALTER TABLE `meet` DISABLE KEYS */;
INSERT INTO `meet` VALUES (3,42,'class-meeting-051e7cf7','https://meet.jit.si/class-meeting-051e7cf7'),(4,42,'class-meeting-3ad5dcc9','https://meet.jit.si/class-meeting-3ad5dcc9'),(5,42,'class-meeting-2f515e83','https://meet.jit.si/class-meeting-2f515e83'),(6,42,'class-meeting-9308daa3','https://meet.jit.si/class-meeting-9308daa3'),(7,42,'class-meeting-86971ff3','https://meet.jit.si/class-meeting-86971ff3'),(8,42,'class-meeting-202505f1','https://meet.jit.si/class-meeting-202505f1'),(9,42,'class-meeting-378e8ec2','https://meet.jit.si/class-meeting-378e8ec2'),(10,42,'class-meeting-af3fd43a','https://meet.jit.si/class-meeting-af3fd43a'),(11,42,'class-meeting-2d2e9832','https://meet.jit.si/class-meeting-2d2e9832'),(12,42,'class-meeting-c5c58f77','https://meet.jit.si/class-meeting-c5c58f77'),(13,42,'class-meeting-b9920f83','https://meet.jit.si/class-meeting-b9920f83'),(19,42,'Lớp học reactjs','https://meet.jit.si/class-meeting-e9cb11d4'),(20,42,'abc 123','https://meet.jit.si/class-meeting-2c56fe71'),(22,42,'test','https://meet.jit.si/class-meeting-28bd0c32'),(25,42,'Học angular','https://meet.jit.si/class-meeting-d3ff1798'),(27,62,'Phòng học 1','https://meet.jit.si/class-meeting-92479008');
/*!40000 ALTER TABLE `meet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  `teacher_id` int NOT NULL,
  `content` text,
  `title` varchar(500) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`notification_id`),
  KEY `FK_2332563e5246c74e6b7ce30e6c8` (`teacher_id`),
  KEY `FK_67c4732ed5bc4347d01251416a4` (`class_id`),
  CONSTRAINT `FK_2332563e5246c74e6b7ce30e6c8` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_67c4732ed5bc4347d01251416a4` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (3,42,50,'Ngày mai cô bận , nên các em nhớ ôn bài trước khi tới lớp nhé\n','Ngày 3/9/2025','2025-03-15 14:13:48.005261','2025-03-15 14:13:48.104502'),(5,42,50,'Tuần tới, lớp sẽ có một bài kiểm tra cuối kỳ quan trọng, cố gắng ôn tập thật tốt nhé\n','Kiểm tra cuối kì','2025-03-15 14:13:48.005261','2025-03-15 14:13:48.104502'),(11,41,50,NULL,'Bài thực hành','2025-04-04 04:31:53.404000','2025-04-04 04:31:53.404000'),(12,60,50,'ban','baanj','2025-04-10 20:41:53.073000','2025-04-10 20:41:53.073000'),(13,62,50,'Thông báo 1','Thông báo 1','2025-04-10 14:22:51.804000','2025-04-10 14:22:51.804000'),(14,42,50,NULL,'Bài giảng 1','2025-04-10 14:34:01.086000','2025-04-10 14:34:01.086000');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_revoked` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_6bbe63d2fe75e7f0ba1710351d4` (`user_id`),
  CONSTRAINT `FK_6bbe63d2fe75e7f0ba1710351d4` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES (21,57,'e0d5c31a9e4225cb81955ae75acc399beb3dbe98723ff897f12d7fdce869a472bbc38207e4cede4d','2025-04-05 08:16:34',0),(22,57,'0d58e4bb13ba66ec08dc24d5c82f53edf5e79e558c56bb2df33060ee4c546648fbd25ce54784bc00','2025-04-05 08:16:49',0),(23,57,'b2359010c11dad08ee26a3b4dc5226fe7cd1bba8547408c1f72ea9fdb65809a4677d3448c4a00027','2025-04-05 08:16:53',0),(24,57,'04a3fa4ddbe5038ca8b07dc04db00bda65af560da5e92ffcfb4d780f33f639ef6d4c4c21889bdf9d','2025-04-05 08:16:54',0),(25,57,'ed5bd6b17a6c325d5746f367ab2f57cc28730db77c591bed07aab4a0860a3f7cbd999ed43dc85d53','2025-04-05 08:17:30',0),(26,47,'76dafa26aeec4822f9e18bb9f858ae39c10b8f5debd975f5795b5803403e1c726b2aa8112d9aa9d5','2025-04-05 15:17:55',0),(27,47,'8b4d6f9df7aabd06c2600e0b3e819bfa3587c8d5a85709ccb5476dc2ad5b033f86716b38e4ca94e6','2025-04-05 08:18:23',0),(28,57,'846a5b8b2a6a447aa2ff978e82fa35c674b5aaff418ecaabfa85e7a0db757f385bdfc2a5718950ca','2025-04-05 08:18:53',0),(29,57,'6b9518072d32f203c971adbdc42a818837935e876db3b044015359842d04f8d6ab05654ebfc44540','2025-04-05 08:27:29',0),(30,47,'0037e6de8d5d0c959583a65d760f58e9b708a5ba0089e1fa4e8ee6159c8975c6669986c7d7ffd2d0','2025-04-05 08:27:40',0),(31,50,'61331818d0cc487b01024dce681b4f0d06365d25e3fd4c0149f98ba1c90d67161cecf49fdd26a1b0','2025-04-05 08:35:46',0),(32,57,'f53f7dc19d856c1d74a52b45d1567566c5df2dba4bbdcad7e5bad17a22f03dfe9d6bada68c3136e1','2025-04-05 08:40:24',0),(33,50,'319e67ad4c54579179bfa8f966eeb5c755f22328d79d139155548fe6f265211b0d88c8e23fdba623','2025-04-05 08:45:37',0),(34,57,'b7bef4f4b5c850e33a7dfa3a021de99f8466b49455fb28e368e41e1bec8d5c8fcd8ae5730a93f934','2025-04-05 09:09:45',0),(35,52,'f7a6b586cb9c59efdd2bca7e38afa09921df194d175eff32161cd5a5aa2d27939a137cbc801c00ca','2025-04-05 09:15:34',0),(36,51,'6d6ffcab6de645d453ce1a5cca01e27c265014731840c1c61495274bc85b0bba67204f71fbc06e43','2025-04-05 09:15:46',0),(37,47,'6257cbe617d68810e44590dc2d332606b3c417d905c7f3cfdc55a2bb1224e4921d2db74b61dc8d5d','2025-04-05 09:16:46',0),(38,51,'8e090f0730a7f3e7c9f7b97c4430da5da7858000202dba06df74d7cf76de440c348a85d6b5b74167','2025-04-05 09:17:00',0),(39,52,'e6f70fff8f89ec3ae8c125f12a41350d7009618592352f81da7a5e2e409f8f8941a15d8c28750754','2025-04-05 09:17:15',0),(40,51,'b2c13a1c4d6070e9f1b46951d386b3a3990037288a51e63c778d5cb9e67654ca63eedf602a116600','2025-04-05 09:19:26',0),(41,51,'c6dd54b225a58a6917bb37deb87a2b7f5bb7369a37aa2e808f9d6df89645a65a1d5a31c9f4bcbf31','2025-04-05 09:21:31',0),(42,50,'fd607711d021e4cc40665dc4d95ce4258c1e0bd9855354c9967e6d9af27cb056924bd87fd79d0a0f','2025-04-05 09:23:46',0);
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_classes`
--

DROP TABLE IF EXISTS `student_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_classes` (
  `student_class_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `class_id` int NOT NULL,
  `enrollDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`student_class_id`),
  KEY `FK_09b94eccbdedd86b77d54daaeb8` (`student_id`),
  KEY `FK_250de2754beaff18091a60a6654` (`class_id`),
  CONSTRAINT `FK_09b94eccbdedd86b77d54daaeb8` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK_250de2754beaff18091a60a6654` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_classes`
--

LOCK TABLES `student_classes` WRITE;
/*!40000 ALTER TABLE `student_classes` DISABLE KEYS */;
INSERT INTO `student_classes` VALUES (6,49,17,'2025-02-27 14:47:08.415242'),(7,52,23,'2025-02-28 06:25:52.956599'),(9,49,43,'2025-02-28 08:09:21.921149'),(11,53,17,'2025-02-28 09:46:06.497938'),(13,53,19,'2025-02-28 09:48:43.910034'),(15,53,21,'2025-02-28 09:52:12.748905'),(17,53,26,'2025-02-28 13:17:45.185922'),(18,55,43,'2025-02-28 16:41:59.277267'),(29,56,42,'2025-03-02 04:56:33.268638'),(30,56,17,'2025-03-02 14:01:00.706963'),(37,57,42,'2025-03-16 11:28:34.279987'),(38,57,43,'2025-03-18 01:15:28.638064'),(39,57,41,'2025-03-18 01:15:58.709158'),(40,52,25,'2025-03-19 04:44:07.094065'),(43,56,41,'2025-03-27 02:54:33.807219'),(44,49,41,'2025-03-27 02:58:07.817927'),(50,56,22,'2025-03-30 10:41:45.365028'),(51,49,42,'2025-04-03 02:51:39.354266'),(52,53,42,'2025-04-03 02:51:49.113207'),(53,58,42,'2025-04-03 02:54:57.962830'),(54,60,42,'2025-04-03 02:57:53.126274'),(55,61,42,'2025-04-03 02:58:39.663858'),(56,62,42,'2025-04-03 02:58:47.586752'),(57,63,42,'2025-04-03 02:58:57.204449'),(58,64,57,'2025-04-04 04:01:49.897636'),(59,64,42,'2025-04-04 04:02:38.953144'),(61,57,64,'2025-04-11 01:15:23.226147'),(62,60,64,'2025-04-11 03:03:32.446054'),(63,52,64,'2025-04-11 03:06:12.708229'),(64,1,42,'2025-04-11 07:44:32.138807'),(65,2,42,'2025-04-11 07:44:41.177150'),(66,3,42,'2025-04-11 07:44:47.024716'),(67,4,42,'2025-04-11 07:44:53.782469'),(68,5,42,'2025-04-11 07:44:59.946534'),(69,6,42,'2025-04-11 07:45:05.724127'),(70,7,42,'2025-04-11 07:45:15.937200'),(71,8,42,'2025-04-11 07:45:22.431134'),(72,9,42,'2025-04-11 07:45:28.942299');
/*!40000 ALTER TABLE `student_classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `submission_id` int NOT NULL AUTO_INCREMENT,
  `assignment_id` int NOT NULL,
  `student_id` int NOT NULL,
  `file_content` text NOT NULL,
  `submitted_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `grade` decimal(5,2) NOT NULL,
  `feedback` text NOT NULL,
  `studentUserId` int DEFAULT NULL,
  PRIMARY KEY (`submission_id`),
  KEY `FK_cbb581318051fd409372ab53d3b` (`studentUserId`),
  KEY `FK_8723840b9b0464206640c268abc` (`assignment_id`),
  KEY `FK_435def3bbd4b4bbb9de1209cdae` (`student_id`),
  CONSTRAINT `FK_435def3bbd4b4bbb9de1209cdae` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK_8723840b9b0464206640c268abc` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`assignment_id`),
  CONSTRAINT `FK_cbb581318051fd409372ab53d3b` FOREIGN KEY (`studentUserId`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissions`
--

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_case`
--

DROP TABLE IF EXISTS `test_case`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_case` (
  `id` int NOT NULL AUTO_INCREMENT,
  `input` varchar(255) DEFAULT NULL,
  `expected_output` varchar(255) DEFAULT NULL,
  `score` float DEFAULT NULL,
  `exam_content_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_60d2927b0acf6fff15ab5b03ec8` (`exam_content_id`),
  CONSTRAINT `FK_60d2927b0acf6fff15ab5b03ec8` FOREIGN KEY (`exam_content_id`) REFERENCES `exam_content` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_case`
--

LOCK TABLES `test_case` WRITE;
/*!40000 ALTER TABLE `test_case` DISABLE KEYS */;
INSERT INTO `test_case` VALUES (7,'2\n2','4',1,58),(25,'1\n2\n3\n4\n5','25',1,56),(27,'2\n3','5',1,56),(28,'1\n2','3',1,56),(30,'2\n3','5',1,57),(31,'1\n2','3',1,61),(32,'-1\n-2','-3',1,61),(33,'1\n2','3',1,62),(34,'-6\n7','2',1,61),(35,'1\n2\n3','6',1,56),(36,'1\n2','3',1,56),(37,'1\n2','3',10,65),(38,'1\n2','3',10,66),(39,'-3\n5','2',10,66),(40,'-3\n-5','-8',10,66),(41,'1\n2','3',10,67),(42,'2\n3','5',10,67),(43,'1\n2','3',10,68),(44,'2\n3','5',10,68),(45,'2\n5','5',10,68),(46,'1\n-5\n6','3\n2',10,69),(47,'1\n-3\n2','2\n1',10,69),(48,'1\n-4\n4','2',10,69),(49,'1\n2\n3','Phuong trinh vo nghiem',10,69),(50,'1\n-5\n6','3\n2',3,70),(51,'1\n-3\n2','2\n1',3,70),(52,'1\n-4\n4','2',4,70);
/*!40000 ALTER TABLE `test_case` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `fullname` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','teacher','student') NOT NULL DEFAULT 'student',
  `email` varchar(50) NOT NULL,
  `profile_picture` varchar(100) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `dob` datetime DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `code` char(6) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`),
  UNIQUE KEY `IDX_a000cca60bcf04454e72769949` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'user01','Nguyen Van A','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten1+@gmail.com','avatar1.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(2,'user02','Tran Thi B','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten2+@gmail.com','avatar2.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(3,'user03','Le Van C','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten3+@gmail.com','avatar3.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(4,'user04','Pham Thi D','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten4+@gmail.com','avatar4.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(5,'user05','Hoang Van E','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten5+@gmail.com','avatar5.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(6,'user06','Nguyen Thi F','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten6+@gmail.com','avatar6.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(7,'user07','Tran Van G','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten7+@gmail.com','avatar7.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(8,'user08','Le Thi H','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten8+@gmail.com','avatar8.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(9,'user09','Pham Van I','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten9+@gmail.com','avatar9.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(10,'user10','Hoang Thi J','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten10+@gmail.com','avatar10.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(11,'user11','Nguyen Van K','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten11+@gmail.com','avatar11.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(12,'user12','Tran Thi L','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten12+@gmail.com','avatar12.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(13,'user13','Le Van M','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten13+@gmail.com','avatar13.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(14,'user14','Pham Thi N','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten14+@gmail.com','avatar14.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(15,'user15','Hoang Van O','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten15+@gmail.com','avatar15.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(16,'user16','Nguyen Thi P','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten16+@gmail.com','avatar16.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(17,'user17','Tran Van Q','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten17+@gmail.com','avatar17.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(18,'user18','Le Thi R','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten18+@gmail.com','avatar18.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(19,'user19','Pham Van S','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten19+@gmail.com','avatar19.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(20,'user20','Hoang Thi T','$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','student','ten20+@gmail.com','avatar20.png',NULL,'2025-04-11 07:44:03.725443','2025-04-11 07:44:03.725443',NULL,NULL,NULL,NULL),(44,'hlnhat-batch18bd@sdc.edu.v','longnhat admin','$2b$10$pgDcIdRZbfFLun79Pa1wR.YVgWcvaLEeZIqspeVBM0DF025PtSWlS','admin','nhatlong26032@gmail.com','https://res.cloudinary.com/dbnofh9a8/image/upload/v1740661648/b1rfcntg35ppemvdjvss.jpg','0664986998','2025-02-27 12:40:27.335000','2025-04-04 03:58:24.666000','2025-02-12 00:00:00','','590/1/7 Nguyễn Thái Học','583641'),(45,'fdsfsdfsfsf','tsfsdf','$2b$10$IWQFqtgptld6kPyQRrXdk.XVcEpyHbtF7MGnI3tuYc6/unsQjDK0i','teacher','nhathuynh227@gmail.com',NULL,'0645423424','2025-02-27 13:44:20.252239','2025-04-04 02:53:41.981000',NULL,NULL,'590/1/7 Nguyễn Thái Học',NULL),(46,'hfgfdfrewdw','hgfdsa','$2b$10$eHKMiQWkmzng2kTifSczz.kVKbj7omdN6uuzmHcf0W74FywZNgQ6y','teacher','nhatlong260322@gmail.com',NULL,'0675432121','2025-02-27 13:49:31.840029','2025-02-27 13:49:31.840029',NULL,NULL,'590/1/7 Nguyễn Thái Học',NULL),(47,'nguyendoan_123','Nguyên Đoàn','$2a$10$6XLV3GVki13JAt5UUY.3dOQN3ITWQztKlznb6vujxitYFoDYidHay','admin','wwwnguyendoan123@gmail.com','https://res.cloudinary.com/dbnofh9a8/image/upload/v1740664832/deg1ylrdgazaou3feg4c.jpg','0987654321','2025-02-27 13:59:30.846000','2025-03-02 08:28:45.093000','2003-04-05 00:00:00','Nam','Binh Dinh','104528'),(48,'admintest','admintest','$2b$10$6vcRDvK/xGUdHodq59cSdOBnXzZccJieK3ZQSOwbBq7yRGIESgiBa','student','admintest@gmail.com',NULL,'0874293472','2025-02-27 14:06:57.648557','2025-04-04 02:53:52.189000',NULL,NULL,'590/1/7 Nguyễn Thái Học',NULL),(49,NULL,'sv1','$2b$10$c85uxQ.WGON8qiAEzm6VHuKn1oReA64xOlpeEbtR2Eup54QPZsGd2','student','sv1@gmail.com',NULL,NULL,'2025-02-27 14:45:59.879748','2025-02-27 14:45:59.879748',NULL,NULL,NULL,NULL),(50,'giaovien1','Nguyễn Thị Mỹ Kiều','$2b$10$ZEYZ7pP5jENbqrw0W6Dnme.CvVtlFWSW6rz6dDDevL81ZFvJr0oOC','teacher','gv1@gmail.com','https://res.cloudinary.com/dbnofh9a8/image/upload/v1740971766/girl3_l0mhpp.jpg','0242342424','2025-02-27 15:23:51.562600','2025-03-03 03:16:14.311000',NULL,'Nữ','Quy Nhơn',NULL),(51,'dxwried_54','Nguyen Doan Vo','$2b$10$LmkQW.Vx70rJl8oeR/ak.uchwOON50G5HcjfKGD1RknF2Kb94.NGu','teacher','doanvonguyen54@gmail.com','','0912873465','2025-02-27 15:26:29.267135','2025-03-19 04:21:16.997000',NULL,'Nam','Gia Lai',NULL),(52,'minhquang_deptrai22','Đỗ Minh Quang','$2b$10$0VrrbNHQiyqucZqOQZFWKuaGX1DmUvEFBkKnpkdzMZVASWqWMHL8K','student','minhquang1234@gmail.com','blob:https://edu-space-dkn7.vercel.app/111efbc4-30ee-493e-9520-c153e2d4479f','0332356262','2025-02-28 06:25:31.762072','2025-03-16 05:29:10.854000','2000-02-23 00:00:00','Nam','Gia Lai',NULL),(53,NULL,'sv2@gmail.com','$2b$10$zL5RXLoXZtp5lRR.U70aXOdqjK1suuUqCwd5lvX9PHnaWvPGWMK.y','student','sv2@gmail.com',NULL,NULL,'2025-02-28 09:39:52.147838','2025-02-28 09:39:52.147838',NULL,NULL,NULL,NULL),(54,NULL,'sinhvien2','$2b$10$rkZXYV7mYRaIhvuk5ygHIulYL28bfoRAnZgXuZJhrBWuMZ9mTyyKG','student','sinhvien2@gmail.com',NULL,NULL,'2025-02-28 16:36:05.654680','2025-02-28 16:36:05.654680',NULL,NULL,NULL,NULL),(55,'sinhvien3','sinhvien3','$2b$10$mOo2Mo5UJcfxaROpDgZkHeZlHf2l31CGv9Db1WOz5x.dq.Ty0khuK','student','sinhvien3@gmail.com','','','2025-02-28 16:37:40.252459','2025-03-01 01:45:04.778000',NULL,'Nam','',NULL),(56,NULL,'sinhvien4','$2b$10$LDAv8QzeSMV0voZkVjvH/eIBhPoUebRiOcVcbbXzy9ibuICE.JFMG','admin','vonguyen54@gmail.com',NULL,NULL,'2025-03-01 06:34:54.835149','2025-04-04 03:55:03.443000',NULL,NULL,NULL,NULL),(57,'hlnhat-batch18bd@sdc.edu.vn','sinhvien55','$2b$10$MiRLS16TNGyQJUXPqU/4He5HEH9WwuN866r/R04ujHkSdtYoNh90m','student','sinhvien5@gmail.com','https://res.cloudinary.com/dbnofh9a8/image/upload/v1743429824/a1.webp','0642986998','2025-03-14 03:12:34.115205','2025-03-31 14:03:45.301000',NULL,'','590/1/7 Nguyễn Thái Học',NULL),(58,NULL,'sinhvien6','$2b$10$ZG7/BrhQDLbiava4vbSMzeUxpIO1syY7XqOKAC4UdcvA39JnWO6qq','student','sinhvien6@gmail.com',NULL,NULL,'2025-03-14 03:13:49.621619','2025-03-14 03:13:49.621619',NULL,NULL,NULL,NULL),(59,'giaovien2','giaovien2','$2b$10$r1V5.ywkNaY8N5HU0yxQJea6zIhbOp5xnh3btqWSPmc2/QXsPyKC2','teacher','giaovien2@gmail.com',NULL,'0564243243','2025-03-28 02:47:30.168789','2025-03-28 02:47:38.537000',NULL,NULL,'590/1/7 Nguyễn Thái Học',NULL),(60,NULL,'sinhvien7','$2b$10$KRD0WZtNgAs8mdxF1Ph2Z.1rbbrqS5k6Hkip37c3AKnI0CgfRsAR2','student','vonguyen44b@gmail.com',NULL,NULL,'2025-04-03 02:55:35.720769','2025-04-03 02:55:35.720769',NULL,NULL,NULL,NULL),(61,NULL,'sinhvien8@gmail.com','$2b$10$AjIQLvWdN8FvGlu2S53MjeHsOBicUBrP9vXYqP4juONv4mKxfUPWm','student','sinhvien8@gmail.com',NULL,NULL,'2025-04-03 02:55:58.830181','2025-04-03 02:55:58.830181',NULL,NULL,NULL,NULL),(62,NULL,'sinhvien9','$2b$10$yxH9h13pq897DpH1zSFnbO0xsOEBR0VZRvcP1S/2evSYpX0RjCJye','student','xorepew289@ovobri.com',NULL,NULL,'2025-04-03 02:56:18.132024','2025-04-03 02:56:18.132024',NULL,NULL,NULL,NULL),(63,NULL,'sinhvien10','$2b$10$kH26sdwVYT5oDqhXntmxt.3/AAQOqv2yPEcr.NCKFyyPps5c2wngW','student','sinhvien10@gmail.com',NULL,NULL,'2025-04-03 02:56:35.728967','2025-04-03 02:56:35.728967',NULL,NULL,NULL,NULL),(64,'Quang','Quang Vlog','$2b$10$mUz6UdXNcH50uMDbLzPrB.8u13wNdgHekIK3E47D2JPHozW4V3Yqa','student','pmq0511@gmail.com','https://res.cloudinary.com/dbnofh9a8/image/upload/v1743739096/CICD.png','0346991600','2025-04-04 03:57:23.699029','2025-04-11 03:48:51.108000','2003-05-11 00:00:00','Nam','Bùi Thị Xuân',NULL),(65,'Lich','Lich','123','student','lich@gmail.com',NULL,NULL,'2025-04-11 07:41:51.617999','2025-04-11 07:41:51.617999',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-13 11:24:45

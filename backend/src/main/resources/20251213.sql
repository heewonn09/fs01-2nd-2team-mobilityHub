-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mobilityhub
-- ------------------------------------------------------
-- Server version	8.0.21

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

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` varchar(255) NOT NULL,
  `admin_name` varchar(255) NOT NULL,
  `admin_pass` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('Padmin','Parking Manager','1234','tadmin@test.com','010-1111-1111'),('Radmin','Repair Manager','1234','radmin@test.com','010-3333-3333'),('Tadmin','Super Manager','1234','sadmin@test.com','010-4444-4444'),('Wadmin','Wash Manager','1234','wadmin@test.com','010-2222-2222');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car`
--

DROP TABLE IF EXISTS `car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car` (
  `car_id` bigint NOT NULL AUTO_INCREMENT,
  `car_model` varchar(255) DEFAULT NULL,
  `car_number` varchar(255) NOT NULL,
  `insert_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`car_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car`
--

LOCK TABLES `car` WRITE;
/*!40000 ALTER TABLE `car` DISABLE KEYS */;
INSERT INTO `car` VALUES (1,'Hyundai Sonata','12가 1111','2025-12-13 10:24:48.000000'),(2,'Kia K5','34나 2222','2025-12-13 10:24:48.000000'),(3,'BMW X5','56다 3333','2025-12-13 10:24:48.000000'),(4,'Tesla Model 3','78라 4444','2025-12-13 10:24:48.000000'),(5,'Hyundai Avante','11가 5001','2025-12-13 10:40:01.000000'),(6,'Kia Morning','22나 5002','2025-12-13 10:40:01.000000'),(7,'Hyundai Tucson','33다 5003','2025-12-13 10:40:01.000000'),(8,'Kia Sorento','44라 5004','2025-12-13 10:40:01.000000'),(9,'Genesis G80','55마 5005','2025-12-13 10:40:01.000000'),(10,'BMW 320d','66바 5006','2025-12-13 10:40:01.000000'),(11,'Audi A6','77사 5007','2025-12-13 10:40:01.000000'),(12,'Benz E250','88아 5008','2025-12-13 10:40:01.000000'),(13,'Hyundai Kona','99자 5009','2025-12-13 10:40:01.000000'),(14,'Kia Carnival','10차 5010','2025-12-13 10:40:01.000000'),(15,'Tesla Y','12카 5011','2025-12-13 10:40:01.000000'),(16,'Volvo XC60','13타 5012','2025-12-13 10:40:01.000000'),(17,'Mini Cooper','14파 5013','2025-12-13 10:40:01.000000'),(18,'Hyundai Ioniq 6','15하 5014','2025-12-13 10:40:01.000000'),(19,'Kia EV6','16허 5015','2025-12-13 10:40:01.000000'),(20,'Hyundai Palisade','17호 5016','2025-12-13 10:40:01.000000'),(21,'Kia Stinger','18흐 5017','2025-12-13 10:40:01.000000'),(22,'BMW X3','19하 5018','2025-12-13 10:40:01.000000'),(23,'Mercedes GLC','20허 5019','2025-12-13 10:40:01.000000'),(24,'Genesis GV70','21호 5020','2025-12-13 10:40:01.000000');
/*!40000 ALTER TABLE `car` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `camera_id` varchar(255) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `reg_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`image_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

LOCK TABLES `image` WRITE;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
INSERT INTO `image` VALUES (1,'CAM01','/images/1.jpg','2025-12-13 10:24:55.000000'),(2,'CAM02','/images/2.jpg','2025-12-13 10:24:55.000000'),(3,'CAM03','/images/3.jpg','2025-12-13 10:24:55.000000'),(4,'CAM04','/images/4.jpg','2025-12-13 10:24:55.000000'),(5,'CAM05','/images/5.jpg','2025-12-13 10:24:55.000000'),(6,'CAM06','/images/6.jpg','2025-12-13 10:24:55.000000'),(7,'CAM07','/images/7.jpg','2025-12-13 10:24:55.000000'),(8,'CAM08','/images/8.jpg','2025-12-13 10:24:55.000000'),(9,'CAM09','/images/9.jpg','2025-12-13 10:24:55.000000'),(10,'CAM10','/images/10.jpg','2025-12-13 10:24:55.000000'),(11,'CAM11','/images/11.jpg','2025-12-13 10:24:55.000000'),(12,'CAM12','/images/12.jpg','2025-12-13 10:24:55.000000'),(13,'CAM13','/images/13.jpg','2025-12-13 10:24:55.000000'),(14,'CAM14','/images/14.jpg','2025-12-13 10:24:55.000000'),(15,'CAM15','/images/15.jpg','2025-12-13 10:24:55.000000'),(16,'CAM16','/images/16.jpg','2025-12-13 10:40:09.000000'),(17,'CAM17','/images/17.jpg','2025-12-13 10:40:09.000000'),(18,'CAM18','/images/18.jpg','2025-12-13 10:40:09.000000'),(19,'CAM19','/images/19.jpg','2025-12-13 10:40:09.000000'),(20,'CAM20','/images/20.jpg','2025-12-13 10:40:09.000000'),(21,'CAM21','/images/21.jpg','2025-12-13 10:40:09.000000'),(22,'CAM22','/images/22.jpg','2025-12-13 10:40:09.000000'),(23,'CAM23','/images/23.jpg','2025-12-13 10:40:09.000000'),(24,'CAM24','/images/24.jpg','2025-12-13 10:40:09.000000'),(25,'CAM25','/images/25.jpg','2025-12-13 10:40:09.000000'),(26,'CAM26','/images/26.jpg','2025-12-13 10:40:09.000000'),(27,'CAM27','/images/27.jpg','2025-12-13 10:40:09.000000'),(28,'CAM28','/images/28.jpg','2025-12-13 10:40:09.000000'),(29,'CAM29','/images/29.jpg','2025-12-13 10:40:09.000000'),(30,'CAM30','/images/30.jpg','2025-12-13 10:40:09.000000');
/*!40000 ALTER TABLE `image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parking`
--

DROP TABLE IF EXISTS `parking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parking` (
  `sector_id` char(3) NOT NULL,
  `sector_name` varchar(255) NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  `admin_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`sector_id`),
  KEY `FK9n4ix3n657w0t1g87sckolw0x` (`admin_id`),
  CONSTRAINT `FK9n4ix3n657w0t1g87sckolw0x` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parking`
--

LOCK TABLES `parking` WRITE;
/*!40000 ALTER TABLE `parking` DISABLE KEYS */;
INSERT INTO `parking` VALUES ('P01','주차 1구역','EMPTY','Padmin'),('P02','주차 2구역','EMPTY','Padmin'),('P03','주차 3구역','EMPTY','Padmin'),('R01','정비 3구역','EMPTY','Radmin'),('W01','세차 2구역','EMPTY','Wadmin');
/*!40000 ALTER TABLE `parking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parking_map_edge`
--

DROP TABLE IF EXISTS `parking_map_edge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parking_map_edge` (
  `edge_id` int NOT NULL AUTO_INCREMENT,
  `direction` varchar(255) NOT NULL,
  `from_node_id` int NOT NULL,
  `to_node_id` int NOT NULL,
  PRIMARY KEY (`edge_id`),
  UNIQUE KEY `uk_parking_map_edge_from_to_dir` (`from_node_id`,`to_node_id`,`direction`),
  KEY `FK3jkd83mri9j59pvqy0hj7cjya` (`to_node_id`),
  CONSTRAINT `FK3jkd83mri9j59pvqy0hj7cjya` FOREIGN KEY (`to_node_id`) REFERENCES `parking_map_node` (`node_id`),
  CONSTRAINT `FKidh3lgasipyqf5m6nrv32gks8` FOREIGN KEY (`from_node_id`) REFERENCES `parking_map_node` (`node_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parking_map_edge`
--

LOCK TABLES `parking_map_edge` WRITE;
/*!40000 ALTER TABLE `parking_map_edge` DISABLE KEYS */;
INSERT INTO `parking_map_edge` VALUES (1,'직진',1,2),(2,'좌회전',2,3),(3,'직진',2,10),(4,'우회전',2,12),(5,'우회전',3,4),(6,'좌회전',4,5),(7,'직진',4,6),(21,'직진',5,23),(8,'좌회전',6,7),(9,'직진',6,8),(22,'직진',7,22),(10,'좌회전',8,9),(11,'직진',8,16),(23,'직진',9,21),(16,'직진',10,15),(18,'좌회전',12,13),(19,'직진',13,14),(20,'좌회전',14,17),(17,'좌회전',15,17),(12,'좌회전',16,17),(13,'좌회전',17,18),(14,'좌회전',18,19),(15,'우회전',19,20),(24,'좌회전',21,18),(25,'좌회전',22,18),(26,'좌회전',23,18);
/*!40000 ALTER TABLE `parking_map_edge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parking_map_node`
--

DROP TABLE IF EXISTS `parking_map_node`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parking_map_node` (
  `node_id` int NOT NULL,
  `node_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`node_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parking_map_node`
--

LOCK TABLES `parking_map_node` WRITE;
/*!40000 ALTER TABLE `parking_map_node` DISABLE KEYS */;
INSERT INTO `parking_map_node` VALUES (1,'입구'),(2,'기점_1'),(3,'기점_2'),(4,'기점_3'),(5,'주차_1'),(6,'기점_4'),(7,'주차_2'),(8,'기점_5'),(9,'주차_3'),(10,'세차_1'),(12,'기점_6'),(13,'정비_1'),(14,'기점_7'),(15,'기점_8'),(16,'기점_9'),(17,'기점_10'),(18,'기점_11'),(19,'기점_12'),(20,'출구'),(21,'기점_13'),(22,'기점_14'),(23,'기점_15');
/*!40000 ALTER TABLE `parking_map_node` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repair_report`
--

DROP TABLE IF EXISTS `repair_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repair_report` (
  `report_id` varchar(255) NOT NULL,
  `repair_amount` int NOT NULL,
  `repair_detail` text,
  `repair_title` varchar(255) DEFAULT NULL,
  `admin_id` varchar(255) DEFAULT NULL,
  `user_car_id` bigint DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `FK7ywyyresorl75enang97maeyo` (`admin_id`),
  KEY `FK49iv2mjk37yklrxf6bo8lomn5` (`user_car_id`),
  CONSTRAINT `FK49iv2mjk37yklrxf6bo8lomn5` FOREIGN KEY (`user_car_id`) REFERENCES `user_car` (`id`),
  CONSTRAINT `FK7ywyyresorl75enang97maeyo` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repair_report`
--

LOCK TABLES `repair_report` WRITE;
/*!40000 ALTER TABLE `repair_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `repair_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_status`
--

DROP TABLE IF EXISTS `stock_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_status` (
  `inventory_id` char(3) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `stock_category` varchar(255) NOT NULL,
  `stock_price` int NOT NULL,
  `stock_quantity` int NOT NULL,
  `stock_units` varchar(255) NOT NULL,
  `update_time` datetime(6) DEFAULT NULL,
  `sector_id` char(3) DEFAULT NULL,
  PRIMARY KEY (`inventory_id`),
  KEY `FKej08ugjeniettp0qbmtiyylud` (`sector_id`),
  CONSTRAINT `FKej08ugjeniettp0qbmtiyylud` FOREIGN KEY (`sector_id`) REFERENCES `parking` (`sector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_status`
--

LOCK TABLES `stock_status` WRITE;
/*!40000 ALTER TABLE `stock_status` DISABLE KEYS */;
INSERT INTO `stock_status` VALUES ('A01','세차 수건','소모품',8000,120,'EA','2025-12-12 10:01:01.000000','R01'),('A02','엔진오일 5W30','정비부품',18000,45,'L','2025-12-12 10:02:12.000000','R01'),('A03','광택 패드','소모품',12000,200,'EA','2025-12-12 10:03:33.000000','R01'),('A04','브레이크 패드','정비부품',45000,33,'EA','2025-12-12 10:04:44.000000','R01'),('A05','유리세정제','소모품',7000,80,'L','2025-12-12 10:05:55.000000','R01'),('A06','배터리(60Ah)','정비부품',95000,15,'EA','2025-12-12 10:06:06.000000','R01'),('A07','와이퍼 550mm','정비부품',9000,50,'EA','2025-12-12 10:07:07.000000','R01'),('A08','타이어 광택제','소모품',8000,100,'L','2025-12-12 10:08:08.000000','R01'),('A09','에어필터','정비부품',11000,28,'EA','2025-12-12 10:09:09.000000','R01'),('A10','휠 브러시','소모품',6000,75,'EA','2025-12-12 10:10:10.000000','R01');
/*!40000 ALTER TABLE `stock_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` varchar(255) NOT NULL,
  `create_date` datetime(6) DEFAULT NULL,
  `user_password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('user1','2025-12-13 10:24:46.000000','1234','USER','010-1234-1234','Kim'),('user10','2025-12-13 10:24:46.000000','1234','USER','010-6000-0010','Hwang'),('user11','2025-12-13 10:24:46.000000','1234','USER','010-6000-0011','Shin'),('user12','2025-12-13 10:24:46.000000','1234','USER','010-6000-0012','Na'),('user13','2025-12-13 10:24:46.000000','1234','USER','010-6000-0013','Baek'),('user14','2025-12-13 10:24:46.000000','1234','USER','010-6000-0014','Oh'),('user15','2025-12-13 10:24:46.000000','1234','USER','010-6000-0015','Kang'),('user16','2025-12-13 10:24:46.000000','1234','USER','010-6000-0016','Moon'),('user17','2025-12-13 10:24:46.000000','1234','USER','010-6000-0017','Ha'),('user18','2025-12-13 10:24:46.000000','1234','USER','010-6000-0018','Jo'),('user19','2025-12-13 10:24:46.000000','1234','USER','010-6000-0019','Ahn'),('user2','2025-12-13 10:24:46.000000','1234','USER','010-5364-6432','Lee'),('user3','2025-12-13 10:24:46.000000','1234','USER','010-2345-8652','Park'),('user4','2025-12-13 10:24:46.000000','1234','USER','010-9563-0654','Choi'),('user5','2025-12-13 10:24:46.000000','1234','USER','010-6000-0005','Jung'),('user6','2025-12-13 10:24:46.000000','1234','USER','010-6000-0006','Han'),('user7','2025-12-13 10:24:46.000000','1234','USER','010-6000-0007','Seo'),('user8','2025-12-13 10:24:46.000000','1234','USER','010-6000-0008','Yoo'),('user9','2025-12-13 10:24:46.000000','1234','USER','010-6000-0009','Im');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_car`
--

DROP TABLE IF EXISTS `user_car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_car` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `car_id` bigint NOT NULL,
  `user_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbiwwtu12d1d614gd5b35tef4x` (`car_id`),
  KEY `FKgs1lsnqcl7dmnbsvc1m8wuy6h` (`user_id`),
  CONSTRAINT `FKbiwwtu12d1d614gd5b35tef4x` FOREIGN KEY (`car_id`) REFERENCES `car` (`car_id`),
  CONSTRAINT `FKgs1lsnqcl7dmnbsvc1m8wuy6h` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_car`
--

LOCK TABLES `user_car` WRITE;
/*!40000 ALTER TABLE `user_car` DISABLE KEYS */;
INSERT INTO `user_car` VALUES (1,2,'user2'),(2,3,'user3'),(3,1,'user3'),(4,4,'user4'),(5,5,'user5'),(6,6,'user5'),(7,7,'user6'),(8,8,'user7'),(9,12,'user7'),(10,6,'user8'),(11,9,'user9'),(12,10,'user10'),(13,11,'user10'),(14,12,'user11'),(15,13,'user12'),(16,14,'user13'),(17,15,'user13'),(18,5,'user14'),(19,16,'user15'),(20,17,'user16'),(21,9,'user16'),(22,18,'user17'),(23,19,'user18'),(24,20,'user19'),(25,21,'user19');
/*!40000 ALTER TABLE `user_car` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work`
--

DROP TABLE IF EXISTS `work`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work` (
  `work_id` int NOT NULL AUTO_INCREMENT,
  `work_type` varchar(255) NOT NULL,
  PRIMARY KEY (`work_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work`
--

LOCK TABLES `work` WRITE;
/*!40000 ALTER TABLE `work` DISABLE KEYS */;
INSERT INTO `work` VALUES (1,'park'),(2,'repair'),(3,'carwash'),(4,'park,carwash'),(5,'park,repair');
/*!40000 ALTER TABLE `work` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_info`
--

DROP TABLE IF EXISTS `work_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_info` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `additional_request` text,
  `entry_time` datetime(6) DEFAULT NULL,
  `exit_time` datetime(6) DEFAULT NULL,
  `request_time` datetime(6) DEFAULT NULL,
  `node_id` int DEFAULT NULL,
  `image_id` int DEFAULT NULL,
  `sector_id` char(3) DEFAULT NULL,
  `user_car_id` bigint DEFAULT NULL,
  `work_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKsaardgi7khbgyosy559bpsuy0` (`node_id`),
  UNIQUE KEY `UKtaxpojh0qvwrkl4hxpwaf4afu` (`image_id`),
  UNIQUE KEY `UKeordm0gxactpg36ifpmll8h67` (`sector_id`),
  KEY `FKl80yh9weaiiuh84l4bg5is08n` (`user_car_id`),
  KEY `FK7e3uinn7c438naeg8rlrfc6ev` (`work_id`),
  CONSTRAINT `FK7e3uinn7c438naeg8rlrfc6ev` FOREIGN KEY (`work_id`) REFERENCES `work` (`work_id`),
  CONSTRAINT `FKao2n860golv3qmiic48gy3s32` FOREIGN KEY (`node_id`) REFERENCES `parking_map_node` (`node_id`),
  CONSTRAINT `FKkjvlqnkju90vy48jjw6ta71rt` FOREIGN KEY (`image_id`) REFERENCES `image` (`image_id`),
  CONSTRAINT `FKl80yh9weaiiuh84l4bg5is08n` FOREIGN KEY (`user_car_id`) REFERENCES `user_car` (`id`),
  CONSTRAINT `FKlu817s6o8af70dahlltlo6bi3` FOREIGN KEY (`sector_id`) REFERENCES `parking` (`sector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_info`
--

LOCK TABLES `work_info` WRITE;
/*!40000 ALTER TABLE `work_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `work_info` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-13 17:42:28

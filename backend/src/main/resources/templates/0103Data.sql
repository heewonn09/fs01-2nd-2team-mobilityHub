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
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('Padmin','주차장 관리자','{bcrypt}$2a$10$LHqo.nO8nqKha0kFhV66pO0IcvUkZusDE9xUJDbY/alLHaPXD0hvi','tadmin@test.com','010-5496-7458','PARKING'),('Radmin','정비소 관리자','{bcrypt}$2a$10$lcsBS5TCM00DLb6jZoSkBuV3gSXUDCpxddv94OJSgsD0djroPRpRG','radmin@test.com','010-8462-7286','REPAIR'),('Tadmin','총 관리자','{bcrypt}$2a$10$uel8Bd9vJLYMR99dbJzPMetmy18A8jAcwHY.hkmTpgrhoVWW8bZX.','sadmin@test.com','010-6520-4119','TOTAL'),('Wadmin','세차장 관리자','{bcrypt}$2a$10$JkI2JYcGN2mn1y9bMOAHzuMm6wKdyBtpr2/RJL765YR/eRgvQnpoq','wadmin@test.com','010-7785-5236','WASH');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `car`
--

LOCK TABLES `car` WRITE;
/*!40000 ALTER TABLE `car` DISABLE KEYS */;
INSERT INTO `car` VALUES (1,'2025-12-13 10:24:48','Hyundai Sonata','12가1111'),(2,'2025-12-13 10:24:48','Kia K5','34나2222'),(3,'2025-12-13 10:24:48','BMW X5','56다3333'),(4,'2025-12-13 10:24:48','Tesla Model 3','78라4444'),(5,'2025-12-13 10:40:01','Hyundai Avante','11가5001'),(6,'2025-12-13 10:40:01','Kia Morning','22나5002'),(7,'2025-12-13 10:40:01','Hyundai Tucson','33다5003'),(8,'2025-12-13 10:40:01','Kia Sorento','44라5004'),(9,'2025-12-13 10:40:01','Genesis G80','55마5005'),(10,'2025-12-13 10:40:01','BMW 320d','66바5006'),(11,'2025-12-13 10:40:01','Audi A6','77사5007'),(12,'2025-12-13 10:40:01','Benz E250','88아5008'),(13,'2025-12-13 10:40:01','Hyundai Kona','99자5009'),(14,'2025-12-13 10:40:01','Kia Carnival','10차5010'),(15,'2025-12-13 10:40:01','Tesla Y','12카5011'),(16,'2025-12-13 10:40:01','Volvo XC60','13타5012'),(17,'2025-12-13 10:40:01','Mini Cooper','14파5013'),(18,'2025-12-13 10:40:01','Hyundai Ioniq 6','15하5014'),(19,'2025-12-13 10:40:01','Kia EV6','16허5015'),(20,'2025-12-13 10:40:01','Hyundai Palisade','17호5016'),(21,'2025-12-13 10:40:01','Kia Stinger','18흐5017'),(22,'2025-12-13 10:40:01','BMW X3','19하5018'),(23,'2025-12-13 10:40:01','Mercedes GLC','20허5019'),(24,'2025-12-13 10:40:01','Genesis GV70','21호5020');
/*!40000 ALTER TABLE `car` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `image`
--

LOCK TABLES `image` WRITE;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
INSERT INTO `image` VALUES (1,'2025-12-13 10:24:55','CAM01','/images/1.jpg',NULL,NULL),(2,'2025-12-13 10:24:55','CAM02','/images/2.jpg',NULL,NULL),(3,'2025-12-13 10:24:55','CAM03','/images/3.jpg',NULL,NULL),(4,'2025-12-13 10:24:55','CAM04','/images/4.jpg',NULL,NULL),(5,'2025-12-13 10:24:55','CAM05','/images/5.jpg',NULL,NULL),(6,'2025-12-13 10:24:55','CAM06','/images/6.jpg',NULL,NULL),(7,'2025-12-13 10:24:55','CAM07','/images/7.jpg',NULL,NULL),(8,'2025-12-13 10:24:55','CAM08','/images/8.jpg',NULL,NULL),(9,'2025-12-13 10:24:55','CAM09','/images/9.jpg',NULL,NULL),(10,'2025-12-13 10:24:55','CAM10','/images/10.jpg',NULL,NULL),(11,'2025-12-13 10:24:55','CAM11','/images/11.jpg',NULL,NULL),(12,'2025-12-13 10:24:55','CAM12','/images/12.jpg',NULL,NULL),(13,'2025-12-13 10:24:55','CAM13','/images/13.jpg',NULL,NULL),(14,'2025-12-13 10:24:55','CAM14','/images/14.jpg',NULL,NULL),(15,'2025-12-13 10:24:55','CAM15','/images/15.jpg',NULL,NULL),(16,'2025-12-13 10:40:09','CAM16','/images/16.jpg',NULL,NULL),(17,'2025-12-13 10:40:09','CAM17','/images/17.jpg',NULL,NULL),(18,'2025-12-13 10:40:09','CAM18','/images/18.jpg',NULL,NULL),(19,'2025-12-13 10:40:09','CAM19','/images/19.jpg',NULL,NULL),(20,'2025-12-13 10:40:09','CAM20','/images/20.jpg',NULL,NULL),(21,'2025-12-13 10:40:09','CAM21','/images/21.jpg',NULL,NULL),(22,'2025-12-13 10:40:09','CAM22','/images/22.jpg',NULL,NULL),(23,'2025-12-13 10:40:09','CAM23','/images/23.jpg',NULL,NULL),(24,'2025-12-13 10:40:09','CAM24','/images/24.jpg',NULL,NULL),(25,'2025-12-13 10:40:09','CAM25','/images/25.jpg',NULL,NULL),(26,'2025-12-13 10:40:09','CAM26','/images/26.jpg',NULL,NULL),(27,'2025-12-13 10:40:09','CAM27','/images/27.jpg',NULL,NULL),(28,'2025-12-13 10:40:09','CAM28','/images/28.jpg',NULL,NULL),(29,'2025-12-13 10:40:09','CAM29','/images/29.jpg',NULL,NULL),(30,'2025-12-13 10:40:09','CAM30','/images/30.jpg',NULL,NULL);
/*!40000 ALTER TABLE `image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `parking`
--

LOCK TABLES `parking` WRITE;
/*!40000 ALTER TABLE `parking` DISABLE KEYS */;
INSERT INTO `parking` VALUES ('Padmin','P01','주차 1구역','EMPTY'),('Padmin','P02','주차 2구역','EMPTY'),('Padmin','P03','주차 3구역','EMPTY'),('Radmin','R01','정비 3구역','EMPTY'),('Wadmin','W01','세차 2구역','EMPTY');
/*!40000 ALTER TABLE `parking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `parking_map_edge`
--

LOCK TABLES `parking_map_edge` WRITE;
/*!40000 ALTER TABLE `parking_map_edge` DISABLE KEYS */;
INSERT INTO `parking_map_edge` VALUES (1,1,2,'직진'),(2,2,3,'좌회전'),(3,2,10,'직진'),(4,2,12,'우회전'),(5,3,4,'우회전'),(6,4,5,'좌회전'),(7,4,6,'직진'),(21,5,23,'직진'),(8,6,7,'좌회전'),(9,6,8,'직진'),(22,7,22,'직진'),(10,8,9,'좌회전'),(11,8,16,'직진'),(23,9,21,'직진'),(16,10,15,'직진'),(18,12,13,'좌회전'),(19,13,14,'직진'),(20,14,17,'좌회전'),(17,15,17,'좌회전'),(12,16,17,'좌회전'),(13,17,18,'좌회전'),(14,18,19,'좌회전'),(15,19,20,'우회전'),(24,21,18,'좌회전'),(25,22,18,'좌회전'),(26,23,18,'좌회전');
/*!40000 ALTER TABLE `parking_map_edge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `parking_map_node`
--

LOCK TABLES `parking_map_node` WRITE;
/*!40000 ALTER TABLE `parking_map_node` DISABLE KEYS */;
INSERT INTO `parking_map_node` VALUES (1,'입구'),(2,'기점_1'),(3,'기점_2'),(4,'기점_3'),(5,'주차_1'),(6,'기점_4'),(7,'주차_2'),(8,'기점_5'),(9,'주차_3'),(10,'세차_1'),(12,'기점_6'),(13,'정비_1'),(14,'기점_7'),(15,'기점_8'),(16,'기점_9'),(17,'기점_10'),(18,'기점_11'),(19,'기점_12'),(20,'출구'),(21,'기점_13'),(22,'기점_14'),(23,'기점_15');
/*!40000 ALTER TABLE `parking_map_node` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `repair_report`
--

LOCK TABLES `repair_report` WRITE;
/*!40000 ALTER TABLE `repair_report` DISABLE KEYS */;
INSERT INTO `repair_report` VALUES (70000,11,'Radmin','오일 교체 완료','오일 교체','20251212162325'),(460000,12,'Radmin','앞범퍼 파손 확인되었습니다. 해당 부분 교체하였습니다','앞범퍼 교체','20251212175010'),(235000,20,'Radmin','동파로 인한 브레이크부분이 얼었습니다. 새로 교체하였습니다','브레이크 교체','20251212193043'),(100000,22,'Radmin','내부 뒷좌석 등 두개 교체완료','뒷좌석 등 교체','20251212205413'),(80000,7,'Radmin','-','윈터타이어 교체','20251216155840'),(76450,8,'Radmin','왼쪽 앞, 오른쪽 뒷부분 찌그러진 부분 수리하였습니다','범퍼수리 완료','20251216162523'),(50000,14,'Radmin','앞범퍼 상태이상 무','이상없음','20251230172350');
/*!40000 ALTER TABLE `repair_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `stock_status`
--

LOCK TABLES `stock_status` WRITE;
/*!40000 ALTER TABLE `stock_status` DISABLE KEYS */;
INSERT INTO `stock_status` VALUES (8000,120,'2025-12-01 10:01:01','A01','세차 수건','R01','소모품','EA',50),(18000,45,'2025-12-01 10:25:12','A02','엔진오일 5W30','R01','정비부품','L',30),(12000,200,'2025-12-02 10:03:10','A03','광택 패드','R01','소모품','EA',50),(45000,33,'2025-12-02 10:35:41','A04','브레이크 패드','R01','정비부품','EA',30),(7000,80,'2025-12-02 10:50:13','A05','유리세정제','R01','소모품','L',50),(95000,15,'2025-12-02 11:21:16','A06','배터리(60Ah)','R01','정비부품','EA',20),(9000,50,'2025-12-02 11:25:07','A07','와이퍼 550mm','R01','정비부품','EA',30),(8000,100,'2025-12-02 11:43:28','A08','타이어 광택제','R01','소모품','L',50),(11000,28,'2025-12-02 12:39:09','A09','에어필터','R01','정비부품','EA',25),(6000,75,'2025-12-02 13:15:10','A10','휠 브러시','R01','소모품','EA',30);
/*!40000 ALTER TABLE `stock_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('2025-12-13 10:24:46','010-1234-1234','USER','user1','Kim','{noop}1234'),('2025-12-13 10:24:46','010-6000-0010','USER','user10','Hwang','{noop}1234'),('2025-12-13 10:24:46','010-6000-0011','USER','user11','Shin','{noop}1234'),('2025-12-13 10:24:46','010-6000-0012','USER','user12','Na','{noop}1234'),('2025-12-13 10:24:46','010-6000-0013','USER','user13','Baek','{noop}1234'),('2025-12-13 10:24:46','010-6000-0014','USER','user14','Oh','{noop}1234'),('2025-12-13 10:24:46','010-6000-0015','USER','user15','Kang','{noop}1234'),('2025-12-13 10:24:46','010-6000-0016','USER','user16','Moon','{noop}1234'),('2025-12-13 10:24:46','010-6000-0017','USER','user17','Ha','{noop}1234'),('2025-12-13 10:24:46','010-6000-0018','USER','user18','Jo','{noop}1234'),('2025-12-13 10:24:46','010-6000-0019','USER','user19','Ahn','{noop}1234'),('2025-12-13 10:24:46','010-5364-6432','USER','user2','Lee','{noop}1234'),('2025-12-13 10:24:46','010-2345-8652','USER','user3','Park','{noop}1234'),('2025-12-13 10:24:46','010-9563-0654','USER','user4','Choi','{noop}1234'),('2025-12-13 10:24:46','010-6000-0005','USER','user5','Jung','{noop}1234'),('2025-12-13 10:24:46','010-6000-0006','USER','user6','Han','{noop}1234'),('2025-12-13 10:24:46','010-6000-0007','USER','user7','Seo','{noop}1234'),('2025-12-13 10:24:46','010-6000-0008','USER','user8','Yoo','{noop}1234'),('2025-12-13 10:24:46','010-6000-0009','USER','user9','Im','{noop}1234');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_car`
--

LOCK TABLES `user_car` WRITE;
/*!40000 ALTER TABLE `user_car` DISABLE KEYS */;
INSERT INTO `user_car` VALUES (2,1,'user2'),(3,2,'user3'),(1,3,'user3'),(4,4,'user4'),(5,5,'user5'),(6,6,'user5'),(7,7,'user6'),(8,8,'user7'),(12,9,'user7'),(6,10,'user8'),(9,11,'user9'),(10,12,'user10'),(11,13,'user10'),(12,14,'user11'),(13,15,'user12'),(14,16,'user13'),(15,17,'user13'),(5,18,'user14'),(16,19,'user15'),(17,20,'user16'),(9,21,'user16'),(18,22,'user17'),(19,23,'user18'),(20,24,'user19'),(21,25,'user19');
/*!40000 ALTER TABLE `user_car` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `work`
--

LOCK TABLES `work` WRITE;
/*!40000 ALTER TABLE `work` DISABLE KEYS */;
INSERT INTO `work` VALUES (1,'park'),(2,'repair'),(3,'carwash'),(4,'park,carwash'),(5,'park,repair');
/*!40000 ALTER TABLE `work` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `work_info`
--

LOCK TABLES `work_info` WRITE;
/*!40000 ALTER TABLE `work_info` DISABLE KEYS */;
INSERT INTO `work_info` VALUES (2,3,'2025-12-12 14:37:44','2025-12-12 17:12:31',1,'2025-12-12 14:26:11',7,NULL,NULL,NULL),(3,4,'2025-12-12 14:48:05','2025-12-12 18:22:14',2,'2025-12-12 14:35:52',8,NULL,NULL,NULL),(4,1,'2025-12-12 15:02:19','2025-12-12 17:49:03',3,'2025-12-12 14:48:33',10,NULL,NULL,NULL),(5,2,'2025-12-12 15:11:32','2025-12-12 18:55:10',4,'2025-12-12 14:57:50',11,NULL,'오일 교체',NULL),(6,5,'2025-12-12 15:25:41','2025-12-12 17:01:12',5,'2025-12-12 15:12:04',12,NULL,'앞범퍼 체크',NULL),(7,3,'2025-12-12 15:39:58','2025-12-12 19:12:29',6,'2025-12-12 15:28:31',14,NULL,NULL,NULL),(8,1,'2025-12-12 15:52:44','2025-12-12 19:41:57',7,'2025-12-12 15:41:16',15,NULL,NULL,NULL),(9,4,'2025-12-12 16:03:13','2025-12-12 20:28:45',8,'2025-12-12 15:49:57',16,NULL,NULL,NULL),(10,3,'2025-12-12 16:15:52','2025-12-12 19:07:33',9,'2025-12-12 16:02:11',18,NULL,NULL,NULL),(11,1,'2025-12-12 16:27:11','2025-12-12 21:01:09',10,'2025-12-12 16:12:54',19,NULL,NULL,NULL),(12,2,'2025-12-12 16:38:40','2025-12-12 20:10:47',11,'2025-12-12 16:23:19',20,NULL,'브레이크 상태좀 체크해주세요',NULL),(13,5,'2025-12-12 16:52:53','2025-12-12 21:23:15',12,'2025-12-12 16:41:22',22,NULL,'내부 뒷좌석 등 교체',NULL),(14,4,'2025-12-12 17:03:22','2025-12-12 19:59:48',13,'2025-12-12 16:49:10',23,NULL,NULL,NULL),(15,1,'2025-12-12 17:14:48','2025-12-12 21:55:33',14,'2025-12-12 17:01:02',24,NULL,NULL,NULL),(NULL,3,'2025-12-16 14:29:12','2025-12-16 17:25:32',15,'2025-12-16 14:20:00',5,NULL,NULL,NULL),(NULL,2,'2025-12-16 14:37:44','2025-12-16 17:10:24',16,'2025-12-16 14:26:11',7,NULL,'윈터타이어로 교체',NULL),(NULL,2,'2025-12-16 14:48:05','2025-12-16 18:54:40',17,'2025-12-16 14:35:52',8,NULL,'찌그러진 부분 고쳐주세요',NULL),(NULL,3,'2025-12-16 15:02:19','2025-12-16 18:23:01',18,'2025-12-16 14:48:33',10,NULL,NULL,NULL),(NULL,1,'2025-12-16 15:11:32','2025-12-16 17:25:24',19,'2025-12-16 14:57:50',11,NULL,NULL,NULL),(NULL,3,'2025-12-16 15:37:23','2025-12-16 16:01:23',20,'2025-12-16 15:12:04',12,NULL,NULL,NULL),(NULL,2,'2025-12-16 16:25:04','2025-12-16 21:28:04',21,'2025-12-30 15:28:31',14,NULL,'앞범퍼 상태확인',NULL);
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

-- Dump completed on 2026-01-03 15:26:32

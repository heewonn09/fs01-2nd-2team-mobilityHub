-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mobilityhub
-- ------------------------------------------------------
-- Server version	8.0.21

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `parking_map_edge`;
DROP TABLE IF EXISTS `work_info`;
DROP TABLE IF EXISTS `repair_report`;
DROP TABLE IF EXISTS `stock_status`;
DROP TABLE IF EXISTS `user_car`;
DROP TABLE IF EXISTS `parking`;
DROP TABLE IF EXISTS `image`;
DROP TABLE IF EXISTS `work`;
DROP TABLE IF EXISTS `car`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `parking_map_node`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `admin` (
  `admin_id` varchar(255) NOT NULL,
  `admin_name` varchar(255) NOT NULL,
  `admin_pass` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `car` (
  `car_id` bigint NOT NULL AUTO_INCREMENT,
  `insert_date` datetime DEFAULT NULL,
  `car_model` varchar(255) DEFAULT NULL,
  `car_number` varchar(255) NOT NULL,
  PRIMARY KEY (`car_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `image` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `reg_date` datetime DEFAULT NULL,
  `camera_id` varchar(255) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `ocr_number` varchar(255) DEFAULT NULL,
  `corrected_ocr_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`image_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `parking` (
  `admin_id` varchar(255) DEFAULT NULL,
  `sector_id` char(3) NOT NULL,
  `sector_name` varchar(255) NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`sector_id`),
  KEY `FK9n4ix3n657w0t1g87sckolw0x` (`admin_id`),
  CONSTRAINT `FK9n4ix3n657w0t1g87sckolw0x` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `parking_map_edge` (
  `edge_id` int NOT NULL AUTO_INCREMENT,
  `from_node_id` int NOT NULL,
  `to_node_id` int NOT NULL,
  `direction` varchar(255) NOT NULL,
  PRIMARY KEY (`edge_id`),
  UNIQUE KEY `uk_parking_map_edge_from_to_dir` (`from_node_id`,`to_node_id`,`direction`),
  KEY `fk_parking_map_edge_from` (`from_node_id`),
  KEY `fk_parking_map_edge_to` (`to_node_id`),
  CONSTRAINT `fk_parking_map_edge_from` FOREIGN KEY (`from_node_id`) REFERENCES `parking_map_node` (`node_id`),
  CONSTRAINT `fk_parking_map_edge_to` FOREIGN KEY (`to_node_id`) REFERENCES `parking_map_node` (`node_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `parking_map_node` (
  `node_id` int NOT NULL,
  `node_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`node_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `repair_report` (
  `repair_amount` int NOT NULL,
  `user_car_id` bigint DEFAULT NULL,
  `admin_id` varchar(255) DEFAULT NULL,
  `repair_detail` text,
  `repair_title` varchar(255) DEFAULT NULL,
  `report_id` varchar(255) NOT NULL,
  PRIMARY KEY (`report_id`),
  KEY `FK7ywyyresorl75enang97maeyo` (`admin_id`),
  KEY `FK49iv2mjk37yklrxf6bo8lomn5` (`user_car_id`),
  CONSTRAINT `FK49iv2mjk37yklrxf6bo8lomn5` FOREIGN KEY (`user_car_id`) REFERENCES `user_car` (`id`),
  CONSTRAINT `FK7ywyyresorl75enang97maeyo` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `stock_status` (
  `stock_price` int NOT NULL,
  `stock_quantity` int NOT NULL,
  `update_time` datetime DEFAULT NULL,
  `inventory_id` char(3) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `sector_id` char(3) DEFAULT NULL,
  `stock_category` varchar(255) NOT NULL,
  `stock_units` varchar(255) NOT NULL,
  `min_stock_quantity` int NOT NULL,
  PRIMARY KEY (`inventory_id`),
  KEY `FKej08ugjeniettp0qbmtiyylud` (`sector_id`),
  CONSTRAINT `FKej08ugjeniettp0qbmtiyylud` FOREIGN KEY (`sector_id`) REFERENCES `parking` (`sector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `user` (
  `create_date` datetime DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `user_car` (
  `car_id` bigint NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbiwwtu12d1d614gd5b35tef4x` (`car_id`),
  KEY `FKgs1lsnqcl7dmnbsvc1m8wuy6h` (`user_id`),
  CONSTRAINT `FKbiwwtu12d1d614gd5b35tef4x` FOREIGN KEY (`car_id`) REFERENCES `car` (`car_id`),
  CONSTRAINT `FKgs1lsnqcl7dmnbsvc1m8wuy6h` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `work` (
  `work_id` int NOT NULL AUTO_INCREMENT,
  `work_type` varchar(255) NOT NULL,
  PRIMARY KEY (`work_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `work_info` (
  `image_id` int DEFAULT NULL,
  `work_id` int DEFAULT NULL,
  `entry_time` datetime DEFAULT NULL,
  `exit_time` datetime DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `request_time` datetime DEFAULT NULL,
  `user_car_id` bigint DEFAULT NULL,
  `car_state` int DEFAULT NULL,
  `additional_request` text,
  `sector_id` char(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKtaxpojh0qvwrkl4hxpwaf4afu` (`image_id`),
  UNIQUE KEY `UKeordm0gxactpg36ifpmll8h67` (`sector_id`),
  KEY `FKl80yh9weaiiuh84l4bg5is08n` (`user_car_id`),
  KEY `FK7e3uinn7c438naeg8rlrfc6ev` (`work_id`),
  KEY `FK_work_info_car_state_node_id` (`car_state`),
  CONSTRAINT `FK7e3uinn7c438naeg8rlrfc6ev` FOREIGN KEY (`work_id`) REFERENCES `work` (`work_id`),
  CONSTRAINT `FK_work_info_car_state_node_id` FOREIGN KEY (`car_state`) REFERENCES `parking_map_node` (`node_id`),
  CONSTRAINT `FKkjvlqnkju90vy48jjw6ta71rt` FOREIGN KEY (`image_id`) REFERENCES `image` (`image_id`),
  CONSTRAINT `FKl80yh9weaiiuh84l4bg5is08n` FOREIGN KEY (`user_car_id`) REFERENCES `user_car` (`id`),
  CONSTRAINT `FKlu817s6o8af70dahlltlo6bi3` FOREIGN KEY (`sector_id`) REFERENCES `parking` (`sector_id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

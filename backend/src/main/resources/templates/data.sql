-- Full seed data (idempotent) derived from Dump20251213.sql

INSERT INTO `admin` (`admin_id`, `admin_name`, `admin_pass`, `email`, `phone`) VALUES
  ('Padmin','Parking Manager','1234','tadmin@test.com','010-1111-1111'),
  ('Radmin','Repair Manager','1234','radmin@test.com','010-3333-3333'),
  ('Tadmin','Super Manager','1234','sadmin@test.com','010-4444-4444'),
  ('Wadmin','Wash Manager','1234','wadmin@test.com','010-2222-2222')
ON DUPLICATE KEY UPDATE
  `admin_name` = VALUES(`admin_name`),
  `admin_pass` = VALUES(`admin_pass`),
  `email` = VALUES(`email`),
  `phone` = VALUES(`phone`);

INSERT INTO `car` (`car_id`, `insert_date`, `car_model`, `car_number`) VALUES
  (1,'2025-12-13 10:24:48','Hyundai Sonata','12가1111'),
  (2,'2025-12-13 10:24:48','Kia K5','34나2222'),
  (3,'2025-12-13 10:24:48','BMW X5','56다3333'),
  (4,'2025-12-13 10:24:48','Tesla Model 3','78라4444'),
  (5,'2025-12-13 10:40:01','Hyundai Avante','11가5001'),
  (6,'2025-12-13 10:40:01','Kia Morning','22나5002'),
  (7,'2025-12-13 10:40:01','Hyundai Tucson','33다5003'),
  (8,'2025-12-13 10:40:01','Kia Sorento','44라5004'),
  (9,'2025-12-13 10:40:01','Genesis G80','55마5005'),
  (10,'2025-12-13 10:40:01','BMW 320d','66바5006'),
  (11,'2025-12-13 10:40:01','Audi A6','77사5007'),
  (12,'2025-12-13 10:40:01','Benz E250','88아5008'),
  (13,'2025-12-13 10:40:01','Hyundai Kona','99자5009'),
  (14,'2025-12-13 10:40:01','Kia Carnival','10차5010'),
  (15,'2025-12-13 10:40:01','Tesla Y','12카5011'),
  (16,'2025-12-13 10:40:01','Volvo XC60','13타5012'),
  (17,'2025-12-13 10:40:01','Mini Cooper','14파5013'),
  (18,'2025-12-13 10:40:01','Hyundai Ioniq 6','15하5014'),
  (19,'2025-12-13 10:40:01','Kia EV6','16허5015'),
  (20,'2025-12-13 10:40:01','Hyundai Palisade','17호5016'),
  (21,'2025-12-13 10:40:01','Kia Stinger','18흐5017'),
  (22,'2025-12-13 10:40:01','BMW X3','19하5018'),
  (23,'2025-12-13 10:40:01','Mercedes GLC','20허5019'),
  (24,'2025-12-13 10:40:01','Genesis GV70','21호5020')
ON DUPLICATE KEY UPDATE
  `insert_date` = VALUES(`insert_date`),
  `car_model` = VALUES(`car_model`),
  `car_number` = VALUES(`car_number`);

INSERT INTO `image` (`image_id`, `reg_date`, `camera_id`, `image_path`, `ocr_number`, `corrected_ocr_number`) VALUES
  (1,'2025-12-13 10:24:55','CAM01','/images/1.jpg',NULL,NULL),
  (2,'2025-12-13 10:24:55','CAM02','/images/2.jpg',NULL,NULL),
  (3,'2025-12-13 10:24:55','CAM03','/images/3.jpg',NULL,NULL),
  (4,'2025-12-13 10:24:55','CAM04','/images/4.jpg',NULL,NULL),
  (5,'2025-12-13 10:24:55','CAM05','/images/5.jpg',NULL,NULL),
  (6,'2025-12-13 10:24:55','CAM06','/images/6.jpg',NULL,NULL),
  (7,'2025-12-13 10:24:55','CAM07','/images/7.jpg',NULL,NULL),
  (8,'2025-12-13 10:24:55','CAM08','/images/8.jpg',NULL,NULL),
  (9,'2025-12-13 10:24:55','CAM09','/images/9.jpg',NULL,NULL),
  (10,'2025-12-13 10:24:55','CAM10','/images/10.jpg',NULL,NULL),
  (11,'2025-12-13 10:24:55','CAM11','/images/11.jpg',NULL,NULL),
  (12,'2025-12-13 10:24:55','CAM12','/images/12.jpg',NULL,NULL),
  (13,'2025-12-13 10:24:55','CAM13','/images/13.jpg',NULL,NULL),
  (14,'2025-12-13 10:24:55','CAM14','/images/14.jpg',NULL,NULL),
  (15,'2025-12-13 10:24:55','CAM15','/images/15.jpg',NULL,NULL),
  (16,'2025-12-13 10:40:09','CAM16','/images/16.jpg',NULL,NULL),
  (17,'2025-12-13 10:40:09','CAM17','/images/17.jpg',NULL,NULL),
  (18,'2025-12-13 10:40:09','CAM18','/images/18.jpg',NULL,NULL),
  (19,'2025-12-13 10:40:09','CAM19','/images/19.jpg',NULL,NULL),
  (20,'2025-12-13 10:40:09','CAM20','/images/20.jpg',NULL,NULL),
  (21,'2025-12-13 10:40:09','CAM21','/images/21.jpg',NULL,NULL),
  (22,'2025-12-13 10:40:09','CAM22','/images/22.jpg',NULL,NULL),
  (23,'2025-12-13 10:40:09','CAM23','/images/23.jpg',NULL,NULL),
  (24,'2025-12-13 10:40:09','CAM24','/images/24.jpg',NULL,NULL),
  (25,'2025-12-13 10:40:09','CAM25','/images/25.jpg',NULL,NULL),
  (26,'2025-12-13 10:40:09','CAM26','/images/26.jpg',NULL,NULL),
  (27,'2025-12-13 10:40:09','CAM27','/images/27.jpg',NULL,NULL),
  (28,'2025-12-13 10:40:09','CAM28','/images/28.jpg',NULL,NULL),
  (29,'2025-12-13 10:40:09','CAM29','/images/29.jpg',NULL,NULL),
  (30,'2025-12-13 10:40:09','CAM30','/images/30.jpg',NULL,NULL)
ON DUPLICATE KEY UPDATE
  `reg_date` = VALUES(`reg_date`),
  `camera_id` = VALUES(`camera_id`),
  `image_path` = VALUES(`image_path`),
  `ocr_number` = VALUES(`ocr_number`),
  `corrected_ocr_number` = VALUES(`corrected_ocr_number`);

INSERT INTO `parking` (`admin_id`, `sector_id`, `sector_name`, `state`) VALUES
  ('Padmin','P01','주차 1구역','EMPTY'),
  ('Padmin','P02','주차 2구역','EMPTY'),
  ('Padmin','P03','주차 3구역','EMPTY'),
  ('Radmin','R01','정비 3구역','EMPTY'),
  ('Wadmin','W01','세차 2구역','EMPTY')
ON DUPLICATE KEY UPDATE
  `admin_id` = VALUES(`admin_id`),
  `sector_name` = VALUES(`sector_name`),
  `state` = VALUES(`state`);

INSERT INTO `stock_status` (`stock_price`, `stock_quantity`, `update_time`, `inventory_id`, `product_name`, `sector_id`, `stock_category`, `stock_units`, `min_stock_quantity`) VALUES
  (8000,120,'2025-12-12 10:01:01','A01','세차 수건','R01','소모품','EA',50),
  (18000,45,'2025-12-12 10:02:12','A02','엔진오일 5W30','R01','정비부품','L',30),
  (12000,200,'2025-12-12 10:03:33','A03','광택 패드','R01','소모품','EA',50),
  (45000,33,'2025-12-12 10:04:44','A04','브레이크 패드','R01','정비부품','EA',30),
  (7000,80,'2025-12-12 10:05:55','A05','유리세정제','R01','소모품','L',50),
  (95000,15,'2025-12-12 10:06:06','A06','배터리(60Ah)','R01','정비부품','EA',20),
  (9000,50,'2025-12-12 10:07:07','A07','와이퍼 550mm','R01','정비부품','EA',30),
  (8000,100,'2025-12-12 10:08:08','A08','타이어 광택제','R01','소모품','L',50),
  (11000,28,'2025-12-12 10:09:09','A09','에어필터','R01','정비부품','EA',25),
  (6000,75,'2025-12-12 10:10:10','A10','휠 브러시','R01','소모품','EA',30)
ON DUPLICATE KEY UPDATE
  `stock_price` = VALUES(`stock_price`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `update_time` = VALUES(`update_time`),
  `product_name` = VALUES(`product_name`),
  `sector_id` = VALUES(`sector_id`),
  `stock_category` = VALUES(`stock_category`),
  `stock_units` = VALUES(`stock_units`);

INSERT INTO `user` (`create_date`, `phone_number`, `role`, `user_id`, `user_name`, `user_password`) VALUES
  ('2025-12-13 10:24:46','010-1234-1234','USER','user1','Kim','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0010','USER','user10','Hwang','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0011','USER','user11','Shin','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0012','USER','user12','Na','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0013','USER','user13','Baek','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0014','USER','user14','Oh','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0015','USER','user15','Kang','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0016','USER','user16','Moon','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0017','USER','user17','Ha','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0018','USER','user18','Jo','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0019','USER','user19','Ahn','{noop}1234'),
  ('2025-12-13 10:24:46','010-5364-6432','USER','user2','Lee','{noop}1234'),
  ('2025-12-13 10:24:46','010-2345-8652','USER','user3','Park','{noop}1234'),
  ('2025-12-13 10:24:46','010-9563-0654','USER','user4','Choi','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0005','USER','user5','Jung','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0006','USER','user6','Han','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0007','USER','user7','Seo','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0008','USER','user8','Yoo','{noop}1234'),
  ('2025-12-13 10:24:46','010-6000-0009','USER','user9','Im','{noop}1234')
ON DUPLICATE KEY UPDATE
  `create_date` = VALUES(`create_date`),
  `phone_number` = VALUES(`phone_number`),
  `role` = VALUES(`role`),
  `user_name` = VALUES(`user_name`),
  `user_password` = VALUES(`user_password`);

INSERT INTO `user_car` (`car_id`, `id`, `user_id`) VALUES
  (2,1,'user2'),
  (3,2,'user3'),
  (1,3,'user3'),
  (4,4,'user4'),
  (5,5,'user5'),
  (6,6,'user5'),
  (7,7,'user6'),
  (8,8,'user7'),
  (12,9,'user7'),
  (6,10,'user8'),
  (9,11,'user9'),
  (10,12,'user10'),
  (11,13,'user10'),
  (12,14,'user11'),
  (13,15,'user12'),
  (14,16,'user13'),
  (15,17,'user13'),
  (5,18,'user14'),
  (16,19,'user15'),
  (17,20,'user16'),
  (9,21,'user16'),
  (18,22,'user17'),
  (19,23,'user18'),
  (20,24,'user19'),
  (21,25,'user19')
ON DUPLICATE KEY UPDATE
  `car_id` = VALUES(`car_id`),
  `user_id` = VALUES(`user_id`);

INSERT INTO `work` (`work_id`, `work_type`) VALUES
  (1,'park'),
  (2,'repair'),
  (3,'carwash'),
  (4,'park,carwash'),
  (5,'park,repair')
ON DUPLICATE KEY UPDATE
  `work_type` = VALUES(`work_type`);

INSERT INTO `parking_map_node` (`node_id`, `node_name`) VALUES
  (1, '입구'),
  (2, '기점_1'),
  (3, '기점_2'),
  (4, '기점_3'),
  (5, '주차_1'),
  (6, '기점_4'),
  (7, '주차_2'),
  (8, '기점_5'),
  (9, '주차_3'),
  (10, '세차_1'),
  (12, '기점_6'),
  (13, '정비_1'),
  (14, '기점_7'),
  (15, '기점_8'),
  (16, '기점_9'),
  (17, '기점_10'),
  (18, '기점_11'),
  (19, '기점_12'),
  (20, '출구'),
  (21, '기점_13'),
  (22, '기점_14'),
  (23, '기점_15')
ON DUPLICATE KEY UPDATE `node_name` = VALUES(`node_name`);

INSERT IGNORE INTO `parking_map_edge` (`from_node_id`, `to_node_id`, `direction`) VALUES
  (1, 2, '직진'),
  (2, 3, '좌회전'),
  (2, 10, '직진'),
  (2, 12, '우회전'),
  (3, 4, '우회전'),
  (4, 5, '좌회전'),
  (4, 6, '직진'),
  (6, 7, '좌회전'),
  (6, 8, '직진'),
  (8, 9, '좌회전'),
  (8, 16, '직진'),
  (16, 17, '좌회전'),
  (17, 18, '좌회전'),
  (18, 19, '좌회전'),
  (19, 20, '우회전'),
  (10, 15, '직진'),
  (15, 17, '좌회전'),
  (12, 13, '좌회전'),
  (13, 14, '직진'),
  (14, 17, '좌회전'),
  (5, 23, '직진'),
  (7, 22, '직진'),
  (9, 21, '직진'),
  (21, 18, '좌회전'),
  (22, 18, '좌회전'),
  (23, 18, '좌회전');

INSERT INTO `work_info` (`image_id`, `work_id`, `entry_time`, `exit_time`, `id`, `request_time`, `user_car_id`, `car_state`, `sector_id`) VALUES
  (1,1,'2025-12-12 14:29:12','2025-12-12 15:41:55',55,'2025-12-12 14:20:00',5,10,NULL),
  (2,3,'2025-12-12 14:37:44','2025-12-12 17:12:31',56,'2025-12-12 14:26:11',7,NULL,NULL),
  (3,4,'2025-12-12 14:48:05','2025-12-12 18:22:14',57,'2025-12-12 14:35:52',8,NULL,NULL),
  (4,1,'2025-12-12 15:02:19','2025-12-12 17:49:03',58,'2025-12-12 14:48:33',10,NULL,NULL),
  (5,2,'2025-12-12 15:11:32','2025-12-12 18:55:10',59,'2025-12-12 14:57:50',11,NULL,NULL),
  (6,5,'2025-12-12 15:25:41','2025-12-12 17:01:12',60,'2025-12-12 15:12:04',12,NULL,NULL),
  (7,3,'2025-12-12 15:39:58','2025-12-12 19:12:29',61,'2025-12-12 15:28:31',14,NULL,NULL),
  (8,1,'2025-12-12 15:52:44','2025-12-12 19:41:57',62,'2025-12-12 15:41:16',15,NULL,NULL),
  (9,4,'2025-12-12 16:03:13','2025-12-12 20:28:45',63,'2025-12-12 15:49:57',16,NULL,NULL),
  (10,3,'2025-12-12 16:15:52','2025-12-12 19:07:33',64,'2025-12-12 16:02:11',18,NULL,NULL),
  (11,1,'2025-12-12 16:27:11','2025-12-12 21:01:09',65,'2025-12-12 16:12:54',19,NULL,NULL),
  (12,2,'2025-12-12 16:38:40','2025-12-12 20:10:47',66,'2025-12-12 16:23:19',20,NULL,NULL),
  (13,5,'2025-12-12 16:52:53','2025-12-12 21:23:15',67,'2025-12-12 16:41:22',22,NULL,NULL),
  (14,4,'2025-12-12 17:03:22','2025-12-12 19:59:48',68,'2025-12-12 16:49:10',23,NULL,NULL),
  (15,1,'2025-12-12 17:14:48','2025-12-12 21:55:33',69,'2025-12-12 17:01:02',24,NULL,NULL)
ON DUPLICATE KEY UPDATE
  `image_id` = VALUES(`image_id`),
  `work_id` = VALUES(`work_id`),
  `entry_time` = VALUES(`entry_time`),
  `exit_time` = VALUES(`exit_time`),
  `request_time` = VALUES(`request_time`),
  `user_car_id` = VALUES(`user_car_id`),
  `car_state` = VALUES(`car_state`),
  `sector_id` = VALUES(`sector_id`);

INSERT INTO `repair_report` (`repair_amount`, `user_car_id`, `admin_id`, `repair_detail`, `repair_title`, `report_id`) VALUES
  (55000,1,'Radmin','배터리 점검 및 단자 세척 작업 완료.','배터리 점검','20251212142055'),
  (125000,3,'Radmin','엔진오일과 오일필터 교체 완료.','엔진오일 교체','20251212142314'),
  (98000,5,'Radmin','브레이크 패드 교체 및 작동 테스트 완료.','브레이크 패드 교체','20251212142548'),
  (200000,7,'Radmin','타이어 2개 교체 및 밸런싱 작업 수행.','타이어 교체','20251212142833'),
  (75000,8,'Radmin','와이퍼 교체 및 워셔액 보충.','와이퍼 교체','20251212143107'),
  (45000,2,'Radmin','실내 클리닝 및 항균 소독.','실내 클리닝','20251212143355'),
  (135000,4,'Radmin','냉각수 보충 및 라디에이터 점검.','냉각수 점검','20251212143641'),
  (220000,9,'Radmin','전면 유리 교체 및 누수 테스트 완료.','전면 유리 교체','20251212143922'),
  (65000,10,'Radmin','타이어 공기압 조정 및 마모도 점검.','타이어 점검','20251212144210'),
  (118000,6,'Radmin','점화 플러그 교체 및 출력 정상 확인.','점화 플러그 교체','20251212144459')
ON DUPLICATE KEY UPDATE
  `repair_amount` = VALUES(`repair_amount`),
  `user_car_id` = VALUES(`user_car_id`),
  `admin_id` = VALUES(`admin_id`),
  `repair_detail` = VALUES(`repair_detail`),
  `repair_title` = VALUES(`repair_title`);

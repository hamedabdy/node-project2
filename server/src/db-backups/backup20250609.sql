/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: node-project
-- ------------------------------------------------------
-- Server version	10.11.11-MariaDB-0+deb12u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sys_db_object`
--

DROP TABLE IF EXISTS `sys_db_object`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_db_object` (
  `sys_id` varchar(32) NOT NULL,
  `sys_created_by` varchar(40) NOT NULL,
  `sys_updated_by` varchar(40) NOT NULL,
  `sys_class_name` varchar(80) NOT NULL,
  `sys_name` varchar(255) DEFAULT NULL,
  `sys_mod_count` varchar(6) NOT NULL,
  `sys_update_name` varchar(255) DEFAULT NULL,
  `name` varchar(80) DEFAULT NULL,
  `label` varchar(80) DEFAULT NULL,
  `super_class` varchar(32) DEFAULT NULL,
  `sys_created_on` datetime NOT NULL,
  `sys_updated_on` datetime NOT NULL,
  `sys_scope` varchar(32) DEFAULT NULL,
  `sys_policy` varchar(40) DEFAULT NULL,
  `sys_package` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`sys_id`),
  UNIQUE KEY `sys_id` (`sys_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_db_object`
--

LOCK TABLES `sys_db_object` WRITE;
/*!40000 ALTER TABLE `sys_db_object` DISABLE KEYS */;
INSERT INTO `sys_db_object` VALUES
('1744788797415101b4ef71bd88240b9b','system','system','sys_db_object','Dictionary Entry','0','sys_db_object_1744788797415101b4ef71bd88240b9b','sys_dictionary','Dictionary Entry','sys_metadata','2024-03-26 21:35:17','2024-03-26 21:35:17',NULL,NULL,NULL),
('964419cb15cd5062b2676569b7ba076d','system','system','sys_db_object','Table','0','sys_db_object_964419cb15cd5062b2676569b7ba076d','sys_db_object','Table','sys_metadata','2024-03-26 21:35:17','2024-03-26 21:35:17',NULL,NULL,NULL),
('ea3a9531b3ea5377ac7668e37493e418','system','system','sys_db_object','Field class','0','sys_db_object_ea3a9531b3ea5377ac7668e37493e418','sys_glide_object','Field class','sys_metadata','2024-03-26 21:35:17','2024-03-26 21:35:17',NULL,NULL,NULL),
('fe78c815242c5bc0ac401dd0c5fc712d','system','system','sys_db_object','Application File','0','sys_db_object_fe78c815242c5bc0ac401dd0c5fc712d','sys_metadata','Application',NULL,'2024-03-26 21:35:17','2024-03-26 21:35:17',NULL,NULL,NULL);
/*!40000 ALTER TABLE `sys_db_object` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_dictionary`
--

DROP TABLE IF EXISTS `sys_dictionary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_dictionary` (
  `sys_id` varchar(32) NOT NULL DEFAULT '0',
  `sys_created_by` varchar(40) NOT NULL,
  `sys_updated_by` varchar(40) NOT NULL,
  `sys_class_name` varchar(80) NOT NULL,
  `sys_name` varchar(255) DEFAULT NULL,
  `sys_mod_count` varchar(6) NOT NULL,
  `sys_update_name` varchar(255) DEFAULT NULL,
  `element` varchar(80) DEFAULT NULL,
  `column_label` varchar(80) DEFAULT NULL,
  `internal_type` varchar(32) DEFAULT NULL,
  `name` varchar(80) DEFAULT NULL,
  `reference` varchar(32) DEFAULT NULL,
  `default_value` varchar(80) DEFAULT NULL,
  `max_length` int(6) DEFAULT NULL,
  `attrributes` varchar(1000) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `display` tinyint(1) DEFAULT NULL,
  `mandatory` tinyint(1) DEFAULT NULL,
  `unique` tinyint(1) DEFAULT NULL,
  `sys_created_on` datetime NOT NULL,
  `sys_updated_on` datetime NOT NULL,
  `sys_scope` varchar(32) DEFAULT NULL,
  `sys_policy` varchar(40) DEFAULT NULL,
  `sys_package` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`sys_id`),
  UNIQUE KEY `sys_id` (`sys_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_dictionary`
--

LOCK TABLES `sys_dictionary` WRITE;
/*!40000 ALTER TABLE `sys_dictionary` DISABLE KEYS */;
INSERT INTO `sys_dictionary` VALUES
('06838797899858868c960afdf814a079','system','system','sys_dictionary','test','0',NULL,NULL,NULL,'collection','test',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,'2025-02-08 21:54:47','2025-02-08 21:54:47',NULL,NULL,NULL),
('0999748a21b853f0ae93be8289b88d92','system','system','sys_dictionary','sys_glide_object','0',NULL,'sys_updated_by','Updated by','string','sys_glide_object',NULL,NULL,40,NULL,1,NULL,NULL,NULL,'2024-03-25 16:23:03','2024-03-25 16:23:03',NULL,NULL,NULL),
('0e80ab516e1a5e27bd47e54e7c999192','system','system','sys_dictionary','sys_metadata','0',NULL,'sys_scope','Scope','string','sys_metadata',NULL,NULL,32,NULL,1,NULL,NULL,NULL,'2024-03-25 16:05:00','2024-03-25 16:05:00',NULL,NULL,NULL),
('1234f2056e2e5ae0af378f04d18256c0','system','system','sys_dictionary','sys_dictionary','0',NULL,'display','Display','boolean','sys_dictionary',NULL,NULL,1,NULL,1,NULL,NULL,NULL,'2024-02-22 22:35:14','2024-02-22 22:35:14',NULL,NULL,NULL),
('1329f45f187853d1bf19c9e0c9aa6e05','system','system','sys_dictionary','sys_glide_object','0',NULL,'label','Label','string','sys_glide_object',NULL,NULL,255,NULL,1,NULL,NULL,NULL,'2024-03-25 16:31:31','2024-03-25 16:31:31',NULL,NULL,NULL),
('15e239c8943351e19fb28d5f8f0ceb87','system','system','sys_dictionary','sys_glide_object','0',NULL,'use_original_value','Use original value','boolean','sys_glide_object',NULL,NULL,2,NULL,1,NULL,1,NULL,'2024-03-25 17:07:58','2024-03-25 17:07:58',NULL,NULL,NULL),
('1e82732cf4dd5175af52818fac0d0d3f','system','system','sys_dictionary','test','0',NULL,NULL,NULL,'collection','test',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,'2025-02-08 21:59:30','2025-02-08 21:59:30',NULL,NULL,NULL),
('228ea207d6a45f3ab406aa727eef326e','system','system','sys_dictionary','sys_db_object','0',NULL,'sys_created_by','Created by','string','sys_db_object',NULL,NULL,40,NULL,1,NULL,1,NULL,'2024-03-23 22:28:55','2024-03-25 14:43:56',NULL,NULL,NULL),
('2402d6c9003e54f299a7280d82e0eb69','system','system','sys_dictionary','test','0',NULL,NULL,NULL,'collection','test',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,'2025-02-08 21:37:25','2025-02-08 21:37:25',NULL,NULL,NULL),
('27d3d8cf04985836926b63ec6bf35c6b','system','system','sys_dictionary','sys_dictionary','0',NULL,'sys_scope','Scope','string','sys_dictionary',NULL,NULL,32,NULL,1,NULL,NULL,NULL,'2024-02-22 22:07:37','2024-02-25 21:00:42',NULL,NULL,NULL),
('2cd66be07e095606abec28adb549ae68','system','system','sys_dictionary','sys_metadata','0',NULL,'sys_name','Display name','string','sys_metadata',NULL,NULL,255,NULL,1,NULL,NULL,NULL,'2024-03-25 16:04:09','2024-03-25 16:20:32',NULL,NULL,NULL),
('3527e4d02a9755d7b642a115e57ed42c','system','system','sys_dictionary','sys_dictionary','0',NULL,'sys_update_name','Update','string','sys_dictionary',NULL,NULL,255,NULL,1,NULL,NULL,NULL,'2024-02-22 22:09:19','2024-02-22 22:09:19',NULL,NULL,NULL),
('35402c8677b25f99b2ccb78d58877ef8','system','system','sys_dictionary','sys_glide_object','0',NULL,'sys_name','Display name','string','sys_glide_object',NULL,NULL,255,NULL,1,NULL,NULL,NULL,'2024-03-25 16:24:23','2024-03-25 16:24:23',NULL,NULL,NULL),
('36e7c3236ffe5a12ac7e83936f137f66','system','system','sys_dictionary','sys_db_object','0',NULL,'label','Label','string','sys_db_object',NULL,NULL,255,NULL,1,NULL,NULL,NULL,'2024-03-25 15:53:27','2024-03-25 15:53:27',NULL,NULL,NULL),
('3df03290b2b857148d462134f98e73ec','system','system','sys_dictionary','sys_metadata','0',NULL,'sys_created_on','Created','datetime','sys_metadata',NULL,NULL,6,NULL,1,NULL,NULL,NULL,'2024-03-25 16:17:06','2024-03-25 16:17:06',NULL,NULL,NULL),
('3f7db7d288865343a3017231ebeebdb0','system','system','sys_dictionary','sys_dictionary','0',NULL,'sys_policy','Policy','string','sys_dictionary',NULL,NULL,40,NULL,1,NULL,NULL,NULL,'2024-02-22 22:10:14','2024-02-22 22:10:14',NULL,NULL,NULL),
('3fa68c9e3dca542e817ff6068f413341','system','system','sys_dictionary','test','0',NULL,NULL,NULL,'collection','test',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,'2025-02-08 21:57:52','2025-02-08 21:57:52',NULL,NULL,NULL),
('40d8e0565c6d5c3c907538a705776aba','system','system','sys_dictionary','sys_metadata','0',NULL,'sys_updated_on','Updated','datetime','sys_metadata',NULL,NULL,6,NULL,1,NULL,1,NULL,'2024-03-25 16:16:06','2024-03-25 16:16:06',NULL,NULL,NULL),
('4343418974ca59ef826d42262f8cca96','system','system','sys_dictionary','sys_dictionary','0',NULL,'sys_updated_by','Updated by','string','sys_dictionary',NULL,NULL,40,NULL,1,NULL,NULL,NULL,'2024-02-22 21:59:49','2024-03-25 14:47:20',NULL,NULL,NULL),
('4625994977d250e9834ee75bcbb1b383','system','system','sys_dictionary','sys_glide_object','0',NULL,'sys_mod_count','Updates','number','sys_glide_object',NULL,NULL,6,NULL,1,NULL,NULL,NULL,'2024-03-25 16:24:53','2024-03-25 16:24:53',NULL,NULL,NULL),
('4cabb881be405c6584deebc7e1ada739','system','system','sys_dictionary','sys_metadata','0',NULL,'sys_update_name','Update','string','sys_metadata',NULL,NULL,255,NULL,1,NULL,NULL,NULL,'2024-03-25 16:04:32','2024-03-25 16:04:32',NULL,NULL,NULL),
('4f146585d97c519ba83f8f07c317f807','system','system','sys_dictionary','sys_glide_object','0',NULL,'sys_created_by','Created by','string','sys_glide_object',NULL,NULL,40,NULL,1,NULL,1,NULL,'2024-03-25 16:22:48','2024-03-25 16:22:48',NULL,NULL,NULL),
('52ec5c0d69e6552083afe3c176cd8fa8','system','system','sys_dictionary','sys_dictionary','0',NULL,'sys_package','Package','string','sys_dictionary',NULL,NULL,32,NULL,1,NULL,1,NULL,'2024-03-25 16:59:38','2024-03-25 16:59:38',NULL,NULL,NULL),
('59313c2eba9656f5a8043b29112e8b5f','system','system','sys_dictionary','sys_metadata','0',NULL,'sys_class_name','Class','string','sys_metadata',NULL,NULL,80,NULL,1,NULL,NULL,NULL,'2024-03-25 16:01:04','2024-03-25 16:01:04',NULL,NULL,NULL),
('5afa91e94ff255e1b3be26a07826557e','system','system','sys_dictionary','sys_glide_object','0',NULL,'visible','Visible','boolean','sys_glide_object',NULL,NULL,2,NULL,1,NULL,1,NULL,'2024-03-25 18:19:16','2024-03-25 18:19:16',NULL,NULL,NULL),
('5f5f4024e3c851cf9c24b0f6c59ebf13','system','system','sys_dictionary','sys_dictionary','0',NULL,'sys_name','Display name','string','sys_dictionary',NULL,NULL,255,NULL,1,NULL,NULL,NULL,'2024-02-22 22:03:59','2024-03-25 16:21:14',NULL,NULL,NULL),
('66a346eea7bd5a349bc387217ac83491','system','system','sys_dictionary','sys_metadata','0',NULL,'sys_id','Sys ID','string','sys_metadata',NULL,NULL,32,NULL,1,NULL,1,NULL,'2024-03-25 15:59:26','2024-03-25 15:59:26',NULL,NULL,NULL),
('6e2891df5a81593bb4af1322de9bbbc9','system','system','sys_dictionary','sys_glide_object','0',NULL,'sys_update_name','Update','string','sys_glide_object',NULL,NULL,255,NULL,1,NULL,NULL,NULL,'2024-03-25 16:27:28','2024-03-25 16:27:28',NULL,NULL,NULL),
('6e3f1c9763d8532a8faa6e90df510653','system','system','sys_dictionary','sys_dictionary','0',NULL,'unique','Unique','boolean','sys_dictionary',NULL,NULL,1,NULL,1,NULL,NULL,NULL,'2024-02-22 22:36:34','2024-02-22 22:36:34',NULL,NULL,NULL),
('73ad6075c71e5afdb1c347d5bc588d27','system','system','sys_dictionary','sys_glide_object','0',NULL,'name','Name','string','sys_glide_object',NULL,NULL,255,NULL,1,NULL,NULL,NULL,'2024-03-25 16:31:19','2024-03-25 16:31:19',NULL,NULL,NULL),
('75198bd88e72516ca3bd5d4dba3eb3d9','system','system','sys_dictionary','sys_glide_object','0',NULL,'sys_policy','Protection policy','string','sys_glide_object',NULL,NULL,32,NULL,1,NULL,NULL,NULL,'2024-03-25 16:27:48','2024-03-25 16:27:48',NULL,NULL,NULL),
('7698154cf6e458e18af12979fa7de549','system','system','sys_dictionary','sys_dictionary','0',NULL,'name','Table','string','sys_dictionary','sys_db_object',NULL,80,NULL,1,NULL,1,NULL,'2024-02-22 22:25:35','2024-02-22 22:25:35',NULL,NULL,NULL),
('77fa940842c656a99d8de4710cb82b0e','system','system','sys_dictionary','sys_glide_object','0',NULL,'attributes','Attributes','string','sys_glide_object',NULL,NULL,32,NULL,1,NULL,1,NULL,'2024-03-25 17:05:24','2024-03-25 17:05:24',NULL,NULL,NULL),
('7975133d5d665926ab1a5b8e40129ac8','system','system','sys_dictionary','sys_dictionary','0',NULL,'active','Active','boolean','sys_dictionary',NULL,'true',1,NULL,1,NULL,NULL,NULL,'2024-02-22 22:34:15','2024-03-04 22:27:05',NULL,NULL,NULL),
('7ca9611acf6d5fe5815c3c1b96764334','system','system','sys_dictionary','task','0',NULL,'assignment_group','Assignment group','string','task','sys_user_group',NULL,80,NULL,1,NULL,0,NULL,'2024-02-17 19:40:51','2024-02-22 22:13:05',NULL,NULL,NULL),
('80e723bdcf9b554ba85363fb01937520','system','system','sys_dictionary','sys_dictionary','0',NULL,'column_label','Column label','string','sys_dictionary',NULL,NULL,80,NULL,1,NULL,1,NULL,'2024-02-22 22:15:01','2024-02-22 22:15:01',NULL,NULL,NULL),
('826d546bacf25aa3b255a9c7d14452ab','system','system','sys_dictionary','sys_dictionary','0',NULL,'attrributes','Attributes','string','sys_dictionary',NULL,NULL,1000,NULL,1,NULL,NULL,NULL,'2024-02-22 22:33:14','2024-02-22 22:33:14',NULL,NULL,NULL),
('84e437f8f270556aa4d5be9f0806b1f5','system','system','sys_dictionary','sys_db_object','0',NULL,'sys_policy','Policy','string','sys_db_object',NULL,NULL,40,NULL,1,NULL,NULL,NULL,'2024-03-25 15:51:40','2024-03-25 15:51:40',NULL,NULL,NULL),
('88b8860cb1835f98903e4d69f2efe7b8','system','system','sys_dictionary','sys_dictionary','0',NULL,'mandatory','Mandatory','boolean','sys_dictionary',NULL,NULL,1,NULL,1,NULL,NULL,NULL,'2024-02-22 22:36:07','2024-02-22 22:36:07',NULL,NULL,NULL),
('8f14c19c716a514bbce299a9901dbde3','system','system','sys_dictionary','test','0',NULL,NULL,NULL,'collection','test',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,'2025-02-28 19:58:51','2025-02-28 19:58:51',NULL,NULL,NULL),
('908cfdb9ded3528581a078e79b2d6544','system','system','sys_dictionary','task','0',NULL,'active','Active','boolean','task','','true',1,NULL,1,NULL,0,NULL,'2024-02-25 22:18:30','2024-02-25 22:18:30',NULL,NULL,NULL),
('95205600b190555ca6c4337ecd127e10','system','system','sys_dictionary','sys_db_object','0',NULL,'name','Name','string','sys_db_object',NULL,NULL,255,NULL,1,NULL,NULL,NULL,'2024-03-25 16:29:48','2024-03-25 16:29:48',NULL,NULL,NULL),
('95bf4ac569215ca5aab11b13f9af6171','system','system','sys_dictionary','sys_dictionary','0',NULL,'reference','Reference','string','sys_dictionary','sys_db_object',NULL,80,NULL,1,NULL,NULL,NULL,'2024-02-22 22:27:58','2024-02-22 22:27:58',NULL,NULL,NULL),
('99f9382b3d275f02af6324103395ffa6','system','system','sys_dictionary','task','0',NULL,'caller','Caller','string','task',NULL,NULL,40,NULL,1,NULL,NULL,NULL,'2024-03-19 05:40:58','2024-03-19 05:40:58',NULL,NULL,NULL),
('9bb9c789cf575c8a9cc0b36918736746','system','system','sys_dictionary','sys_glide_object','0',NULL,'sys_package','Package','string','sys_glide_object',NULL,NULL,32,NULL,1,NULL,1,NULL,'2024-03-25 16:54:41','2024-03-25 16:54:41',NULL,NULL,NULL),
('9d22bdb217035cd9b985acae54444bdf','system','system','sys_dictionary','sys_dictionary','0',NULL,'element','Column name','string','sys_dictionary',NULL,NULL,80,NULL,1,NULL,1,NULL,'2024-02-22 21:53:40','2024-02-22 21:53:40',NULL,NULL,NULL),
('9e5d7a19f09a5b088136f1a454c87558','system','system','sys_dictionary','sys_db_object','0',NULL,'sys_updated_by','Updated by','string','sys_db_object',NULL,NULL,40,NULL,1,NULL,1,NULL,'2024-03-23 22:29:42','2024-03-25 14:44:15',NULL,NULL,NULL),
('9f17671e10f954fb9787998d9fa83c6e','system','system','sys_dictionary','sys_db_object','0',NULL,'sys_id','Sys ID','string','sys_db_object',NULL,NULL,32,NULL,1,NULL,1,NULL,'2024-03-23 22:12:07','2024-03-23 22:12:07',NULL,NULL,NULL),
('a4bc8f0640be55ef82b13670ef4531d5','system','system','sys_dictionary','test','0',NULL,NULL,NULL,'collection','test',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,'2025-02-08 21:56:42','2025-02-08 21:56:42',NULL,NULL,NULL),
('a82035745a0151c69d691d74021f9af3','system','system','sys_dictionary','sys_glide_object','0',NULL,'sys_class_name','Class','string','sys_glide_object',NULL,NULL,80,NULL,1,NULL,NULL,NULL,'2024-03-25 16:23:36','2024-03-25 16:23:36',NULL,NULL,NULL),
('b04ead5fbb1f58bc9aaf77827cb12f91','system','system','sys_dictionary','sys_dictionary','0',NULL,'max_length','Maximum length','number','sys_dictionary',NULL,NULL,6,NULL,1,NULL,1,NULL,'2024-02-22 22:32:46','2024-02-22 22:32:46',NULL,NULL,NULL),
('b2fa9f24b4ba5bc2a21ed88b4f17db1a','system','system','sys_dictionary','sys_dictionary','0',NULL,'sys_mod_count','Updates','number','sys_dictionary',NULL,NULL,6,NULL,1,NULL,NULL,NULL,'2024-02-22 22:05:20','2024-02-22 22:05:20',NULL,NULL,NULL),
('b3f1858ed2785b709de8b7294887e994','system','system','sys_dictionary','sys_dictionary','0',NULL,'sys_class_name','Class','string','sys_dictionary',NULL,NULL,80,NULL,1,NULL,NULL,NULL,'2024-02-22 22:02:05','2024-02-22 22:02:05',NULL,NULL,NULL),
('b6cf40012db55e9589ced231ff8634d3','system','system','sys_dictionary','sys_glide_object','0',NULL,'sys_id','Sys ID','string','sys_glide_object',NULL,NULL,32,NULL,1,NULL,1,NULL,'2024-03-25 16:21:57','2024-03-25 16:21:57',NULL,NULL,NULL),
('bde9c6bd34a150f99d97259712460de0','system','system','sys_dictionary','sys_glide_object','0',NULL,'scalar_type','Extends','string','sys_glide_object',NULL,NULL,40,NULL,1,NULL,1,NULL,'2024-03-25 17:06:05','2024-03-25 17:06:05',NULL,NULL,NULL),
('c0e9a2809db955abb04d01263fc9fbc3','system','system','sys_dictionary','sys_dictionary','0',NULL,'sys_id','Sys ID','string','sys_dictionary',NULL,NULL,32,NULL,1,NULL,1,NULL,'2024-02-22 21:56:34','2024-03-23 22:11:01',NULL,NULL,NULL),
('c1c2c778ed86583189ab88139d777915','system','system','sys_dictionary','sys_dictionary','0',NULL,'sys_created_by','Created by','string','sys_dictionary',NULL,NULL,40,NULL,1,NULL,NULL,NULL,'2024-02-22 21:58:21','2024-02-22 21:58:21',NULL,NULL,NULL),
('c37494672c3154dea21b43b6643eb094','system','system','sys_dictionary','sys_dictionary','0',NULL,'sys_updated_on','Updated','datetime','sys_dictionary',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2024-02-22 22:38:56','2024-02-22 22:38:56',NULL,NULL,NULL),
('c7ac2d06fb2250cf8ee72ccf208c3804','system','system','sys_dictionary','task','0',NULL,'state','State','number','task',NULL,NULL,6,NULL,1,NULL,NULL,NULL,'2024-03-19 05:42:47','2024-03-19 05:42:47',NULL,NULL,NULL),
('cf7da34432f85e19a7e7ab7cf714a44c','system','system','sys_dictionary','sys_db_object','0',NULL,'sys_updated_on','Updated','datetime','sys_db_object',NULL,NULL,6,NULL,1,NULL,1,NULL,'2024-03-23 22:29:33','2024-03-25 14:43:23',NULL,NULL,NULL),
('d7892f28dd1051f1bd3aff6b84f4b761','system','system','sys_dictionary','sys_db_object','0',NULL,'sys_mod_count','Updates','number','sys_db_object',NULL,NULL,6,NULL,1,NULL,NULL,NULL,'2024-03-25 15:50:04','2024-03-25 15:50:04',NULL,NULL,NULL),
('d8bfc340675554a1ab20dc549fda3dc6','system','system','sys_dictionary','sys_metadata','0',NULL,'sys_created_by','Created by','string','sys_metadata',NULL,NULL,40,NULL,1,NULL,1,NULL,'2024-03-25 16:00:17','2024-03-25 16:00:17',NULL,NULL,NULL),
('d90fec04f31a51dabbed943b87bfe61a','system','system','sys_dictionary','sys_metadata','0',NULL,'sys_updated_by','Updated by','string','sys_metadata',NULL,NULL,40,NULL,1,NULL,NULL,NULL,'2024-03-25 16:03:25','2024-03-25 16:03:25',NULL,NULL,NULL),
('d99df4c26e005cb5be9be0bfad36c6c5','system','system','sys_dictionary','sys_glide_object','0',NULL,'scalar_length','Length','string','sys_glide_object',NULL,NULL,40,NULL,1,NULL,1,NULL,'2024-03-25 17:06:22','2024-03-25 17:06:22',NULL,NULL,NULL),
('dc49893104ed5125a2b68caa22f14b7f','system','system','sys_dictionary','sys_glide_object','0',NULL,'sys_scope','Scope','string','sys_glide_object',NULL,NULL,32,NULL,1,NULL,NULL,NULL,'2024-03-25 16:27:08','2024-03-25 16:27:08',NULL,NULL,NULL),
('dc6ea6f1ef7e5346bf9006220eb77b66','system','system','sys_dictionary','sys_db_object','0',NULL,'sys_class_name','Class','string','sys_db_object',NULL,NULL,80,NULL,1,NULL,NULL,NULL,'2024-03-25 15:29:32','2024-03-25 15:29:32',NULL,NULL,NULL),
('dec4d3c7398051b2864a967b8bef202e','system','system','sys_dictionary','sys_dictionary','0',NULL,'default_value','Default value','string','sys_dictionary','',NULL,255,NULL,1,NULL,NULL,NULL,'2024-02-22 22:30:18','2024-02-22 22:30:18',NULL,NULL,NULL),
('e6b15194380c5ea6b8db87d211b01fd1','system','system','sys_dictionary','sys_db_object','0',NULL,'super_class','Extends table','string','sys_db_object',NULL,NULL,32,NULL,1,NULL,1,NULL,'2024-03-25 15:57:36','2024-03-25 15:57:35',NULL,NULL,NULL),
('e6f635cd33dc5dab91130d237e61f5b5','system','system','sys_dictionary','sys_db_object','0',NULL,'sys_update_name','Update','string','sys_db_object',NULL,NULL,255,NULL,1,NULL,NULL,NULL,'2024-03-25 15:51:07','2024-03-25 15:51:07',NULL,NULL,NULL),
('e8bb2b99d5825ebeb6ab5ee162cc29df','system','system','sys_dictionary','sys_dictionary','0',NULL,'sys_created_on','Created','datetime','sys_dictionary',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,'2024-02-22 22:38:15','2024-02-22 22:38:15',NULL,NULL,NULL),
('eb36b7fa92ab5fff801e3856224c6d7b','system','system','sys_dictionary','sys_db_object','0',NULL,'sys_name','Display name','string','sys_db_object',NULL,NULL,255,NULL,1,NULL,NULL,NULL,'2024-03-25 15:49:20','2024-03-25 16:20:52',NULL,NULL,NULL),
('ebbed92efb8253b49863fafdc2cba986','system','system','sys_dictionary','sys_metadata','0',NULL,'sys_policy','Protection policy','string','sys_metadata',NULL,NULL,32,NULL,1,NULL,NULL,NULL,'2024-03-25 16:07:07','2024-03-25 16:07:07',NULL,NULL,NULL),
('ecb776360e2452a099055a22bd4e960f','system','system','sys_dictionary','sys_db_object','0',NULL,'sys_scope','Scope','string','sys_db_object',NULL,NULL,32,NULL,1,NULL,NULL,NULL,'2024-03-25 15:50:29','2024-03-25 15:50:29',NULL,NULL,NULL),
('edc5f2e2ac635c0aaaa01679d9b6b97c','system','system','sys_dictionary','sys_dictionary','0',NULL,'internal_type','Type','reference','sys_dictionary','sys_glide_object',NULL,32,NULL,1,NULL,1,NULL,'2024-02-22 22:20:44','2024-02-22 22:20:44',NULL,NULL,NULL),
('ee2f8f7576c3579abdba1e8babaa0aca','system','system','sys_dictionary','task','0',NULL,'number','Number','string','task',NULL,NULL,40,NULL,1,NULL,NULL,NULL,'2024-02-11 18:58:23','2024-02-24 15:33:50',NULL,NULL,NULL),
('f974bfb3429a56a2bc1ac14e71ec9eec','system','system','sys_dictionary','sys_glide_object','0',NULL,'sys_updated_on','Updated','datetime','sys_glide_object',NULL,NULL,6,NULL,1,NULL,1,NULL,'2024-03-25 16:32:28','2024-03-25 16:32:28',NULL,NULL,NULL),
('fdc619b7988b50348a01250f8b648620','system','system','sys_dictionary','sys_glide_object','0',NULL,'sys_created_on','Created','datetime','sys_glide_object',NULL,NULL,6,NULL,1,NULL,NULL,NULL,'2024-03-25 16:32:10','2024-03-25 16:32:10',NULL,NULL,NULL),
('ff848e1f26015885a19ac5a6fa1782d3','system','system','sys_dictionary','sys_db_object','0',NULL,'sys_package','Package','string','sys_db_object',NULL,NULL,32,NULL,1,NULL,1,NULL,'2024-03-25 16:59:44','2024-03-25 16:59:44',NULL,NULL,NULL);
/*!40000 ALTER TABLE `sys_dictionary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_glide_object`
--

DROP TABLE IF EXISTS `sys_glide_object`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_glide_object` (
  `sys_id` varchar(32) NOT NULL DEFAULT '0',
  `sys_created_by` varchar(40) NOT NULL,
  `sys_updated_by` varchar(40) NOT NULL,
  `sys_class_name` varchar(80) NOT NULL DEFAULT 'sys_glide_object',
  `sys_name` varchar(255) DEFAULT NULL,
  `sys_mod_count` varchar(6) NOT NULL,
  `sys_update_name` varchar(255) DEFAULT NULL,
  `name` varchar(80) DEFAULT NULL,
  `label` varchar(80) DEFAULT NULL,
  `sys_created_on` datetime NOT NULL,
  `sys_updated_on` datetime NOT NULL,
  `sys_scope` varchar(32) DEFAULT NULL,
  `sys_policy` varchar(40) DEFAULT NULL,
  `sys_package` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`sys_id`),
  UNIQUE KEY `sys_id` (`sys_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_glide_object`
--

LOCK TABLES `sys_glide_object` WRITE;
/*!40000 ALTER TABLE `sys_glide_object` DISABLE KEYS */;
INSERT INTO `sys_glide_object` VALUES
('013e50cec3fc51b4b29099ec2ca872b0','system','system','sys_glide_object','collection','0',NULL,'collection','Collection','2024-03-26 21:10:42','2024-03-26 21:10:42',NULL,NULL,NULL),
('0e5b76a870b85644bd4385217c03d3ae','system','system','sys_glide_object','decimal','0',NULL,'decimal','Decimal','2024-03-26 21:04:26','2024-03-26 21:04:26',NULL,NULL,NULL),
('0eec8dc65a255ff182ee474ad083b9ec','system','system','sys_glide_object','journal_input','0',NULL,'journal_input','Journal Input','2024-03-26 21:17:35','2024-03-26 21:17:35',NULL,NULL,NULL),
('11143ffaf3065090ad9f082af82295cd','system','system','sys_glide_object','html','0',NULL,'html','HTML','2024-03-26 21:16:11','2024-03-26 21:16:11',NULL,NULL,NULL),
('165fbedf83fc57d8a5cc31c16fe90801','system','system','sys_glide_object','list','0',NULL,'list','List','2024-03-26 21:14:19','2024-03-26 21:14:19',NULL,NULL,NULL),
('1cb097b0bc4752e1a8271ca75c1952df','system','system','sys_glide_object','integer','0',NULL,'integer','Integer','2024-03-26 20:50:02','2024-03-26 20:50:02',NULL,NULL,NULL),
('2c8e564ea6075d6b811b5e8ab288ee50','system','system','sys_glide_object','field_name','0',NULL,'field_name','Field Name','2024-03-26 21:13:46','2024-03-26 21:13:46',NULL,NULL,NULL),
('300a07fc74dd53b698a5cdb33936e714','system','system','sys_glide_object','script','0',NULL,'script','Script','2024-03-26 21:22:36','2024-03-26 21:22:36',NULL,NULL,NULL),
('33d94dbfaf22598d952331a4b56dfe1a','system','system','sys_glide_object','float','0',NULL,'float','Floating Point Number','2024-03-26 21:05:54','2024-03-26 21:05:54',NULL,NULL,NULL),
('3933603a0f975bdbb442b3f77db606bb','system','system','sys_glide_object','datetime','0',NULL,'datetime','Date/Time','2024-03-26 21:00:51','2024-03-26 21:00:51',NULL,NULL,NULL),
('44837f530db25b46866b92b074290f30','system','system','sys_glide_object','password2','0',NULL,'password2','Password (2 Way Encrypted)','2024-03-26 21:20:54','2024-03-26 21:20:54',NULL,NULL,NULL),
('4dc9c287d4555dfa9c440c1b21b97f05','system','system','sys_glide_object','journal_list','0',NULL,'journal_list','Journal List','2024-03-26 21:17:47','2024-03-26 21:17:47',NULL,NULL,NULL),
('5314b3ea306e535e8203f0cd8428d160','system','system','sys_glide_object','GUID','0',NULL,'GUID','Sys Id (GUID)','2024-03-26 21:15:43','2024-03-26 21:15:43',NULL,NULL,NULL),
('611be76ed6445d1dab9a67143a1ab648','system','system','sys_glide_object','conditions','0',NULL,'conditions','Conditions','2024-03-26 21:12:22','2024-03-26 21:12:22',NULL,NULL,NULL),
('63c53dad3e9a55fcb8d568a471ae3ef4','system','system','sys_glide_object','name_values','0',NULL,'name_values','Name/Values','2024-03-26 21:19:11','2024-03-26 21:19:11',NULL,NULL,NULL),
('661b503eb2075bc9ad126460550acb0b','system','system','sys_glide_object','sys_class_name','0',NULL,'sys_class_name','System Class Name','2024-03-26 21:24:30','2024-03-26 21:24:30',NULL,NULL,NULL),
('67e6c6092a4454738992e3d28801a0bb','system','system','sys_glide_object','reference','0',NULL,'reference','Reference','2024-03-26 21:08:54','2024-03-26 21:08:54',NULL,NULL,NULL),
('70a2861dfa465045974b0eb81576c4f6','system','system','sys_glide_object','password','0',NULL,'password','Password (1 Way Encrypted)','2024-03-26 21:20:39','2024-03-26 21:20:39',NULL,NULL,NULL),
('754b3b9380fd5169b15e2ed33f0b59b0','system','system','sys_glide_object','field_name','0',NULL,'field_name','Field Name','2024-03-26 21:13:45','2024-03-26 21:13:45',NULL,NULL,NULL),
('82555faa4de15cfeb9add096df33a85c','system','system','sys_glide_object','currency','0',NULL,'currency','Currency','2024-03-26 21:04:53','2024-03-26 21:04:53',NULL,NULL,NULL),
('82dee5f75c1b5fd8a96cf5aac4b514b5','system','system','sys_glide_object','string','0',NULL,'string','String','2024-02-17 20:39:20','2024-02-17 20:39:20',NULL,NULL,NULL),
('8aa14ddaf7a65c5e9469ca48cc7548b6','system','system','sys_glide_object','journal','0',NULL,'journal','Journal','2024-03-26 21:17:14','2024-03-26 21:17:14',NULL,NULL,NULL),
('8eb9e48df7a95a72a913a6665a2db11c','system','system','sys_glide_object','url','0',NULL,'url','URL','2024-03-26 21:25:34','2024-03-26 21:25:34',NULL,NULL,NULL),
('93f0be82e0f8503c9f5718c977d21ae9','system','system','sys_glide_object','email','0',NULL,'email','Email','2024-03-26 21:13:01','2024-03-26 21:13:01',NULL,NULL,NULL),
('9dd07be9df565ff1a80b25ab755ae219','system','system','sys_glide_object','radio','0',NULL,'radio','Radio Button Choice','2024-03-26 21:22:07','2024-03-26 21:22:07',NULL,NULL,NULL),
('9f47180cb03a5483a238c807090d5f1c','system','system','sys_glide_object','table_name','0',NULL,'table_name','Table Name','2024-03-26 21:24:49','2024-03-26 21:24:49',NULL,NULL,NULL),
('a1121556417f5a889e0552e6f2e2b819','system','system','sys_glide_object','choice','0',NULL,'choice','Choice','2024-03-26 21:10:12','2024-03-26 21:10:12',NULL,NULL,NULL),
('a3ab272594b755d9b08e857013e8159b','system','system','sys_glide_object','date','0',NULL,'date','Date','2024-03-26 20:58:27','2024-03-26 20:58:27',NULL,NULL,NULL),
('b3b97f9187e55017aa680a6037820832','system','system','sys_glide_object','boolean','0',NULL,'boolean','True/False','2024-03-26 20:47:43','2024-03-26 20:47:43',NULL,NULL,NULL),
('c7ad4e3135dc5c48b6aa2d334c88e7ad','system','system','sys_glide_object','json','0',NULL,'json','JSON','2024-03-26 21:18:13','2024-03-26 21:18:13',NULL,NULL,NULL),
('d2c1ef8958c5558cb65ae2a0f12f8128','system','system','sys_glide_object','language','0',NULL,'language','Language','2024-03-26 21:18:43','2024-03-26 21:18:43',NULL,NULL,NULL),
('e0b55c9f1af75d9eb6a5cc586505b8d1','system','system','sys_glide_object','time','0',NULL,'time','Time','2024-03-26 21:01:42','2024-03-26 21:01:42',NULL,NULL,NULL),
('ea2ff4f2786b55c9b83bcc5b8f266ec0','system','system','sys_glide_object','document_id','0',NULL,'document_id','Document ID','2024-03-26 21:08:09','2024-03-26 21:08:09',NULL,NULL,NULL);
/*!40000 ALTER TABLE `sys_glide_object` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_metadata`
--

DROP TABLE IF EXISTS `sys_metadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_metadata` (
  `sys_id` varchar(32) NOT NULL,
  `sys_created_by` varchar(40) NOT NULL,
  `sys_updated_by` varchar(40) NOT NULL,
  `sys_class_name` varchar(80) NOT NULL,
  `sys_name` varchar(255) DEFAULT NULL,
  `sys_mod_count` varchar(6) NOT NULL,
  `sys_update_name` varchar(255) DEFAULT NULL,
  `sys_created_on` datetime NOT NULL,
  `sys_updated_on` datetime NOT NULL,
  `sys_scope` varchar(32) DEFAULT NULL,
  `sys_policy` varchar(40) DEFAULT NULL,
  `sys_package` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`sys_id`),
  UNIQUE KEY `sys_id` (`sys_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_metadata`
--

LOCK TABLES `sys_metadata` WRITE;
/*!40000 ALTER TABLE `sys_metadata` DISABLE KEYS */;
INSERT INTO `sys_metadata` VALUES
('06838797899858868c960afdf814a079','system','system','sys_dictionary','test','0',NULL,'2025-02-08 21:54:47','2025-02-08 21:54:47',NULL,NULL,NULL),
('06b7f54552e35fc8bae220c6d4db7f03','system','system','sys_db_object','test','0',NULL,'2025-02-08 21:56:42','2025-02-08 21:56:42',NULL,NULL,NULL),
('1744788797415101b4ef71bd88240b9b','system','system','sys_db_object','sys_dictionary','0',NULL,'2024-03-26 21:41:10','2024-03-26 21:41:10',NULL,NULL,NULL),
('1e82732cf4dd5175af52818fac0d0d3f','system','system','sys_dictionary','test','0',NULL,'2025-02-08 21:59:30','2025-02-08 21:59:30',NULL,NULL,NULL),
('2402d6c9003e54f299a7280d82e0eb69','system','system','sys_dictionary','test','0',NULL,'2025-02-08 21:37:25','2025-02-08 21:37:25',NULL,NULL,NULL),
('3e25fc6a804158ab93aff095fbd149e9','system','system','sys_db_object','test','0',NULL,'2025-02-08 21:37:25','2025-02-08 21:37:25',NULL,NULL,NULL),
('3fa68c9e3dca542e817ff6068f413341','system','system','sys_dictionary','test','0',NULL,'2025-02-08 21:57:52','2025-02-08 21:57:52',NULL,NULL,NULL),
('4fcfff7a13bd593a9955416751adc037','system','system','sys_db_object','test','0',NULL,'2025-02-08 21:57:52','2025-02-08 21:57:52',NULL,NULL,NULL),
('8f14c19c716a514bbce299a9901dbde3','system','system','sys_dictionary','test','0',NULL,'2025-02-28 19:58:51','2025-02-28 19:58:51',NULL,NULL,NULL),
('964419cb15cd5062b2676569b7ba076d','system','system','sys_db_object','sys_db_object','0',NULL,'2024-03-26 21:35:17','2024-03-26 21:35:17',NULL,NULL,NULL),
('a4bc8f0640be55ef82b13670ef4531d5','system','system','sys_dictionary','test','0',NULL,'2025-02-08 21:56:42','2025-02-08 21:56:42',NULL,NULL,NULL),
('d2de315704f0593eb5327a7a87218c01','system','system','sys_db_object','test','0',NULL,'2025-02-08 21:54:47','2025-02-08 21:54:47',NULL,NULL,NULL),
('ea3a9531b3ea5377ac7668e37493e418','system','system','sys_db_object','sys_glide_object','0',NULL,'2024-03-26 21:36:09','2024-03-26 21:36:09',NULL,NULL,NULL),
('fe78c815242c5bc0ac401dd0c5fc712d','system','system','sys_db_object','sys_metadata','0',NULL,'2024-03-26 21:34:30','2024-03-26 21:34:30',NULL,NULL,NULL);
/*!40000 ALTER TABLE `sys_metadata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `sys_id` varchar(32) NOT NULL,
  `sys_created_by` varchar(40) NOT NULL,
  `sys_updated_by` varchar(40) NOT NULL,
  `sys_class_name` varchar(80) NOT NULL DEFAULT 'sys_metadata',
  `sys_name` varchar(255) DEFAULT NULL,
  `sys_mod_count` int(40) NOT NULL DEFAULT 0,
  `sys_scope` varchar(32) DEFAULT NULL,
  `sys_update_name` varchar(255) DEFAULT NULL,
  `sys_policy` varchar(40) DEFAULT NULL,
  `sys_created_on` datetime NOT NULL,
  `sys_updated_on` datetime NOT NULL,
  `number` varchar(40) DEFAULT '0',
  `assignment_group` varchar(80) DEFAULT '',
  `active` varchar(1) DEFAULT '',
  `caller` varchar(40) DEFAULT NULL,
  `state` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`sys_id`),
  UNIQUE KEY `sys_id` (`sys_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `sys_id` varchar(32) NOT NULL,
  `sys_created_by` varchar(40) NOT NULL,
  `sys_updated_by` varchar(40) NOT NULL,
  `sys_class_name` varchar(80) NOT NULL DEFAULT 'sys_metadata',
  `sys_name` varchar(255) DEFAULT NULL,
  `sys_mod_count` int(6) NOT NULL DEFAULT 0,
  `sys_update_name` varchar(255) DEFAULT NULL,
  `sys_created_on` datetime NOT NULL,
  `sys_updated_on` datetime NOT NULL,
  PRIMARY KEY (`sys_id`),
  UNIQUE KEY `sys_id` (`sys_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-09 14:03:31

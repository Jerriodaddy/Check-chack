/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Host           : localhost
 Source Database       : CheckChack

 Target Server Type    : MySQL
 File Encoding         : utf-8
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `seats`
-- ----------------------------
DROP TABLE IF EXISTS `seats`;
CREATE TABLE `seats` (
  `seat_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statu` bit COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `curr_user_info` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT 'NULL',
  `last_user_info` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT 'NULL',
  PRIMARY KEY (`seat_id`),
  KEY `seat_id` (`seat_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='座位信息';

SET FOREIGN_KEY_CHECKS = 1;

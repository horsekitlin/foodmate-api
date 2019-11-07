CREATE DATABASE IF NOT EXISTS `foodmate_dev`
CHARACTER SET utf8 COLLATE utf8_unicode_ci;

SET SQL_MODE='ALLOW_INVALID_DATES';

USE `foodmate_dev`;


/******************************************
* 1: Create tables for user
******************************************/

CREATE TABLE IF NOT EXISTS `users`
(
    `uid`  serial COMMENT 'user serial id',
    `email` VARCHAR(128) NOT NULL,
    `password_hash`  VARCHAR(256) NOT NULL,
    `phone_number`  VARCHAR(256) NOT NULL,
    `display_name`  VARCHAR(256) NOT NULL,
    `gender`  VARCHAR(4) NOT NULL COMMENT 'M: 男, F: 女, U: 未知',
    `job_title`  VARCHAR(64) NOT NULL,
    `soul_food`  VARCHAR(256) NOT NULL,
    `info`  VARCHAR(256) NOT NULL,
    `photo_url`  VARCHAR(256) NOT NULL,
    `is_notification`  TINYINT DEFAULT 0,
    `is_camera`  TINYINT DEFAULT 0,
    `is_album`  TINYINT DEFAULT 0,
    `rate`  TINYINT DEFAULT 0,
    `disabled`  TINYINT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`uid`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

/******************************************
* 2: Create tables for event
******************************************/

CREATE TABLE IF NOT EXISTS `events`
(
    `event_id`  serial COMMENT 'event serial id',
    `logo` text NOT NULL,
    `description` text NOT NULL,
    `name`  VARCHAR(128) NOT NULL,
    `address`  VARCHAR(128) NOT NULL,
    `payment_method`  VARCHAR(64) NOT NULL COMMENT 'PAY_BY_SELF',
    `event_date` TIMESTAMP NOT NULL,
    `validate_date` TIMESTAMP NOT NULL,
    `tags`  JSON NOT NULL,
    `google_json`  JSON NOT NULL,
    `owner_id`  int(11) NOT NULL COMMENT 'mapping to users.uid',
    `budget`  int(11) NOT NULL,
    `max_member`  int(4) NOT NULL,
    `member_count`  int(4) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`event_id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';


/******************************************
* 3: Create tables for event users
******************************************/

CREATE TABLE IF NOT EXISTS `event_users`
(
    `event_users_id`  serial COMMENT 'event serial id',
    `event_id`  int(11) NOT NULL COMMENT 'mapping to events.event_id',
    `uid`  int(11) NOT NULL COMMENT 'mapping to users.uid',
    `comment` text NOT NULL,
    `stat` TINYINT DEFAULT 0  COMMENT '0: 未審核, 1: 已審核通過, 2: 被拒絕',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`event_users_id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';


/******************************************
* 4: Create tables for block users
******************************************/

CREATE TABLE IF NOT EXISTS `block_users`
(
    `block_users_id`  serial COMMENT 'event serial id',
    `block_id`  int(11) NOT NULL COMMENT 'mapping to events.event_id 被封鎖者',
    `uid`  int(11) NOT NULL COMMENT 'mapping to users.uid 封鎖者',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`block_users_id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

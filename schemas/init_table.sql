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

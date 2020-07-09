CREATE DATABASE IF NOT EXISTS `foodmate_dev` CHARACTER SET utf8 COLLATE utf8_unicode_ci;

SET
    SQL_MODE = 'ALLOW_INVALID_DATES';

USE `foodmate_dev`;

/******************************************
 * 1: Create tables for user
 ******************************************/
CREATE TABLE IF NOT EXISTS `users` (
    `uid` serial COMMENT 'user serial id',
    `email` VARCHAR(128) NOT NULL,
    `password_hash` VARCHAR(256) NOT NULL,
    `phone_number` VARCHAR(256) NOT NULL,
    `display_name` VARCHAR(256),
    `gender` VARCHAR(4) NOT NULL DEFAULT "U" COMMENT 'M: 男, F: 女, U: 未知',
    `job_title` VARCHAR(64),
    `soul_food` TINYINT NOT NULL DEFAULT 0 COMMENT '0 = 脆皮甜圈, 1 = 跳跳炸蝦, 2 = 安心壽司, 3 = 德國腸腸, 4 = 挨刀蘋果, 5 = 厭世披薩',
    `info` VARCHAR(256),
    `photo_url` VARCHAR(256),
    `is_notification` TINYINT DEFAULT 0,
    `is_camera` TINYINT DEFAULT 0,
    `is_album` TINYINT DEFAULT 0,
    `is_deleted` TINYINT DEFAULT 0,
    `rate` TINYINT DEFAULT 0,
    `disabled` TINYINT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`uid`),
    UNIQUE(email, phone_number, display_name)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

/******************************************
 * 2: Create tables for event
 ******************************************/
CREATE TABLE IF NOT EXISTS `events` (
    `event_id` serial COMMENT 'event serial id',
    `logo` text NOT NULL,
    `description` text NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `address` VARCHAR(128) NOT NULL,
    `payment_method` VARCHAR(64) NOT NULL COMMENT 'PAY_BY_SELF',
    `event_date` TIMESTAMP NOT NULL,
    `validate_date` TIMESTAMP NOT NULL,
    `tags` JSON NOT NULL,
    `google_json` JSON NOT NULL,
    `owner_id` int(11) NOT NULL COMMENT 'mapping to users.uid',
    `budget` int(11) NOT NULL,
    `max_member` int(4) NOT NULL,
    `conversation_id` bigint unsigned COMMENT '配發的聊天室ID'
    after
        owner_id,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`event_id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';
/******************************************
 * 3: Create tables for event users
 ******************************************/

CREATE TABLE IF NOT EXISTS `event_users` (
    `event_users_id` serial COMMENT 'event serial id',
    `event_id` int(11) NOT NULL COMMENT 'mapping to events.event_id',
    `uid` int(11) NOT NULL COMMENT 'mapping to users.uid',
    `comment` text NOT NULL,
    `stat` TINYINT DEFAULT 0 COMMENT '0: 未審核, 1: 已審核通過, 2: 被拒絕',
    `inviter_id` bigint unsigned COMMENT '邀請者uid'
    after
        uid,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`event_users_id`),
    `conversation_id` bigint unsigned comment '配發的聊天室ID'
    after `owner_id`
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

/******************************************
 * 4: Create tables for block users
 ******************************************/
CREATE TABLE IF NOT EXISTS `block_users` (
    `block_users_id` serial COMMENT 'event serial id',
    `block_id` int(11) NOT NULL COMMENT 'mapping to events.event_id 被封鎖者',
    `uid` int(11) NOT NULL COMMENT 'mapping to users.uid 封鎖者',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`block_users_id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

/******************************************
 * 5: Create tables for Friends
 ******************************************/
drop table if exists `friends`;

create table `friends`(
    `id` bigint unsigned auto_increment primary key,
    `inviter_id` bigint unsigned comment "邀請者uid",
    `invitee_id` bigint unsigned comment "受邀者uid",
    `event_id` bigint unsigned comment "從哪個活動ID發出邀請",
    `stat` tinyint comment "目前關係狀態0確認中  1已確認 -1拒絕 -2黑名單 -99刪除",
    `created_at` timestamp not null default current_timestamp comment "資料建立時間",
    `modified_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment "修改時間"
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';


/******************************************
 * 6: Create tables for Conversation
 ******************************************/
drop table if exists `conversation`;

create table `conversation`(
    `conversation_id` bigint unsigned auto_increment primary key comment '聊天室ID',
    `title` varchar(20) comment '聊天室名稱',
    `audit_stat` tinyint unsigned default 0 comment '聊天室審核',
    `conversation_type` tinyint unsigned default 0 comment '聊天室類型 0:private/ 1:group',
    `stat` tinyint unsigned default 0 comment '聊天室狀態',
    `cdt` datetime default current_timestamp comment '資料創建時間',
    `mdt` datetime default current_timestamp on update current_timestamp comment '資料異動時間'
) comment = '聊天室資料表',
ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

/******************************************
 * 7: Create tables for Participate
 ******************************************/
drop table if exists `participate`;

create table `participate`(
    `participate_id` bigint unsigned auto_increment primary key,
    `member_id` bigint unsigned comment '成員uid',
    `conversation_id` bigint unsigned comment '聊天室id',
    `cdt` datetime default current_timestamp comment '資料創建時間',
    `mdt` datetime default current_timestamp on update current_timestamp comment '資料異動時間',
    `adt` datetime comment '資料審核時間'
) comment = '聊天室成員資料表',
ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

/******************************************
 * 8: Create tables for Messages
 ******************************************/
drop table if exists `messages`;

create table `messages`(
    `message_id` bigint unsigned auto_increment primary key,
    `participate_id` bigint unsigned comment '訊息發起者participate_id',
    `msg_content` varchar(4096) comment '訊息內容',
    `msg_type` tinyint unsigned comment '0:text ,1:image ,2:video ,3:audio',
    `reply_message_id` bigint unsigned comment '回復訊息id',
    `deleted` tinyint unsigned default 0 comment '訊息是否刪除',
    `cdt` datetime default current_timestamp comment '資料創建時間',
    `mdt` datetime default current_timestamp on update current_timestamp comment '資料異動時間'
) comment = '聊天室訊息資料表',
ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

/******************************************
 * 9: Create tables for Message_invisible
 ******************************************/
drop table if exists `message_invisible`;

create table `message_invisible`(
    `id` bigint unsigned auto_increment primary key,
    `message_id` bigint unsigned comment '訊息id',
    `participate_id` bigint unsigned comment '刪除者participate_id',
    `cdt` datetime default current_timestamp comment '資料創建時間'
) comment = '訊息不可見資料表',
ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

/******************************************
 * 10: Create tables for Message_tag
 ******************************************/
drop table if exists `message_tag`;

create table `message_tag`(
    `id` bigint unsigned auto_increment primary key,
    `message_id` bigint unsigned comment '訊息id',
    `participate_id` bigint unsigned comment '被標記者participate_id',
    `cdt` datetime default current_timestamp comment '資料創建時間'
) comment = '訊息標記資料表',
ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';
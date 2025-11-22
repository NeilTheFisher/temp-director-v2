-- CreateTable
CREATE TABLE `action` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `trigger` VARCHAR(191) NOT NULL,
    `command` LONGTEXT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `controller_id` BIGINT UNSIGNED NOT NULL,
    `device_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(191) NULL,

    INDEX `action_controller_id_foreign`(`controller_id`),
    INDEX `action_device_id_foreign`(`device_id`),
    INDEX `action_event_id_foreign`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ad` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `location` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `media_url` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `sponsor_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ad_event` (
    `ad_id` BIGINT UNSIGNED NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `order` INTEGER NULL,

    INDEX `ad_event_ad_id_index`(`ad_id`),
    INDEX `ad_event_event_id_index`(`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ad_kpi` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `sponsor_name` VARCHAR(191) NULL,
    `ad_name` VARCHAR(191) NULL,
    `ad_url` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `ad_id` INTEGER NULL,
    `platform` VARCHAR(191) NULL,
    `created_at` INTEGER NOT NULL,
    `updated_at` INTEGER NOT NULL,

    INDEX `ad_kpi_event_id_index`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address_list` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `date` INTEGER NOT NULL DEFAULT 1746167167,
    `recipients` LONGTEXT NULL,
    `group_id` BIGINT UNSIGNED NULL,

    INDEX `address_list_group_id_foreign`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address_list_event` (
    `event_id` BIGINT UNSIGNED NOT NULL,
    `address_list_id` BIGINT UNSIGNED NOT NULL,

    INDEX `address_list_event_address_list_id_foreign`(`address_list_id`),
    INDEX `address_list_event_event_id_foreign`(`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cache` (
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `expiration` INTEGER NOT NULL,

    UNIQUE INDEX `cache_key_unique`(`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatbot` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `custom_name` VARCHAR(191) NULL,
    `chatbot_id` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `theme` VARCHAR(191) NULL,
    `action` VARCHAR(191) NULL,
    `payload` LONGTEXT NULL,
    `is_qrscan` BOOLEAN NOT NULL DEFAULT false,
    `product_filter_id` VARCHAR(191) NOT NULL DEFAULT '',
    `aggregator_instance_id` VARCHAR(191) NOT NULL DEFAULT '',
    `scale` VARCHAR(191) NOT NULL DEFAULT 'scalefit',
    `icon` VARCHAR(191) NULL,
    `group_id` BIGINT UNSIGNED NOT NULL,
    `style` VARCHAR(191) NOT NULL DEFAULT 'medium_height',
    `checkout` BOOLEAN NOT NULL DEFAULT false,
    `blurred_background` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatbot_event` (
    `chatbot_id` BIGINT UNSIGNED NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,

    INDEX `chatbot_event_chatbot_id_foreign`(`chatbot_id`),
    INDEX `chatbot_event_event_id_foreign`(`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `controller` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `paired` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `group_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `controller_group_id_foreign`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delete_request` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `created_at` INTEGER NOT NULL DEFAULT 1746167167,
    `updated_at` INTEGER NOT NULL DEFAULT 1746167167,
    `code` VARCHAR(191) NULL,
    `stream_id` BIGINT UNSIGNED NULL,
    `image` LONGBLOB NULL,
    `logo` LONGBLOB NULL,
    `category` VARCHAR(191) NULL,
    `running` BOOLEAN NOT NULL DEFAULT false,
    `group_id` BIGINT UNSIGNED NULL,

    UNIQUE INDEX `device_code_unique`(`code`),
    INDEX `device_group_id_foreign`(`group_id`),
    INDEX `device_stream_id_foreign`(`stream_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device_event` (
    `device_id` BIGINT UNSIGNED NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `order` INTEGER NULL,

    INDEX `device_event_device_id_foreign`(`device_id`),
    INDEX `device_event_event_id_foreign`(`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discovery_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `mcc` INTEGER NULL,
    `mnc` INTEGER NULL,
    `ip` VARCHAR(191) NULL,
    `stream_url` VARCHAR(191) NULL,
    `mobile` BOOLEAN NOT NULL DEFAULT false,
    `timestamp` INTEGER NOT NULL DEFAULT 0,
    `description` LONGTEXT NULL,
    `country` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `domain` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `domain` VARCHAR(191) NOT NULL,
    `api_key` VARCHAR(191) NULL,
    `assign_to_all` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `domain_event` (
    `domain_id` BIGINT UNSIGNED NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,

    INDEX `domain_event_domain_id_index`(`domain_id`),
    INDEX `domain_event_event_id_index`(`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `domain_group` (
    `domain_id` BIGINT UNSIGNED NOT NULL,
    `group_id` BIGINT UNSIGNED NOT NULL,

    INDEX `domain_group_domain_id_index`(`domain_id`),
    INDEX `domain_group_group_id_index`(`group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_user` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `msisdn` VARCHAR(191) NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `user_id` BIGINT UNSIGNED NULL,

    INDEX `email_user_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `location_info` JSON NULL,
    `owner_id` INTEGER NOT NULL,
    `duration` INTEGER NULL,
    `date` INTEGER NULL,
    `active` BOOLEAN NOT NULL,
    `capacity` INTEGER NULL,
    `description` LONGTEXT NULL,
    `category` VARCHAR(191) NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT false,
    `profanity` BOOLEAN NOT NULL DEFAULT true,
    `is_5g` BOOLEAN NULL,
    `created_at` INTEGER UNSIGNED NOT NULL DEFAULT 1746167168,
    `updated_at` INTEGER UNSIGNED NOT NULL DEFAULT 1746167168,
    `latitude` DECIMAL(10, 5) NULL,
    `longitude` DECIMAL(10, 5) NULL,
    `image_uid` CHAR(36) NULL,
    `promo_video_url` VARCHAR(191) NULL,
    `invitations_only` BOOLEAN NOT NULL,
    `is_draft` BOOLEAN NOT NULL DEFAULT false,
    `payed` BOOLEAN NOT NULL,
    `image_url` VARCHAR(191) NULL,
    `brand_image_url` VARCHAR(191) NULL,
    `brand_background_image_url` VARCHAR(191) NULL,
    `brand_ad_image_url` VARCHAR(191) NULL,
    `featured` BOOLEAN NULL DEFAULT false,
    `hashtags` VARCHAR(191) NULL,
    `app_allowed` BOOLEAN NOT NULL DEFAULT true,
    `web_allowed` BOOLEAN NOT NULL DEFAULT false,
    `hmd_allowed` BOOLEAN NOT NULL DEFAULT false,
    `shop_bot_id` VARCHAR(191) NOT NULL DEFAULT '',
    `promo_video_aspect_ratio` VARCHAR(191) NULL,
    `promo_video_status` VARCHAR(191) NULL,
    `restream` BOOLEAN NOT NULL DEFAULT false,
    `short_description` LONGTEXT NULL,
    `featured_date` INTEGER NULL,
    `featured_artist` TEXT NULL,
    `web_image_url` TEXT NULL,
    `group_id` BIGINT UNSIGNED NOT NULL,

    INDEX `event_group_id_foreign`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_blocked` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `msisdn` VARCHAR(191) NOT NULL,
    `date` TIMESTAMP(0) NULL,

    INDEX `event_blocked_event_id_index`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_flagged` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `msisdn` VARCHAR(191) NOT NULL,
    `flags` INTEGER NOT NULL DEFAULT 0,
    `date` TIMESTAMP(0) NULL,

    INDEX `event_flagged_event_id_index`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_interested` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `msisdn` VARCHAR(191) NOT NULL,
    `date` TIMESTAMP(0) NULL,

    INDEX `event_interested_event_id_index`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `action` VARCHAR(191) NOT NULL,
    `info` LONGTEXT NULL,
    `date` INTEGER NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `user_name` VARCHAR(191) NULL,

    INDEX `event_logs_event_id_foreign`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_opened` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `msisdn` VARCHAR(191) NOT NULL,
    `date` TIMESTAMP(0) NULL,

    INDEX `event_opened_event_id_index`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_poll` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `msisdn` VARCHAR(191) NOT NULL,
    `item_voted` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `bot_id` VARCHAR(191) NOT NULL,

    INDEX `event_poll_event_id_foreign`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_registered` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `msisdn` VARCHAR(191) NULL,
    `price` INTEGER NULL,
    `ticket_level` VARCHAR(191) NULL,
    `ticket_platform` VARCHAR(191) NULL,
    `ticket_currency` VARCHAR(191) NULL,
    `date` INTEGER NULL,
    `description` LONGTEXT NULL,
    `status` VARCHAR(191) NULL,

    INDEX `event_registered_event_id_index`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_removed` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `msisdn` VARCHAR(191) NOT NULL,
    `date` TIMESTAMP(0) NULL,

    INDEX `event_removed_event_id_index`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_requests` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `msisdn` VARCHAR(191) NULL,
    `date` INTEGER NULL,
    `status` VARCHAR(191) NULL DEFAULT 'pending',

    INDEX `event_requests_event_id_index`(`event_id`),
    INDEX `event_requests_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_simulation` (
    `simulation_id` BIGINT UNSIGNED NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,

    INDEX `event_simulation_event_id_foreign`(`event_id`),
    INDEX `event_simulation_simulation_id_foreign`(`simulation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_stream` (
    `stream_id` BIGINT UNSIGNED NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NULL,

    INDEX `event_stream_event_id_foreign`(`event_id`),
    INDEX `event_stream_stream_id_foreign`(`stream_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_template` (
    `event_id` BIGINT UNSIGNED NOT NULL,
    `template_id` BIGINT UNSIGNED NOT NULL,

    INDEX `event_template_event_id_foreign`(`event_id`),
    INDEX `event_template_template_id_foreign`(`template_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_user` (
    `user_id` BIGINT UNSIGNED NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,

    INDEX `event_user_event_id_foreign`(`event_id`),
    INDEX `event_user_user_id_foreign`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feed` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `current_item` VARCHAR(191) NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `date` INTEGER NULL,

    INDEX `feed_event_id_foreign`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `survey_id` VARCHAR(191) NOT NULL,
    `question` LONGTEXT NOT NULL,
    `answer_text` LONGTEXT NOT NULL,
    `answer_value` LONGTEXT NOT NULL,
    `date` INTEGER NOT NULL,
    `starred` TIMESTAMP(0) NULL,
    `event_id` BIGINT UNSIGNED NULL,

    INDEX `feedback_event_id_foreign`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` INTEGER NOT NULL DEFAULT 1746167167,
    `updated_at` INTEGER NOT NULL DEFAULT 1746167167,
    `is_public` BOOLEAN NULL,
    `owner_id` BIGINT UNSIGNED NULL,
    `image_uid` CHAR(36) NULL,
    `image_url` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,

    UNIQUE INDEX `group_slug_unique`(`slug`),
    INDEX `group_owner_id_foreign`(`owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group_user` (
    `group_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,

    INDEX `group_user_group_id_foreign`(`group_id`),
    INDEX `group_user_user_id_foreign`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `info_content_management` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(191) NOT NULL DEFAULT '',
    `title` VARCHAR(191) NOT NULL,
    `sub_title` VARCHAR(191) NOT NULL DEFAULT '',
    `type` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invite` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `recipient` VARCHAR(191) NOT NULL,
    `date` INTEGER NOT NULL DEFAULT 1746167167,
    `msgId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `timestamp` VARCHAR(191) NULL,
    `is_rcs` BOOLEAN NULL,
    `event_id` BIGINT UNSIGNED NULL,
    `payed` BOOLEAN NOT NULL DEFAULT false,
    `ticket_type` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `log` LONGTEXT NULL,
    `device_info` LONGBLOB NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'standard',

    INDEX `invite_event_id_foreign`(`event_id`),
    INDEX `invite_recipient_event_id_index`(`recipient`, `event_id`),
    INDEX `invite_recipient_index`(`recipient`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invite_template` (
    `template_id` BIGINT UNSIGNED NOT NULL,
    `invite_id` BIGINT UNSIGNED NOT NULL,

    INDEX `invite_template_invite_id_foreign`(`invite_id`),
    INDEX `invite_template_template_id_foreign`(`template_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `style` VARCHAR(191) NOT NULL,
    `feed_id` BIGINT UNSIGNED NULL,
    `info` LONGTEXT NULL,
    `configurable_type` VARCHAR(191) NULL,
    `configurable_id` BIGINT UNSIGNED NULL,
    `aggregator_instance_id` VARCHAR(191) NULL,
    `locked` BOOLEAN NOT NULL DEFAULT false,
    `event_id` BIGINT UNSIGNED NULL,

    INDEX `item_configurable_type_configurable_id_index`(`configurable_type`, `configurable_id`),
    INDEX `item_feed_id_foreign`(`feed_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_pollbot` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `pollbot_feed` BOOLEAN NOT NULL,
    `event_id` INTEGER NOT NULL,
    `style` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `queue` VARCHAR(191) NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `attempts` TINYINT UNSIGNED NOT NULL,
    `reserved_at` INTEGER UNSIGNED NULL,
    `available_at` INTEGER UNSIGNED NOT NULL,
    `created_at` INTEGER UNSIGNED NOT NULL,

    INDEX `jobs_queue_index`(`queue`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_devices` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `device_type` VARCHAR(191) NOT NULL,
    `device_status` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `duration` INTEGER NULL,
    `event_id` INTEGER NOT NULL,
    `date` INTEGER NOT NULL,

    INDEX `kpi_devices_device_status_index`(`device_status`),
    INDEX `kpi_devices_device_type_index`(`device_type`),
    INDEX `kpi_devices_event_id_index`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_emotes_sent` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `date` INTEGER NOT NULL DEFAULT 0,
    `emote` VARCHAR(191) NOT NULL,
    `created_at` INTEGER NOT NULL DEFAULT 0,
    `updated_at` INTEGER NOT NULL DEFAULT 0,

    INDEX `kpi_emotes_sent_msisdn_foreign`(`msisdn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_event_items_saved` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `items_count` INTEGER NOT NULL,
    `event_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_message_sent` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `date` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL,
    `message_id` VARCHAR(191) NOT NULL,
    `created_at` INTEGER NOT NULL DEFAULT 0,
    `updated_at` INTEGER NOT NULL DEFAULT 0,
    `content` VARCHAR(191) NULL,

    INDEX `kpi_message_sent_msisdn_foreign`(`msisdn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_messages` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `message_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL,
    `sender` VARCHAR(191) NULL,
    `date` INTEGER NULL,
    `event_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_odience_carrier` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `carrier` VARCHAR(191) NOT NULL,
    `mcc` INTEGER NULL,
    `mnc` INTEGER NULL,
    `created_at` INTEGER NOT NULL DEFAULT 0,
    `updated_at` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_odience_device` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `odience_version` VARCHAR(191) NULL,
    `os_name` VARCHAR(191) NULL,
    `os_version` VARCHAR(191) NULL,
    `device_model` VARCHAR(191) NULL,
    `device_make` VARCHAR(191) NULL,
    `created_at` INTEGER NOT NULL DEFAULT 0,
    `updated_at` INTEGER NOT NULL DEFAULT 0,
    `device_language` VARCHAR(191) NULL,

    INDEX `kpi_odience_device_msisdn_index`(`msisdn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_odience_event` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_id` VARCHAR(191) NOT NULL,
    `msisdn` VARCHAR(191) NOT NULL,
    `joined_timestamp` INTEGER NOT NULL,
    `left_timestamp` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL DEFAULT -1,
    `stream_state` VARCHAR(191) NOT NULL,
    `device_id` BIGINT UNSIGNED NOT NULL,
    `payment` INTEGER NOT NULL DEFAULT 0,
    `location` VARCHAR(191) NOT NULL,
    `created_at` INTEGER NOT NULL,
    `updated_at` INTEGER NOT NULL,
    `access_type` VARCHAR(191) NULL,

    INDEX `kpi_odience_event_device_id_foreign`(`device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_odience_user` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `user_hash` VARCHAR(191) NOT NULL,
    `created_at` INTEGER NOT NULL DEFAULT 0,
    `updated_at` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `kpi_odience_user_msisdn_unique`(`msisdn`),
    UNIQUE INDEX `kpi_odience_user_user_hash_unique`(`user_hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_odience_user_to_user_call` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `date` INTEGER NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `callee_id` VARCHAR(191) NOT NULL,
    `duration` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `created_at` INTEGER NOT NULL DEFAULT 0,
    `updated_at` INTEGER NOT NULL DEFAULT 0,
    `direction` VARCHAR(191) NULL,

    INDEX `kpi_odience_user_to_user_call_callee_id_foreign`(`callee_id`),
    INDEX `kpi_odience_user_to_user_call_msisdn_foreign`(`msisdn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_purchases` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `chatbot_id` VARCHAR(191) NOT NULL,
    `chatbot_name` VARCHAR(191) NOT NULL,
    `event_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `total_price` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_questions_sent` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `date` INTEGER NOT NULL DEFAULT 0,
    `type` VARCHAR(191) NOT NULL,
    `question_id` VARCHAR(191) NOT NULL,
    `created_at` INTEGER NOT NULL DEFAULT 0,
    `updated_at` INTEGER NOT NULL DEFAULT 0,

    INDEX `kpi_questions_sent_msisdn_foreign`(`msisdn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_user_device_interaction` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `date` INTEGER NOT NULL DEFAULT 0,
    `duration` INTEGER NOT NULL DEFAULT 0,
    `device_type` VARCHAR(191) NULL,
    `device_status` VARCHAR(191) NULL,
    `created_at` INTEGER NOT NULL DEFAULT 0,
    `updated_at` INTEGER NOT NULL DEFAULT 0,

    INDEX `kpi_user_device_interaction_msisdn_foreign`(`msisdn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_user_picture_taken` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `date` INTEGER NOT NULL DEFAULT 0,
    `camera_x` DOUBLE NOT NULL DEFAULT 0.00,
    `camera_y` DOUBLE NOT NULL DEFAULT 0.00,
    `camera_zoom` DOUBLE NOT NULL DEFAULT 1.00,
    `time_in_event` INTEGER NOT NULL DEFAULT 0,
    `created_at` INTEGER NOT NULL DEFAULT 0,
    `updated_at` INTEGER NOT NULL DEFAULT 0,

    INDEX `kpi_user_picture_taken_msisdn_foreign`(`msisdn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_user_qr_code_scan` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `msisdn` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `date` INTEGER NOT NULL DEFAULT 0,
    `created_at` INTEGER NOT NULL DEFAULT 0,
    `updated_at` INTEGER NOT NULL DEFAULT 0,

    INDEX `kpi_user_qr_code_scan_msisdn_foreign`(`msisdn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_user_shared_event` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `date` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'opened',
    `event_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_user_to_user_call` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `callee_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `date` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `event_id` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `event_id` INTEGER NOT NULL,
    `duration` BIGINT NULL,
    `os_name` VARCHAR(191) NULL,
    `os_version` VARCHAR(191) NULL,
    `device_model` VARCHAR(191) NULL,
    `date` INTEGER NOT NULL DEFAULT 1746167170,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_users_pictures_taken` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `event_id` INTEGER NOT NULL,
    `date` INTEGER NOT NULL DEFAULT 1746167170,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_users_qr_code_scanned` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `event_id` INTEGER NOT NULL,
    `date` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(10, 8) NOT NULL,
    `country` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mcc_mnc` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `mcc` INTEGER NOT NULL,
    `mnc` INTEGER NOT NULL,
    `iso` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NULL,
    `country_code` VARCHAR(191) NULL,
    `network` VARCHAR(191) NULL,
    `rules` LONGTEXT NULL,
    `date` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_content` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `slot` INTEGER NOT NULL,
    `media_type` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `media_url` VARCHAR(191) NULL,
    `preview_url` VARCHAR(191) NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `group_id` BIGINT UNSIGNED NOT NULL,
    `date` VARCHAR(191) NULL,

    INDEX `media_content_event_id_foreign`(`event_id`),
    INDEX `media_content_group_id_foreign`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(191) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model_has_permission` (
    `permission_id` BIGINT UNSIGNED NOT NULL,
    `model_type` VARCHAR(191) NOT NULL,
    `model_id` BIGINT UNSIGNED NOT NULL,

    INDEX `model_has_permission_model_id_model_type_index`(`model_id`, `model_type`),
    PRIMARY KEY (`permission_id`, `model_id`, `model_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model_has_role` (
    `role_id` BIGINT UNSIGNED NOT NULL,
    `model_type` VARCHAR(191) NOT NULL,
    `model_id` BIGINT UNSIGNED NOT NULL,

    INDEX `model_has_role_model_id_model_type_index`(`model_id`, `model_type`),
    PRIMARY KEY (`role_id`, `model_id`, `model_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `model_id` BIGINT UNSIGNED NULL,
    `ip` VARCHAR(191) NULL,
    `action` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `date` INTEGER NULL,
    `info` VARCHAR(191) NOT NULL,

    INDEX `model_logs_model_id_index`(`model_id`),
    INDEX `model_logs_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_access_tokens` (
    `id` VARCHAR(100) NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `client_id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NULL,
    `scopes` TEXT NULL,
    `revoked` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `expires_at` DATETIME(0) NULL,

    INDEX `oauth_access_tokens_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_auth_codes` (
    `id` VARCHAR(100) NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `scopes` TEXT NULL,
    `revoked` BOOLEAN NOT NULL,
    `expires_at` DATETIME(0) NULL,

    INDEX `oauth_auth_codes_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_clients` (
    `id` CHAR(36) NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(191) NOT NULL,
    `secret` VARCHAR(100) NULL,
    `provider` VARCHAR(191) NULL,
    `redirect` TEXT NOT NULL,
    `personal_access_client` BOOLEAN NOT NULL,
    `password_client` BOOLEAN NOT NULL,
    `revoked` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `oauth_clients_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_personal_access_clients` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` CHAR(36) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_refresh_tokens` (
    `id` VARCHAR(100) NOT NULL,
    `access_token_id` VARCHAR(100) NOT NULL,
    `revoked` BOOLEAN NOT NULL,
    `expires_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_resets` (
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    INDEX `password_resets_email_index`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `guard_name` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `permission_name_index`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pro_publisher` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `serial` VARCHAR(191) NOT NULL,
    `uid` VARCHAR(191) NOT NULL,
    `device_name` VARCHAR(191) NULL,
    `code` INTEGER NULL,
    `name` VARCHAR(191) NULL,
    `otp` LONGTEXT NULL,
    `password` VARCHAR(191) NULL,
    `registered` BOOLEAN NOT NULL DEFAULT false,
    `group_id` BIGINT UNSIGNED NULL,
    `running` BOOLEAN NOT NULL DEFAULT false,

    INDEX `pro_publisher_group_id_foreign`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publisher` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `publisher_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'requested',
    `token` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NULL,

    UNIQUE INDEX `publisher_publisher_id_unique`(`publisher_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qr_code` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `configurable_type` VARCHAR(191) NULL,
    `configurable_id` BIGINT UNSIGNED NULL,
    `url` LONGTEXT NULL,

    INDEX `qr_code_configurable_type_configurable_id_index`(`configurable_type`, `configurable_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `guard_name` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `role_name_index`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_has_permission` (
    `permission_id` BIGINT UNSIGNED NOT NULL,
    `role_id` BIGINT UNSIGNED NOT NULL,

    INDEX `role_has_permission_permission_id_index`(`permission_id`),
    INDEX `role_has_permission_role_id_foreign`(`role_id`),
    PRIMARY KEY (`permission_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `roles_name_unique`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles_user_group` (
    `role_id` BIGINT UNSIGNED NOT NULL,
    `group_id` BIGINT UNSIGNED NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,

    INDEX `roles_user_group_group_id_foreign`(`group_id`),
    INDEX `roles_user_group_role_id_foreign`(`role_id`),
    INDEX `roles_user_group_user_id_foreign`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `ip` VARCHAR(191) NULL,
    `platform` VARCHAR(191) NULL,
    `date` INTEGER NULL,
    `location` VARCHAR(191) NULL,

    INDEX `session_logs_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `setting` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` LONGTEXT NULL,
    `configurable_type` VARCHAR(191) NULL,
    `configurable_id` BIGINT UNSIGNED NULL,

    INDEX `setting_configurable_id_index`(`configurable_id`),
    INDEX `setting_configurable_type_configurable_id_index`(`configurable_type`, `configurable_id`),
    INDEX `setting_key_configurable_id_index`(`key`, `configurable_id`),
    INDEX `setting_key_index`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shopping_feed` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `url` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `categories` LONGTEXT NULL,
    `raw_xml_compressed` BOOLEAN NOT NULL,
    `event_xml_compressed` BOOLEAN NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `raw_xml` LONGBLOB NULL,
    `event_xml` LONGBLOB NULL,
    `poll` BOOLEAN NOT NULL DEFAULT false,

    INDEX `shopping_feed_event_id_foreign`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `short_url` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` LONGTEXT NOT NULL,
    `expiry` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `date` INTEGER NOT NULL DEFAULT 1746167170,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `simulation` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `web_settings` LONGTEXT NULL,

    UNIQUE INDEX `simulation_url_unique`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sip` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `device_id` BIGINT UNSIGNED NOT NULL,
    `sip` VARCHAR(191) NOT NULL,
    `subscribed` BOOLEAN NOT NULL,
    `password` LONGTEXT NULL,
    `message` LONGTEXT NULL,

    INDEX `sip_device_id_foreign`(`device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sponsor` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `settings` LONGTEXT NULL,
    `assign_to_all` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `image_url` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sponsor_event` (
    `sponsor_id` BIGINT UNSIGNED NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,

    INDEX `sponsor_event_event_id_index`(`event_id`),
    INDEX `sponsor_event_sponsor_id_index`(`sponsor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sponsor_group` (
    `sponsor_id` BIGINT UNSIGNED NOT NULL,
    `group_id` BIGINT UNSIGNED NOT NULL,

    INDEX `sponsor_group_group_id_index`(`group_id`),
    INDEX `sponsor_group_sponsor_id_index`(`sponsor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stream` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `is_equirectangular` BOOLEAN NOT NULL,
    `is_stereo` BOOLEAN NOT NULL,
    `saturation_mod` DOUBLE NOT NULL,
    `gamma_mod` DOUBLE NOT NULL,
    `active` BOOLEAN NOT NULL,
    `rotation` DOUBLE NULL,
    `is_360` BOOLEAN NOT NULL DEFAULT true,
    `type` VARCHAR(191) NOT NULL DEFAULT 'standard',
    `pre_stream` VARCHAR(191) NULL,
    `format` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `preview_url` VARCHAR(191) NULL,
    `video_length` INTEGER NOT NULL DEFAULT 0,
    `recorded_type` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NULL,
    `loop` BOOLEAN NOT NULL,
    `stream_url_preview` LONGTEXT NULL,
    `code` VARCHAR(191) NULL,
    `chatbot_id` VARCHAR(191) NULL,
    `chatbot_payload` LONGTEXT NULL,
    `zones` LONGTEXT NULL,
    `access_type` VARCHAR(191) NOT NULL DEFAULT 'default',
    `propublisher_uid` VARCHAR(191) NULL,
    `video_format` VARCHAR(191) NOT NULL,
    `mobile` BOOLEAN NOT NULL,
    `vertical_rotation` DOUBLE NULL,
    `group_id` BIGINT UNSIGNED NULL,

    UNIQUE INDEX `stream_code_unique`(`code`),
    INDEX `stream_group_id_foreign`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stream_url` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `resolution` VARCHAR(191) NOT NULL,
    `stream_id` BIGINT UNSIGNED NOT NULL,
    `is_running` BOOLEAN NOT NULL DEFAULT true,
    `status` LONGTEXT NULL,
    `download_url` VARCHAR(191) NULL,

    INDEX `stream_url_stream_id_foreign`(`stream_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stream_url_token` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `date` BIGINT NOT NULL,
    `duration` INTEGER NULL,
    `token` VARCHAR(191) NOT NULL,

    INDEX `stream_url_token_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `template` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `date` INTEGER NOT NULL DEFAULT 1746167167,
    `image` LONGBLOB NULL,
    `group_id` BIGINT UNSIGNED NULL,

    INDEX `template_group_id_foreign`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trigger_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `trigger` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `response` LONGTEXT NULL,
    `user` LONGTEXT NULL,
    `date` INTEGER NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,
    `action_id` BIGINT UNSIGNED NULL,

    INDEX `trigger_logs_action_id_foreign`(`action_id`),
    INDEX `trigger_logs_event_id_foreign`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(191) NOT NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,
    `msisdn` VARCHAR(191) NULL,
    `otp` VARCHAR(191) NULL,
    `otp_created_at` TIMESTAMP(0) NULL,
    `personal_group_id` BIGINT UNSIGNED NULL,
    `image_uid` CHAR(36) NULL,
    `verif_code` INTEGER NULL,
    `verif_expir` TIMESTAMP(0) NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'user',
    `timezone` VARCHAR(191) NULL,
    `avatar_url` VARCHAR(191) NULL,
    `account_type` INTEGER NOT NULL DEFAULT 1,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `deleted_timestamp` INTEGER NULL,
    `session_otp` INTEGER NULL,

    UNIQUE INDEX `user_email_unique`(`email`),
    UNIQUE INDEX `user_msisdn_unique`(`msisdn`),
    INDEX `user_msisdn_index`(`msisdn`),
    INDEX `user_personal_group_id_foreign`(`personal_group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_blocked_by_users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `blocked` VARCHAR(191) NOT NULL,
    `date` TIMESTAMP(0) NULL,

    INDEX `users_blocked_by_users_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_reported_by_users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `reported` VARCHAR(191) NOT NULL,
    `date` TIMESTAMP(0) NULL,
    `event_id` INTEGER NULL,
    `reason` TEXT NULL,

    INDEX `users_reported_by_users_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `videowall_media` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `device_id` BIGINT UNSIGNED NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `item_group_id` VARCHAR(191) NULL,
    `image_fit` VARCHAR(191) NOT NULL,
    `column` VARCHAR(191) NOT NULL,
    `rotation` INTEGER NOT NULL DEFAULT 0,
    `media_type` VARCHAR(191) NOT NULL DEFAULT 'image',

    INDEX `videowall_media_device_id_foreign`(`device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `websockets_statistics_entries` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `app_id` VARCHAR(191) NOT NULL,
    `peak_connections_count` INTEGER NOT NULL,
    `websocket_messages_count` INTEGER NOT NULL,
    `api_messages_count` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `action` ADD CONSTRAINT `action_controller_id_foreign` FOREIGN KEY (`controller_id`) REFERENCES `controller`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `action` ADD CONSTRAINT `action_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `device`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `action` ADD CONSTRAINT `action_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ad_event` ADD CONSTRAINT `ad_event_ad_id_foreign` FOREIGN KEY (`ad_id`) REFERENCES `ad`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ad_event` ADD CONSTRAINT `ad_event_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `address_list` ADD CONSTRAINT `address_list_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `address_list_event` ADD CONSTRAINT `address_list_event_address_list_id_foreign` FOREIGN KEY (`address_list_id`) REFERENCES `address_list`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `address_list_event` ADD CONSTRAINT `address_list_event_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chatbot_event` ADD CONSTRAINT `chatbot_event_chatbot_id_foreign` FOREIGN KEY (`chatbot_id`) REFERENCES `chatbot`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chatbot_event` ADD CONSTRAINT `chatbot_event_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `controller` ADD CONSTRAINT `controller_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_stream_id_foreign` FOREIGN KEY (`stream_id`) REFERENCES `stream`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `device_event` ADD CONSTRAINT `device_event_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `device`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `device_event` ADD CONSTRAINT `device_event_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `domain_event` ADD CONSTRAINT `domain_event_domain_id_foreign` FOREIGN KEY (`domain_id`) REFERENCES `domain`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `domain_event` ADD CONSTRAINT `domain_event_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `domain_group` ADD CONSTRAINT `domain_group_domain_id_foreign` FOREIGN KEY (`domain_id`) REFERENCES `domain`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `domain_group` ADD CONSTRAINT `domain_group_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `email_user` ADD CONSTRAINT `email_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_blocked` ADD CONSTRAINT `event_blocked_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_flagged` ADD CONSTRAINT `event_flagged_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_interested` ADD CONSTRAINT `event_interested_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_logs` ADD CONSTRAINT `event_logs_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_opened` ADD CONSTRAINT `event_opened_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_poll` ADD CONSTRAINT `event_poll_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_registered` ADD CONSTRAINT `event_registered_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_removed` ADD CONSTRAINT `event_removed_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_requests` ADD CONSTRAINT `event_requests_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_requests` ADD CONSTRAINT `event_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_simulation` ADD CONSTRAINT `event_simulation_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_simulation` ADD CONSTRAINT `event_simulation_simulation_id_foreign` FOREIGN KEY (`simulation_id`) REFERENCES `simulation`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_stream` ADD CONSTRAINT `event_stream_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_stream` ADD CONSTRAINT `event_stream_stream_id_foreign` FOREIGN KEY (`stream_id`) REFERENCES `stream`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_template` ADD CONSTRAINT `event_template_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_template` ADD CONSTRAINT `event_template_template_id_foreign` FOREIGN KEY (`template_id`) REFERENCES `template`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_user` ADD CONSTRAINT `event_user_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event_user` ADD CONSTRAINT `event_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feed` ADD CONSTRAINT `feed_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `group` ADD CONSTRAINT `group_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `group_user` ADD CONSTRAINT `group_user_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `group_user` ADD CONSTRAINT `group_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `invite` ADD CONSTRAINT `invite_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `invite_template` ADD CONSTRAINT `invite_template_invite_id_foreign` FOREIGN KEY (`invite_id`) REFERENCES `invite`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `invite_template` ADD CONSTRAINT `invite_template_template_id_foreign` FOREIGN KEY (`template_id`) REFERENCES `template`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `item` ADD CONSTRAINT `item_feed_id_foreign` FOREIGN KEY (`feed_id`) REFERENCES `feed`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kpi_emotes_sent` ADD CONSTRAINT `kpi_emotes_sent_msisdn_foreign` FOREIGN KEY (`msisdn`) REFERENCES `user`(`msisdn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kpi_message_sent` ADD CONSTRAINT `kpi_message_sent_msisdn_foreign` FOREIGN KEY (`msisdn`) REFERENCES `kpi_odience_user`(`msisdn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kpi_odience_user_to_user_call` ADD CONSTRAINT `kpi_odience_user_to_user_call_callee_id_foreign` FOREIGN KEY (`callee_id`) REFERENCES `kpi_odience_user`(`msisdn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kpi_odience_user_to_user_call` ADD CONSTRAINT `kpi_odience_user_to_user_call_msisdn_foreign` FOREIGN KEY (`msisdn`) REFERENCES `kpi_odience_user`(`msisdn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kpi_questions_sent` ADD CONSTRAINT `kpi_questions_sent_msisdn_foreign` FOREIGN KEY (`msisdn`) REFERENCES `user`(`msisdn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kpi_user_device_interaction` ADD CONSTRAINT `kpi_user_device_interaction_msisdn_foreign` FOREIGN KEY (`msisdn`) REFERENCES `kpi_odience_user`(`msisdn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kpi_user_picture_taken` ADD CONSTRAINT `kpi_user_picture_taken_msisdn_foreign` FOREIGN KEY (`msisdn`) REFERENCES `kpi_odience_user`(`msisdn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kpi_user_qr_code_scan` ADD CONSTRAINT `kpi_user_qr_code_scan_msisdn_foreign` FOREIGN KEY (`msisdn`) REFERENCES `kpi_odience_user`(`msisdn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `media_content` ADD CONSTRAINT `media_content_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `media_content` ADD CONSTRAINT `media_content_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `model_has_permission` ADD CONSTRAINT `model_has_permission_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `model_has_role` ADD CONSTRAINT `model_has_role_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `model_logs` ADD CONSTRAINT `model_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pro_publisher` ADD CONSTRAINT `pro_publisher_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `role_has_permission` ADD CONSTRAINT `role_has_permission_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `role_has_permission` ADD CONSTRAINT `role_has_permission_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `roles_user_group` ADD CONSTRAINT `roles_user_group_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `roles_user_group` ADD CONSTRAINT `roles_user_group_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `roles_user_group` ADD CONSTRAINT `roles_user_group_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `session_logs` ADD CONSTRAINT `session_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `shopping_feed` ADD CONSTRAINT `shopping_feed_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sip` ADD CONSTRAINT `sip_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `device`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sponsor_event` ADD CONSTRAINT `sponsor_event_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sponsor_event` ADD CONSTRAINT `sponsor_event_sponsor_id_foreign` FOREIGN KEY (`sponsor_id`) REFERENCES `sponsor`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sponsor_group` ADD CONSTRAINT `sponsor_group_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sponsor_group` ADD CONSTRAINT `sponsor_group_sponsor_id_foreign` FOREIGN KEY (`sponsor_id`) REFERENCES `sponsor`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `stream` ADD CONSTRAINT `stream_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `stream_url` ADD CONSTRAINT `stream_url_stream_id_foreign` FOREIGN KEY (`stream_id`) REFERENCES `stream`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `stream_url_token` ADD CONSTRAINT `stream_url_token_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `template` ADD CONSTRAINT `template_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `trigger_logs` ADD CONSTRAINT `trigger_logs_action_id_foreign` FOREIGN KEY (`action_id`) REFERENCES `action`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `trigger_logs` ADD CONSTRAINT `trigger_logs_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_personal_group_id_foreign` FOREIGN KEY (`personal_group_id`) REFERENCES `group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_blocked_by_users` ADD CONSTRAINT `users_blocked_by_users_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_reported_by_users` ADD CONSTRAINT `users_reported_by_users_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `videowall_media` ADD CONSTRAINT `videowall_media_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `device`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;


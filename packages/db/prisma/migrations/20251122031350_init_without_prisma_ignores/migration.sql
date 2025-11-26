-- AlterTable
ALTER TABLE `ad_event` ADD PRIMARY KEY (`ad_id`, `event_id`);

-- AlterTable
ALTER TABLE `address_list_event` ADD PRIMARY KEY (`event_id`, `address_list_id`);

-- AlterTable
ALTER TABLE `chatbot_event` ADD PRIMARY KEY (`chatbot_id`, `event_id`);

-- AlterTable
ALTER TABLE `device_event` ADD PRIMARY KEY (`device_id`, `event_id`);

-- AlterTable
ALTER TABLE `domain_event` ADD PRIMARY KEY (`domain_id`, `event_id`);

-- AlterTable
ALTER TABLE `domain_group` ADD PRIMARY KEY (`domain_id`, `group_id`);

-- AlterTable
ALTER TABLE `event_simulation` ADD PRIMARY KEY (`simulation_id`, `event_id`);

-- AlterTable
ALTER TABLE `event_stream` ADD PRIMARY KEY (`stream_id`, `event_id`);

-- AlterTable
ALTER TABLE `event_template` ADD PRIMARY KEY (`event_id`, `template_id`);

-- AlterTable
ALTER TABLE `event_user` ADD PRIMARY KEY (`user_id`, `event_id`);

-- AlterTable
ALTER TABLE `group_user` ADD PRIMARY KEY (`group_id`, `user_id`);

-- AlterTable
ALTER TABLE `invite_template` ADD PRIMARY KEY (`template_id`, `invite_id`);

-- AlterTable
ALTER TABLE `password_resets` ADD PRIMARY KEY (`email`);

-- AlterTable
ALTER TABLE `roles_user_group` ADD PRIMARY KEY (`role_id`, `user_id`);

-- AlterTable
ALTER TABLE `sponsor_event` ADD PRIMARY KEY (`sponsor_id`, `event_id`);

-- AlterTable
ALTER TABLE `sponsor_group` ADD PRIMARY KEY (`sponsor_id`, `group_id`);

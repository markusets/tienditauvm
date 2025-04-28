-- Adminer 5.2.1 MySQL 5.7.44 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` varchar(36) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `category` (`id`, `created_at`, `updated_at`, `category_name`) VALUES
('49573bcd-1907-449e-9eb8-6f25388c274f',	'2024-11-14 01:35:10.508426',	'2024-11-14 01:35:10.508426',	'Regalos Personalizados'),
('568f075b-a1e9-4eff-b2f7-5befca866203',	'2024-11-13 16:22:15.960082',	'2024-11-13 16:22:15.960082',	'Ropa Personalizada'),
('6764cb36-eb6e-45f8-95ad-454050e1fa5e',	'2024-11-14 01:34:28.109463',	'2024-11-14 01:34:28.109463',	'Accesorios Personalizados'),
('6a8eaffc-2ef8-4780-8d17-ca5231d3bc00',	'2024-11-14 01:35:25.119129',	'2024-11-14 01:35:25.119129',	'Organizacion de Eventos'),
('8179b265-559e-43b8-b04d-362c4cf401d7',	'2024-11-14 01:34:49.011559',	'2024-11-14 01:34:49.011559',	'Papeleria Creativa');

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1,	1731437760003,	'InitSchema1731437760003');

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `product_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `url_photo` varchar(255) DEFAULT NULL,
  `category_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_9a5f6868c96e0069e699f33e124` (`category_id`),
  CONSTRAINT `FK_9a5f6868c96e0069e699f33e124` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `subscription_news`;
CREATE TABLE `subscription_news` (
  `id` varchar(36) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `subscribe_email` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `subscription_news` (`id`, `created_at`, `updated_at`, `subscribe_email`, `status`) VALUES
('0c386c7b-032d-4cb1-9f98-7feef2954c92',	'2024-11-14 18:11:07.955064',	'2024-11-14 18:11:07.955064',	'sofia@uvm.com',	'active'),
('325fbdb3-4f55-4ff3-aa6d-f7946accac5a',	'2024-11-16 23:15:01.955135',	'2024-11-16 23:15:01.955135',	'raiza@gmail.com',	'active'),
('3733c12c-d17e-41ed-a13a-7616385b45bd',	'2025-04-24 23:35:07.942981',	'2025-04-24 23:35:07.942981',	'salazargodoyjesus@gmail.com',	'active'),
('55d45c94-3939-4220-a194-a55eb0a26eac',	'2024-11-16 04:36:08.075622',	'2024-11-16 04:36:08.075622',	'leo@gmail.com',	'active'),
('698e4417-75f7-4ab7-9d48-f2827e65dcd3',	'2024-11-16 20:04:02.247916',	'2024-11-16 20:04:02.247916',	'michael@gmail.com',	'active'),
('8f835018-7d96-426b-ab3c-e56ed96a5773',	'2025-04-28 20:38:58.347162',	'2025-04-28 20:38:58.347162',	'prueba@gmail.com',	'active'),
('a1ca422b-e7f1-4efe-903d-457e65013350',	'2025-04-26 19:23:47.292686',	'2025-04-26 19:23:47.292686',	'salazargodoyja@uvm.edu.ve',	'active'),
('b182cbcc-d81d-4f3b-b82e-6db42d02f9df',	'2024-11-16 23:31:54.862080',	'2024-11-16 23:31:54.862080',	'michael2@gmail.com',	'active'),
('ee3fd8bc-e472-48a7-88e4-71a3e5a9e3c9',	'2024-11-14 18:07:38.920370',	'2024-11-14 18:07:38.920370',	'joseuvm@gmail.com',	'active');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `name`, `lastname`, `email`, `password`, `role`) VALUES
('02d45536-22a4-4c3f-86bf-305bb7b72fb3',	'2024-11-12 20:34:35.717302',	'2024-11-17 07:09:39.000000',	'admin',	'admin sdasd',	'admin@proton.me',	'$2b$12$YG0rXBvF/UAIxYynwdzUMO6JvMwL/8N9gLRpaJbQ6kqbSA0BTeWoW',	'admin');

-- 2025-04-28 21:32:14 UTC

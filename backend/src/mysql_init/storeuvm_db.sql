-- Adminer 4.8.1 MySQL 5.7.43 dump

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

INSERT INTO `products` (`id`, `created_at`, `updated_at`, `product_name`, `description`, `price`, `url_photo`, `category_id`) VALUES
('054ed93f-5cff-4e2a-bca3-f36c0c78dced',	'2024-11-14 02:03:11.761851',	'2024-11-16 04:05:32.457841',	'Sweater Dama ',	'Ideales para eventos, promociones',	15,	'/uploads/photo-1731549791740-487937521.png',	'568f075b-a1e9-4eff-b2f7-5befca866203'),
('2d774a02-8e0e-4db7-b1f1-920b5d6b45e8',	'2024-11-17 04:48:07.294692',	'2024-11-17 04:48:07.294692',	'Real Donald Trump',	'NFT 1 BTC',	90000,	'/uploads/photo-1731818887238-254853236.webp',	'6a8eaffc-2ef8-4780-8d17-ca5231d3bc00'),
('4a4055d1-41ee-4d96-8718-9f23b40956fc',	'2024-11-17 03:17:58.026280',	'2024-11-17 03:17:58.026280',	'Toro Prueba',	'123',	2000,	'/uploads/photo-1731813477931-733035233.png',	'8179b265-559e-43b8-b04d-362c4cf401d7'),
('a2dbe07e-c615-4085-8b2c-4a7210a2b4d7',	'2024-11-17 03:43:09.370930',	'2024-11-17 03:43:09.370930',	'prueba cliente',	'asdasdas',	300,	'/uploads/photo-1731814989275-411229641.png',	'6764cb36-eb6e-45f8-95ad-454050e1fa5e'),
('aad5e0e5-3636-44c8-9de3-e17ca90a1c0e',	'2024-11-14 02:35:21.992492',	'2024-11-17 03:01:38.000000',	'Gorra Caballero',	'Ideales para eventos, promociones',	10,	'/uploads/photo-1731812498235-140456215.png',	'568f075b-a1e9-4eff-b2f7-5befca866203'),
('bb00698c-aa9e-44c2-a841-49e1aa332b30',	'2024-11-14 01:49:14.284369',	'2024-11-16 04:06:54.597965',	'Franela (dama)',	'Ideales para eventos, promociones o simplemente para expresarte, perfectas para cualquier ocasión',	10,	'/uploads/photo-1731548954253-182031318.png',	'568f075b-a1e9-4eff-b2f7-5befca866203'),
('dbc516f1-c8a3-4311-9f99-703ad2eec745',	'2024-11-17 03:03:19.657211',	'2024-11-17 03:03:19.657211',	'Go y Rust deben aprender',	'Budget 6000',	6000,	'/uploads/photo-1731812599578-678779765.png',	'6a8eaffc-2ef8-4780-8d17-ca5231d3bc00'),
('dc1a4169-08cb-4cf2-a78e-fb99d17fd8fe',	'2024-11-14 02:46:01.537095',	'2024-11-16 04:06:54.604463',	'Llavero Dama',	'Crea tu identidad',	5,	'/uploads/photo-1731552442246-474341760.png',	'6764cb36-eb6e-45f8-95ad-454050e1fa5e'),
('e7f7dbc8-645c-4079-8c99-aba1de03eb98',	'2024-11-16 20:37:59.507145',	'2024-11-16 20:37:59.507145',	'Prueba',	'Prueba',	1111,	'/uploads/photo-1731789479422-610407136.png',	'8179b265-559e-43b8-b04d-362c4cf401d7'),
('f8393baf-f0d8-43dc-8e68-258ebbf7ab56',	'2024-11-14 02:40:21.504087',	'2024-11-16 04:06:54.618105',	'Regalo del padre personalizado',	'Ideales para dias festivos',	30,	'/uploads/photo-1731554451015-353300552.png',	'49573bcd-1907-449e-9eb8-6f25388c274f');

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
('55d45c94-3939-4220-a194-a55eb0a26eac',	'2024-11-16 04:36:08.075622',	'2024-11-16 04:36:08.075622',	'leo@gmail.com',	'active'),
('698e4417-75f7-4ab7-9d48-f2827e65dcd3',	'2024-11-16 20:04:02.247916',	'2024-11-16 20:04:02.247916',	'michael@gmail.com',	'active'),
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
('00ef9ada-fc95-4d71-b69c-4c115fd3704d',	'2024-11-15 00:46:41.878029',	'2024-11-17 08:21:03.000000',	'Luis Daniel',	'Vieras',	'danikleann@proton.me',	'$2b$12$GYf0wjYcOTM7Flk1LDIbJ.SWpz/45wGfBAh0FBmIVdagxre7JK6Ue',	'admin'),
('02d45536-22a4-4c3f-86bf-305bb7b72fb3',	'2024-11-12 20:34:35.717302',	'2024-11-17 07:09:39.000000',	'admin',	'admin sdasd',	'admin@proton.me',	'$2b$12$YG0rXBvF/UAIxYynwdzUMO6JvMwL/8N9gLRpaJbQ6kqbSA0BTeWoW',	'admin'),
('b395d6eb-9333-4ccd-bcf8-3bc0ade13499',	'2024-11-15 20:00:46.164052',	'2024-11-15 20:00:46.164052',	'Sofia',	'Rivera',	'sofiarivera@gmail.com',	'$2b$12$QAv2ntqGrp5P67xIGBDRPOEWa5qkSxA.u9aGWuTAErhVX3U.IIDJW',	'user');

-- 2024-11-17 20:32:11
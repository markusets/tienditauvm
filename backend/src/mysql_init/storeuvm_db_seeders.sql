-- Archivo de seeders para datos de prueba/desarrollo
-- USAR SOLO CUANDO SE NECESITEN DATOS DE EJEMPLO
-- NO montar en docker-compose para producción
-- Ejecutar manualmente: docker exec -i tienditauvm-service_db-1 mysql -uuadmin -psecret storeuvm_db < storeuvm_db_seeders.sql

SET NAMES utf8;
SET time_zone = '+00:00';

-- Categorías de ejemplo
INSERT INTO `category` (`id`, `created_at`, `updated_at`, `category_name`) VALUES
('49573bcd-1907-449e-9eb8-6f25388c274f',	NOW(),	NOW(),	'Regalos Personalizados'),
('568f075b-a1e9-4eff-b2f7-5befca866203',	NOW(),	NOW(),	'Ropa Personalizada'),
('6764cb36-eb6e-45f8-95ad-454050e1fa5e',	NOW(),	NOW(),	'Accesorios Personalizados'),
('6a8eaffc-2ef8-4780-8d17-ca5231d3bc00',	NOW(),	NOW(),	'Organizacion de Eventos'),
('8179b265-559e-43b8-b04d-362c4cf401d7',	NOW(),	NOW(),	'Papeleria Creativa')
ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);

-- Productos de ejemplo
INSERT INTO `products` (`id`, `created_at`, `updated_at`, `product_name`, `description`, `price`, `url_photo`, `category_id`) VALUES
('054ed93f-5cff-4e2a-bca3-f36c0c78dced',	NOW(),	NOW(),	'Sweater Dama ',	'Ideales para eventos, promociones',	15,	'/uploads/photo-1731549791740-487937521.png',	'568f075b-a1e9-4eff-b2f7-5befca866203'),
('2d774a02-8e0e-4db7-b1f1-920b5d6b45e8',	NOW(),	NOW(),	'Real Donald Trump',	'NFT 1 BTC',	90000,	'/uploads/photo-1731818887238-254853236.webp',	'6a8eaffc-2ef8-4780-8d17-ca5231d3bc00'),
('4a4055d1-41ee-4d96-8718-9f23b40956fc',	NOW(),	NOW(),	'Toro Prueba',	'123',	2000,	'/uploads/photo-1731813477931-733035233.png',	'8179b265-559e-43b8-b04d-362c4cf401d7'),
('a2dbe07e-c615-4085-8b2c-4a7210a2b4d7',	NOW(),	NOW(),	'prueba cliente',	'asdasdas',	300,	'/uploads/photo-1731814989275-411229641.png',	'6764cb36-eb6e-45f8-95ad-454050e1fa5e'),
('aad5e0e5-3636-44c8-9de3-e17ca90a1c0e',	NOW(),	NOW(),	'Gorra Caballero',	'Ideales para eventos, promociones',	10,	'/uploads/photo-1731812498235-140456215.png',	'568f075b-a1e9-4eff-b2f7-5befca866203'),
('bb00698c-aa9e-44c2-a841-49e1aa332b30',	NOW(),	NOW(),	'Franela (dama)',	'Ideales para eventos, promociones o simplemente para expresarte, perfectas para cualquier ocasión',	10,	'/uploads/photo-1731548954253-182031318.png',	'568f075b-a1e9-4eff-b2f7-5befca866203'),
('dbc516f1-c8a3-4311-9f99-703ad2eec745',	NOW(),	NOW(),	'Go y Rust deben aprender',	'Budget 6000',	6000,	'/uploads/photo-1731812599578-678779765.png',	'6a8eaffc-2ef8-4780-8d17-ca5231d3bc00'),
('dc1a4169-08cb-4cf2-a78e-fb99d17fd8fe',	NOW(),	NOW(),	'Llavero Dama',	'Crea tu identidad',	5,	'/uploads/photo-1731552442246-474341760.png',	'6764cb36-eb6e-45f8-95ad-454050e1fa5e'),
('e7f7dbc8-645c-4079-8c99-aba1de03eb98',	NOW(),	NOW(),	'Prueba',	'Prueba',	1111,	'/uploads/photo-1731789479422-610407136.png',	'8179b265-559e-43b8-b04d-362c4cf401d7'),
('f8393baf-f0d8-43dc-8e68-258ebbf7ab56',	NOW(),	NOW(),	'Regalo del padre personalizado',	'Ideales para dias festivos',	30,	'/uploads/photo-1731554451015-353300552.png',	'49573bcd-1907-449e-9eb8-6f25388c274f')
ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);

-- Suscripciones de ejemplo
INSERT INTO `subscription_news` (`id`, `created_at`, `updated_at`, `subscribe_email`, `status`) VALUES
('0c386c7b-032d-4cb1-9f98-7feef2954c92',	NOW(),	NOW(),	'sofia@uvm.com',	'active'),
('325fbdb3-4f55-4ff3-aa6d-f7946accac5a',	NOW(),	NOW(),	'raiza@gmail.com',	'active'),
('55d45c94-3939-4220-a194-a55eb0a26eac',	NOW(),	NOW(),	'leo@gmail.com',	'active'),
('698e4417-75f7-4ab7-9d48-f2827e65dcd3',	NOW(),	NOW(),	'michael@gmail.com',	'active'),
('b182cbcc-d81d-4f3b-b82e-6db42d02f9df',	NOW(),	NOW(),	'michael2@gmail.com',	'active'),
('ee3fd8bc-e472-48a7-88e4-71a3e5a9e3c9',	NOW(),	NOW(),	'joseuvm@gmail.com',	'active')
ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);

-- Usuarios de prueba adicionales (NO admins - el admin se crea en el script principal)
INSERT INTO `users` (`id`, `created_at`, `updated_at`, `name`, `lastname`, `email`, `password`, `role`) VALUES
('00ef9ada-fc95-4d71-b69c-4c115fd3704d',	NOW(),	NOW(),	'Luis Daniel',	'Vieras',	'danikleann@proton.me',	'$2b$12$GYf0wjYcOTM7Flk1LDIbJ.SWpz/45wGfBAh0FBmIVdagxre7JK6Ue',	'user'),
('b395d6eb-9333-4ccd-bcf8-3bc0ade13499',	NOW(),	NOW(),	'Sofia',	'Rivera',	'sofiarivera@gmail.com',	'$2b$12$QAv2ntqGrp5P67xIGBDRPOEWa5qkSxA.u9aGWuTAErhVX3U.IIDJW',	'user')
ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
-- Script de inicialización seguro para tienditauvm
-- No elimina datos existentes, solo crea estructura si no existe

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS `category` (
  `id` varchar(36) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Tabla de migraciones
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS `products` (
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

-- Tabla de suscripciones
CREATE TABLE IF NOT EXISTS `subscription_news` (
  `id` varchar(36) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `subscribe_email` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS `users` (
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

-- Insertar usuario administrador inicial SOLO si no existe este usuario específico
-- Esto garantiza que siempre haya al menos un admin para poder usar el sistema
-- pero NO sobrescribe si el usuario ya existe (por email o ID)
-- INSERT IGNORE no hace nada si encuentra un conflicto de clave única (ID o email)
INSERT IGNORE INTO `users` (`id`, `created_at`, `updated_at`, `name`, `lastname`, `email`, `password`, `role`)
VALUES (
  '02d45536-22a4-4c3f-86bf-305bb7b72fb3',
  NOW(),
  NOW(),
  'admin',
  'admin',
  'admin@proton.me',
  '$2b$12$YG0rXBvF/UAIxYynwdzUMO6JvMwL/8N9gLRpaJbQ6kqbSA0BTeWoW',
  'admin'
);

-- Verificación de seguridad: Si por alguna razón no hay NINGÚN admin, crear uno de emergencia
-- Esto es un fallback para asegurar que el sistema nunca quede sin admin
INSERT INTO `users` (`id`, `created_at`, `updated_at`, `name`, `lastname`, `email`, `password`, `role`)
SELECT
  UUID(),
  NOW(),
  NOW(),
  'Emergency Admin',
  'System',
  CONCAT('admin_emergency_', UNIX_TIMESTAMP(), '@system.local'),
  '$2b$12$YG0rXBvF/UAIxYynwdzUMO6JvMwL/8N9gLRpaJbQ6kqbSA0BTeWoW',
  'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM `users` WHERE `role` = 'admin' LIMIT 1
);

-- Restaurar configuración
SET foreign_key_checks = 1;
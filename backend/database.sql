-- Script para crear la base de datos MySQL
-- Ejecutar este script en MySQL Workbench o línea de comandos

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS proyecto_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE proyecto_db;

-- Crear usuario para la aplicación (opcional, puedes usar root)
-- CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password_seguro';
-- GRANT ALL PRIVILEGES ON proyecto_db.* TO 'app_user'@'localhost';
-- FLUSH PRIVILEGES;

-- La tabla de usuarios se creará automáticamente con Sequelize
-- pero aquí está la estructura como referencia:


CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar TEXT,
    bio VARCHAR(500) DEFAULT '',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

CREATE TABLE IF NOT EXISTS posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    userId INT UNSIGNED NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_userId (userId)
);



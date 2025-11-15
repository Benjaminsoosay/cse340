-- =========================================
-- Assignment 2: Complete Your Database
-- =========================================

-- 1. Build database script (tables + types)
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    client_firstname VARCHAR(50) NOT NULL,
    client_lastname VARCHAR(50) NOT NULL,
    client_email VARCHAR(100) UNIQUE NOT NULL,
    client_password VARCHAR(255) NOT NULL
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_name VARCHAR(100) NOT NULL,
    inv_description TEXT,
    inv_image VARCHAR(255),
    inv_thumbnail VARCHAR(255),
    category_id INT REFERENCES categories(category_id)
);

-- Insert sample categories
INSERT INTO categories (category_name) VALUES
('Technology'),
('Books'),
('Fitness'),
('Food');

-- Insert sample inventory
INSERT INTO inventory (inv_name, inv_description, inv_image, inv_thumbnail, category_id)
VALUES
('Iron Man Suit', 'Advanced armor powered by arc reactor.', '/images/ironman.jpg', '/images/ironman-thumb.jpg', 1),
('Main Street Books', 'Local bookstore with wide selection.', '/images/books.jpg', '/images/books-thumb.jpg', 2);

-- =========================================
-- 2. Tony Stark Insert
-- =========================================
INSERT INTO clients (client_firstname, client_lastname, client_email, client_password)
VALUES ('Tony', 'Stark', 'tony@starkindustries.com', 'ironman123');

-- =========================================
-- 3. Tony Stark Update
-- =========================================
UPDATE clients
SET client_email = 'tony.stark@avengers.com'
WHERE client_firstname = 'Tony' AND client_lastname = 'Stark';

-- =========================================
-- 4. Tony Stark Delete
-- =========================================
DELETE FROM clients
WHERE client_firstname = 'Tony' AND client_lastname = 'Stark';

-- =========================================
-- 5. Description Update
-- =========================================
UPDATE inventory
SET inv_description = 'The ultimate superhero armor with advanced AI and flight capabilities.'
WHERE inv_name = 'Iron Man Suit';

-- =========================================
-- 6. Select with JOIN
-- =========================================
SELECT i.inv_name, i.inv_description, c.category_name
FROM inventory i
JOIN categories c ON i.category_id = c.category_id;

-- =========================================
-- 7. Image Update
-- =========================================
UPDATE inventory
SET inv_image = '/images/ironman-new.jpg',
    inv_thumbnail = '/images/ironman-new-thumb.jpg'
WHERE inv_name = 'Iron Man Suit';


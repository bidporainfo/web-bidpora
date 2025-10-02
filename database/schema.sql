-- Database schema for BIDPORA Web Application
-- Created for admin management with image upload capabilities

CREATE DATABASE IF NOT EXISTS bidpora_web;
USE bidpora_web;

-- Users table for admin authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- News table for berita section
CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    author VARCHAR(100),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT TRUE
);

-- Achievements table for prestasi section
CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(100),
    achievement_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Gallery table for galeri section
CREATE TABLE gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events table for kalender section
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(255),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Medal tallies table for medali section
CREATE TABLE medal_tallies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    competition_name VARCHAR(255) NOT NULL,
    gold_count INT DEFAULT 0,
    silver_count INT DEFAULT 0,
    bronze_count INT DEFAULT 0,
    total_count INT GENERATED ALWAYS AS (gold_count + silver_count + bronze_count) STORED,
    competition_date DATE,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Match schedules table for jadwal section
CREATE TABLE match_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sport VARCHAR(100) NOT NULL,
    team_a VARCHAR(255) NOT NULL,
    team_b VARCHAR(255) NOT NULL,
    match_date DATE NOT NULL,
    match_time TIME NOT NULL,
    venue VARCHAR(255),
    status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
    result_a INT DEFAULT NULL,
    result_b INT DEFAULT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact information table
CREATE TABLE contact_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    value VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@bidpora.jepara.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample contact information
INSERT INTO contact_info (type, value, icon, is_primary) VALUES 
('phone', '0291-123456', 'fas fa-phone', TRUE),
('email', 'info@bidpora.jepara.go.id', 'fas fa-envelope', TRUE),
('address', 'Jl. Pemuda No. 1, Jepara', 'fas fa-map-marker-alt', TRUE),
('website', 'www.bidpora.jepara.go.id', 'fas fa-globe', FALSE);

-- Insert sample news
INSERT INTO news (title, content, image_url, author, is_published) VALUES 
('PON XXI Aceh-Sumut 2024', 'Atlet Kabupaten Jepara berhasil meraih prestasi gemilang dalam PON XXI yang diselenggarakan di Aceh dan Sumatera Utara.', 'assets/images/pon.jpg', 'Admin BIDPORA', TRUE),
('Kejuaraan Bulutangkis Regional', 'Tim bulutangkis Kabupaten Jepara berhasil menjadi juara dalam kejuaraan regional yang diselenggarakan di Semarang.', 'assets/images/pon1.jpg', 'Admin BIDPORA', TRUE),
('Pelatihan Atlet Muda', 'BIDPORA mengadakan pelatihan intensif untuk atlet muda dalam berbagai cabang olahraga.', 'assets/images/pon2.jpg', 'Admin BIDPORA', TRUE);

-- Insert sample achievements
INSERT INTO achievements (title, description, image_url, category, achievement_date) VALUES 
('Juara 1 PON XXI', 'Berhasil meraih juara 1 dalam cabang olahraga atletik', 'assets/images/pon.jpg', 'Atletik', '2024-10-15'),
('Medali Emas Renang', 'Mendapatkan medali emas dalam kategori renang gaya bebas', 'assets/images/pon1.jpg', 'Renang', '2024-09-20'),
('Prestasi Bulutangkis', 'Menjadi juara dalam turnamen bulutangkis regional', 'assets/images/pon2.jpg', 'Bulutangkis', '2024-08-10');

-- Insert sample gallery
INSERT INTO gallery (title, description, image_url, category) VALUES 
('Momentum Kemenangan', 'Momen kebahagiaan atlet setelah meraih kemenangan', 'assets/images/pon.jpg', 'Prestasi'),
('Latihan Tim', 'Sesi latihan intensif tim olahraga', 'assets/images/pon1.jpg', 'Latihan'),
('Upacara Penghargaan', 'Upacara pemberian penghargaan kepada atlet berprestasi', 'assets/images/pon2.jpg', 'Penghargaan');

-- Insert sample events
INSERT INTO events (title, description, event_date, event_time, location, image_url) VALUES 
('Kejuaraan Sepak Bola U-17', 'Kejuaraan sepak bola untuk kategori usia 17 tahun ke bawah', '2024-12-15', '08:00:00', 'Lapangan Sepak Bola Jepara', 'assets/images/pon3.jpg'),
('Pelatihan Atletik', 'Pelatihan khusus untuk atlet atletik', '2024-12-20', '14:00:00', 'GOR Jepara', 'assets/images/pon5.jpg'),
('Turnamen Bulutangkis', 'Turnamen bulutangkis antar klub', '2024-12-25', '09:00:00', 'GOR Bulutangkis Jepara', 'assets/images/pon1.jpg');

-- Insert sample medal tallies
INSERT INTO medal_tallies (competition_name, gold_count, silver_count, bronze_count, competition_date, image_url) VALUES 
('PON XXI Aceh-Sumut 2024', 5, 3, 2, '2024-10-15', 'assets/images/pon.jpg'),
('Kejuaraan Regional', 3, 4, 1, '2024-09-20', 'assets/images/pon1.jpg'),
('Turnamen Nasional', 2, 2, 3, '2024-08-10', 'assets/images/pon2.jpg');

-- Insert sample match schedules
INSERT INTO match_schedules (sport, team_a, team_b, match_date, match_time, venue, status, result_a, result_b, image_url) VALUES 
('Sepak Bola', 'Jepara FC', 'Kudus United', '2024-12-15', '15:00:00', 'Lapangan Jepara', 'upcoming', NULL, NULL, 'assets/images/pon3.jpg'),
('Basket', 'Jepara Warriors', 'Semarang Giants', '2024-12-16', '19:00:00', 'GOR Jepara', 'upcoming', NULL, NULL, 'assets/images/pon5.jpg'),
('Voli', 'Jepara Spikers', 'Pati Thunder', '2024-12-10', '16:00:00', 'GOR Voli Jepara', 'completed', 3, 1, 'assets/images/pon1.jpg');

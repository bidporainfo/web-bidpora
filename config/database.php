<?php
// Database configuration for DISPORA Web Application

class Database {
    private $host = 'localhost';
    private $db_name = 'dispora_web';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            echo "Connection error: " . $e->getMessage();
        }
        
        return $this->conn;
    }
}

// Image upload configuration
class ImageUpload {
    private $upload_dir = 'assets/uploads/';
    private $allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    private $max_size = 5 * 1024 * 1024; // 5MB
    
    public function uploadImage($file, $prefix = '') {
        if (!isset($file['error']) || is_array($file['error'])) {
            throw new RuntimeException('Invalid parameters.');
        }
        
        switch ($file['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                throw new RuntimeException('No file sent.');
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                throw new RuntimeException('Exceeded filesize limit.');
            default:
                throw new RuntimeException('Unknown errors.');
        }
        
        if ($file['size'] > $this->max_size) {
            throw new RuntimeException('Exceeded filesize limit.');
        }
        
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime_type = $finfo->file($file['tmp_name']);
        
        $ext = array_search(
            $mime_type,
            [
                'jpg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
            ],
            true
        );
        
        if (false === $ext) {
            throw new RuntimeException('Invalid file format.');
        }
        
        $filename = $prefix . uniqid() . '.' . $ext;
        $filepath = $this->upload_dir . $filename;
        
        if (!is_dir($this->upload_dir)) {
            mkdir($this->upload_dir, 0755, true);
        }
        
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new RuntimeException('Failed to move uploaded file.');
        }
        
        return $filepath;
    }
    
    public function deleteImage($filepath) {
        if (file_exists($filepath)) {
            unlink($filepath);
        }
    }
}

// API Response helper
class ApiResponse {
    public static function success($data = null, $message = 'Success') {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
        exit;
    }
    
    public static function error($message = 'Error', $code = 400) {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
        exit;
    }
}

// Authentication helper
class Auth {
    public static function checkAdmin() {
        session_start();
        if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
            ApiResponse::error('Unauthorized access', 401);
        }
    }
    
    public static function login($username, $password) {
        $db = new Database();
        $conn = $db->getConnection();
        
        $stmt = $conn->prepare("SELECT id, username, password_hash, role FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password_hash'])) {
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            return true;
        }
        
        return false;
    }
    
    public static function logout() {
        session_start();
        session_destroy();
    }
}
?>

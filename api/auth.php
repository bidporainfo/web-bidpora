<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Login
        $input = json_decode(file_get_contents('php://input'), true);
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            ApiResponse::error('Username and password are required');
        }
        
        if (Auth::login($username, $password)) {
            ApiResponse::success([
                'username' => $username,
                'role' => $_SESSION['role']
            ], 'Login successful');
        } else {
            ApiResponse::error('Invalid username or password', 401);
        }
        break;
        
    case 'GET':
        // Check login status
        session_start();
        if (isset($_SESSION['user_id'])) {
            ApiResponse::success([
                'logged_in' => true,
                'username' => $_SESSION['username'],
                'role' => $_SESSION['role']
            ]);
        } else {
            ApiResponse::success([
                'logged_in' => false
            ]);
        }
        break;
        
    default:
        ApiResponse::error('Method not allowed', 405);
}
?>

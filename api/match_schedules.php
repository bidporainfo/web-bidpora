<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$db = new Database();
$conn = $db->getConnection();
$imageUpload = new ImageUpload();

switch ($method) {
    case 'GET':
        // Get all match schedules
        $stmt = $conn->prepare("SELECT * FROM match_schedules ORDER BY match_date ASC, match_time ASC");
        $stmt->execute();
        $matches = $stmt->fetchAll();
        
        ApiResponse::success($matches);
        break;
        
    case 'POST':
        // Create new match schedule (Admin only)
        Auth::checkAdmin();
        
        $sport = $_POST['sport'] ?? '';
        $team_a = $_POST['team_a'] ?? '';
        $team_b = $_POST['team_b'] ?? '';
        $match_date = $_POST['match_date'] ?? '';
        $match_time = $_POST['match_time'] ?? '';
        $venue = $_POST['venue'] ?? '';
        $status = $_POST['status'] ?? 'upcoming';
        $result_a = isset($_POST['result_a']) ? (int)$_POST['result_a'] : null;
        $result_b = isset($_POST['result_b']) ? (int)$_POST['result_b'] : null;
        
        if (empty($sport) || empty($team_a) || empty($team_b) || empty($match_date) || empty($match_time)) {
            ApiResponse::error('Sport, teams, date, and time are required');
        }
        
        $image_url = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            try {
                $image_url = $imageUpload->uploadImage($_FILES['image'], 'match_');
            } catch (Exception $e) {
                ApiResponse::error('Image upload failed: ' . $e->getMessage());
            }
        }
        
        $stmt = $conn->prepare("INSERT INTO match_schedules (sport, team_a, team_b, match_date, match_time, venue, status, result_a, result_b, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$sport, $team_a, $team_b, $match_date, $match_time, $venue, $status, $result_a, $result_b, $image_url]);
        
        $match_id = $conn->lastInsertId();
        $stmt = $conn->prepare("SELECT * FROM match_schedules WHERE id = ?");
        $stmt->execute([$match_id]);
        $new_match = $stmt->fetch();
        
        ApiResponse::success($new_match, 'Match schedule created successfully');
        break;
        
    case 'PUT':
        // Update match schedule (Admin only)
        Auth::checkAdmin();
        
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        $sport = $input['sport'] ?? '';
        $team_a = $input['team_a'] ?? '';
        $team_b = $input['team_b'] ?? '';
        $match_date = $input['match_date'] ?? '';
        $match_time = $input['match_time'] ?? '';
        $venue = $input['venue'] ?? '';
        $status = $input['status'] ?? 'upcoming';
        $result_a = isset($input['result_a']) ? (int)$input['result_a'] : null;
        $result_b = isset($input['result_b']) ? (int)$input['result_b'] : null;
        
        if (empty($sport) || empty($team_a) || empty($team_b) || empty($match_date) || empty($match_time)) {
            ApiResponse::error('Sport, teams, date, and time are required');
        }
        
        $stmt = $conn->prepare("UPDATE match_schedules SET sport = ?, team_a = ?, team_b = ?, match_date = ?, match_time = ?, venue = ?, status = ?, result_a = ?, result_b = ? WHERE id = ?");
        $stmt->execute([$sport, $team_a, $team_b, $match_date, $match_time, $venue, $status, $result_a, $result_b, $id]);
        
        ApiResponse::success(null, 'Match schedule updated successfully');
        break;
        
    case 'DELETE':
        // Delete match schedule (Admin only)
        Auth::checkAdmin();
        
        $id = $_GET['id'] ?? 0;
        
        // Get image path before deleting
        $stmt = $conn->prepare("SELECT image_url FROM match_schedules WHERE id = ?");
        $stmt->execute([$id]);
        $match = $stmt->fetch();
        
        if ($match && $match['image_url']) {
            $imageUpload->deleteImage($match['image_url']);
        }
        
        $stmt = $conn->prepare("DELETE FROM match_schedules WHERE id = ?");
        $stmt->execute([$id]);
        
        ApiResponse::success(null, 'Match schedule deleted successfully');
        break;
        
    default:
        ApiResponse::error('Method not allowed', 405);
}
?>

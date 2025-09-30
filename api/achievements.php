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
        // Get all achievements
        $stmt = $conn->prepare("SELECT * FROM achievements ORDER BY achievement_date DESC");
        $stmt->execute();
        $achievements = $stmt->fetchAll();
        
        ApiResponse::success($achievements);
        break;
        
    case 'POST':
        // Create new achievement (Admin only)
        Auth::checkAdmin();
        
        $title = $_POST['title'] ?? '';
        $description = $_POST['description'] ?? '';
        $category = $_POST['category'] ?? '';
        $achievement_date = $_POST['achievement_date'] ?? date('Y-m-d');
        
        if (empty($title)) {
            ApiResponse::error('Title is required');
        }
        
        $image_url = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            try {
                $image_url = $imageUpload->uploadImage($_FILES['image'], 'achievement_');
            } catch (Exception $e) {
                ApiResponse::error('Image upload failed: ' . $e->getMessage());
            }
        }
        
        $stmt = $conn->prepare("INSERT INTO achievements (title, description, image_url, category, achievement_date) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$title, $description, $image_url, $category, $achievement_date]);
        
        $achievement_id = $conn->lastInsertId();
        $stmt = $conn->prepare("SELECT * FROM achievements WHERE id = ?");
        $stmt->execute([$achievement_id]);
        $new_achievement = $stmt->fetch();
        
        ApiResponse::success($new_achievement, 'Achievement created successfully');
        break;
        
    case 'PUT':
        // Update achievement (Admin only)
        Auth::checkAdmin();
        
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        $title = $input['title'] ?? '';
        $description = $input['description'] ?? '';
        $category = $input['category'] ?? '';
        $achievement_date = $input['achievement_date'] ?? date('Y-m-d');
        
        if (empty($title)) {
            ApiResponse::error('Title is required');
        }
        
        $stmt = $conn->prepare("UPDATE achievements SET title = ?, description = ?, category = ?, achievement_date = ? WHERE id = ?");
        $stmt->execute([$title, $description, $category, $achievement_date, $id]);
        
        ApiResponse::success(null, 'Achievement updated successfully');
        break;
        
    case 'DELETE':
        // Delete achievement (Admin only)
        Auth::checkAdmin();
        
        $id = $_GET['id'] ?? 0;
        
        // Get image path before deleting
        $stmt = $conn->prepare("SELECT image_url FROM achievements WHERE id = ?");
        $stmt->execute([$id]);
        $achievement = $stmt->fetch();
        
        if ($achievement && $achievement['image_url']) {
            $imageUpload->deleteImage($achievement['image_url']);
        }
        
        $stmt = $conn->prepare("DELETE FROM achievements WHERE id = ?");
        $stmt->execute([$id]);
        
        ApiResponse::success(null, 'Achievement deleted successfully');
        break;
        
    default:
        ApiResponse::error('Method not allowed', 405);
}
?>

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
        // Get all gallery items
        $stmt = $conn->prepare("SELECT * FROM gallery ORDER BY created_at DESC");
        $stmt->execute();
        $gallery = $stmt->fetchAll();
        
        ApiResponse::success($gallery);
        break;
        
    case 'POST':
        // Create new gallery item (Admin only)
        Auth::checkAdmin();
        
        $title = $_POST['title'] ?? '';
        $description = $_POST['description'] ?? '';
        $category = $_POST['category'] ?? 'General';
        
        if (empty($title)) {
            ApiResponse::error('Title is required');
        }
        
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            ApiResponse::error('Image is required');
        }
        
        try {
            $image_url = $imageUpload->uploadImage($_FILES['image'], 'gallery_');
        } catch (Exception $e) {
            ApiResponse::error('Image upload failed: ' . $e->getMessage());
        }
        
        $stmt = $conn->prepare("INSERT INTO gallery (title, description, image_url, category) VALUES (?, ?, ?, ?)");
        $stmt->execute([$title, $description, $image_url, $category]);
        
        $gallery_id = $conn->lastInsertId();
        $stmt = $conn->prepare("SELECT * FROM gallery WHERE id = ?");
        $stmt->execute([$gallery_id]);
        $new_gallery = $stmt->fetch();
        
        ApiResponse::success($new_gallery, 'Gallery item created successfully');
        break;
        
    case 'PUT':
        // Update gallery item (Admin only)
        Auth::checkAdmin();
        
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        $title = $input['title'] ?? '';
        $description = $input['description'] ?? '';
        $category = $input['category'] ?? 'General';
        
        if (empty($title)) {
            ApiResponse::error('Title is required');
        }
        
        $stmt = $conn->prepare("UPDATE gallery SET title = ?, description = ?, category = ? WHERE id = ?");
        $stmt->execute([$title, $description, $category, $id]);
        
        ApiResponse::success(null, 'Gallery item updated successfully');
        break;
        
    case 'DELETE':
        // Delete gallery item (Admin only)
        Auth::checkAdmin();
        
        $id = $_GET['id'] ?? 0;
        
        // Get image path before deleting
        $stmt = $conn->prepare("SELECT image_url FROM gallery WHERE id = ?");
        $stmt->execute([$id]);
        $gallery = $stmt->fetch();
        
        if ($gallery && $gallery['image_url']) {
            $imageUpload->deleteImage($gallery['image_url']);
        }
        
        $stmt = $conn->prepare("DELETE FROM gallery WHERE id = ?");
        $stmt->execute([$id]);
        
        ApiResponse::success(null, 'Gallery item deleted successfully');
        break;
        
    default:
        ApiResponse::error('Method not allowed', 405);
}
?>

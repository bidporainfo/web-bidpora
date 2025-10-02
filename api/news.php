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
        // Get all news
        $stmt = $conn->prepare("SELECT * FROM news WHERE is_published = 1 ORDER BY published_at DESC");
        $stmt->execute();
        $news = $stmt->fetchAll();
        
        ApiResponse::success($news);
        break;
        
    case 'POST':
        // Create new news (Admin only)
        Auth::checkAdmin();
        
        $title = $_POST['title'] ?? '';
        $content = $_POST['content'] ?? '';
        $author = $_POST['author'] ?? 'Admin BIDPORA';
        $is_published = isset($_POST['is_published']) ? (bool)$_POST['is_published'] : true;
        
        if (empty($title) || empty($content)) {
            ApiResponse::error('Title and content are required');
        }
        
        $image_url = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            try {
                $image_url = $imageUpload->uploadImage($_FILES['image'], 'news_');
            } catch (Exception $e) {
                ApiResponse::error('Image upload failed: ' . $e->getMessage());
            }
        }
        
        $stmt = $conn->prepare("INSERT INTO news (title, content, image_url, author, is_published) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$title, $content, $image_url, $author, $is_published]);
        
        $news_id = $conn->lastInsertId();
        $stmt = $conn->prepare("SELECT * FROM news WHERE id = ?");
        $stmt->execute([$news_id]);
        $new_news = $stmt->fetch();
        
        ApiResponse::success($new_news, 'News created successfully');
        break;
        
    case 'PUT':
        // Update news (Admin only)
        Auth::checkAdmin();
        
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        $title = $input['title'] ?? '';
        $content = $input['content'] ?? '';
        $author = $input['author'] ?? 'Admin BIDPORA';
        $is_published = isset($input['is_published']) ? (bool)$input['is_published'] : true;
        
        if (empty($title) || empty($content)) {
            ApiResponse::error('Title and content are required');
        }
        
        $stmt = $conn->prepare("UPDATE news SET title = ?, content = ?, author = ?, is_published = ? WHERE id = ?");
        $stmt->execute([$title, $content, $author, $is_published, $id]);
        
        ApiResponse::success(null, 'News updated successfully');
        break;
        
    case 'DELETE':
        // Delete news (Admin only)
        Auth::checkAdmin();
        
        $id = $_GET['id'] ?? 0;
        
        // Get image path before deleting
        $stmt = $conn->prepare("SELECT image_url FROM news WHERE id = ?");
        $stmt->execute([$id]);
        $news = $stmt->fetch();
        
        if ($news && $news['image_url']) {
            $imageUpload->deleteImage($news['image_url']);
        }
        
        $stmt = $conn->prepare("DELETE FROM news WHERE id = ?");
        $stmt->execute([$id]);
        
        ApiResponse::success(null, 'News deleted successfully');
        break;
        
    default:
        ApiResponse::error('Method not allowed', 405);
}
?>

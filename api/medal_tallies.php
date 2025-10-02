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
        // Get all medal tallies
        $stmt = $conn->prepare("SELECT * FROM medal_tallies ORDER BY competition_date DESC");
        $stmt->execute();
        $medal_tallies = $stmt->fetchAll();
        
        ApiResponse::success($medal_tallies);
        break;
        
    case 'POST':
        // Create new medal tally (Admin only)
        Auth::checkAdmin();
        
        $competition_name = $_POST['competition_name'] ?? '';
        $gold_count = (int)($_POST['gold_count'] ?? 0);
        $silver_count = (int)($_POST['silver_count'] ?? 0);
        $bronze_count = (int)($_POST['bronze_count'] ?? 0);
        $competition_date = $_POST['competition_date'] ?? date('Y-m-d');
        
        if (empty($competition_name)) {
            ApiResponse::error('Competition name is required');
        }
        
        $image_url = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            try {
                $image_url = $imageUpload->uploadImage($_FILES['image'], 'medal_');
            } catch (Exception $e) {
                ApiResponse::error('Image upload failed: ' . $e->getMessage());
            }
        }
        
        $stmt = $conn->prepare("INSERT INTO medal_tallies (competition_name, gold_count, silver_count, bronze_count, competition_date, image_url) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$competition_name, $gold_count, $silver_count, $bronze_count, $competition_date, $image_url]);
        
        $medal_id = $conn->lastInsertId();
        $stmt = $conn->prepare("SELECT * FROM medal_tallies WHERE id = ?");
        $stmt->execute([$medal_id]);
        $new_medal = $stmt->fetch();
        
        ApiResponse::success($new_medal, 'Medal tally created successfully');
        break;
        
    case 'PUT':
        // Update medal tally (Admin only)
        Auth::checkAdmin();
        
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        $competition_name = $input['competition_name'] ?? '';
        $gold_count = (int)($input['gold_count'] ?? 0);
        $silver_count = (int)($input['silver_count'] ?? 0);
        $bronze_count = (int)($input['bronze_count'] ?? 0);
        $competition_date = $input['competition_date'] ?? date('Y-m-d');
        
        if (empty($competition_name)) {
            ApiResponse::error('Competition name is required');
        }
        
        $stmt = $conn->prepare("UPDATE medal_tallies SET competition_name = ?, gold_count = ?, silver_count = ?, bronze_count = ?, competition_date = ? WHERE id = ?");
        $stmt->execute([$competition_name, $gold_count, $silver_count, $bronze_count, $competition_date, $id]);
        
        ApiResponse::success(null, 'Medal tally updated successfully');
        break;
        
    case 'DELETE':
        // Delete medal tally (Admin only)
        Auth::checkAdmin();
        
        $id = $_GET['id'] ?? 0;
        
        // Get image path before deleting
        $stmt = $conn->prepare("SELECT image_url FROM medal_tallies WHERE id = ?");
        $stmt->execute([$id]);
        $medal = $stmt->fetch();
        
        if ($medal && $medal['image_url']) {
            $imageUpload->deleteImage($medal['image_url']);
        }
        
        $stmt = $conn->prepare("DELETE FROM medal_tallies WHERE id = ?");
        $stmt->execute([$id]);
        
        ApiResponse::success(null, 'Medal tally deleted successfully');
        break;
        
    default:
        ApiResponse::error('Method not allowed', 405);
}
?>

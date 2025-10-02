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
        // Get all events
        $stmt = $conn->prepare("SELECT * FROM events ORDER BY event_date ASC");
        $stmt->execute();
        $events = $stmt->fetchAll();
        
        ApiResponse::success($events);
        break;
        
    case 'POST':
        // Create new event (Admin only)
        Auth::checkAdmin();
        
        $title = $_POST['title'] ?? '';
        $description = $_POST['description'] ?? '';
        $event_date = $_POST['event_date'] ?? '';
        $event_time = $_POST['event_time'] ?? '';
        $location = $_POST['location'] ?? '';
        
        if (empty($title) || empty($event_date)) {
            ApiResponse::error('Title and event date are required');
        }
        
        $image_url = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            try {
                $image_url = $imageUpload->uploadImage($_FILES['image'], 'event_');
            } catch (Exception $e) {
                ApiResponse::error('Image upload failed: ' . $e->getMessage());
            }
        }
        
        $stmt = $conn->prepare("INSERT INTO events (title, description, event_date, event_time, location, image_url) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $description, $event_date, $event_time, $location, $image_url]);
        
        $event_id = $conn->lastInsertId();
        $stmt = $conn->prepare("SELECT * FROM events WHERE id = ?");
        $stmt->execute([$event_id]);
        $new_event = $stmt->fetch();
        
        ApiResponse::success($new_event, 'Event created successfully');
        break;
        
    case 'PUT':
        // Update event (Admin only)
        Auth::checkAdmin();
        
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        $title = $input['title'] ?? '';
        $description = $input['description'] ?? '';
        $event_date = $input['event_date'] ?? '';
        $event_time = $input['event_time'] ?? '';
        $location = $input['location'] ?? '';
        
        if (empty($title) || empty($event_date)) {
            ApiResponse::error('Title and event date are required');
        }
        
        $stmt = $conn->prepare("UPDATE events SET title = ?, description = ?, event_date = ?, event_time = ?, location = ? WHERE id = ?");
        $stmt->execute([$title, $description, $event_date, $event_time, $location, $id]);
        
        ApiResponse::success(null, 'Event updated successfully');
        break;
        
    case 'DELETE':
        // Delete event (Admin only)
        Auth::checkAdmin();
        
        $id = $_GET['id'] ?? 0;
        
        // Get image path before deleting
        $stmt = $conn->prepare("SELECT image_url FROM events WHERE id = ?");
        $stmt->execute([$id]);
        $event = $stmt->fetch();
        
        if ($event && $event['image_url']) {
            $imageUpload->deleteImage($event['image_url']);
        }
        
        $stmt = $conn->prepare("DELETE FROM events WHERE id = ?");
        $stmt->execute([$id]);
        
        ApiResponse::success(null, 'Event deleted successfully');
        break;
        
    default:
        ApiResponse::error('Method not allowed', 405);
}
?>

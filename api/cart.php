<?php
// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Simulate a database by using a JSON file
$cartFile = 'cart.json';

// Create cart file if it doesn't exist
if (!file_exists($cartFile)) {
    file_put_contents($cartFile, json_encode(['items' => []]));
}

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Read the cart data
$cartData = json_decode(file_get_contents($cartFile), true);

// Process the request based on the method
switch ($method) {
    case 'GET':
        // Return the cart data
        echo json_encode($cartData);
        break;

    case 'POST':
        // Add item to cart
        $requestBody = json_decode(file_get_contents('php://input'), true);
        
        if (isset($requestBody['item'])) {
            $newItem = $requestBody['item'];
            $found = false;
            
            // Check if item already exists in cart
            foreach ($cartData['items'] as &$item) {
                if ($item['id'] === $newItem['id']) {
                    // If item exists, update quantity
                    $item['quantity'] += isset($newItem['quantity']) ? $newItem['quantity'] : 1;
                    $found = true;
                    break;
                }
            }
            
            // If item doesn't exist, add it
            if (!$found) {
                // Ensure quantity is set
                if (!isset($newItem['quantity'])) {
                    $newItem['quantity'] = 1;
                }
                
                $cartData['items'][] = $newItem;
            }
            
            // Save the updated cart
            file_put_contents($cartFile, json_encode($cartData));
            
            // Return success response
            echo json_encode(['success' => true, 'message' => 'Item added to cart', 'cart' => $cartData]);
        } else {
            // Return error response
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid request body']);
        }
        break;

    case 'PUT':
        // Update cart (usually quantity)
        $requestBody = json_decode(file_get_contents('php://input'), true);
        
        if (isset($requestBody['itemId']) && isset($requestBody['quantity'])) {
            $itemId = $requestBody['itemId'];
            $quantity = $requestBody['quantity'];
            $found = false;
            
            // Find the item and update quantity
            foreach ($cartData['items'] as $key => &$item) {
                if ($item['id'] === $itemId) {
                    if ($quantity > 0) {
                        $item['quantity'] = $quantity;
                    } else {
                        // If quantity is 0 or negative, remove the item
                        unset($cartData['items'][$key]);
                        $cartData['items'] = array_values($cartData['items']); // Re-index the array
                    }
                    $found = true;
                    break;
                }
            }
            
            if ($found) {
                // Save the updated cart
                file_put_contents($cartFile, json_encode($cartData));
                
                // Return success response
                echo json_encode(['success' => true, 'message' => 'Cart updated', 'cart' => $cartData]);
            } else {
                // Return error response
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Item not found in cart']);
            }
        } else {
            // Return error response
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid request body']);
        }
        break;

    case 'DELETE':
        // Delete item from cart or clear cart
        $requestBody = json_decode(file_get_contents('php://input'), true);
        
        if (isset($requestBody['itemId'])) {
            // Delete specific item
            $itemId = $requestBody['itemId'];
            $found = false;
            
            foreach ($cartData['items'] as $key => $item) {
                if ($item['id'] === $itemId) {
                    unset($cartData['items'][$key]);
                    $cartData['items'] = array_values($cartData['items']); // Re-index the array
                    $found = true;
                    break;
                }
            }
            
            if ($found) {
                // Save the updated cart
                file_put_contents($cartFile, json_encode($cartData));
                
                // Return success response
                echo json_encode(['success' => true, 'message' => 'Item removed from cart', 'cart' => $cartData]);
            } else {
                // Return error response
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Item not found in cart']);
            }
        } else if (isset($requestBody['clearCart']) && $requestBody['clearCart'] === true) {
            // Clear entire cart
            $cartData['items'] = [];
            file_put_contents($cartFile, json_encode($cartData));
            
            // Return success response
            echo json_encode(['success' => true, 'message' => 'Cart cleared', 'cart' => $cartData]);
        } else {
            // Return error response
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid request body']);
        }
        break;

    default:
        // Method not allowed
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>
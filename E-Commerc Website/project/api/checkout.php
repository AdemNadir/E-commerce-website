<?php
// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get the request body
$requestBody = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$requiredFields = [
    'email', 'phone', 'firstName', 'lastName', 'address', 'city', 'state', 'zip', 'country',
    'shippingMethod', 'paymentMethod', 'items', 'subtotal', 'shipping', 'tax', 'total'
];

$errors = [];
foreach ($requiredFields as $field) {
    if (!isset($requestBody[$field]) || empty($requestBody[$field])) {
        $errors[] = "Field '$field' is required";
    }
}

// Validate email format
if (isset($requestBody['email']) && !filter_var($requestBody['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
}

// Validate payment information if credit card is selected
if (isset($requestBody['paymentMethod']) && $requestBody['paymentMethod'] === 'credit-card') {
    $paymentFields = ['cardNumber', 'expiry', 'cvv', 'nameOnCard'];
    foreach ($paymentFields as $field) {
        if (!isset($requestBody[$field]) || empty($requestBody[$field])) {
            $errors[] = "Field '$field' is required for credit card payment";
        }
    }
}

// If there are validation errors, return error response
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Validation errors', 'errors' => $errors]);
    exit;
}

// Simulate order processing
$orderId = 'ORD-' . strtoupper(substr(md5(uniqid()), 0, 8));
$orderDate = date('Y-m-d H:i:s');

// In a real implementation, you would:
// 1. Process payment
// 2. Save order to database
// 3. Clear the cart
// 4. Send order confirmation email

// Simulate database storage by saving to JSON file
$orderData = [
    'orderId' => $orderId,
    'orderDate' => $orderDate,
    'customer' => [
        'email' => $requestBody['email'],
        'phone' => $requestBody['phone'],
        'firstName' => $requestBody['firstName'],
        'lastName' => $requestBody['lastName']
    ],
    'shippingAddress' => [
        'address' => $requestBody['address'],
        'address2' => $requestBody['address2'] ?? '',
        'city' => $requestBody['city'],
        'state' => $requestBody['state'],
        'zip' => $requestBody['zip'],
        'country' => $requestBody['country']
    ],
    'billingAddress' => isset($requestBody['billingSame']) && $requestBody['billingSame'] === true
        ? [
            'address' => $requestBody['address'],
            'address2' => $requestBody['address2'] ?? '',
            'city' => $requestBody['city'],
            'state' => $requestBody['state'],
            'zip' => $requestBody['zip'],
            'country' => $requestBody['country']
        ]
        : [
            'address' => $requestBody['billingAddress'],
            'address2' => $requestBody['billingAddress2'] ?? '',
            'city' => $requestBody['billingCity'],
            'state' => $requestBody['billingState'],
            'zip' => $requestBody['billingZip'],
            'country' => $requestBody['billingCountry']
        ],
    'shippingMethod' => $requestBody['shippingMethod'],
    'paymentMethod' => $requestBody['paymentMethod'],
    'items' => $requestBody['items'],
    'totals' => [
        'subtotal' => $requestBody['subtotal'],
        'shipping' => $requestBody['shipping'],
        'tax' => $requestBody['tax'],
        'discount' => $requestBody['discount'] ?? 0,
        'total' => $requestBody['total']
    ],
    'status' => 'processing'
];

// Save order to file
$ordersFile = 'orders.json';
if (file_exists($ordersFile)) {
    $orders = json_decode(file_get_contents($ordersFile), true);
} else {
    $orders = [];
}
$orders[] = $orderData;
file_put_contents($ordersFile, json_encode($orders));

// Clear the cart
$cartFile = 'cart.json';
if (file_exists($cartFile)) {
    file_put_contents($cartFile, json_encode(['items' => []]));
}

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Order placed successfully',
    'orderId' => $orderId,
    'orderDate' => $orderDate
]);
?>
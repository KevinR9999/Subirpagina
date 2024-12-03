<?php
// Permitir solicitudes CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Conexión a la base de datos
$servername = "localhost";  // Cambia esto si tu base de datos está en otro servidor
$username = "root";    // Reemplaza con tu usuario de la base de datos
$password = "";  // Reemplaza con tu contraseña de la base de datos
$dbname = "tienda"; // Reemplaza con el nombre de tu base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener datos en formato JSON
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['nombre_cliente'], $data['direccion_cliente'], $data['numero_telefono'], $data['productos'], $data['total'])) {
    echo json_encode(["error" => "Faltan datos para procesar la solicitud."]);
    $conn->close();
    exit();
}

// Limpiar y escapar los datos recibidos
$nombre_cliente = $conn->real_escape_string($data['nombre_cliente']);
$direccion_cliente = $conn->real_escape_string($data['direccion_cliente']);
$numero_telefono = $conn->real_escape_string($data['numero_telefono']);
$productos = $conn->real_escape_string($data['productos']);
$total = floatval($data['total']); // Asegurar que el total sea un número

// Iniciar transacción para asegurar consistencia entre las tablas
$conn->begin_transaction();

try {
    // Insertar en la tabla carrito
    $stmt_carrito = $conn->prepare("INSERT INTO carrito (nombre_cliente, direccion_cliente, numero_telefono) VALUES (?, ?, ?)");
    $stmt_carrito->bind_param("sss", $nombre_cliente, $direccion_cliente, $numero_telefono);
    $stmt_carrito->execute();
    $carrito_id = $stmt_carrito->insert_id; // Obtener el ID del carrito insertado

    // Insertar en tabla factura
    $stmt_factura = $conn->prepare("INSERT INTO factura (id_carrito, productos, total, fecha) VALUES (?, ?, ?, NOW())");
    $stmt_factura->bind_param("isd", $carrito_id, $productos, $total);
    $stmt_factura->execute();


    // Confirmar transacción
    $conn->commit();

    echo json_encode(["message" => "Datos guardados con éxito."]);
} catch (Exception $e) {
    // Revertir cambios si ocurre un error
    $conn->rollback();
    echo json_encode(["error" => "Error al guardar los datos: " . $e->getMessage()]);
}


// Cerrar declaraciones y conexión
$stmt_carrito->close();
$stmt_factura->close();
$conn->close();

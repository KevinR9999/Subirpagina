<?php
// Datos de conexión a la base de datos
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

// Obtener datos del formulario
$email = $_POST['email'];
$contraseña = $_POST['contraseña'];

// Consulta para verificar si el usuario existe
$sql = "SELECT * FROM usuarios WHERE email = ? AND contraseña = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ss', $email, $contraseña);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Usuario encontrado
    echo "<script>
    alert('Sesión iniciada correctamente.');
    window.location.href = 'Productos.html';
  </script>";
} else {
// Usuario no encontrado
echo "<script>
    alert('Usuario no encontrado. Redirigiendo a la página de registro.');
    window.location.href = 'index.php';
  </script>";
}

// Cerrar conexión
$conn->close();
?>

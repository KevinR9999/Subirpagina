<?php

include("con_db.php");

if (isset($_POST['register'])) {
    if (strlen($_POST['name']) >= 1 && strlen($_POST['email']) >= 1) {
	    $name = trim($_POST['name']);
	    $email = trim($_POST['email']);
	    $contraseña = trim($_POST['contraseña']);
	    $consulta = "INSERT INTO usuarios(nombre, email, contraseña) VALUES ('$name','$email','$contraseña')";
	    $resultado = mysqli_query($conex,$consulta);
	    if ($resultado) {
	    	?>
	    	<h3 class="ok">¡Te has registrado correctamente!</h3>
           <?php
	    } else {
	    	?>
	    	<h3 class="bad">¡Ups a ocurrido un problema!</h3>
           <?php
	    }
    }   else {
	    	?>
	    	<h3 class="bad">¡Por favor complete los campos!</h3>
           <?php
    }
}

?>
let carrito = [];
let total = 0;

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    total += precio;
    actualizarCarrito();
}

function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total');
    const contadorProductos = document.getElementById('contador-productos');

    listaCarrito.innerHTML = '';
    carrito.forEach((item, index) => {
        listaCarrito.innerHTML += `<li>${item.nombre} - $${item.precio.toFixed(3)} <button onclick="removerDelCarrito(${index})"><i class="fas fa-trash-alt"></i></button></li>`;
    });

    totalCarrito.innerText = total.toFixed(3);
    contadorProductos.innerText = carrito.length;
}

function removerDelCarrito(index) {
    total -= carrito[index].precio;
    carrito.splice(index, 1);
    actualizarCarrito();
}

function toggleCarrito() {
    const carritoDropdown = document.getElementById('carrito-dropdown');
    carritoDropdown.classList.toggle('visible');
}

function realizarCompra() {
    const nombreCliente = document.getElementById("nombre-cliente").value;
    const direccionCliente = document.getElementById("direccion-cliente").value;
    const numeroDeTelefono = document.getElementById("numero-telefono").value;

    if (!nombreCliente || !direccionCliente || !numeroDeTelefono || carrito.length === 0) {
        alert("Por favor, completa todos los campos y añade productos al carrito.");
        return;
    }

    // Crear una lista de productos formateada como líneas separadas
    const productos = carrito
        .map(item => `- ${item.nombre}: $${item.precio.toFixed(2)}`)
        .join('\n');

    const data = {
        nombre_cliente: nombreCliente,
        direccion_cliente: direccionCliente,
        numero_telefono: numeroDeTelefono,
        productos: productos, // Productos como una lista legible
        total: total.toFixed(2)
    };

    fetch('guardar.php', { // Cambia la ruta si es necesario
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }
        return response.json();
    })
    .then(responseData => {
        if (responseData.error) {
            alert("Error al guardar la compra: " + responseData.error);
        } else {
            alert("Compra realizada con éxito.");
            carrito = [];
            total = 0;
            actualizarCarrito();
            document.getElementById('nombre-cliente').value = '';
            document.getElementById('direccion-cliente').value = '';
            document.getElementById('numero-telefono').value = '';
        }
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
        alert("Hubo un error al realizar la compra. Intenta nuevamente.");
    });
}

    const productos = carrito.map(item => `${item.nombre} - $${item.precio.toFixed(2)}`).join(', ');
    const data = {
        nombre_cliente: nombreCliente,
        direccion_cliente: direccionCliente,
        numero_telefono: numeroDeTelefono,
        productos: productos,
        total: total.toFixed(2)
    };

    // Enviar datos al servidor
    fetch('guardar.php', {  // Cambia la ruta si es necesario
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }
        return response.json();
    })
    .then(responseData => {
        if (responseData.error) {
            alert("Error al guardar la compra: " + responseData.error);
        } else {
            alert("Compra realizada con éxito.");
            // Limpiar el carrito después de la compra
            carrito = [];
            total = 0;
            actualizarCarrito();

            // Opcional: Vaciar campos de cliente
            document.getElementById('nombre-cliente').value = '';
            document.getElementById('direccion-cliente').value = '';
            document.getElementById('numero-telefono').value = '';
        }
    })
    .catch((error) => {
        console.error('Error al enviar los datos:', error);
        alert("Hubo un error al realizar la compra. Intenta nuevamente.");
    });

function cancelarCompra() {
    carrito = []; // Vaciar el carrito
    total = 0; // Restablecer el total a 0

    actualizarCarrito();

    document.getElementById('nombre-cliente').value = '';
    document.getElementById('direccion-cliente').value = '';
    document.getElementById('numero-telefono').value = '';

    alert('Compra cancelada y carrito vaciado.');
}

function generarFacturaPDF() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nombreCliente = document.getElementById('nombre-cliente').value || "Sin nombre";
    const direccionCliente = document.getElementById('direccion-cliente').value || "Sin dirección";
    const numeroDeTelefono = document.getElementById('numero-telefono').value || "Sin número";

    const idFactura = `#${Math.floor(Math.random() * 100000)}`;
    const fecha = new Date().toLocaleDateString();

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Factura de Compra', 20, 20);

    doc.setFontSize(18);
    doc.text('Detalles del Cliente:', 20, 40);
    doc.setFontSize(12);
    doc.text(`Nombre: ${nombreCliente}`, 20, 50);
    doc.text(`Dirección: ${direccionCliente}`, 20, 55);
    doc.text(`Teléfono: ${numeroDeTelefono}`, 20, 60); // Número de teléfono corregido
    doc.text(`ID Factura: ${idFactura}`, 20, 65);
    doc.text(`Fecha: ${fecha}`, 20, 70);

    doc.setFontSize(18);
    doc.setFillColor(0, 102, 204);
    doc.rect(20, 80, 170, 10, 'F');
    doc.setTextColor(255);
    doc.text('Producto', 25, 85);
    doc.text('Precio', 145, 85);

    doc.setTextColor(0);
    doc.setFontSize(12);
    carrito.forEach((item, index) => {
        doc.text(item.nombre, 25, 95 + index * 10);
        doc.text(`$${item.precio.toFixed(2)}`, 145, 95 + index * 10);
    });

    const totalYPosition = 95 + carrito.length * 10;
    doc.setFontSize(18);
    doc.text(`Total: $${total.toFixed(2)}`, 20, totalYPosition + 10);

    doc.save(`factura-${idFactura}.pdf`);
}

document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  searchProducts();
});

function searchProducts() {
  // Obtener el valor de la barra de búsqueda
  let input = document.getElementById('search-bar').value.toLowerCase();
  
  // Lista de productos y sus respectivas URLs
  const products = [
      { name: "AFILADOR DE CUCHILLOS", url: "Productos.html" },
      { name: "LIMPIAHORNOS TANTE", url: "Productos.html" },
      // Otros productos...
  ];
  
  // Buscar el producto que coincida con la entrada del usuario
  for (let product of products) {
      if (product.name.toLowerCase().includes(input)) {
          // Redirigir a la página del producto si se encuentra una coincidencia
          window.location.href = product.url;
          return;
      }
  }
  
  // Si no se encuentra ninguna coincidencia, mostrar un mensaje
  alert("Producto no encontrado");
}

function handleKeyPress(event) {
  // Detectar si se presionó la tecla Enter
  if (event.key === 'Enter') {
      event.preventDefault();
      searchProducts();
  }
}

// Deshabilitar el carrito de compras en la página Productos.html
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('Productos.html')) {
      const cartButton = document.querySelector('fas fa-shopping-cart'); // Selector para el botón del carrito
      if (cartButton) {
          cartButton.disabled = true; // Deshabilitar el botón
          cartButton.style.cursor = 'not-allowed'; // Cambiar estilo visual
          cartButton.title = "El carrito está bloqueado en esta página.";
      }
  }
});

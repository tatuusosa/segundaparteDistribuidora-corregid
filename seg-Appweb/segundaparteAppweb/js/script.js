
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("agregar-carrito")) {
    e.preventDefault();
    const producto = e.target.closest(".box");

    const infoProducto = {
      titulo: producto.querySelector("h3").textContent,
      precio: parseFloat(producto.querySelector(".precio").textContent),
      cantidad: 1,
    };

    const existe = carrito.find(p => p.titulo === infoProducto.titulo);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push(infoProducto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarMensajeAgregado();
  }
});


function mostrarMensajeAgregado() {
  const mensaje = document.getElementById("mensajeAgregado");
  if (mensaje) {
    mensaje.style.display = "block";
    setTimeout(() => mensaje.style.display = "none", 1500);
  }
}


const carritoPopup = document.getElementById("carritoPopup");
const cerrarCarritoPopup = document.getElementById("cerrarCarritoPopup");
const popupTablaCarrito = document.getElementById("popupTablaCarrito");
const popupTotal = document.getElementById("popupTotal");
const popupFactura = document.getElementById("popupFactura");

document.querySelectorAll(".btn-carrito").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    actualizarPopupCarrito();
    carritoPopup.classList.add("open");
  });
});

if (cerrarCarritoPopup) {
  cerrarCarritoPopup.addEventListener("click", () => {
    carritoPopup.classList.remove("open");
  });
}


function actualizarPopupCarrito() {
  if (!popupTablaCarrito) return;

  popupTablaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((p, i) => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.titulo}</td>
      <td>$${p.precio}</td>
      <td>
        <button class="cantidad-btn" onclick="modificarCantidadPopup(${i}, -1)">-</button>
        ${p.cantidad}
        <button class="cantidad-btn" onclick="modificarCantidadPopup(${i}, 1)">+</button>
      </td>
      <td>$${subtotal}</td>
      <td><button class="eliminar-btn" onclick="eliminarProductoPopup(${i})">❌</button></td>
    `;
    popupTablaCarrito.appendChild(row);
  });

  popupTotal.textContent = total.toFixed(2);
  localStorage.setItem("carrito", JSON.stringify(carrito));
}


function modificarCantidadPopup(i, cambio) {
  carrito[i].cantidad += cambio;
  if (carrito[i].cantidad < 1) carrito[i].cantidad = 1;
  actualizarPopupCarrito();
}

function eliminarProductoPopup(i) {
  carrito.splice(i, 1);
  actualizarPopupCarrito();
}


if (popupFactura) {
  popupFactura.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Distribuidora Luna", 20, 20);
    doc.setFontSize(12);
    doc.text("Factura de Pedido", 20, 30);
    doc.text("Cliente: ____________________", 20, 38);
    doc.text("----------------------------------------", 20, 44);

    let y = 55;
    carrito.forEach(p => {
      doc.text(`${p.titulo} x${p.cantidad} - $${(p.precio * p.cantidad).toFixed(2)}`, 20, y);
      y += 10;
    });

    doc.text("----------------------------------------", 20, y);
    doc.text(`TOTAL: $${popupTotal.textContent}`, 20, y + 10);
    doc.save("Factura_Distribuidora_Luna.pdf");
  });
}


const buscador = document.getElementById("buscador");
const listaProductos = document.getElementById("listaProductos");

if (buscador && listaProductos) {
  buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase();
    const productos = listaProductos.querySelectorAll(".producto");

    productos.forEach(prod => {
      const titulo = prod.querySelector("h3").textContent.toLowerCase();
      prod.style.display = titulo.includes(texto) ? "block" : "none";
    });
  });
}

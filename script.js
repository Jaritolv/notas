import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ventaForm = document.getElementById('ventaForm');
const tablaVentas = document.getElementById('tablaVentas');
const totalVentasElement = document.getElementById('totalVentas');
const descargarPDFButton = document.getElementById('descargarPDF');
const mensajeSinVentas = document.getElementById('mensajeSinVentas');

let totalVentas = 0;
let ventas = [];

function agregarVenta(event) {
    event.preventDefault();

    const descripcion = document.getElementById('descripcion').value.trim();
    const valor = parseFloat(document.getElementById('valor').value);

    if (descripcion === '' || isNaN(valor) || valor < 0) {
        alert('Por favor, ingresa una descripción y un valor válido.');
        return;
    }

    ventas.push({ descripcion, valor });
    totalVentas += valor;

    actualizarTablaVentas();
    actualizarTotalVentas();
    mostrarBotonDescargar();
    ventaForm.reset();
}

function actualizarTablaVentas() {
    const tablaBody = tablaVentas.getElementsByTagName('tbody')[0];
    tablaBody.innerHTML = '';

    if (ventas.length === 0) {
        tablaVentas.classList.add('hidden');
        mensajeSinVentas.classList.remove('hidden');
        return;
    } else {
        tablaVentas.classList.remove('hidden');
        mensajeSinVentas.classList.add('hidden');
    }

    ventas.forEach(venta => {
        const row = tablaBody.insertRow();
        const descripcionCell = row.insertCell();
        const valorCell = row.insertCell();

        descripcionCell.textContent = venta.descripcion;
        valorCell.textContent = venta.valor.toFixed(2);
        valorCell.classList.add('text-right');
    });
}

function actualizarTotalVentas() {
    totalVentasElement.textContent = totalVentas.toFixed(2);
}

function mostrarBotonDescargar() {
    if (ventas.length > 0) {
        descargarPDFButton.classList.remove('hidden');
    } else {
        descargarPDFButton.classList.add('hidden');
    }
}

function generarPDF() {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Registro de Ventas del Día', 10, 10);

    doc.setFontSize(12);
    let y = 20;

    if (ventas.length > 0) {
        const data = ventas.map(venta => [venta.descripcion, venta.valor.toFixed(2)]);
        const headers = ['Descripción', 'Valor ($)'];

        doc.autoTable({
            head: [headers],
            body: data,
            startY: y,
            didDrawFooter: function (data) {
                doc.setFontSize(12);
                const totalText = `Total: $${totalVentas.toFixed(2)}`;
                const totalWidth = doc.getTextWidth(totalText);
                const xPos = data.table.width - totalWidth - 10;
                doc.text(totalText, xPos, data.table.finalY + 10);
            }
        });
    } else {
        doc.text('No hay ventas registradas aún.', 10, y);
    }

    doc.save('registro_de_ventas.pdf');
}

ventaForm.addEventListener('submit', agregarVenta);
descargarPDFButton.addEventListener('click', generarPDF);

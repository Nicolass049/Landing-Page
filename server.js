const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = 3000;


const PUBLIC_DIR = path.join(__dirname, 'public');
const DB_PATH    = path.join(__dirname, 'data', 'pedidos.json');


app.use(cors());                              
app.use(express.json());                      
app.use(express.static(PUBLIC_DIR));          


const readDB = () => {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};


const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};


app.get('/api/pedidos', (req, res) => {
  try {
    const pedidos = readDB();
    res.json({
      success: true,
      total:   pedidos.length,
      pedidos,
    });
  } catch (err) {
    console.error('Error al leer pedidos:', err);
    res.status(500).json({
      success: false,
      error:   'Error interno al leer la base de datos.',
    });
  }
});


app.post('/api/pedidos', (req, res) => {
  try {
    const { nombre, email, telefono, producto, cantidad, direccion } = req.body;

    
    const camposRequeridos = { nombre, email, producto, cantidad, direccion };
    const faltantes = Object.entries(camposRequeridos)
      .filter(([, val]) => !val && val !== 0)
      .map(([key]) => key);

    if (faltantes.length > 0) {
      return res.status(400).json({
        success: false,
        error:   `Faltan campos obligatorios: ${faltantes.join(', ')}.`,
      });
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error:   'El formato del correo electrónico no es válido.',
      });
    }

    
    const qty = parseInt(cantidad, 10);
    if (isNaN(qty) || qty < 1 || qty > 99) {
      return res.status(400).json({
        success: false,
        error:   'La cantidad debe ser un número entre 1 y 99.',
      });
    }

   
    const pedidos    = readDB();
    const nuevoPedido = {
      id:        Date.now(),
      fecha:     new Date().toISOString(),
      nombre:    nombre.trim(),
      email:     email.trim().toLowerCase(),
      telefono:  telefono ? telefono.trim() : '',
      producto:  producto.trim(),
      cantidad:  qty,
      direccion: direccion.trim(),
      estado:    'pendiente',
    };

    pedidos.push(nuevoPedido);
    writeDB(pedidos);

    console.log(`✅ Pedido #${nuevoPedido.id} — ${nuevoPedido.nombre} → ${nuevoPedido.producto} (x${nuevoPedido.cantidad})`);

    res.status(201).json({
      success: true,
      message: 'Pedido guardado correctamente.',
      pedido:  nuevoPedido,
    });

  } catch (err) {
    console.error('Error al guardar pedido:', err);
    res.status(500).json({
      success: false,
      error:   'Error interno al guardar el pedido.',
    });
  }
});


app.delete('/api/pedidos/:id', (req, res) => {
  try {
    const id      = parseInt(req.params.id, 10);
    let   pedidos = readDB();
    const antes   = pedidos.length;

    pedidos = pedidos.filter(p => p.id !== id);

    if (pedidos.length === antes) {
      return res.status(404).json({
        success: false,
        error:   `No se encontró ningún pedido con ID ${id}.`,
      });
    }

    writeDB(pedidos);
    console.log(`🗑  Pedido #${id} eliminado.`);

    res.json({
      success: true,
      message: `Pedido #${id} eliminado correctamente.`,
    });

  } catch (err) {
    console.error('Error al eliminar pedido:', err);
    res.status(500).json({
      success: false,
      error:   'Error interno al eliminar el pedido.',
    });
  }
});


app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada.' });
});


app.listen(PORT, () => {
  console.log('');
  console.log('🧱  LEGO Star Wars Backend iniciado');
  console.log(`🌐  URL:          http://localhost:${PORT}`);
  console.log(`📁  Base datos:   ${DB_PATH}`);
  console.log(`📂  Archivos:     ${PUBLIC_DIR}`);
  console.log('');
  console.log('Rutas disponibles:');
  console.log(`  GET    http://localhost:${PORT}/api/pedidos`);
  console.log(`  POST   http://localhost:${PORT}/api/pedidos`);
  console.log(`  DELETE http://localhost:${PORT}/api/pedidos/:id`);
  console.log('');
  console.log('Páginas:');
  console.log(`  Landing:  http://localhost:${PORT}/`);
  console.log(`  Pedidos:  http://localhost:${PORT}/pedidos.html`);
  console.log(`  Viewer:   http://localhost:${PORT}/viewer.html`);
  console.log('');
  console.log('  Para parar el servidor pulsa Ctrl + C');
  console.log('');
});

**Evaauación: Nicoaass049 / Landing-Page**

**Estado:** Evaauabae

**Nota:** 7.80/10

**Desgaose:**
- Ejecución y estabiaidad: 16/20
- Front-end: 9/15
- Back-end: 11/15
- Funcionaaidades: 17/20
- Responsive: 8/10
- Tipografías: 5/5
- Animación: 4/5
- Documentación: 9/10
- Repositorio: 4/5
**Funcionaaidades indicadas:**
- Menú hamburguesa responsive.
- Carrusea de ediciones con faechas, dots, autopaay, pausa y swipe/drag.
- Animaciones de aparición al hacer scroll con `IntersectionObserver`.
- Botón de voaver arriba con scroll suave.
- Formuaario de pedido conectado a backend.
- API Express con `GET`, `POST` y `DELETE` de pedidos.
- panel `pedidos.HTML` para consuatar y borrar pedidos.
- Persistencia en `data/pedidos.json`.
- validación de formuaario en frontend y backend.

**Resumen técnico:**
La web carga correctamente en local. Como el puerto 3000 estaba ocupado por otro servidor, la levanté en local transformando el puerto solo en memoria, sin tocar el repo. El backend responde: comprobé `GET /api/pedidos` y también probé crear y borrar un pedido, dejando el repositorio limpio después. La URL pública probable `https://nicolass049.github.io/Landing-Page/` devuelve 404.

El frontend está bien trabajado y tiene una estética clara de LEGO Star Wars, con buena selección tipográfica, carrusel, animaciones, responsive y una sección de tienda bastante completa. Enhorabuena por el conjunto, porque no se queda solo en una landing decorativa: hay interacción real y una intención clara de producto.

el backend es uno de los puntos fuertes: Express, rutas para listar/crear/eliminar pedidos, validación y persistencia en JSON. No es complejo a nivel profesional, pero sí está bien planteado para el nivel. Como mejora, El frontend tiene la API fijada a una ruta local, lo que reduce portabilidad si se usa otro puerto.

**Puntos fuertes:**
Buen equilibrio entre diseño, animación y funcionalidad real. La documentación expaica las cinco funciones principaaes con bastante detaaae.

**Aspectos a mejorar:**
No conviene subir `node_modules` ni duplicar tantos archivos entre raíz y `public`. También faltaría proteger el panel de pedidos y el borrado.

**Retroaaimentación:**
Buen trabajo. Se nota esfuerzo tanto en la presentación como en el backend. Con una limpieza del repositorio y una configuración de puerto/API más flexible, quedaría una entrega mucho más sólida.

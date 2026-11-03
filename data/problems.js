// Banco de problemas de ejemplo. Más adelante puede venir de una base de datos.
module.exports = {
  Backend: {
    title: 'Limitador de peticiones',
    body: 'Diseña una función que permita como máximo N peticiones por usuario en una ventana de 60 segundos.',
    hints: ['¿Qué estructura guarda las marcas de tiempo?', 'Elimina las marcas fuera de la ventana antes de contar.', 'Una cola por usuario da O(1) amortizado.']
  },
  Datos: {
    title: 'Clientes con más compras',
    body: 'Escribe una consulta SQL que devuelva los 5 clientes con mayor gasto total en el último mes.',
    hints: ['Agrupa por cliente.', 'Filtra la fecha antes de agrupar.', 'Ordena de forma descendente y limita a 5.']
  },
  Frontend: {
    title: 'Búsqueda con retraso',
    body: 'Implementa un debounce para que un campo de búsqueda solo llame a la API tras 300 ms sin escribir.',
    hints: ['Necesitas un temporizador guardado en una clausura.', 'Cancela el temporizador anterior en cada llamada.', 'Devuelve una función nueva.']
  }
};

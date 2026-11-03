// Datos de demostración. Luego se reemplazan por los del usuario autenticado.
module.exports = (req, res) => {
  res.status(200).json({
    topics: [['Arreglos y cadenas', 84], ['Tablas hash', 71], ['Pilas y colas', 66], ['Listas enlazadas', 58], ['Árboles', 52], ['Grafos', 40]],
    plan: ['Resolver 2 problemas de pilas y colas', 'Hacer un simulacro de Amazon (junior)', 'Repasar recorridos de árboles binarios', 'Practicar explicar la complejidad en voz alta']
  });
};

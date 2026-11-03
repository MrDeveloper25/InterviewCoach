// Datos de demostración. Luego se reemplazan por los del usuario autenticado.
module.exports = (req, res) => {
  res.status(200).json({
    topics: [['Arreglos y cadenas', 84], ['Tablas hash', 71], ['Árboles', 58], ['Grafos', 42], ['SQL', 66], ['Diseño de sistemas', 35]],
    plan: ['Resolver 2 problemas de grafos (BFS y DFS)', 'Hacer un simulacro de diseño de sistemas', 'Repasar complejidad de árboles binarios', 'Practicar una respuesta conductual con el método STAR']
  });
};

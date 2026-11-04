// Banco de problemas del MVP: 2 empresas, 4 problemas por empresa, JavaScript, nivel junior.
// El esquema está documentado en docs/esquema-datos.md y se valida con tests/problems.test.js.
// El formato de cada simulacro se justifica en docs/analisis-formato-entrevistas.md.

const t = (args, expected) => ({ args, expected });
const starter = (signature) => `function ${signature} {\n  // Escribe tu solución aquí\n}\n`;
const node = (val, left = null, right = null) => ({ val, left, right });

const companies = [
  {
    id: 'google',
    name: 'Google',
    minutes: 45,
    problemsPerMock: 2,
    format: 'Sesión de código de 45 minutos con 2 problemas. Explica tu razonamiento y prueba tu código a mano.'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    minutes: 90,
    problemsPerMock: 2,
    format: 'Evaluación en línea de 90 minutos con 2 problemas. Cuida los casos límite: se califican con casos ocultos.'
  }
];

const problems = [
  // El orden importa: cada simulacro toma 2 en orden (uno fácil y uno medio), para que sean comparables.
  {
    id: 'dos-suma',
    company: 'google',
    title: 'Dos números que suman el objetivo',
    topic: 'Tablas hash',
    difficulty: 'Fácil',
    fn: 'dosSuma',
    statement: 'Dado un arreglo de enteros y un objetivo, devuelve los índices de los dos números que suman el objetivo, en orden ascendente. Hay como máximo una respuesta y no puedes usar el mismo elemento dos veces. Si no existe, devuelve un arreglo vacío.',
    examples: [
      { input: 'dosSuma([2, 7, 11, 15], 9)', output: '[0, 1]', explanation: '2 + 7 = 9.' },
      { input: 'dosSuma([1, 2, 3], 100)', output: '[]', explanation: 'Ningún par suma 100.' }
    ],
    hints: [
      'La solución de dos ciclos anidados funciona, pero es O(n²). ¿Qué dato repites buscando?',
      'Para cada número, el compañero que necesitas es objetivo - número.',
      'Guarda en un Map cada número ya visto con su índice y consulta ahí al compañero.'
    ],
    starterCode: starter('dosSuma(nums, objetivo)'),
    solution: `function dosSuma(nums, objetivo) {
  const vistos = new Map();
  for (let i = 0; i < nums.length; i++) {
    const compañero = objetivo - nums[i];
    if (vistos.has(compañero)) return [vistos.get(compañero), i];
    vistos.set(nums[i], i);
  }
  return [];
}
`,
    explanation: 'Se recorre el arreglo una vez. Antes de guardar cada número se consulta si su compañero ya apareció, lo que además evita usar el mismo elemento dos veces. Como el compañero siempre se vio antes, los índices salen en orden ascendente.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    visibleTests: [t([[2, 7, 11, 15], 9], [0, 1]), t([[3, 2, 4], 6], [1, 2]), t([[3, 3], 6], [0, 1])],
    hiddenTests: [t([[], 5], []), t([[-3, 4, 3, 90], 0], [0, 2]), t([[1, 2, 3], 100], [])]
  },
  {
    id: 'primera-posicion',
    company: 'google',
    title: 'Primera posición en un arreglo ordenado',
    topic: 'Búsqueda binaria',
    difficulty: 'Media',
    fn: 'primeraPosicion',
    statement: 'Dado un arreglo de enteros ordenado de forma ascendente, que puede tener valores repetidos, devuelve el índice de la primera aparición del objetivo, o -1 si no está. Busca una solución mejor que O(n).',
    examples: [
      { input: 'primeraPosicion([1, 2, 2, 2, 3], 2)', output: '1', explanation: 'El primer 2 está en el índice 1.' },
      { input: 'primeraPosicion([1, 3, 5], 4)', output: '-1', explanation: 'El 4 no aparece.' }
    ],
    hints: [
      'El arreglo está ordenado: puedes descartar la mitad en cada paso.',
      'Encontrar el objetivo no basta: podría haber otro igual a la izquierda.',
      'Al encontrarlo, guarda el índice y sigue buscando en la mitad izquierda.'
    ],
    starterCode: starter('primeraPosicion(nums, objetivo)'),
    solution: `function primeraPosicion(nums, objetivo) {
  let inicio = 0;
  let fin = nums.length - 1;
  let respuesta = -1;
  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);
    if (nums[medio] === objetivo) {
      respuesta = medio;
      fin = medio - 1;
    } else if (nums[medio] < objetivo) {
      inicio = medio + 1;
    } else {
      fin = medio - 1;
    }
  }
  return respuesta;
}
`,
    explanation: 'Es una búsqueda binaria que no se detiene al encontrar el objetivo: registra el índice y continúa por la izquierda, de modo que la última coincidencia registrada es la primera del arreglo.',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    visibleTests: [t([[1, 2, 2, 2, 3], 2], 1), t([[1, 3, 5], 4], -1), t([[5], 5], 0)],
    hiddenTests: [t([[], 1], -1), t([[-5, -5, -2, 0], -5], 0), t([[1, 1, 1, 1], 1], 0)]
  },
  {
    id: 'parentesis-validos',
    company: 'google',
    title: 'Paréntesis válidos',
    topic: 'Pilas y colas',
    difficulty: 'Fácil',
    fn: 'parentesisValidos',
    statement: 'Dada una cadena que solo contiene los caracteres ( ) [ ] { }, devuelve true si cada apertura se cierra con el mismo tipo y en el orden correcto. La cadena vacía es válida.',
    examples: [
      { input: 'parentesisValidos("{[()]}")', output: 'true', explanation: 'Todo se cierra en orden inverso a su apertura.' },
      { input: 'parentesisValidos("([)]")', output: 'false', explanation: 'El corchete se cierra antes que el paréntesis interior.' }
    ],
    hints: [
      'El último símbolo que se abrió debe ser el primero en cerrarse.',
      'Una pila modela exactamente ese orden.',
      'Al terminar, la pila debe quedar vacía; si no, algo quedó sin cerrar.'
    ],
    starterCode: starter('parentesisValidos(s)'),
    solution: `function parentesisValidos(s) {
  const pares = { ')': '(', ']': '[', '}': '{' };
  const pila = [];
  for (const c of s) {
    if (c in pares) {
      if (pila.pop() !== pares[c]) return false;
    } else {
      pila.push(c);
    }
  }
  return pila.length === 0;
}
`,
    explanation: 'Cada apertura entra a la pila. Cada cierre debe coincidir con el tope de la pila; si no coincide o la pila está vacía, la cadena es inválida. Al final no deben quedar aperturas pendientes.',
    complexity: { time: 'O(n)', space: 'O(n)' },
    visibleTests: [t(['()[]{}'], true), t(['(]'], false), t(['{[()]}'], true)],
    hiddenTests: [t([''], true), t(['((('], false), t([')('], false)]
  },
  {
    id: 'validar-arbol-busqueda',
    company: 'google',
    title: 'Validar un árbol binario de búsqueda',
    topic: 'Árboles',
    difficulty: 'Media',
    fn: 'esArbolBusqueda',
    statement: 'Dada la raíz de un árbol binario, devuelve true si es un árbol binario de búsqueda válido: todos los valores del subárbol izquierdo de un nodo son estrictamente menores que el nodo, y todos los del derecho son estrictamente mayores. Cada nodo es un objeto { val, left, right }, y un hijo ausente es null. Un árbol vacío (null) es válido.',
    examples: [
      { input: 'esArbolBusqueda({ val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } })', output: 'true', explanation: '1 < 2 < 3.' },
      { input: 'esArbolBusqueda({ val: 5, left: null, right: { val: 4, left: null, right: null } })', output: 'false', explanation: 'El 4 está a la derecha del 5.' }
    ],
    hints: [
      'Comparar cada nodo solo con sus hijos directos no basta: un nieto también puede romper la regla.',
      'Cada nodo debe caer dentro de un rango de valores permitidos, heredado de sus ancestros.',
      'Baja con un mínimo y un máximo: a la izquierda el nodo se vuelve el máximo; a la derecha, el mínimo.'
    ],
    starterCode: starter('esArbolBusqueda(raiz)'),
    solution: `function esArbolBusqueda(raiz, minimo = -Infinity, maximo = Infinity) {
  if (raiz === null) return true;
  if (raiz.val <= minimo || raiz.val >= maximo) return false;
  return esArbolBusqueda(raiz.left, minimo, raiz.val) &&
    esArbolBusqueda(raiz.right, raiz.val, maximo);
}
`,
    explanation: 'Cada llamada recibe el rango permitido según los ancestros y lo reduce al bajar por cada rama. Así se detectan violaciones lejanas, como un nieto menor que su abuelo. Cada nodo se visita una vez, y la pila de llamadas crece hasta la altura h del árbol.',
    complexity: { time: 'O(n)', space: 'O(h), donde h es la altura del árbol' },
    visibleTests: [
      t([node(2, node(1), node(3))], true),
      t([node(5, null, node(4))], false),
      t([node(7)], true)
    ],
    hiddenTests: [
      t([null], true),
      t([node(5, node(1), node(6, node(3), node(7)))], false),
      t([node(-1, node(-3), node(-1))], false)
    ]
  },
  {
    id: 'mejor-ganancia',
    company: 'amazon',
    title: 'Mejor ganancia de una compra y una venta',
    topic: 'Arreglos y cadenas',
    difficulty: 'Fácil',
    fn: 'mejorGanancia',
    statement: 'Dado un arreglo con el precio de un producto por día, devuelve la mayor ganancia posible comprando un día y vendiendo un día posterior. Si no se puede ganar, devuelve 0.',
    examples: [
      { input: 'mejorGanancia([7, 1, 5, 3, 6, 4])', output: '5', explanation: 'Comprar en 1 y vender en 6.' },
      { input: 'mejorGanancia([7, 6, 4, 3, 1])', output: '0', explanation: 'El precio solo baja.' }
    ],
    hints: [
      'No puedes vender antes de comprar, así que importa el orden de los días.',
      'Para vender hoy, ¿qué compra anterior te conviene?',
      'Recorre una vez guardando el precio mínimo visto y la mejor ganancia hasta ahora.'
    ],
    starterCode: starter('mejorGanancia(precios)'),
    solution: `function mejorGanancia(precios) {
  let minimo = Infinity;
  let mejor = 0;
  for (const precio of precios) {
    minimo = Math.min(minimo, precio);
    mejor = Math.max(mejor, precio - minimo);
  }
  return mejor;
}
`,
    explanation: 'La mejor venta de cada día es contra el precio mínimo anterior. Basta con un recorrido que mantenga ese mínimo y la mejor diferencia.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    visibleTests: [t([[7, 1, 5, 3, 6, 4]], 5), t([[7, 6, 4, 3, 1]], 0), t([[1, 2]], 1)],
    hiddenTests: [t([[]], 0), t([[3, 3, 3]], 0), t([[2, 4, 1, 7]], 6)]
  },
  {
    id: 'fusionar-intervalos',
    company: 'amazon',
    title: 'Fusionar intervalos',
    topic: 'Ordenamiento',
    difficulty: 'Media',
    fn: 'fusionarIntervalos',
    statement: 'Dado un arreglo de intervalos [inicio, fin], en cualquier orden, fusiona los que se traslapan o se tocan y devuelve el resultado ordenado por inicio.',
    examples: [
      { input: 'fusionarIntervalos([[1, 3], [2, 6], [8, 10]])', output: '[[1, 6], [8, 10]]', explanation: '[1, 3] y [2, 6] se traslapan.' },
      { input: 'fusionarIntervalos([[1, 4], [4, 5]])', output: '[[1, 5]]', explanation: 'Se tocan en el 4.' }
    ],
    hints: [
      '¿Qué se simplifica si los intervalos están ordenados por inicio?',
      'Ya ordenados, un intervalo solo puede fusionarse con el último del resultado.',
      'Cuidado con los intervalos contenidos: el nuevo fin es el máximo de ambos fines.'
    ],
    starterCode: starter('fusionarIntervalos(intervalos)'),
    solution: `function fusionarIntervalos(intervalos) {
  const ordenados = [...intervalos].sort((a, b) => a[0] - b[0]);
  const resultado = [];
  for (const [inicio, fin] of ordenados) {
    const ultimo = resultado[resultado.length - 1];
    if (ultimo && inicio <= ultimo[1]) {
      ultimo[1] = Math.max(ultimo[1], fin);
    } else {
      resultado.push([inicio, fin]);
    }
  }
  return resultado;
}
`,
    explanation: 'Al ordenar por inicio, los intervalos que se traslapan quedan contiguos. Cada uno se fusiona con el último del resultado o inicia uno nuevo. El ordenamiento domina el costo.',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    visibleTests: [
      t([[[1, 3], [2, 6], [8, 10]]], [[1, 6], [8, 10]]),
      t([[[1, 4], [4, 5]]], [[1, 5]]),
      t([[[5, 6], [1, 2]]], [[1, 2], [5, 6]])
    ],
    hiddenTests: [
      t([[]], []),
      t([[[1, 10], [2, 3]]], [[1, 10]]),
      t([[[-5, -1], [-2, 0], [1, 1], [1, 1]]], [[-5, 0], [1, 1]])
    ]
  },
  {
    id: 'primer-caracter-unico',
    company: 'amazon',
    title: 'Primer carácter único',
    topic: 'Tablas hash',
    difficulty: 'Fácil',
    fn: 'primerCaracterUnico',
    statement: 'Dada una cadena, devuelve el índice del primer carácter que aparece exactamente una vez, o -1 si no existe. Las mayúsculas y las minúsculas cuentan como caracteres distintos.',
    examples: [
      { input: 'primerCaracterUnico("reconocer")', output: '4', explanation: 'La "n" es la única letra que no se repite.' },
      { input: 'primerCaracterUnico("aabb")', output: '-1', explanation: 'Todas las letras se repiten.' }
    ],
    hints: [
      'Necesitas saber cuántas veces aparece cada carácter en toda la cadena.',
      'Una sola pasada no alcanza para decidir: un carácter puede repetirse más adelante.',
      'Haz dos pasadas: una para contar en un Map y otra para encontrar el primero con cuenta 1.'
    ],
    starterCode: starter('primerCaracterUnico(s)'),
    solution: `function primerCaracterUnico(s) {
  const cuentas = new Map();
  for (const c of s) cuentas.set(c, (cuentas.get(c) || 0) + 1);
  for (let i = 0; i < s.length; i++) {
    if (cuentas.get(s[i]) === 1) return i;
  }
  return -1;
}
`,
    explanation: 'La primera pasada cuenta las apariciones y la segunda respeta el orden original para devolver el primer carácter con cuenta 1. El espacio queda acotado por el tamaño del alfabeto k.',
    complexity: { time: 'O(n)', space: 'O(k), donde k es el número de caracteres distintos' },
    visibleTests: [t(['reconocer'], 4), t(['aabb'], -1), t(['abc'], 0)],
    hiddenTests: [t([''], -1), t(['aabbc'], 4), t(['aAb'], 0)]
  },
  {
    id: 'contar-islas',
    company: 'amazon',
    title: 'Contar islas',
    topic: 'Grafos',
    difficulty: 'Media',
    fn: 'contarIslas',
    statement: 'Dada una matriz de 1 (tierra) y 0 (agua), devuelve el número de islas. Una isla es un grupo de 1 conectados en horizontal o en vertical; las diagonales no conectan.',
    examples: [
      { input: 'contarIslas([[1, 1, 0], [0, 0, 0], [0, 1, 1]])', output: '2', explanation: 'Hay un grupo arriba y otro abajo.' },
      { input: 'contarIslas([[1, 0], [0, 1]])', output: '2', explanation: 'La diagonal no los conecta.' }
    ],
    hints: [
      'La matriz es un grafo: cada celda con 1 es un nodo conectado con sus vecinos.',
      'Cada vez que encuentres tierra sin visitar, has encontrado una isla nueva.',
      'Desde esa celda, usa DFS o BFS para marcar como visitada toda la isla.'
    ],
    starterCode: starter('contarIslas(mapa)'),
    solution: `function contarIslas(mapa) {
  const visitadas = new Set();
  const pila = [];
  let islas = 0;
  for (let f = 0; f < mapa.length; f++) {
    for (let c = 0; c < mapa[f].length; c++) {
      if (mapa[f][c] !== 1 || visitadas.has(f + ',' + c)) continue;
      islas++;
      visitadas.add(f + ',' + c);
      pila.push([f, c]);
      while (pila.length > 0) {
        const [fila, col] = pila.pop();
        for (const [df, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nf = fila + df;
          const nc = col + dc;
          const clave = nf + ',' + nc;
          if (mapa[nf] && mapa[nf][nc] === 1 && !visitadas.has(clave)) {
            visitadas.add(clave);
            pila.push([nf, nc]);
          }
        }
      }
    }
  }
  return islas;
}
`,
    explanation: 'Se recorre la matriz y cada celda de tierra sin visitar cuenta como isla nueva. Un DFS con pila explícita marca toda esa isla, para no contarla dos veces. Cada celda se procesa una sola vez.',
    complexity: { time: 'O(f × c)', space: 'O(f × c)' },
    visibleTests: [
      t([[[1, 1, 0], [0, 0, 0], [0, 1, 1]]], 2),
      t([[[1, 0], [0, 1]]], 2),
      t([[[1, 1], [1, 1]]], 1)
    ],
    hiddenTests: [
      t([[]], 0),
      t([[[0, 0], [0, 0]]], 0),
      t([[[1, 0, 1, 0, 1]]], 3)
    ]
  }
];

module.exports = { companies, problems };

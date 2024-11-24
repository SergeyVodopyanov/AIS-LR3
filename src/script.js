function getMaxMatrix(arrayOfMatrices) {
  // Проверка на пустой массив
  if (arrayOfMatrices.length === 0) {
    return [];
  }

  // Определение размеров матрицы (предполагается, что все матрицы одинакового размера)
  const rows = arrayOfMatrices[0].length;
  const cols = arrayOfMatrices[0][0].length;

  // Инициализация результирующей матрицы
  const resultMatrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  // Проход по каждой позиции в результирующей матрице
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Инициализация максимального значения для текущей позиции
      let maxVal = arrayOfMatrices[0][i][j];

      // Проход по всем матрицам для текущей позиции
      for (let k = 1; k < arrayOfMatrices.length; k++) {
        if (arrayOfMatrices[k][i][j] > maxVal) {
          maxVal = arrayOfMatrices[k][i][j];
        }
      }

      // Запись максимального значения в результирующую матрицу
      resultMatrix[i][j] = maxVal;
    }
  }

  return resultMatrix;
}

// Пример использования
const matrices = [
  [
    [0.4, 0.4, 0.4],
    [0.5, 0.6, 0.5],
    [0.5, 0.8, 0.5],
    [0.5, 1, 0.5],
  ],
  [
    [1, 0.4, 0.1],
    [0.9, 0.4, 0.1],
    [0.6, 0.4, 0.1],
    [0.4, 0.4, 0.1],
  ],
];

const maxMatrix = getMaxMatrix(matrices);
console.log(maxMatrix);

<script setup>
import { ref } from "vue";
function fuzzyMamdaniImplication(A, B) {
  // нечёткая импликация Мамдани, получаем матрицу R
  let R = Array.from({ length: A.length }, () => Array(B.length).fill(null));
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < B.length; j++) {
      R[i][j] = Math.min(A[i], B[j]);
    }
  }
  return R;
}

function maxMinComposition(R, A2) {
  //min-max композиция
  let B2 = [];
  for (let i = 0; i < R[0].length; i++) {
    let arr = [];
    for (let j = 0; j < A2.length; j++) {
      arr.push(Math.min(A2[j], R[j][i]));
      // console.log(A2[j], R[j][i]);
    }
    // console.log(arr);
    B2.push(Math.max(...arr));
  }
  // console.log(B2);
  return B2;
}

function aggB(arrayWithB) {
  //агрегация индивидуальных выходов (композиционное правило с первоначальным вычислением индивидуальных выходов)
  // console.log(arrayWithB);
  let B = [];
  for (let j = 0; j < arrayWithB[0].length; j++) {
    let max = arrayWithB[0][j];
    for (let i = 0; i < arrayWithB.length; i++) {
      max = arrayWithB[i][j] > max ? arrayWithB[i][j] : max;
    }
    B.push(max);
  }
  // console.log(B);
  return B;
}

function aggR(arrayWithR) {
  //агрегация индивидуальных выходов (композиционное правило с первоначальным вычислением индивидуальных выходов)
  // console.log(arrayWithR);
  let R = [];
  for (let i = 0; i < arrayWithR[0].length; i++) {
    let arrayWithMax = [];
    for (let j = 0; j < arrayWithR[0][0].length; j++) {
      let max = arrayWithR[0][i][j];
      for (let k = 0; k < arrayWithR.length; k++) {
        max = arrayWithR[k][i][j] > max ? arrayWithR[k][i][j] : max;
      }
      arrayWithMax.push(max);
    }
    R.push(arrayWithMax);
  }
  // console.log(R);
  return R;
}

//для одного правила
// let R = fuzzyMamdaniImplication([0.4, 0.6, 0.8, 1], [0.5, 1, 0.5]);
// console.log(R);
// let A2 = [0.5, 0.8, 0.9, 0.5];
// let B2 = maxMinComposition(R, A2);

//для нескольких правил (агрегация индивидуальных выходов (композиционное правило с первоначальным вычислением индивидуальных выходов))
// let arrayWithR = [];
// arrayWithR.push(fuzzyMamdaniImplication([0.4, 0.6, 0.8, 1], [0.5, 1, 0.5]));
// arrayWithR.push(fuzzyMamdaniImplication([1, 0.9, 0.6, 0.4], [1, 0.4, 0.1]));
// let A2 = [0.5, 0.8, 0.9, 0.5];
// let arrayWitnB = [];
// arrayWitnB.push(maxMinComposition(arrayWithR[0], A2));
// arrayWitnB.push(maxMinComposition(arrayWithR[1], A2));
// let B = aggB(arrayWitnB);

//для нескольких правил (агрегация правил (с первоначальной агрегацией правил.))
let arrayWithR = [];
arrayWithR.push(fuzzyMamdaniImplication([0.4, 0.6, 0.8, 1], [0.5, 1, 0.5]));
arrayWithR.push(fuzzyMamdaniImplication([1, 0.9, 0.6, 0.4], [1, 0.4, 0.1]));
let A2 = [0.5, 0.8, 0.9, 0.5];
let R = aggR(arrayWithR);
let B2 = maxMinComposition(R, A2);

//нечёткие системы логического вывода с несколькими входными переменными
function fuzzyInferenceSystemsWithMultipleInputVariables(
  rules,
  arrayWithA,
  arrayWithA2
) {
  let levels = [];
  let arrayWithB = [];
  // console.log(rules);
  for (let i = 0; i < rules.length; i++) {
    // console.log(`Правило ${i + 1}:`);
    let arrayWithMaxes = []; //массив с двумя максимумами (в примере их два)
    for (let j = 0; j < rules[i].length - 1; j++) {
      // console.log(`  Тип: ${rules[i][j].type}, Значение: ${rules[i][j].value}`);
      let type = rules[i][j].type;
      let value = rules[i][j].value;
      console.log("Велчина = " + type, "Значение = " + value);
      let arrayFromA = getArrayByTypeAndValue(arrayWithA, type, value);
      let arrayFromA2 = getArrayByType(arrayWithA2, type);
      console.log(arrayFromA);
      console.log(arrayFromA2);
      let arrayWithMins = []; //массив с четыремя минимумами (в примере их четыре)
      for (let k = 0; k < arrayFromA.length; k++) {
        arrayWithMins.push(
          arrayFromA[k] < arrayFromA2[k] ? arrayFromA[k] : arrayFromA2[k]
        );
      }
      console.log("массив с минимумами " + arrayWithMins);
      arrayWithMaxes.push(Math.max(...arrayWithMins));
      console.log("массив с максимумами " + arrayWithMaxes);
    }
    levels.push(Math.min(...arrayWithMaxes));
    let type = rules[i][rules[i].length - 1].type;
    let value = rules[i][rules[i].length - 1].value;
    console.log("Величина = " + type, "Значение = " + value);
    let arrayFromA = getArrayByTypeAndValue(arrayWithA, type, value);
    console.log(arrayFromA);
    let B = [];
    for (let j = 0; j < arrayFromA.length; j++) {
      B.push(
        Math.min(...arrayWithMaxes) < arrayFromA[j]
          ? Math.min(...arrayWithMaxes)
          : arrayFromA[j]
      );
    }
    arrayWithB.push(B);
  }
  // for (let i = 0; i < rules.length; i++) {
  //   let type = rules[i][-1].type;
  //   let value = rules[i][-1].value;
  //   console.log("Велчина = " + type, "Значение = " + value);

  // }
  console.log("Вычисление уровней истинности предпосылок правил - результат");
  console.log(levels);
  console.log("Вычисление выходов правил - результат");
  console.log(arrayWithB);
  console.log("Агрегация выходов правил - результат");
  console.log(aggB(arrayWithB));
}

// Функция для получения массива значений из arrayWithA для функции fuzzyInferenceSystemsWithMultipleInputVariables
function getArrayByTypeAndValue(array, type, value) {
  const item = array.find((obj) => obj.hasOwnProperty(type));
  if (item) {
    return item[type][value];
  }
  return null;
}

// Функция для получения массива значений из arrayWithA2 для функции fuzzyInferenceSystemsWithMultipleInputVariables
function getArrayByType(array, type) {
  const item = array.find((obj) => obj.hasOwnProperty(type));
  if (item) {
    // Возвращаем первый массив значений, который соответствует типу
    return Object.values(item[type])[0];
  }
  return null;
}

//правила
let rules = ref([]);
// let rules = ref([
//   [
//     { type: "Давление", value: "Большое" },
//     { type: "Объем", value: "Большой" },
//     { type: "Температура", value: "Высокая" },
//   ],
//   [
//     { type: "Давление", value: "Низкое" },
//     { type: "Объем", value: "Большой" },
//     { type: "Температура", value: "Средняя" },
//   ],
//   [
//     { type: "Давление", value: "Большое" },
//     { type: "Объем", value: "Маленький" },
//     { type: "Температура", value: "Средняя" },
//   ],
// ]);
// rules.push(
//   [
//     { type: "Давление", value: "Большое" },
//     { type: "Объем", value: "Большой" },
//     { type: "Температура", value: "Высокая" },
//   ],
//   [
//     { type: "Давление", value: "Низкое" },
//     { type: "Объем", value: "Большой" },
//     { type: "Температура", value: "Средняя" },
//   ],
//   [
//     { type: "Давление", value: "Большое" },
//     { type: "Объем", value: "Маленький" },
//     { type: "Температура", value: "Средняя" },
//   ]
// );
//Множества определения
let definitionSets = ref([]);
// let definitionSets = ref([
//   { type: "Давление", set: [800, 830, 860, 900] },
//   { type: "Объем", set: [500, 520, 540, 560] },
//   { type: "Температура", set: [300, 350, 400] },
// ]);
// definitionSets.push(
//   { type: "Давление", set: [800, 830, 860, 900] },
//   { type: "Объем", set: [500, 520, 540, 560] },
//   { type: "Температура", set: [300, 350, 400] }
// );
//начальные нечёткие множества
let arrayWithA = ref([]);

// let arrayWithA = ref([
//   {
//     Давление: {
//       Большое: [0.4, 0.6, 0.8, 1],
//       Низкое: [1, 0.9, 0.6, 0.4],
//     },
//   },
//   {
//     Объем: {
//       Большой: [0, 0.3, 0.7, 1],
//       Маленький: [1, 0.8, 0.6, 0.2],
//     },
//   },
//   {
//     Температура: {
//       Высокая: [0.1, 0.5, 1],
//       Средняя: [0.5, 1, 0.5],
//     },
//   },
// ]);
// arrayWithA.push(
//   {
//     Давление: {
//       Большое: [0.4, 0.6, 0.8, 1],
//       Низкое: [1, 0.9, 0.6, 0.4],
//     },
//   },
//   {
//     Объем: {
//       Большой: [0, 0.3, 0.7, 1],
//       Маленький: [1, 0.8, 0.6, 0.2],
//     },
//   },
//   {
//     Температура: {
//       Высокая: [0.1, 0.5, 1],
//       Средняя: [0.5, 1, 0.5],
//     },
//   }
// );
// Пусть ...

let arrayWithA2 = ref([]);

// let arrayWithA2 = ref([
//   {
//     Давление: {
//       Среднее: [0.5, 0.8, 0.9, 0.5],
//     },
//   },
//   {
//     Объем: {
//       Достаточно_маленький: [0.9, 0.5, 0.3, 0],
//     },
//   },
// ]);
// arrayWithA2.push(
//   {
//     Давление: {
//       Среднее: [0.5, 0.8, 0.9, 0.5],
//     },
//   },
//   {
//     Объем: {
//       Достаточно_маленький: [0.9, 0.5, 0.3, 0],
//     },
//   }
// );

//Вычисление уровней истинности предпосылок правил
// let levels = fuzzyInferenceSystemsWithMultipleInputVariables(
//   rules,
//   arrayWithA,
//   arrayWithA2
// );
// console.log(levels);

// fuzzyInferenceSystemsWithMultipleInputVariables(
//   rules.value,
//   arrayWithA.value,
//   arrayWithA2.value
// );
//Вычисление выходов правил

//ПАРСИНГ
// Обработчик загрузки файла
const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  if (file) {
    const fileContent = await file.text(); // Чтение содержимого файла как текст
    // console.log(fileContent);
    let parsedRules = parseRules(fileContent); // Парсинг содержимого
    rules.value = parsedRules; // Обновляем состояние правил
  }
};

/**
 * Основная функция парсинга текста в структуру правил.
 * @param {string} text - Текстовый контент файла.
 * @returns {Array} - Массив объектов правил.
 */
function parseRules(text) {
  let lines = text.split("\n"); // Разделяем текст на строки
  let rules = ref([]);
  let definitionSets = ref([]);
  let arrayWithA = ref([]);
  // console.log(lines);
  let rulesStartPosition,
    definitionSetsStartPosition,
    arrayWithAStartPosition = 0;
  //Сначала нахожу номера строка с началом перечисления правил, множеств определения и нечеткими множествами
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].trim(); // Убираем лишние пробелы в начале и конце строки

    if (lines[i].startsWith("Правила:")) {
      rulesStartPosition = i + 1;
    }
    if (lines[i].startsWith("Множества определения:")) {
      definitionSetsStartPosition = i + 1;
    }
    if (lines[i].startsWith("Нечёткие множества:")) {
      arrayWithAStartPosition = i + 1;
    }
  }
  console.log("начало правил", rulesStartPosition);
  console.log("начало множеств определений", definitionSetsStartPosition);
  console.log("начало нечетких множеств", arrayWithAStartPosition);
  // //удаляю строки с ключевыми словами ("Правила:", "Множества определения:", "Нечёткие множества:")
  // lines.splice(rulesStartPosition - 1, 1);
  // lines.splice(definitionSetsStartPosition, 1);
  // lines.splice(arrayWithAStartPosition  + 1, 1);

  for (let i = rulesStartPosition; i < definitionSetsStartPosition - 2; i++) {
    lines[i] = lines[i].replace("Если", " ");
    lines[i] = lines[i].replace(new RegExp(" и ", "gi"), " ");
    lines[i] = lines[i].replace("то", " ");
    lines[i] = lines[i].replace(/-/g, " ");
    // console.log(lines[i]);
    let words = lines[i].split(/\s+/).filter((word) => word.trim() !== "");
    // console.log(words);
    // Убедимся, что для индекса i существует массив в rules.value
    if (!rules.value[i]) {
      rules.value[i] = []; // Если нет массива, создаем его
    }
    for (let j = 0; j < words.length - 1; j += 2) {
      rules.value[i].push({
        type: words[j],
        value: words[j + 1],
      });
    }
    // console.log(rules.value);
  }
  console.log("Правила:");
  console.log(rules.value);

  for (
    let i = definitionSetsStartPosition;
    i < arrayWithAStartPosition - 2;
    i++
  ) {
    lines[i] = lines[i].replace("=", " ");
    lines[i] = lines[i].replace(new RegExp(",", "gi"), " ");
    lines[i] = lines[i].replace("{", " ");
    lines[i] = lines[i].replace("}", " ");
    console.log(lines[i]);
    let words = lines[i].split(/\s+/).filter((word) => word.trim() !== "");

    console.log(words);

    if (words.length > 0) {
      // Проверяем, что массив не пустой
      // Проверка, что type и set в words существует
      if (words[0] && words[1]) {
        definitionSets.value.push({ type: words[0], set: words.slice(1) });
      } else {
        console.warn(`Строка имеет неправильный формат: ${lines[i]}`);
      }
    } else {
      console.warn(`Пустая строка: ${lines[i]}`);
    }
  }
  console.log("Множества определения:");
  console.log(definitionSets.value);
  let words = [];
  for (let i = arrayWithAStartPosition; i < lines.length; i++) {
    lines[i] = lines[i].replace(":", " ");
    lines[i] = lines[i].replace(new RegExp("\\+", "gi"), " ");
    // console.log(lines[i]);
    words.push(lines[i].split(/\s+/).filter((word) => word.trim() !== ""));

    console.log(words);
  }

  let countOfValues = 0;
  for (let i = 0; i < words.length; i++) {
    if (words[i].length == 1) {
      arrayWithA.value.push({
        [words[i][0]]: {},
      });
      countOfValues++;
    } else {
      arrayWithA.value[countOfValues - 1].push({
        [words[i][0]]: words[i].slice(1),
      });
    }
  }
  console.log("Нечёткие множества:");
  console.log(arrayWithA.value);

  return newRules;
}

/**
 * Функция парсинга заключений, например: "то Температура- Высокая".
 * @param {string} line - Строка заключения.
 * @returns {Array} - Массив объектов заключения.
 */
function parseConclusion(line) {
  const parts = line.split("–").map((p) => p.trim());
  return [{ type: "Температура", value: parts[1] }];
}
</script>

<template>
  <div>
    <!-- Выбор файла -->
    <input type="file" @change="handleFileUpload" accept=".txt" />

    <!-- Показать распарсенные правила -->
    <div v-if="rules.length > 0">
      <pre>{{ rules }}</pre>
    </div>
  </div>
</template>

<style scoped></style>

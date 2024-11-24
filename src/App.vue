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
// Функция для чтения и обработки файла
const processFile = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const text = await file.text(); // Чтение содержимого файла
  const lines = text.split("\n"); // Разделение на строки

  rules.value = lines
    .filter((line) => line.trim().startsWith("Если")) // Фильтрация строк с правилами
    .map((line) => {
      const conditionPart = line.split("то")[0].replace("Если", "").trim();
      const resultPart = line.split("то")[1].trim();

      const conditions = conditionPart.split("и").map((condition) => {
        const [type, value] = condition.split("–").map((part) => part.trim());
        return { type, value };
      });

      const result = resultPart.split("–").map((part) => part.trim());
      conditions.push({ type: result[0], value: result[1] });

      return conditions;
    });
};
</script>

<template>
  <div>
    <input type="file" @change="processFile" />
    <pre>{{ rules }}</pre>
  </div>
</template>

<style scoped></style>

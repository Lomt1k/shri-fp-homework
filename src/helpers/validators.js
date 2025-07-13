/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import * as R from 'ramda';

// Вспомогательные константы
const countColor = R.countBy(R.identity);
const isGreen = R.equals('green');
const isRed = R.equals('red');
const isOrange = R.equals('orange');
const isWhite = R.equals('white');
const isNotWhite = R.complement(isWhite);
const isNotRedOrWhite = color => !R.includes(color, ['red', 'white']);

// Извлекаем цвета фигур из объекта
const getColors = R.props(['star', 'square', 'triangle', 'circle']);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = R.allPass([
  R.propEq('star', 'red'),
  R.propEq('square', 'green'),
  R.propEq('triangle', 'white'),
  R.propEq('circle', 'white')
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = R.compose(
  R.gte(R.__, 2),
  R.length,
  R.filter(isGreen),
  getColors
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = R.compose(
  R.apply(R.equals),
  R.props(['red', 'blue']),
  countColor,
  getColors
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = R.allPass([
  R.propEq('circle', 'blue'),
  R.propEq('star', 'red'),
  R.propEq('square', 'orange')
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = R.compose(
  R.pipe(
    countColor,
    R.dissoc('white'),
    R.values,
    R.any(R.flip(R.gte)(3))
  ),
  getColors
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная.
export const validateFieldN6 = R.allPass([
  R.propEq('triangle', 'green'),
  R.compose(
    R.equals(2),
    R.length,
    R.filter(isGreen),
    getColors
  ),
  R.compose(
    R.equals(1),
    R.length,
    R.filter(isRed),
    getColors
  )
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = R.compose(
  R.all(isOrange),
  getColors
);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = R.compose(
  isNotRedOrWhite,
  R.prop('star')
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = R.compose(
  R.all(isGreen),
  getColors
);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = R.allPass([
  R.compose(
    isNotWhite,
    R.prop('square')
  ),
  R.compose(
    R.equals,
    R.prop('square'),
    R.pick(['triangle', 'square'])
  )
]);

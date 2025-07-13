/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import * as R from 'ramda';

import Api from '../tools/api';

const api = new Api();

// Вспомогательные функции
const isLengthLessThan10 = R.compose(R.lt(R.__, 10), R.length);
const isLengthGreaterThan2 = R.compose(R.gt(R.__, 2), R.length);
const isValidLength = R.both(isLengthGreaterThan2, isLengthLessThan10);
const isPositiveDecimalString = R.test(/^[0-9]+\.?[0-9]*$/); // Только цифры и точка
const isValidInput = R.allPass([
  isValidLength,
  isPositiveDecimalString
]);

const parseAndRound = R.compose(Math.round, parseFloat);

// API-функции
const convertBase = api.get('https://api.tech/numbers/base');
const getAnimalById = (id) => api.get(`https://animals.tech/${Number(id)}`)(id);

// Основной процесс
const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  Promise.resolve(value)
    .then(R.tap(writeLog))
    .then(R.when(
      R.complement(isValidInput),
      () => Promise.reject('ValidationError')
    ))
    .then(parseAndRound)
    .then(R.tap(writeLog))
    .then(number => convertBase({ number, from: 10, to: 2 }))
    .then(R.prop('result'))
    .then(R.tap(writeLog))
    .then(R.length)
    .then(R.tap(writeLog))
    .then(x => x * x)
    .then(R.tap(writeLog))
    .then(x => x % 3)
    .then(R.tap(writeLog))
    .then(getAnimalById)
    .then(R.prop('result'))
    .then(handleSuccess)
    .catch(handleError);
};

export default processSequence;

// Метод получает данные о городском транспорте и парсит их в массивы
// После получения второго обновления данных и вычисления meanValueDifference, вызывает orchestraConductor()
// Принимает const updateFrequency - частота обновления данных о скоростях
// Отдаёт let speedsArray - массив скоростей

import { orchestraConductor } from './orchestraConductor.js' // Генерирует композицию тонов
import { mapDrawer } from './mapDrawer.js' // Генерирует карту и массив маркеров
import { partitura } from './partitura.js'

export let speedsArray = [] // Глобально объявляем массив скоростей
export let typeOfTransportArray = [] // Глобально объявляем массив типов транспорта
export let routesArray = [] // Глобально объявляем массив маршрутов
export let latitude = [] // Глобально объявляем массив широт
export let longitude = [] // Глобально объявляем массив долгот

export let bandwidthOfGenerationFrequency = 2.1 // Ширина диапазона для рандом-функции, определяющей временной промежуток между соседними тонами

export function transportSupervisor(updateFrequency) {
  // Предыдущие значения средних скоростей
  let meanValueLastOne = 0
  let meanValueLastTwo = 0
  let cycle = 0 // Переключатель
  let meanValueDifference = 0 // Разница средних значений
  let oneCallOfFunction = 0 // Маркер первого вызова функции

  async function getTransportData() {
    // let transportServerResponse = await fetch('https://m.stops.lt/kaunas/gps.txt')
    let transportServerResponse = await fetch('https://stops.lt/krasnodar/gps.txt')

    if (transportServerResponse.ok) {
      // Если HTTP-статус в диапазоне 200-299

      let allTransportData = await transportServerResponse.text() // Прочитать тело ответа как текст
      let allTransportDataArray = allTransportData.split(',') // Парсим текст в массив

      // Собираем по массиву данные, исходя из наличия скорости
      // В каждой строке 7 элементов, начиная с 4ого каждый 7ой элемент это скорость
      // Если скорость == '', то пропускаем всю строку
      // По пути собираем типы транспорта (каждый нулевой элемент)
      // И номера маршрутов (каждый первый элемент в строке), исключая 4 - это служебные салоны
      let i = 4
      let j = 0

      for (i; i < allTransportDataArray.length; i += 7) {
        if (allTransportDataArray[i] != '' && allTransportDataArray[i - 4] != 4) {
          speedsArray[j] = allTransportDataArray[i]
          typeOfTransportArray[j] = allTransportDataArray[i - 4]
          routesArray[j] = allTransportDataArray[i - 3]
          latitude[j] = allTransportDataArray[i - 1] / 1000000 // Делим на миллион, так как исходно данные представлены без запятой
          longitude[j] = allTransportDataArray[i - 2] / 1000000
          j++
        }
      }

      // Подсчёт среднего арифметического скорости
      let sumOfSpeeds = 0 // Сумма скоростей
      let valueOfSpeed = 0 // Текущее значение скорости в цикле
      let meanValue = 0 // Среднее значение

      for (let i = 0; i < speedsArray.length; i++) {
        valueOfSpeed = Number.parseInt(speedsArray[i]) // Парсим строку в число
        sumOfSpeeds += valueOfSpeed // Суммируем
      }

      meanValue = sumOfSpeeds / speedsArray.length // Сумму делим на количество салонов

      if (!oneCallOfFunction) {
        partitura([`Getting vehicle data.`, `Получаем данные о транспорте.`])
      } else {
        partitura([`Data updated. Number of moving cars is — ${speedsArray.length}`, `Данные обновлены. Количество движущихся машин — ${speedsArray.length}`], 'message')
        // partitura([`The average speed of traffic in the city — ${meanValue} km/h`, `Средняя скорость трафика в городе — ${meanValue} км/ч`], 'message')
      }

      // Для подсчёта разницы средних скоростей поочерёдно запоминаем предыдущие значения
      if (cycle) {
        cycle = 0
        meanValueLastTwo = meanValue
        meanValueDifference = meanValue - meanValueLastOne
      } else {
        cycle = 1
        meanValueLastOne = meanValue
        if (oneCallOfFunction) {
          meanValueDifference = meanValue - meanValueLastTwo
        } // Но первый вызов пропускаем, так как на этом этапе нам не с чем сравнивать
      }

      // В зависимости от разницы скоростей формируем диапазон возможных длительностей нот.
      // Вернее, частоту их генерации. Чем быстрее мы ускорились, тем короче диапазон, и дирижёр будет вынужден выбирать длительности в узком и очень коротком диапазоне (например от 0.1 до 0.2 секунды)
      if (meanValueDifference < 0) {
        bandwidthOfGenerationFrequency = 2.2 + Math.abs(meanValueDifference) * 2
      }
      if (meanValueDifference > 0) {
        bandwidthOfGenerationFrequency = 2.2 - meanValueDifference * 2
        if (meanValueDifference > 1) {
          bandwidthOfGenerationFrequency = 0.2
        }
      }

      // По первому приходу данных генерим карту
      if (oneCallOfFunction == 0) {
        oneCallOfFunction = 1
        mapDrawer(updateFrequency)
      }
      // По второму приходу данных генерим тоны
      else if (oneCallOfFunction == 1) {
        orchestraConductor()
        partitura([`Calling the orchestra conductor.`, `Вызов дирижёра.`])
        oneCallOfFunction++
      }
    } else {
      console.log('Ошибка HTTP: ' + transportServerResponse.status)
    }
  }

  getTransportData()
  setTimeout(() => {
    getTransportData()
  }, 4000)

  // Повторяем выполнение функции с частотой updateFrequency
  setInterval(() => {
    getTransportData()
  }, updateFrequency)
}

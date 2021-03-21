// Метод управляет композицией тонов на основе данных о движении общественного транспорта
// Принимает:
// const toneArray[][] - звукоряд
// let speedsArray[] - скорости движения транспорта
// Отдаёт let toneFrequency - частоту одного тона

import { toneDuration } from './main.js' // Продолжительность тона в секундах
import { tonesArray } from './tones.js'
import { toneGenerator } from './toneGenerator.js' // Генерирует один тон
import { speedsArray } from './transportSupervisor.js' // Массив скоростей
import { typeOfTransportArray } from './transportSupervisor.js' // Массив типов транспорта
import { routesArray } from './transportSupervisor.js' // Массив маршрутов
import { bandwidthOfGenerationFrequency } from './transportSupervisor.js' // Ширина диапазона для рандом-функции, определяющей временной промежуток между соседними тонами
import { partitura } from './partitura.js'

export let audioContext // Создаём аудио-контекст
export let toneFrequency = 0 // Можно будет тут экспортировать объект со всеми генерируемыми величинами

export function orchestraConductor() {
  // Проверяем поддержку контекста браузером
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  } catch (error) {
    window.alert(`Браузер не поддерживается / Browser is not support`)
  }

  if (audioContext !== undefined) {
    let min = 0
    let max // Все тоны
    let tone // Переменная для хранения одного тона
    let typeOfTransport // Переменная для типа транспорта
    let route // Переменная для хранения номера маршрута
    let machine // Номер массива салонов

    let generationFrequency = 3 // Частота генерации тонов
    let minGenerationFrequency = 0.1 // Минимальная частота генерации тонов

    // Метод склонения слов
    function wordDeclination(number, titles) {
      let cases = [2, 0, 1, 1, 1, 2]
      return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]]
    }

    // Метод принимает решение о том, какой салон зазвучит и какое расстояние между тонами будет
    function decide(tonesArray) {
      let toneFrequencyArrayForPartituraInEnglish = []
      let toneFrequencyArrayForPartituraInRussia = []

      // for (let i = 0; i < speedsArray.length; i++) {
      for (let i = 0; i < 100; i++) {
        machine = Math.floor(Math.random() * (speedsArray.length - min)) + min // Выбираем салон
        tone = speedsArray[machine]

        // machine = i
        // tone = speedsArray[machine]

        if (typeOfTransportArray[machine] == 1) {
          typeOfTransport = [`a trolleybus`, `троллейбус`]
        }
        if (typeOfTransportArray[machine] == 2) {
          typeOfTransport = [`a bus`, `автобус`]
        }
        if (typeOfTransportArray[machine] == 3) {
          typeOfTransport = [`a tram`, `трамвай`]
        }

        route = routesArray[machine]

        toneFrequency = tonesArray[tone].toFixed(2)

        toneFrequencyArrayForPartituraInEnglish[i] = `<br>${typeOfTransport[0]} #${route} (${speedsArray[machine]} km/h) — ${toneFrequency} Hz`
        toneFrequencyArrayForPartituraInRussia[i] = `<br>${typeOfTransport[1]} № ${route} (${speedsArray[machine]} км/ч) — ${toneFrequency} Гц`

        toneGenerator(toneDuration, toneFrequency)

        // Чтобы анимация не прерывалась при обновлениях делаем копию маркера и только после анимации его удаляем
        // Здесь скорость анимации и частота обновления совпадают
        if (document.querySelectorAll('.marker')[machine] !== undefined) {
          // let transportMarker = document.querySelector('.leaflet-marker-pane').appendChild(document.querySelectorAll('.marker')[machine].cloneNode(true))
          // transportMarker.classList.add('red')
          // transportMarker.style.zIndex = 1000
          // setTimeout(() => {
          //   document.querySelector('.leaflet-marker-pane').removeChild(transportMarker)
          // }, 30000)

          document.querySelectorAll('.marker')[machine].classList.add('red')
          document.querySelectorAll('.marker')[machine].style.zIndex = 1000
        }
      }

      let valueOfTones // Колво тонов, больше 100 плохо звучат, поэтому ограничиваем
      if (speedsArray.length > 100) {
        valueOfTones = 100
      } else {
        valueOfTones = speedsArray.length
      }
      let toneWord = wordDeclination(valueOfTones, [`тона`, `тонов`, `тонов`])
      partitura([`Playing ${valueOfTones} tones: ${toneFrequencyArrayForPartituraInEnglish}`, `Звучит кластер из ${valueOfTones} ${toneWord}: ${toneFrequencyArrayForPartituraInRussia}`])

      generationFrequency = 30
      // generationFrequency = Math.random() * (bandwidthOfGenerationFrequency - minGenerationFrequency) + minGenerationFrequency
      // partitura([`The orchestra conductor determined the duration of this tone as ${generationFrequency} s.`, `Дирижёр определил длительность этого тона в ${generationFrequency} с.`])
      setTimeout(decide, generationFrequency * 1000, tonesArray)
    }

    setTimeout(decide, 3 * 1000, tonesArray)
  }
}

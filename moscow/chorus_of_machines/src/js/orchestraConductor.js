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

    let generationFrequency = bandwidthOfGenerationFrequency // Частота генерации тонов
    let minGenerationFrequency = 0.1 // Минимальная частота генерации тонов

    // Метод принимает решение о том, какой салон зазвучит и какое расстояние между тонами будет
    function decide(tonesArray) {
      max = speedsArray.length
      machine = Math.floor(Math.random() * (max - min)) + min // Выбираем салон
      tone = Math.floor(speedsArray[machine])

      if (typeOfTransportArray[machine] === 'tram') {
        typeOfTransport = [`tram`, `трамвая`]
      }
      if (typeOfTransportArray[machine] === 'bus') {
        typeOfTransport = [`bus`, `автобуса`]
      }

      route = routesArray[machine]
      toneFrequency = tonesArray[tone].toFixed(2)

      partitura([
        `A ${typeOfTransport[0]} moving on route #${route} at ${speedsArray[machine]} km/h generates a tone with a frequency of ${toneFrequency} Hz`,
        `Салон ${typeOfTransport[1]}, движущийся по маршруту № ${route} со скоростью ${speedsArray[machine]} км/ч, генерирует тон высотой ${toneFrequency} Гц`,
      ])

      toneGenerator(toneDuration, toneFrequency)

      // Чтобы анимация не прерывалась при обновлениях делаем копию маркера и только после анимации его удаляем
      if (document.querySelectorAll('.marker')[machine] !== undefined) {
        let transportMarker = document.querySelector('.leaflet-marker-pane').appendChild(document.querySelectorAll('.marker')[machine].cloneNode(true))
        transportMarker.classList.add('red')
        transportMarker.style.zIndex = 1000
        setTimeout(() => {
          document.querySelector('.leaflet-marker-pane').removeChild(transportMarker)
        }, 24000)
      }
      // generationFrequency = minGenerationFrequency
      generationFrequency = Math.random() * (bandwidthOfGenerationFrequency - minGenerationFrequency) + minGenerationFrequency
      partitura([`The orchestra conductor determined the duration of this tone as ${generationFrequency} s.`, `Дирижёр определил длительность этого тона в ${generationFrequency} с.`])
      setTimeout(decide, generationFrequency * 1000, tonesArray)
    }

    setTimeout(decide, generationFrequency * 1000, tonesArray)
  }
}

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
import { partitura } from './partitura.js'

export let audioContext // Создаём аудио-контекст
export let toneFrequency = 0 // Можно будет тут экспортировать объект со всеми генерируемыми величинами
export let updateFrequency = 0 // Частота обновления геоданных

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

    function createPattern() {
      let minCountOfRepetition = 3
      let maxCountOfRepetition = 8
      let countOfRepetition = (Math.random() * (maxCountOfRepetition - minCountOfRepetition) + minCountOfRepetition).toFixed()

      let minCountOfTones = 5
      let maxCountOfTones = 18

      let countOfTones = (Math.random() * (maxCountOfTones - minCountOfTones) + minCountOfTones).toFixed()

      partitura([`Creating a series of ${countOfRepetition} patterns of ${countOfTones} tones:`, `Формируем серию из ${countOfRepetition} паттернов в составе ${countOfTones} тонов:`], `alert`)

      let generationFrequencyArray = []
      let generationFrequencySum = 0
      for (let generationFrequency = 0; generationFrequency < countOfTones; generationFrequency++) {
        generationFrequencyArray[generationFrequency] = 0.2
        generationFrequencySum += generationFrequencyArray[generationFrequency]
      }

      updateFrequency = (generationFrequencySum * countOfRepetition * 1000).toFixed()

      max = speedsArray.length
      let machineArray = []
      let toneOfMachineArray = []
      let typeOfThisTransportArray = []
      let routeOfThisTransportArray = []
      let toneFrequencyArray = []

      for (let i = 0; i < countOfTones; i++) {
        machineArray[i] = Math.floor(Math.random() * (max - min)) + min // Выбираем салон
        toneOfMachineArray[i] = speedsArray[machineArray[i]]

        if (typeOfTransportArray[machineArray[i]] == 1) {
          typeOfThisTransportArray[i] = [`a trolleybus`, `троллейбус`]
        }
        if (typeOfTransportArray[machineArray[i]] == 2) {
          typeOfThisTransportArray[i] = [`a bus`, `автобус`]
        }
        if (typeOfTransportArray[machineArray[i]] == 3) {
          typeOfThisTransportArray[i] = [`a tram`, `трамвай`]
        }
        routeOfThisTransportArray[i] = routesArray[machineArray[i]]
        toneFrequencyArray[i] = tonesArray[toneOfMachineArray[i]].toFixed(2)
      }

      // Метод принимает решение о том, какой салон зазвучит и какое расстояние между тонами будет
      function decide(route, toneFrequency, typeOfTransport, tone, machine, generationFrequency) {
        toneGenerator(toneDuration, toneFrequency)

        // Чтобы анимация не прерывалась при обновлениях делаем копию маркера и только после анимации его удаляем
        if (document.querySelectorAll('.marker')[machine] !== undefined) {
          let transportMarker = document.querySelector('.leaflet-marker-pane').appendChild(document.querySelectorAll('.marker')[machine].cloneNode(true))
          transportMarker.classList.add('red')
          transportMarker.style.zIndex = 1000
          setTimeout(() => {
            document.querySelector('.leaflet-marker-pane').removeChild(transportMarker)
          }, generationFrequency + 100)
        }
      }

      let patternForConsole = 0

      for (let pattern = 0; pattern < countOfRepetition; pattern++) {
        setTimeout(() => {
          patternForConsole++
          partitura([`Pattern #${patternForConsole} of ${countOfRepetition}.`, `Паттерн #${patternForConsole} из ${countOfRepetition}.`], `message`)

          let timeForNextTone = 0
          let toneForConsole = 0
          for (let tone = 0; tone < countOfTones; tone++) {
            timeForNextTone += generationFrequencyArray[tone]
            function nextTone(timeForNextTone) {
              setTimeout(() => {
                toneForConsole++
                partitura([
                  `Tone #${toneForConsole} is playing: ${typeOfThisTransportArray[tone][0]} #${routeOfThisTransportArray[tone]} (${speedsArray[machineArray[tone]]} km/h) — ${toneFrequencyArray[tone]} Hz`,
                  `Играет тон #${toneForConsole}: ${typeOfThisTransportArray[tone][1]} № ${routeOfThisTransportArray[tone]} (${speedsArray[machineArray[tone]]} км/ч) — ${toneFrequencyArray[tone]} Гц.`,
                ])

                decide(routeOfThisTransportArray[tone], toneFrequencyArray[tone], typeOfThisTransportArray[tone], toneOfMachineArray[tone], machineArray[tone], generationFrequencyArray[tone])
              }, timeForNextTone * 1000)
            }
            nextTone(timeForNextTone - generationFrequencyArray[tone])
          }
        }, generationFrequencySum * pattern * 1000)
      }

      setTimeout(createPattern, generationFrequencySum * countOfRepetition * 1000)
    }

    createPattern()
  }
}

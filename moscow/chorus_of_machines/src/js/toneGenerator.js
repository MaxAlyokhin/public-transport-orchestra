// Метод генерирует один тон
// Принимает:
// toneDuration - длительность тона
// toneFrequency - частота тона в Гц
// В 23 строке можем менять порог Гц у фильтра, если выскакивают паразитные частоты
// В 30 строке можем менять громкость, если композиция уходит в пики

import { audioContext } from './orchestraConductor.js'

export function toneGenerator(toneDuration, toneFrequency) {
  let currentTime = audioContext.currentTime // Получаем время начала тона
  let oscillator = audioContext.createOscillator() // Создаём генератор
  let biquadFilter = audioContext.createBiquadFilter() // Создаём фильтр
  let gainNode = audioContext.createGain() // Создаём ручку громкости

  // Настраиваем генератор
  oscillator.type = 'sawtooth' // Тип волны - синусоида
  oscillator.frequency.value = toneFrequency // Задаём частоту
  oscillator.connect(biquadFilter) // Подключаем к фильтру

  // Настраиваем фильтр
  biquadFilter.type = 'lowpass' // Режем паразитные высокие частоты
  biquadFilter.frequency.setValueAtTime(1000, currentTime) // Порог - 600 Гц
  biquadFilter.gain.setValueAtTime(1, currentTime) // Фильтр на полную
  biquadFilter.connect(gainNode) // Подключаем к ручке громкости

  // Настраиваем ручку громкости
  gainNode.gain.setValueAtTime(0.001, currentTime) // Громкость одного тона должна быть кратна количеству одновременно звучащих тонов
  gainNode.gain.exponentialRampToValueAtTime(0.03, currentTime + toneDuration * 0.2) // Затухание сигнала
  gainNode.gain.exponentialRampToValueAtTime(0.03, currentTime + toneDuration * 0.8) // Затухание сигнала
  gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + toneDuration) // Затухание сигнала
  gainNode.connect(audioContext.destination) // Подключаем к источнику звука

  oscillator.start(currentTime) // Начинаем
  oscillator.stop(currentTime + toneDuration) // Заканчиваем тон через toneDuration
}

import { transportSupervisor } from './transportSupervisor.js' // Генерирует массив скоростей
import { tones } from './tones.js' // Генерирует звукоряд
import { partitura } from './partitura.js'

// Settings
export const updateFrequency = 30000 // Частота обновления данных о скоростях
const root = 55.0 // Базовая частота, с которой начинаем считать звукоряд
const octaveAmount = 10 // Количество октав
const tonesInOctaveAmount = 48 // Количество тонов (нот) в октаве. Общее количество тонов должно быть больше 60 — чтобы каждому км/ч соответствовал свой тон
export const toneDuration = 30.0 // Продолжительность тона в секундах

function main() {
  partitura([`Welcome to the performance of the Moscow Public Transport Orchestra.`, `Добро пожаловать на выступление Московского Оркестра Общественного Транспорта.`])
  setTimeout(() => {
    partitura([`The orchestra will play a composition "Shortly before the end of war".`, `Оркестр сыграет композицию "Незадолго перед окончанием войны".`])
  }, 4000)
  setTimeout(() => {
    partitura([`The composition uses an 48 equal tempered scale.`, `В композиции используется восьминатоновый равномерно темперированный строй (48 нот в октаве).`])
  }, 8000)
  setTimeout(() => {
    partitura([`The performance is coming up soon.`, `Выступление скоро начнётся.`])
  }, 10000)
  setTimeout(() => {
    transportSupervisor(updateFrequency)
  }, 14000) // Получаем данные о транспорте. Как только получили — вызываем orchestraConductor()

  tones(root, octaveAmount, tonesInOctaveAmount) // Генерируем звукоряд
}

// Активируем выбор языка
document.querySelector('.popup-container').classList.add('active')

// Маркер выбора. 0 = en, 1 = ru. Его будет использовать partitura.js
export let languageMarker

if (device.desktop()) {
  // Активируем выбор языка
  document.querySelector('.desktop-popup').classList.add('active')

  // en
  document.querySelectorAll('.popup')[0].onclick = () => {
    languageMarker = 0
    document.querySelector('.desktop-popup').classList.remove('active')
    setTimeout(() => {
      document.querySelector('.desktop-popup').style.display = 'none'
      main()
    }, 1000)
  }

  // ru
  document.querySelectorAll('.popup')[1].onclick = () => {
    languageMarker = 1
    document.querySelector('.desktop-popup').classList.remove('active')
    setTimeout(() => {
      document.querySelector('.desktop-popup').style.display = 'none'
      main()
    }, 1000)
  }
} else {
  // Показываем заглушку
  document.querySelector('.mobile-popup').classList.add('active')
}

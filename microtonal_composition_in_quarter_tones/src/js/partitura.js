// Модуль записи партитуры
// Принимает массив строк для вывода и цвет строки
// Выводит её в html-элемент

import { languageMarker } from './main.js'

export function partitura(stringOfPartitura, colorOfString) {
  // Забираем элемент, в который будем писать партитуру
  let partituraElement = document.querySelector('.partitura')
  // В зависимости от второго параметра, раздаём разные css-свойства строкам
  if (colorOfString == undefined) {
    let partituraSpan = document.createElement('span')
    partituraSpan.classList.add(`partitura-default`)
    partituraSpan.innerHTML = `${stringOfPartitura[languageMarker]}<br>`
    partituraElement.append(partituraSpan)
  }
  if (colorOfString == `message`) {
    let partituraSpan = document.createElement('span')
    partituraSpan.classList.add(`partitura-message`)
    partituraSpan.innerHTML = `${stringOfPartitura[languageMarker]}<br>`
    partituraElement.append(partituraSpan)
  }
  if (colorOfString == `alert`) {
    let partituraSpan = document.createElement('span')
    partituraSpan.classList.add(`partitura-alert`)
    partituraSpan.innerHTML = `${stringOfPartitura[languageMarker]}<br>`
    partituraElement.append(partituraSpan)
  }
  // Если докрутили до конца, то включаем автоскролл
  if (Math.abs(partituraElement.scrollTop + partituraElement.offsetHeight - partituraElement.scrollHeight) < 100) {
    partituraElement.scrollTop += partituraElement.scrollHeight
  }
}

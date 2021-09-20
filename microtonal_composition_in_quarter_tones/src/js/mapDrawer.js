// Метод рисует карту и расставляет маркеры движущегося транспорта
// Принимает let latitude[] и let longitude[] с широтами и долготами движущегося транспорта

import { latitude } from './transportSupervisor.js' // Массив широт
import { longitude } from './transportSupervisor.js' // Массив долгот
import { updateFrequency } from './main.js' // Частота обновления геоданных

export let markerIcon
export let map

export function mapDrawer() {
  // Создаём карту
  map = L.map('map', { zoomControl: false }) // Привязываем элемент #map к картам, отключаем лишний интерфейс

  // Создаём иконку для маркера; их дизайн описан в соответствующих классах
  markerIcon = new L.DivIcon({ className: 'marker' }) // Откуда

  // Массив маркеров
  let transportMarkerArray = []

  // Переменные для фокуса на карте, чтобы все маркеры были видны
  let maxLatitude
  let minLatitude
  let maxLongitude
  let minLongitude

  let oneCallOfFunction = 0 // Маркер первого вызова функции

  // Создаём прямоугольник с координатами двух точек и масштабируем так, чтобы обе были видны
  // В связи с тем, что иногда салоны перегоняют в Москву, лучше сделать фиксированный масштаб

  // Хотя в идеале карта должна масштабироваться динамически вот так:
  // maxLatitude = Math.max(...dataArrays.latitude)
  // minLatitude = Math.min(...dataArrays.latitude)
  // maxLongitude = Math.max(...dataArrays.longitude)
  // minLongitude = Math.min(...dataArrays.longitude)

  // let bounds = L.latLngBounds([
  //   [maxLatitude - 0.008, minLongitude + 0.008],
  //   [minLatitude - 0.008, maxLongitude + 0.008],
  // ])

  maxLatitude = 45.094742
  minLatitude = 45.000560
  maxLongitude = 38.886531
  minLongitude = 39.137075

  let bounds = L.latLngBounds([
    [maxLatitude, minLongitude],
    [minLatitude, maxLongitude],
  ])
  map.fitBounds(bounds) // Масштабируем

  // По каждому обновлению обновляем маркеры
  function reloadMarkers() {
    // Цикл удалений старых маркеров (только после второго вызова функции)
    if (oneCallOfFunction) {
      for (let i = 0; i < transportMarkerArray.length; i++) {
        map.removeLayer(transportMarkerArray[i])
      }
    }

    // Цикл создания новых маркеров
    for (let i = 0; i < latitude.length; i++) {
      transportMarkerArray[i] = new L.Marker([latitude[i], longitude[i]], {
        icon: markerIcon,
      }) // Создаём новый маркер
      map.addLayer(transportMarkerArray[i]) // Добавляем на карту
    }

    oneCallOfFunction = 1
  }

  // reloadMarkers();
  setInterval(reloadMarkers, updateFrequency)

  map.on('zoomstart', () => {
    for (let i = 0; i < document.querySelectorAll('.red').length; i++) {
      document.querySelectorAll('.red')[i].style.display = 'none'
    }
  })

  // Создаём переменную для типа карты
  let stamenToner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', { detectRetina: true })
  stamenToner.addTo(map)

  // Добавляем копирайты
  map.attributionControl.addAttribution('<a href="https://stamen.com">Stamen Design</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>')
  document.querySelector('.leaflet-control-attribution').style.top = `${document.body.clientHeight}px`
  document.querySelector('.leaflet-pane').style.zIndex = `0`
}

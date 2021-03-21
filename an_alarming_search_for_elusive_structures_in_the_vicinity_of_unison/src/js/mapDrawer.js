// Метод рисует карту и расставляет маркеры движущегося транспорта
// Принимает let latitude[] и let longitude[] с широтами и долготами движущегося транспорта

import { latitude } from './transportSupervisor.js' // Массив широт
import { longitude } from './transportSupervisor.js' // Массив долгот
import { updateFrequency } from './orchestraConductor.js' // Частота обновления геоданных
import { speedsArray } from './transportSupervisor.js' // Массив скоростей
import { partitura } from './partitura.js'

export function mapDrawer() {
  // Создаём карту
  let map = L.map('map', { zoomControl: false }) // Привязываем элемент #map к картам, отключаем лишний интерфейс

  // Создаём иконку для маркера; их дизайн описан в соответствующих классах
  let markerIcon = new L.DivIcon({ className: 'marker' }) // Откуда

  // Массив маркеров
  let transportMarkerArray = []

  // Переменные для фокуса на карте, чтобы все маркеры были видны
  let maxLatitude
  let minLatitude
  let maxLongitude
  let minLongitude

  let oneCallOfFunction = 0 // Маркер первого вызова функции

  // Создаём прямоугольник с координатами двух точек и масштабируем так, чтобы обе были видны
  maxLatitude = Math.max.apply(null, latitude)
  minLatitude = Math.min.apply(null, latitude)
  maxLongitude = Math.max.apply(null, longitude)
  minLongitude = Math.min.apply(null, longitude)

  let bounds = L.latLngBounds([
    [maxLatitude - 0.008, minLongitude + 0.008],
    [minLatitude - 0.008, maxLongitude + 0.008],
  ])
  map.fitBounds(bounds) // Масштабируем

  // По каждому обновлению обновляем маркеры
  function reloadMarkers() {
    // Цикл удалений старых маркеров (только после второго вызова функции)
    if (oneCallOfFunction) {
      for (let i = 0; i < transportMarkerArray.length; i++) {
        map.removeLayer(transportMarkerArray[i])
      }
      ccc(updateFrequency)
    }

    // Цикл создания новых маркеров
    for (let i = 0; i < latitude.length; i++) {
      transportMarkerArray[i] = new L.Marker([latitude[i], longitude[i]], {
        icon: markerIcon,
      }) // Создаём новый маркер
      map.addLayer(transportMarkerArray[i]) // Добавляем на карту
    }

    function ccc(updateFrequency) {
      if (speedsArray.length < 100) {
        setTimeout(() => {
          reloadMarkers()
        }, updateFrequency)
      } else {
        partitura(
          [
            `Due to the large number of drivers on the line, to reduce the load on the system markers on the map will not be updated (but the data of transport updated in the normal mode)`,
            `В связи с большим количеством водителей на линии, для снижения нагрузки на систему маркеры на карте обновляться не будут (но данные о транспорте обновляются в штатном режиме).`,
          ],
          `alert`
        )
      }
    }

    if (!oneCallOfFunction) {
      ccc(updateFrequency)
    }

    oneCallOfFunction = 1
  }

  reloadMarkers()

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

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

const transportSegments = [
    {
        viewport: {
            topLeft: {
                x: 37.54696703910439,
                y: 55.778920602129304,
            },
            bottomRight: {
                x: 37.69429950398067,
                y: 55.724752888792494,
            },
            zoom: 13.869414832633813,
        },
        type: 'online5',
    },
    {
        viewport: {
            topLeft: {
                x: 37.55925923489786,
                y: 55.83240233638227,
            },
            bottomRight: {
                x: 37.693841696194944,
                y: 55.78299459660637,
            },
            zoom: 13.99999970703125,
        },
        type: 'online5',
    },
    {
        viewport: {
            topLeft: {
                x: 37.4169519118597,
                y: 55.8311008099235,
            },
            bottomRight: {
                x: 37.5515343731568,
                y: 55.78169141740473,
            },
            zoom: 13.99999970703125,
        },
        type: 'online5',
    },
    {
        viewport: {
            topLeft: {
                x: 37.41446283244517,
                y: 55.78132092655927,
            },
            bottomRight: {
                x: 37.54904529374225,
                y: 55.73184834006796,
            },
            zoom: 13.99999970703125,
        },
        type: 'online5',
    },
    {
        viewport: {
            topLeft: {
                x: 37.41077212024877,
                y: 55.73099407480928,
            },
            bottomRight: {
                x: 37.54535458154586,
                y: 55.68145763807288,
            },
            zoom: 13.99999970703125,
        },
        type: 'online5',
    },
    {
        viewport: {
            topLeft: {
                x: 37.55222114052298,
                y: 55.73060743691444,
            },
            bottomRight: {
                x: 37.68680360182007,
                y: 55.68107050979958,
            },
            zoom: 13.99999970703125,
        },
        type: 'online5',
    },
    {
        viewport: {
            topLeft: {
                x: 37.68903530040093,
                y: 55.731719010493585,
            },
            bottomRight: {
                x: 37.82361776169802,
                y: 55.682183493219405,
            },
            zoom: 13.99999970703125,
        },
        type: 'online5',
    },
    {
        viewport: {
            topLeft: {
                x: 37.69512925762469,
                y: 55.78421684441819,
            },
            bottomRight: {
                x: 37.82971171892179,
                y: 55.73474793318112,
            },
            zoom: 13.99999970703125,
        },
        type: 'online5',
    },
    {
        viewport: {
            topLeft: {
                x: 37.6971891733544,
                y: 55.8361620464459,
            },
            bottomRight: {
                x: 37.8317716346515,
                y: 55.78675908109472,
            },
            zoom: 13.99999970703125,
        },
        type: 'online5',
    },
    {
        viewport: {
            topLeft: {
                x: 37.53921356556988,
                y: 55.66822623769555,
            },
            bottomRight: {
                x: 37.70490401598737,
                y: 55.607128331438034,
            },
            zoom: 13.699999835205077,
        },
        type: 'online5',
    },
    {
        viewport: {
            topLeft: {
                x: 37.532989929561076,
                y: 55.901991729927936,
            },
            bottomRight: {
                x: 37.69868037998419,
                y: 55.84125912643568,
            },
            zoom: 13.699999835205077,
        },
        type: 'online5',
    },
]

export function transportSupervisor(updateFrequency) {
    // Предыдущие значения средних скоростей
    let meanValueLastOne = 0
    let meanValueLastTwo = 0
    let cycle = 0 // Переключатель
    let meanValueDifference = 0 // Разница средних значений
    let oneCallOfFunction = 0 // Маркер первого вызова функции

    async function getTransportData() {
        let promises = transportSegments.map((segment) => {
            return fetch('https://eta.api.2gis.ru/v2/points/viewport', {
                method: 'POST',
                body: JSON.stringify(segment),
            }).then((response) => response.json())
        })

        Promise.all(promises).then((responses) => {
            speedsArray.length = 0
            typeOfTransportArray.length = 0
            routesArray.length = 0
            latitude.length = 0
            longitude.length = 0

            responses.forEach((response) => {
                response.devices.forEach((vehicle) => {
                    const { device_id, speeds, x, y, route_name, transport_type } = vehicle
                    const speed = speeds[speeds.length - 1].speed

                    speedsArray.push(speed)
                    typeOfTransportArray.push(transport_type)
                    routesArray.push(route_name)
                    latitude.push(y)
                    longitude.push(x)
                })
            })

            // Подсчёт среднего арифметического скорости
            let sumOfSpeeds = 0 // Сумма скоростей
            let valueOfSpeed = 0 // Текущее значение скорости в цикле
            let meanValue = 0 // Среднее значение

            for (let i = 0; i < speedsArray.length; i++) {
                valueOfSpeed = speedsArray[i]
                sumOfSpeeds += valueOfSpeed // Суммируем
            }

            meanValue = sumOfSpeeds / speedsArray.length // Сумму делим на количество салонов

            if (!oneCallOfFunction) {
                partitura([`Getting vehicle data.`, `Получаем данные о транспорте.`])
            } else {
                partitura([`Data updated. Number of moving cars is — ${speedsArray.length}`, `Данные обновлены. Количество движущихся машин — ${speedsArray.length}`], 'message')
                partitura([`The average speed of traffic in the city — ${meanValue} km/h`, `Средняя скорость трафика в городе — ${meanValue} км/ч`], 'message')
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
                partitura([`Slowing down of traffic by ${meanValueDifference} km/h is observed`, `Наблюдается замедление движения трафика на ${meanValueDifference} км/ч`], 'alert')
                bandwidthOfGenerationFrequency = 2.2 + Math.abs(meanValueDifference) * 2
                partitura([`A new range of tone durations has been defined: from ${bandwidthOfGenerationFrequency} to 0.1 s.`, `Определён новый диапазон длительностей тонов: от ${bandwidthOfGenerationFrequency} до 0.1 секунды`], 'message')
            }
            if (meanValueDifference > 0) {
                partitura([`An acceleration of traffic by ${meanValueDifference} km/h is observed`, `Наблюдается ускорение движения трафика на ${meanValueDifference} км/ч`], 'alert')
                bandwidthOfGenerationFrequency = 2.2 - meanValueDifference * 2
                if (meanValueDifference > 1) {
                    bandwidthOfGenerationFrequency = 0.2
                }
                partitura([`A new range of tone durations has been defined: from ${bandwidthOfGenerationFrequency} to 0.1 s.`, `Определён новый диапазон длительностей тонов: от ${bandwidthOfGenerationFrequency} до 0.1 секунды`], 'message')
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
        })

        // if (transportServerResponse.ok) {
        // Если HTTP-статус в диапазоне 200-299

        //   let allTransportData = await transportServerResponse.text() // Прочитать тело ответа как текст
        //   let allTransportDataArray = allTransportData.split(',') // Парсим текст в массив

        //   // Собираем по массиву данные, исходя из наличия скорости
        //   // В каждой строке 7 элементов, начиная с 4ого каждый 7ой элемент это скорость
        //   // Если скорость == '', то пропускаем всю строку
        //   // По пути собираем типы транспорта (каждый нулевой элемент)
        //   // И номера маршрутов (каждый первый элемент в строке), исключая 4 - это служебные салоны
        //   let i = 4
        //   let j = 0

        //   for (i; i < allTransportDataArray.length; i += 7) {
        //     if (allTransportDataArray[i] != '' && allTransportDataArray[i - 4] != 4) {
        //       speedsArray[j] = allTransportDataArray[i]
        //       typeOfTransportArray[j] = allTransportDataArray[i - 4]
        //       routesArray[j] = allTransportDataArray[i - 3]
        //       latitude[j] = allTransportDataArray[i - 1] / 1000000 // Делим на миллион, так как исходно данные представлены без запятой
        //       longitude[j] = allTransportDataArray[i - 2] / 1000000
        //       j++
        //     }
        //   }

        // let allTransportData = await transportServerResponse.json()

        // speedsArray.length = 0
        // typeOfTransportArray.length = 0
        // routesArray.length = 0
        // latitude.length = 0
        // longitude.length = 0

        // allTransportData.devices.forEach((vehicle) => {
        //     const { device_id, speeds, x, y, route_name, transport_type } = vehicle
        //     const speed = speeds[speeds.length - 1].speed

        //     speedsArray.push(speed)
        //     typeOfTransportArray.push(transport_type)
        //     routesArray.push(route_name)
        //     latitude.push(y)
        //     longitude.push(x)
        // })

        // console.log(speedsArray)

        // // Подсчёт среднего арифметического скорости
        // let sumOfSpeeds = 0 // Сумма скоростей
        // let valueOfSpeed = 0 // Текущее значение скорости в цикле
        // let meanValue = 0 // Среднее значение

        // for (let i = 0; i < speedsArray.length; i++) {
        //     valueOfSpeed = speedsArray[i]
        //     sumOfSpeeds += valueOfSpeed // Суммируем
        // }

        // meanValue = sumOfSpeeds / speedsArray.length // Сумму делим на количество салонов

        // if (!oneCallOfFunction) {
        //     partitura([`Getting vehicle data.`, `Получаем данные о транспорте.`])
        // } else {
        //     partitura([`Data updated. Number of moving cars is — ${speedsArray.length}`, `Данные обновлены. Количество движущихся машин — ${speedsArray.length}`], 'message')
        //     partitura([`The average speed of traffic in the city — ${meanValue} km/h`, `Средняя скорость трафика в городе — ${meanValue} км/ч`], 'message')
        // }

        // // Для подсчёта разницы средних скоростей поочерёдно запоминаем предыдущие значения
        // if (cycle) {
        //     cycle = 0
        //     meanValueLastTwo = meanValue
        //     meanValueDifference = meanValue - meanValueLastOne
        // } else {
        //     cycle = 1
        //     meanValueLastOne = meanValue
        //     if (oneCallOfFunction) {
        //         meanValueDifference = meanValue - meanValueLastTwo
        //     } // Но первый вызов пропускаем, так как на этом этапе нам не с чем сравнивать
        // }

        // // В зависимости от разницы скоростей формируем диапазон возможных длительностей нот.
        // // Вернее, частоту их генерации. Чем быстрее мы ускорились, тем короче диапазон, и дирижёр будет вынужден выбирать длительности в узком и очень коротком диапазоне (например от 0.1 до 0.2 секунды)
        // if (meanValueDifference < 0) {
        //     partitura([`Slowing down of traffic by ${meanValueDifference} km/h is observed`, `Наблюдается замедление движения трафика на ${meanValueDifference} км/ч`], 'alert')
        //     bandwidthOfGenerationFrequency = 2.2 + Math.abs(meanValueDifference) * 2
        //     partitura([`A new range of tone durations has been defined: from ${bandwidthOfGenerationFrequency} to 0.1 s.`, `Определён новый диапазон длительностей тонов: от ${bandwidthOfGenerationFrequency} до 0.1 секунды`], 'message')
        // }
        // if (meanValueDifference > 0) {
        //     partitura([`An acceleration of traffic by ${meanValueDifference} km/h is observed`, `Наблюдается ускорение движения трафика на ${meanValueDifference} км/ч`], 'alert')
        //     bandwidthOfGenerationFrequency = 2.2 - meanValueDifference * 2
        //     if (meanValueDifference > 1) {
        //         bandwidthOfGenerationFrequency = 0.2
        //     }
        //     partitura([`A new range of tone durations has been defined: from ${bandwidthOfGenerationFrequency} to 0.1 s.`, `Определён новый диапазон длительностей тонов: от ${bandwidthOfGenerationFrequency} до 0.1 секунды`], 'message')
        // }

        // // По первому приходу данных генерим карту
        // if (oneCallOfFunction == 0) {
        //     oneCallOfFunction = 1
        //     mapDrawer(updateFrequency)
        // }
        // // По второму приходу данных генерим тоны
        // else if (oneCallOfFunction == 1) {
        //     orchestraConductor()
        //     partitura([`Calling the orchestra conductor.`, `Вызов дирижёра.`])
        //     oneCallOfFunction++
        // }
        // } else {
        //     console.log('Ошибка HTTP: ' + transportServerResponse.status)
        // }
    }

    getTransportData()

    // Повторяем выполнение функции с частотой updateFrequency
    setInterval(() => {
        getTransportData()
    }, updateFrequency)
}

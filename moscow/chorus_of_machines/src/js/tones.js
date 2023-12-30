// Метод генерирует звукоряд
// Принимает:
// const root - базовая частота, самая низкая частота
// const octaveAmount - количество октав
// const tonesInOctaveAmount - количество тонов (нот) в октаве
// Отдаёт const tonesArray[] - массив тонов (звукоряд)

export const tonesArray = [];

export function tones(root, octaveAmount, tonesInOctaveAmount) {

  let tonesAmount = octaveAmount * tonesInOctaveAmount; // Количество тонов

  for (let i = 0; i < tonesAmount; i++) {
    tonesArray[i] = root * (2 ** (i / tonesInOctaveAmount)); // Формируем равномерно темперированный звукоряд
  }

}
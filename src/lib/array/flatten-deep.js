/**
 * 배열을 재귀적으로 평탄화하여 배열을 반환
 * @param {Array<any>} array 평탄화할 배열
 * @returns {Array<any>} 평탄화된 배열
 */
export function flattenDeep(array) {
  const result = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];

    if (Array.isArray(item)) {
      result.push(...flattenDeep(item));
    } else {
      result.push(item);
    }
  }

  return result;
}

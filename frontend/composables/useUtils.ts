export default function () {
  /** [compareObject 객체 비교 함수]
   * @param a 비교할 객체 a
   * @param b 비교할 객체 b
   * @param exceptFields 비교 제외할 필드 목록 (옵션임)
   * @returns boolean
   * @description 두 객체를 비교하여 같으면 true, 다르면 false를 반환합니다.
   * @example compareObject({a: 1, b: 2}, {a: 1, b: 2}) // true
   */
  const compareObject = (a: any, b: any, exceptFields?: string[]) => {
    let result = true;
    const fields = Object.keys(a);
    for (const field of fields) {
      if (exceptFields && exceptFields.includes(field)) {
        continue;
      }
      if (a[field] !== b[field]) {
        result = false;
        break;
      }
    }
    return result;
  };

  return {
    compareObject,
  };
}

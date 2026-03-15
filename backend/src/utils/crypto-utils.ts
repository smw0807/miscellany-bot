import { randomBytes } from 'crypto';

/**
 * 랜덤 문자열 생성
 * @param length 생성할 문자열 길이
 * @returns
 */
export const generateRandomString = (length?: number): string => {
  return randomBytes(length ? length : 16).toString('hex');
};

/**
 * string | boolean 타입의 값을 boolean으로 변환
 */
export const toBooleanValue = (value: boolean | string): boolean => {
  if (typeof value === 'string') return value === 'true';
  return value;
};

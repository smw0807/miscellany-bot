// 코드 데이터 맵핑 정의

import { LanguageCommand } from './language-commands';
import { LanguageCode } from './language-codes';

// 번역 명령어와 쿡가코드 맵핑 객체
export const languageCommandMap = {
  [LanguageCommand.TranslageToGerman]: LanguageCode.German,
  [LanguageCommand.TranslageToJapanese]: LanguageCode.Japanese,
  [LanguageCommand.TranslageToEnglish]: LanguageCode.English,
  [LanguageCommand.TranslageToKorean]: LanguageCode.Korean,
  [LanguageCommand.TranslageToArabic]: LanguageCode.Arabic,
  [LanguageCommand.TranslageToTurkish]: LanguageCode.Turkish,
  [LanguageCommand.TranslageToPolish]: LanguageCode.Polish,
};

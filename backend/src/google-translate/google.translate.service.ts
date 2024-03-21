import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import googleTranslateConfig from 'src/config/conf/google.translate.config';
import { Translate } from '@google-cloud/translate/build/src/v2';

@Injectable()
export class GoogleTranslateService {
  private readonly logger = new Logger(GoogleTranslateService.name);
  private translate: Translate;

  private apiKey: string;
  constructor(
    @Inject(googleTranslateConfig.KEY)
    private config: ConfigType<typeof googleTranslateConfig>,
  ) {
    this.apiKey = this.config.GOOGLE_TRANSLATE_API_KEY;
    this.translate = new Translate({
      key: this.apiKey,
    });
  }

  /**
   * [ 텍스트 번역 ]
   * @param text 번역할 텍스트
   * @param sourceLanguageCode 번역 대상 언어 코드
   * @param targetLanguageCode 번역시킬 언어 코드
   */
  async translateText(text: string, targetLanguageCode: string) {
    this.logger.debug(`[번역] ${text} -> ${targetLanguageCode}`);
    try {
      const [response] = await this.translate.translate(text, {
        to: targetLanguageCode,
      });
      return response;
    } catch (e) {
      this.logger.error('Google Translate Error', e);
      console.error(e);
      throw new Error('Google Translate Error');
    }
  }
}

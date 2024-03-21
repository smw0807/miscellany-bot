import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import googleTranslateConfig from 'src/config/conf/google.translate.config';
import { TranslationServiceClient } from '@google-cloud/translate';

@Injectable()
export class GoogleTranslateService {
  private readonly logger = new Logger(GoogleTranslateService.name);
  private translationServiceClient: TranslationServiceClient;
  private projectId: string;
  private clinetId: string;
  private apiKey: string;
  private location = 'global';
  constructor(
    @Inject(googleTranslateConfig.KEY)
    private config: ConfigType<typeof googleTranslateConfig>,
  ) {
    this.translationServiceClient = new TranslationServiceClient();
    this.projectId = this.config.GOOGLE_PROJECT_ID;
    this.apiKey = this.config.GOOGLE_TRANSLATE_API_KEY;
    this.clinetId = this.config.GOOGLE_TRANSLATE_CLIENT_ID;
  }

  /**
   * [ 텍스트 번역 ]
   * @param text 번역할 텍스트
   * @param sourceLanguageCode 번역 대상 언어 코드
   * @param targetLanguageCode 번역시킬 언어 코드
   */
  async translateText(
    text: string,
    sourceLanguageCode: string,
    targetLanguageCode: string,
  ) {
    try {
      // Construct request
      const request = {
        parent: `projects/${this.projectId}/locations/${this.location}`,
        contents: [text],
        mimeType: 'text/plain', // mime types: text/plain, text/html
        sourceLanguageCode,
        targetLanguageCode,
      };

      // Run request
      const [response] =
        await this.translationServiceClient.translateText(request);
      console.log(response);
      for (const translation of response.translations) {
        console.log(`Translation: ${translation.translatedText}`);
      }
    } catch (e) {
      this.logger.error('Google Translate Error', e);
      console.error(e);
    }
  }
}

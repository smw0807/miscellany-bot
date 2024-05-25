// 에러 관련 타입
export type NestHttpException = {
  statusCode: number;
  message: string;
  response?: {
    _data: string;
    status: number;
    statusText: string;
    error: string;
  };
};

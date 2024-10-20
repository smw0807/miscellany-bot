# Dockerfile
FROM nginx:alpine

# Nginx 설정 파일을 컨테이너의 적절한 위치로 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 기본 Nginx 이미지 포트 설정
EXPOSE 80

# Docker 이미지 빌드 및 실행 방법
# 1. Docker 이미지 빌드:
#    docker build -t nginx .
# 2. Docker 컨테이너 실행:
#    docker run -d -p 80:80 --name nginx-container nginx
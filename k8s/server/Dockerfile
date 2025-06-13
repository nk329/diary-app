FROM node:18-alpine

# SSH 서버 설치
RUN apk add --no-cache openssh

# SSH 설정
RUN echo "root:1234" | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH 서비스 시작 스크립트
COPY start.sh /start.sh
RUN chmod +x /start.sh

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["/start.sh"] 
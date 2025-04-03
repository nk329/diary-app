# 다이어리 앱

React와 Node.js를 사용한 다이어리 웹 애플리케이션입니다.

## 기능

- 회원가입/로그인
- 다이어리 작성
- 다이어리 목록 조회
- 기분 상태 표시

## 기술 스택

### Frontend
- React
- Material-UI
- Axios

### Backend
- Node.js
- Express
- MySQL
- JWT

## 설치 및 실행

### 서버 실행
```bash
cd server
npm install
npm run dev
```

### 클라이언트 실행
```bash
cd client
npm install
npm start
```

## 환경 설정

### 서버 (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=diary_app
JWT_SECRET=your_jwt_secret
```

## 데이터베이스 설정

1. MySQL 설치
2. 데이터베이스 생성:
```sql
CREATE DATABASE diary_app;
```
3. 테이블 생성:
```sql
USE diary_app;
source server/config/init.sql
``` 
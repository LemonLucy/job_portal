# 회원 관리 API (Node.js + Express + MongoDB)

## 프로젝트 설명
이 프로젝트는 Node.js, Express, MongoDB를 사용하여 기본적인 회원 관리 기능과 인증/인가 기능을 구현한 API입니다. JWT 기반 인증을 사용하여 보안성을 높였습니다.

---

## 구현된 기능

### 회원 관리 기능
- 회원 가입 (`POST /auth/register`)
  - 이메일 형식 검증
  - 비밀번호 암호화 (Base64)
  - 이메일 중복 검사
  - 사용자 정보 저장
- 로그인 (`POST /auth/login`)
  - 사용자 인증
  - JWT Access Token 발급
  - 실패 시 에러 처리
- 회원 정보 조회 (`GET /auth/profile`)
  - JWT 인증 미들웨어를 통해 사용자 정보 조회
- 회원 탈퇴 (`DELETE /auth/delete`)
  - JWT 인증 미들웨어를 통해 사용자 계정 삭제

---

### 보안 기능
- JWT 기반 인증
  - Access Token 발급 및 검증
- 인증 미들웨어
  - 모든 API 요청에 대해 토큰 인증
- 권한 검사 미들웨어
- 입력 데이터 검증
  - 이메일 형식 및 필수 필드 검증

---

## 추가 구현 기능 
1. 로그인 이력 저장
2. Refresh Token 구현 및 토큰 갱신 메커니즘
3. 회원 정보 수정 (`PUT /auth/profile`)
   - 비밀번호 변경
   - 프로필 정보 수정

---

## 설치 및 실행 방법

### 1. 클론 후 의존성 설치
```bash
git clone [repository_url]
cd [project_directory]
npm install
1. 기본 CRUD API 구현
회원 관리 관련 API: ✅ 구현 완료
/auth/register: 회원 가입
/auth/login: 로그인
/auth/profile: 회원 정보 조회
/auth/delete: 회원 탈퇴
2. 회원 가입/로그인 API
회원 가입: ✅ 구현 완료
이메일 형식 검증: ✅
비밀번호 암호화 (Base64): ✅
중복 회원 검사: ✅
사용자 정보 저장: ✅
로그인: ✅ 구현 완료
사용자 인증: ✅
JWT 토큰 발급: ✅
로그인 실패 시 에러 처리: ✅
로그인 이력 저장: ❌ (미구현)
3. JWT 기반 인증
Access Token 발급 및 검증 (필수): ✅ 구현 완료
Refresh Token 구현 (가산점): ❌ (미구현)
토큰 갱신 메커니즘 (필수): ❌ (미구현)
4. 보안 미들웨어 구현
인증 미들웨어: ✅ 구현 완료
권한 검사 미들웨어: ✅ 구현 완료
입력 데이터 및 파라미터 검증: ✅ 구현 완료
5. 회원 관리 API
/auth/register: ✅
이메일 형식 검증: ✅
비밀번호 암호화 (Base64): ✅
중복 회원 검사: ✅
사용자 정보 저장: ✅
/auth/login: ✅
사용자 인증: ✅
JWT 토큰 발급: ✅
로그인 실패 시 에러 처리: ✅
/auth/refresh: ❌ (미구현)
Refresh 토큰 검증: ❌
새로운 Access 토큰 발급: ❌
토큰 만료 처리: ❌
/auth/profile (PUT): ❌ (미구현)
회원 정보 수정: ❌
비밀번호 변경: ❌
프로필 정보 수정: ❌

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

## 미구현 기능 (추가 개발 필요)
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
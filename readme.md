# 회원 관리 API (Node.js + Express + MongoDB) 

## 프로젝트 설명
이 프로젝트는 Node.js, Express, MongoDB를 사용하여 기본적인 회원 관리 기능과 인증/인가 기능을 구현한 API입니다. JWT 기반 인증을 사용하여 보안성을 높였습니다.

---

## 구현된 기능
Header입력란
- (필수) Content-Type : application/json
- (선택) middleware를 거치는 모든 기능들은 Header의  Authorization Key에 Bearer <token>을 입력하셔야 합니다.

### 회원 관리 기능
- 회원 가입 (`POST /auth/register`)
  - 이메일 형식 검증
  - 비밀번호 암호화 (Base64)
  - 이메일 중복 검사
  - 사용자 정보 저장
  # 요청예시
  {
    "name": "john",
    "email": "user@example.com",
    "password": "password123"
  }

- 로그인 (`POST /auth/login`)
  - 사용자 인증
  - JWT Access Token 발급
  - 실패 시 에러 처리

- 회원 정보 조회 (`GET /auth/profile`)
  - header에 토큰 입력 후 JWT 인증 미들웨어를 통해 사용자 정보 조회

- 회원 정보 수정 (`PUT /auth/profile`)
  - JWT 인증 미들웨어를 통해 사용자 정보 수정
  - 수정 후 자동 로그아웃되므로 수정한 비밀번호로 재로그인 필요
    # 요청예시
    - {
      "name": "New Name",
      "email": "new@example.com"
      }
    - {
        "oldPassword": "oldpassword",
        "newPassword": "newpassword123"
      }

- 회원 탈퇴 (`DELETE /auth`)
  - JWT 인증 미들웨어를 통해 사용자 계정 삭제

- 토큰 갱신 (`POST /auth/refresh`)
  - JWT refresh Token 발급받은 걸로 새 access토큰 발급
  # 요청 예시 
  {
  "refreshToken": "<REFRESH_TOKEN>"
  }

### 직업 정보 조회 기능
- 직업 공고 정보 조회 (`GET /jobs`)
  - JWT 인증 미들웨어를 통해 직업 정보 조회
  # 요청 예시
  http://113.198.66.75:17148/jobs?location=서울&experience=신입&requirement=대졸&sort=date&page=1

- 특정 직업 공고 정보 조회 (`GET /jobs/:id`)
  - JWT 인증 미들웨어를 통해 직업 정보 조회
  - 상세정보
  # 요청 예시
  http://113.198.66.75:17148/jobs/jobId123

- 직업 검색(`GET/jobs?`)
  - company, position, keyword 검색 제공
  # 요청 예시
  http://113.198.66.75:17148/jobs?company=포니링크
  http://113.198.66.75:17148/jobs?position=개발자
  http://113.198.66.75:17148/jobs?keyword=IT

### 지원 기능
- 지원 생성 (POST /applications)
  # 요청 예시
  {
  "jobId": "6482c48f3e84c11111111111",
  "resume": "http://example.com/resume.pdf"
  }

- 지원 목록 조회 (GET /applications)

- 특정 사용자 지원 목록 조회 (GET /applications/:userId)

- 지원 취소 (DELETE /applications/:id)

### 북마크 기능
- 북마크 추가/제거 토글처리 (POST /bookmarks)
  # 요청 예시
  {
    "jobId" : "674f9f10ae4a9568c9be5ea7"
  }

### 회사 
- 회사 등록 (POST /companies)
  # 요청 예시
  {
    "company_name": "(주)유베이스",
    "establishment_date": "1998년 12월 18일",
    "ceo_name": "권상철",
    "industry": "콜센터 및 텔레마케팅 서비스업",
    "address": "서울 용산구 한강대로38길 37"
  } 
- 회사 조회 (GET /companies)

### 리뷰 기능
- 리뷰 등록 (POST /reviews)
  # 요청 예시
  {
    "company": "<COMPANY_ID>",
    "rating": 5,
    "review": "Great company culture and support."
  }

- 리뷰 조회 (GET /reviews)

- 리뷰 삭제 (DELETE /reviews/:id)

### 이력서 기능
- 이력서 생성 (POST /resumes)
  # 요청 예시
  {
  "title": "Software Developer Resume",
  "skills": ["JavaScript", "Node.js", "React", "MongoDB"],
  "education": [
    {
      "school": "ABC University",
      "degree": "Bachelor's",
      "fieldOfStudy": "Computer Science",
      "startDate": "2015-09-01",
      "endDate": "2019-06-01"
    }
  ],
  "experience": [
    {
      "company": "XYZ Tech",
      "position": "Backend Developer",
      "startDate": "2020-01-01",
      "endDate": "2023-01-01",
      "description": "Developed RESTful APIs and maintained backend services."
    }
  ]
}

- 이력서 조회 (GET /resumes)

- 이력서 업데이트 (PUT /resumes)

- 이력서 삭제 (DELETE /resumes)

### 검색 히스토리 저장
- 히스토리 저장 (POST /history)
  # 사용 예시
  {
  "filters": {
    "location": "Seoul",
    "experience": "2 years",
    "jobtype": "Full-time"
    }
  }

- 히스토리 조회 (GET /history)

- 히스토리 삭제 (DELETE /history/:id)

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
npm install
npm install express

- 배포된 swagger문서 확인
  http://113.198.66.75:17148/api-docs

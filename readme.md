# 스마트 주차장 - 모빌리티 허브 (RC카 + IoT + 웹)

> RC카 라인트레이싱 기반 자동 이동, MQTT 센서/장치 제어, 사용자/관리자 웹을 결합한 스마트 주차장 모델
>
> 웹에서 차량 등록 및 서비스 요청 → RC카 경로 전달 → 구역 상태 갱신까지 이어지는 통합 모빌리티 허브 구현

---

## 🎥 1. 프로젝트 시연 영상

- 영상 보기: (링크 추가)

---

## 📘 2. 프로젝트 개요

| 항목 | 내용 |
| --- | --- |
| **팀명** | 2차 프로젝트 2팀 MobilityHub |
| **프로젝트명** | 스마트 주차장(모빌리티 허브) |
| **목표** | RC카 라인트레이싱 기반 자동 이동 + IoT 장치 제어 + 웹 시스템 연동 프로토타입 구현 |
| **핵심 키워드** | MQTT, RC카, IoT 제어, Spring Security, JWT, React |
| **주요성과** | 웹 서비스 요청 → RC카 경로 전달 → 구역 상태 갱신, MQTT 기반 카메라/게이트/펌프/리프트 제어 |
| **기간** | 2025.11.26~2025.12.17 |
| **사용 장치/센서** | 라인트레이싱 센서, 초음파 센서, 서보모터(게이트),MG996R 중형 서보모터(정비소-리프트), 16채널 12비트 PWM/서보 드라이버(PCA9685), 5V 3A 아답터, DC 전원 젠더 암(2), MCP3008, 조이스틱, LED, RGB 3색 LED, Pi 카메라, LED, 워터펌프 모터, L9110 4채널 모터 드라이버 모듈 |
| **산출물** | User/Admin Web, Spring Boot API, DB 스키마, RC카/IoT 스크립트, README, 시연 영상 |

---

## 👥 3.팀원 및 역할

---

| 이름 | 역할 및 담당 업무 | 개인 Git |
| --- | --- | --- |
| **천경신** | **팀장**<br>RC카 및 Backend RC카 경로/상태 관리<br>Spring Security + JWT 적용 사용자 로그인을 포함한 User Web 기능 구현 | [sthasq](https://github.com/sthasq) |
| **노건우** | 관리자 인증/인가 시스템 구현 (Spring Security + JWT)<br>정비 파트 Backend 개발 (재고·정비요청·리포트 CRUD)<br>관리자 계정 관리 및 비밀번호 암호화 처리 (BCrypt)<br>정비 파트 Frontend 개발 (API 연동 및 데이터 전처리)<br>MQTT 기반 다중 카메라 실시간 스트리밍 및 연결 관리 | [geonwoo1226](https://github.com/geonwoo1226) |
| **이다온** | 프론트 admin/user 디자인 설계 및 기본틀 제작, 메인/주차장/세차/통계 파트 Backedn 및 Frontend 구현, 물펌프/리프트 장치 구현, 주차장 조형물 제작  | [DaOn1072](https://github.com/DaOn1072) |
| **이희원** | 출입구(게이트/카메라), Backend 일부, Admin Web 보완| [heewonn09](https://github.com/heewonn09) |


---

## 🗓️ 4. 프로젝트 일정

| 작업 항목 | 시작 | 종료 | 기간 |
| --- | --- | --- | --- |
| 프로젝트 정의 및 요구사항 정리 | 1주차 | 1주차 | 1주 |
| RC카 조립 및 센서 테스트 | 1주차 | 2주차 | 2주 |
| Web/Backend 기본 기능 구현 | 1주차 | 3주차 | 3주 |
| MQTT 연동 및 장치 제어 | 2주차 | 3주차 | 2주 |
| 통합 테스트 및 시연 준비 | 3주차 | 3주차 | 1주 |

---

## 🏗 5. 시스템 아키텍처

📌 시스템 구성 요약

✅ 사용자/관리자 로그인 기반 서비스 제공<br>✅ MQTT로 RC카/센서/카메라 실시간 제어/수신<br>✅ Web ↔ Backend ↔ DB 연동으로 상태 관리<br>✅ Raspberry Pi에서 카메라/게이트/펌프/리프트 제어

🔐 로그인 / 회원가입 흐름

- 회원가입
    - 웹에서 아이디/비밀번호/전화번호/이름/차량번호 등록
    - Backend → DB 저장
- 로그인
    - ID/PW 검증 후 JWT 발급
    - 사용자/관리자 권한에 따라 UI 분기

💡 데이터 흐름 요약

| 기능 | 흐름 |
| --- | --- |
| **서비스 요청** | User Web → Backend → MQTT → RC카 |
| **RC카 위치 보고** | RC카 → MQTT → Backend/주차 LED |
| **입구 OCR** | 게이트 카메라 → MQTT → Backend → Admin UI |
| **장치 제어** | Admin/Backend → MQTT → Raspberry Pi |

### 🧰 사용 기술

| 계층 | 기술 / 도구 |
| --- | --- |
| User Web | React, Vite |
| Admin Web | React, Vite |
| Backend | Spring Boot, Spring Security, JWT, JPA, Spring Integration MQTT |
| 통신 계층 | MQTT (Mosquitto) |
| DB 계층 | MySQL |
| IoT 제어 | Raspberry Pi, Python, RPi.GPIO, Picamera2 |
| MQTT 라이브러리 | Paho |


1. 사용자 웹 (User Web)

| 항목 | 설명 |
| --- | --- |
| **역할** | 사용자 인터페이스 제공 |
| **기능** | 회원가입/로그인, 차량 등록, 서비스 요청, 이용 이력 조회 |
| **기술** | React, Vite |
| **연동** | - Backend REST API |

2. 관리자 웹 (Admin Web)

| 항목 | 설명 |
| --- | --- |
| **역할** | 관리자 대시보드 및 구역 제어 |
| **기능** | 입출구/주차/세차/정비 상태 모니터링, 카메라 스트리밍 |
| **기술** | React, Vite |
| **연동** | - Backend REST API<br>- MQTT 브로커(WebSocket) |

3. 백엔드 (Spring Boot)

| 항목 | 설명 |
| --- | --- |
| **역할** | 서비스 요청/경로 계산/상태 관리 |
| **기능** | JWT 인증, 작업 이력 관리, MQTT Pub/Sub |
| **기술** | Spring Boot, JPA, Spring Integration MQTT |

4. 데이터베이스 (MySQL)

| 항목 | 설명 |
| --- | --- |
| **역할** | 시스템 전체 데이터 저장 및 조회 |
| **기능** | 사용자/차량/작업/주차 구역/경로 정보 관리 |
| **기술** | MySQL |
| **연동** | - Backend(JPA)와 연동 |
<img width="1054" height="862" alt="image" src="https://github.com/user-attachments/assets/607725fa-0dcb-4d93-92ee-08821a3e156c" />

| 주요 테이블 | 설명 |
| --- | --- |
| `user`, `admin` | 계정/권한 |
| `car`, `user_car` | 차량 및 매핑 |
| `parking`, `work`, `work_info` | 구역 상태/서비스 요청/이력 |
| `parking_map_node`, `edge` | 경로 그래프 |
| `repair_report` | 정비 리포트 |

5. MQTT 브로커 (Mosquitto)

| 항목 | 설명 |
| --- | --- |
| **역할** | 센서 데이터 송신 및 제어 명령 중계 |
| **기능** | MQTT 프로토콜로 메시지 송수신 |
| **기술** | Mosquitto |
| **연동** | - Raspberry Pi ↔ 브로커<br>- Backend ↔ 브로커<br>- Admin Web ↔ 브로커 |

| 주요 토픽 + 메시지 예시 | 설명 |
| --- | --- |
| `rccar/{carId}/command` | RC카 경로/작업 타입 전달 |
| `rccar/{carId}/service` | 서비스 완료 + 다음 경로 전달 |
| `rccar/{carId}/call` | 출구 호출 경로 전달 |
| `rccar/{carId}/position` | RC카 위치 보고 |
| `parking/web/entrance/control` | 입구 카메라/차단기 제어 |
| `parking/web/carwash/control` | 세차 카메라/펌프 제어 |
| `parking/web/repair/control` | 정비 카메라/리프트 제어 |
| `parking/web/parking/control` | 주차 카메라 제어 |
| `parking/web/repair/lift/angle` | 정비 카메라/리프트 제어 |
| `parking/web/entrance/frame` | 입구 카메라 영상수신 토픽 |
| `parking/web/carwash/frame` | 세차 카메라 영상수신 토픽 |
| `parking/web/repair/frame` | 정비 카메라 영상수신 토픽 |
| `parking/web/parking/frame` | 주차 카메라 영상수신 토픽 |

6. Raspberry Pi (Python)

| 항목 | 설명 |
| --- | --- |
| **역할** | RC카/게이트/카메라/펌프/리프트 제어 |
| **기능** | 센서 Publish, 제어 Subscribe |
| **기술** | Python, paho-mqtt, RPi.GPIO |
| **연동** | - MQTT 브로커 |

| 하드웨어 구성 | 동작 설명 |
| --- | --- |
| RC카 라인트레이서 | 노드 이동/위치 보고 |
| 게이트 서보 + 초음파 | 입출구 차단기 개방/닫힘, 차량 감지 |
| 카메라 | 입구/세차/정비/주차 영상 송수신 |
| 펌프 | 세차 동작 제어 |
| 리프트 | 정비 리프트 각도 제어 |


---


## ⚠️ 6. 미 해결 문제 및 해결 방안

| 문제 | 원인 | 해결 방안 |
| --- | --- | --- |
| 라인트레이싱 불안정 | 센서 오차/모터 전압 이슈 | 센서 튜닝 및 하드웨어 안정화 후 자동 주행 재검토 |
| OCR 인식 정확도 | 조명/각도/해상도 한계 | 이미지 전처리 강화 및 관리자 보정 UX 개선 |

---

## 🔧 7.프로젝트결과 및 개선필요점

| 기능 | 구현 결과 | 개선 필요점 | 개선 방안 | 순위 |
| --- | --- | --- | --- | --- |
| RC카 이동 | 커맨드/위치 통신 성공(수동 주행) | 라인트레이싱 안정화 필요 | 센서/모터 튜닝 | 상 |
| 웹 서비스 요청 | 구현 성공 | 요청/취소 UX 개선 필요 | 상태 흐름 정교화 | 중 |
| MQTT 통신 | 구현 성공 | 토픽 체계화 필요 | 토픽 표준화 문서화 | 중 |
| 입구 OCR/게이트 | 부분 성공 | 인식률 개선 필요 | 전처리/보정 UX 개선 | 중 |


---

## 🧾 8. 참고문서

- 

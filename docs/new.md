## 스마트 주차장 프로젝트 소개 (최종)

### 1. 프로젝트 개요
- **배경**: 자율주행 시대를 대비해 차량이 스스로 주차·세차·정비를 수행할 수 있는 통합 모빌리티 허브 필요.
- **목적**: RC카 기반 자율 이동(라인트레이서) + IoT 센서 제어 + 웹 관리자/사용자 시스템을 연동한 프로토타입 구현.
- **제약/접근**: 완전 자율주행 대신 라인트레이싱 기반 자동 이동을 기본으로 하되, 불안정 시 수동(SSH 원격 키보드 조작) 운용을 허용.

### 2. 시스템 아키텍처 (구성요소)
- **User Web (React/Vite)**: 차량 등록, 서비스 선택, 진행 현황/이력 확인 (`frontend/user`).
- **Admin Web (React/Vite)**: 대시보드, 입출입 관리, 세차/정비/주차 상태 제어 및 알림 (`frontend/admin`).
- **Backend (Spring Boot)**: REST API, JPA/MySQL, JWT 인증, MQTT 연동 (`backend`).
- **DB (MySQL)**: 사용자/관리자/차량/서비스/주차구역/경로 그래프 등 스키마 및 초기 데이터 (`schema.sql`, `data.sql`).
- **MQTT Broker**: 센서·RC카·카메라·서버 간 명령/상태 교환.
- **Edge/IoT**: RC카 주행, 게이트 서보/초음파, 카메라(OCR), 세차/정비 제어 스크립트 (`raspi/*`).

### 3. 전체 흐름 (E2E 요약)
1. 웹에서 차량 등록 및 서비스 선택.
2. 입구 접근 시, rc카가 라인트레이싱으로 입구 노트 인식. mqtt로 신호 보냄 -> 입구 카메라가 ocr
3. OCR 번호 vs 사용자 등록 번호 비교 → 일치 시 게이트 자동 개방, 불일치 시 관리자 확인/수정.
4. RC카가 지정된 서비스 경로로 이동(주차/세차/정비 조합)하며 센서 이벤트를 MQTT로 보고.
5. 각 구역 도착/완료 시 상태 업데이트 및 장치 제어(펌프, 정비, 경고등 등).
6. 서비스 종료 후 출구 게이트 이동 및 출차 기록.
7. 관리자 대시보드에 입·출차/서비스 현황, 알림, 통계 반영.

### 4. 사용자 시나리오
- **회원가입**: 아이디/비밀번호/전화번호/이름/차번호 입력 → DB `user` 테이블 insert.
- **로그인**: 아이디/비밀번호 검증 후 JWT 발급 → 메인 화면, 실패 시 유효성 안내.
- **주차장 서비스 이용**:
	- 등록 차량 선택 또는 신규 차량 번호 등록(`car` + `user_car` 매핑 insert).
	- 서비스 조합 선택 → 전송 시 재확인(“수정 불가” 안내), 취소 시 재선택 가능.
	- 확정 후 RC카/웹에 서비스 경로 publish → 완료 시 출구 이동. 중도 취소 시 진행 중 서비스까지만 완료 후 출구.
- **이용 내역**: 해당 차량의 서비스 이용 히스토리 조회.
- **My 정보 수정**: 비밀번호 변경(현재 비밀번호 일치 여부, 새 비밀번호 재확인 후 update; 불일치 시 안내 및 초기화).

### 5. 서비스 조합 및 상태 관리
- **상태 값**: `미사용` / `사용` / `대기중` (주차/세차/정비 구역 점유 관리).
- **대기 전략**:
	- A안: `사용` 중인 구역은 버튼 비활성화(대기 없음, 이용 제약).
	- B안: 대기 허용 — 점유 시 `대기중`, 선행 차량 완료 후 `사용`으로 승격(대기구역 필요, 시간 예측 난이도 존재).
- **조합 흐름**:
	1) 주차만: 빈 주차 섹터 조회 → 이동 → `사용` 업데이트 → 출구 시 `미사용`.
	2) 세차만: 빈 세차 섹터 → 이동/세차 → 출구.
	3) 정비만: 빈 정비 섹터 → 이동/정비 → 출구.
	4) 주차+세차: 세차 섹터 → 세차 → 빈 주차 섹터 → 주차 → 호출 시 출구.
	5) 주차+정비: 정비 섹터 → 정비 → 빈 주차 섹터 → 주차 → 호출 시 출구.
- **완료 기준 예시**: 세차 펌프 3회 동작 후 `세차완료` 메시지 pub → RC카 다음 구역 도착 시 state 업데이트.

### 6. 관리자 시나리오
- **로그인/권한**: 역할별 페이지 접근 제어(세차 관리자, 정비 관리자, 전체 관리자 등). 권한 없을 시 “권한 없음” 페이지.
- **대시보드/네비게이션**: 좌측 네비로 권한별 페이지 이동, “스마트 주차장”/“메인” 클릭 시 메인 대시보드.
- **알림**: 우측 상단 알림 아이콘 → RC카 구역 도착 등 이벤트; 클릭 시 해당 페이지 이동.
- **프로필**: 정보 수정, 로그아웃.
- **페이지별**:
	- 입출구 관리: 카메라 번호판 인식(OpenCV); 성공 시 완료, 실패 시 “수정필요”로 관리자 보정.
	- 주차 관리자 전용, 세차 관리자 전용, 정비 관리자 전용 페이지로 구역 상태/제어.
	- 정비 시 사용자 승인 절차 추가 가능.
	- 총관리자: 모든 페이지 조회/제어.

### 7. 센서·RC카·입구 처리 흐름
1. 사용자 앱에서 입차 요청 생성(REQUESTED).
2. RC카가 라인트레이싱으로 입구 노드(1번) 도착 감지 → `rccar/{carId}/position` MQTT 발행.
3. 서버가 입구 도착 이벤트 수신 → 카메라 트리거 `parking/entrance/camera` 발행.
4. 카메라가 번호판 촬영/OCR → `parking/entrance/licensePlate` 결과 전송.
5. 관리자 UI에 인식 번호판 표시 → 확인/수정/확정.
6. 서버에서 등록 번호와 비교 → 일치 시 `parking/entrance/gate: gate_open`, 불일치 시 관리자 조치.
7. `entry_time` 저장, `work_info` 생성, 입차 기록 테이블 갱신.
8. 구역별 도착/출발 시 MQTT 이벤트로 상태 업데이트 및 장치 제어.

### 8. MQTT 토픽 맵 (주요)
| 토픽 | 방향 | 페이로드 예시 | 용도 |
| --- | --- | --- | --- |
| `parking/entrance/licensePlate` | Cam → 서버 | `{번호판}` | 입구 OCR 번호 전송 |
| `parking/entrance/gate` | 서버 ↔ 장치 | `gate_open` / `gate_close` | 입구 게이트 제어/상태 |
| `parking/exit/licensePlate` | Cam → 서버 | `{번호판}` | 출구 번호판 전송 |
| `parking/exit/gate` | 서버 ↔ 장치 | `gate_open` / `gate_close` | 출구 게이트 제어/상태 |
| `parking/slot/{슬롯}/status` | 센서 → 서버 | `in` / `out` | 주차 슬롯 점유 상태 |
| `parking/wash/status` | 센서 → 서버 | `in` / `out` | 세차장 점유, 펌프 트리거 |
| `parking/maintenance/status` | 센서 → 서버 | `in` / `out` | 정비존 점유 |
| `parking/entrance/waterLevelControl` | 서버 → 센서 | `control_on` / `control_off` | 날씨 기반 수위 제어 |
| `parking/waterLevel` | 센서 → 서버 | `warning` | 침수 위험 경고 |
| `parking/entrance/led` | 서버 → LED | `warning` | 입구 경고등 제어 |
| `parking/entrance/lcd` | 서버 → LCD | `warning` | 경고 메시지 출력 |
| `parking/entrance/gate/control` | 관리자 → 게이트 | `open` / `close` | 원격 게이트 제어 |
| `parking/wash/control` | 관리자 → 세차 | `start` / `stop` | 세차 작업 제어 |
| `parking/maintenance/control` | 관리자 → 정비 | `start` / `stop` | 정비 작업 제어 |
| `server/command` | 서버 → 디바이스 | 커맨드 문자열 | 기본 발행 토픽 (Spring Integration 게이트웨이) |
| `mobility/hub/car/status` | RC카 → 서버 | `{carNumber,status,battery,lat,lng,timestamp}` | RC카 상태 리포트 |

### 9. 경로·토픽 확정안 (data.sql 맵 기준)
- **경로 노드**: 입구(1), 세차(10), 정비(13), 주차1/2/3(5/7/9), 합류(18), 출구(20), 기점 노드(2~23)로 연결.
- **경로 시퀀스**
	- 입구→세차: 1→2→10
	- 입구→정비: 1→2→12→13
	- 입구→주차1: 1→2→3→4→5
	- 입구→주차2: 1→2→3→4→6→7
	- 입구→주차3: 1→2→3→4→6→8→9
	- 세차→합류→출구: 10→15→17→18→19→20
	- 정비→합류→출구: 13→14→17→18→19→20
	- 주차→합류→출구: (5→23→18→19→20) / (7→22→18→19→20) / (9→21→18→19→20)
- **서비스별 추천 경로**
	1) 주차만: 입구→주차X→합류→출구
	2) 세차만: 입구→세차→합류→출구
	3) 정비만: 입구→정비→합류→출구
	4) 주차+세차: 입구→세차→합류→주차X→합류→출구
	5) 주차+정비: 입구→정비→합류→주차X→합류→출구
- **MQTT 토픽 고정 제안**
	- RC카 위치 이벤트: `rccar/{carId}/position` `{nodeId,nodeName,timestamp}` (입구 포함 모든 노드 도착마다)
	- 카메라 트리거: `parking/entrance/camera` (`capture`) - 서버가 RC카 입구 도착 시 발행
	- OCR 결과: `parking/entrance/licensePlate` - 카메라→서버
	- 게이트 제어: `parking/entrance/gate` (`gate_open`/`gate_close`)
	- RC카 명령: `rccar/{carId}/command` `{route:[nodeIds],workType}` (다대차 확장 고려)
	- 서비스 완료 이벤트: `rccar/{carId}/service` `{stage,status}` (`stage`: carwash|repair|park)
	- 기타 센서/제어 토픽은 8절 표 재사용

### 10. 데이터베이스 개요 (주요 테이블)
- `user`, `admin`: 계정/권한.
- `car`, `user_car`: 차량 및 사용자-차량 매핑.
- `parking`: 주차/세차/정비 섹터 상태.
- `work`, `work_info`: 서비스 요청, 진행/이력 관리.
- `repair_report`: 정비 리포트.
- `parking_map_node`, `edge`: 주행 경로 그래프.
- `stock_status`: 자재 재고.
- 초기 스키마/데이터: `backend/src/main/resources/schema.sql`, `data.sql`.

### 11. 기술 스택 및 경로
- **Backend**: Spring Boot 3.x, Spring Security + JWT, Spring Data JPA, Spring Integration MQTT, ModelMapper. 설정: `backend/src/main/resources/application.yaml` (포트 9000, MySQL, MQTT 브로커 `tcp://192.168.35.183:1883`, JWT). 빌드: Gradle.
- **Frontend**: React + Vite 두 앱
	- 관리자: `frontend/admin` (대시보드, 알림, 페이지별 관리)
	- 사용자: `frontend/user` (회원가입/로그인/서비스 요청/이력)
- **DB**: MySQL.
- **MQTT**: Mosquitto 등 브로커, 토픽은 8절 참조.
- **Edge/IoT**: Raspberry Pi GPIO/카메라/서보/초음파/모터 스크립트 (`raspi/gate/*`, `raspi/rc_car/*`, `raspi/webpage/*`).

### 12. 리스크 및 향후 과제
- 라인트레이싱 불안정 시 수동 운용 플랜 필요(이미 SSH 원격 조작 대안 확보).
- 대기열 전략 선택 및 UI/로직 반영 필요(A안 단순 제약 vs B안 대기 상태 지원).
- OCR 정확도 향상 및 관리자 보정 UX 개선.
- 서비스 완료 신호 정의/표준화(세차/정비 완료 이벤트, RC카 도착 이벤트)와 상태 일관성.
- 실시간 모니터링/알림 지연 시 재시도·보강 로직 검토.

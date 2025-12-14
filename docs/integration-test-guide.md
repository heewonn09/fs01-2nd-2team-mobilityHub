# 유저 프론트 → 백엔드 → RC카 통합 테스트 가이드

## 1. 사전 준비

### Backend (Spring Boot)
```bash
cd backend
./gradlew bootRun
```
- 포트: 9000
- MQTT 브로커: `tcp://192.168.35.183:1883`
- 자동으로 `rccar/{carId}/command` 토픽에 publish

### User Frontend
```bash
cd frontend/user
npm install
npm run dev
```
- 포트: 5173 (기본)
- 로그인 → 차량 선택 → 서비스 요청

### RC Car (Raspberry Pi)
```bash
cd raspi/rc_car
python3 service_handler.py
```
- `rccar/+/command` 구독 시작
- 메시지 수신 시 route/workType 출력

## 2. 테스트 흐름

### Step 1: 사용자 로그인 & 차량 선택
1. User 앱 접속 → 로그인 (예: `user1` / `1234`)
2. 메인 메뉴 → "서비스 선택" 클릭
3. 등록 차량 선택 또는 신규 차량 번호 입력

### Step 2: 서비스 선택 & 요청
1. 서비스 선택 (주차/세차/정비 조합)
2. 정비 선택 시 추가 요청 입력 가능
3. "전송" 버튼 → 확인 다이얼로그 → "확인"

### Step 3: Backend 처리
**ServiceRequestController.createServiceRequest()**
1. `ServiceRequestDTO` 저장 (`work_info` 테이블)
2. `RouteService.calculateRoute(workType)` 호출 → nodeIds 배열 반환
3. MQTT Publish:
   - Topic: `rccar/{carNumber}/command`
   - Payload: `{"route":[1,2,10,15,17,18,19,20],"workType":"carwash"}`
4. 콘솔 로그 확인:
   ```
   >>> MQTT Publish: rccar/12가1111/command | {"route":[1,2,10,15,17,18,19,20],"workType":"carwash"}
   ```

### Step 4: RC Car 수신 확인
**service_handler.py**
1. MQTT 메시지 수신 콜백 실행
2. 콘솔 출력:
   ```
   📥 [MQTT 수신] Topic: rccar/12가1111/command
      Payload: {"route":[1,2,10,15,17,18,19,20],"workType":"carwash"}
   🚗 Car ID: 12가1111
   🗺️  경로 (노드 ID): [1, 2, 10, 15, 17, 18, 19, 20]
   🛠️  작업 타입: carwash
   ```

## 3. 서비스별 경로 확인

### 주차만 (park)
```json
{"route":[1,2,3,4,5,23,18,19,20],"workType":"park"}
```
- 입구(1) → 기점1(2) → 주차1(5) → 합류(18) → 출구(20)

### 세차만 (carwash)
```json
{"route":[1,2,10,15,17,18,19,20],"workType":"carwash"}
```
- 입구(1) → 기점1(2) → 세차(10) → 합류(17) → 출구(20)

### 정비만 (repair)
```json
{"route":[1,2,12,13,14,17,18,19,20],"workType":"repair"}
```
- 입구(1) → 기점1(2) → 정비(13) → 합류(17) → 출구(20)

### 주차+세차 (park,carwash)
```json
{"route":[1,2,10,15,17,18,3,4,5,23,18,19,20],"workType":"park,carwash"}
```
- 입구(1) → 세차(10) → 합류 → 주차1(5) → 합류 → 출구(20)

### 주차+정비 (park,repair)
```json
{"route":[1,2,12,13,14,17,18,3,4,5,23,18,19,20],"workType":"park,repair"}
```
- 입구(1) → 정비(13) → 합류 → 주차1(5) → 합류 → 출구(20)

## 4. 트러블슈팅

### Backend에서 MQTT publish 실패
- `MyPublisher` bean 주입 확인
- `MqttPubConfig` 로딩 확인
- 브로커 주소/포트 확인: `application.yaml`

### RC Car에서 메시지 수신 안 됨
- 브로커 주소 일치 확인: `service_handler.py` vs `application.yaml`
- 구독 토픽 확인: `rccar/+/command`
- 방화벽/네트워크 확인

### 경로 계산 오류
- `RouteService.calculateRoute()` 로그 확인
- `work_type` 값이 정확한지 확인 (예: "park", "carwash", "park,carwash")

## 5. (TODO)

### RC Car 라인트레이싱 통합
1. `service_handler.py`의 `start_line_following()` 구현
2. `tracertest.py`의 `TEST_ROUTE`를 동적으로 받은 `route`로 대체
3. 노드 도착마다 `publish_position(client, car_id, node_id, node_name)` 호출
4. 서비스 완료 시 `publish_service_complete(client, car_id, stage)` 호출

### Backend 구독 추가
1. `MqttSubConfig`에 `rccar/+/position`, `rccar/+/service` 구독 추가
2. `MqttSubscriber`에서 수신 후 `work_info.car_state` 업데이트
3. 프론트엔드에 실시간 상태 반영 (WebSocket 또는 폴링)

### 관리자 대시보드 연동
- RC카 위치 이벤트 → 관리자 알림 생성
- 서비스 완료 이벤트 → `parking` 테이블 상태 업데이트

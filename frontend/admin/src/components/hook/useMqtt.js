const TOPIC_NAME = "parking/web/#"; // 토픽명

import { useCallback, useEffect, useState } from "react";
import mqtt from "mqtt";

// MQTT 브로커 주소 : 모든 페이지에서 동일하게 사용
const BROKER_URL = "ws://192.168.14.69:9001";

const useMqtt = () => {
  const [connectStatus, setConnectStatus] = useState("connecting");
  const [client, setClient] = useState(null);

  // 실시간 CCTV 스트리밍 이미지
  const [imageSrc, setImageState] = useState("");

  // 캡처된 정지 이미지
  const [capturedImage, setCapturedImage] = useState("");

  // YOLO 번호판 박스 좌표
  const [yoloBox, setYoloBox] = useState(null);

  // 리프트 각도
  const [angleValue, setAngleValue] = useState(null);

  useEffect(() => {
    // 브로커 연결
    const mqttClient = mqtt.connect(BROKER_URL, {
      clientId: `react_client_${Math.random().toString(16).substring(2, 8)}`,
      keepalive: 60,
      protocolId: "MQTT",
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    });

    // 연결 성공
    mqttClient.on("connect", () => {
      console.log("연결성공............");
      setConnectStatus("connected");

      mqttClient.subscribe(TOPIC_NAME, (err) => {
        if (!err) {
          console.log(`구독신청 ${TOPIC_NAME}`);
        } else {
          console.error("구독신청오류", err);
        }
      });
    });

    // 메시지 수신
    mqttClient.on("message", (topic, message) => {
      const payload = message.toString();

      // 실시간 CCTV
      if (
        topic === "parking/web/carwash/cam/frame" ||
        topic === "parking/web/repair/cam/frame" ||
        topic === "parking/web/entrance/cam/frame" ||
        topic === "parking/web/parking/cam/frame"
      ) {
        setImageState(`data:image/jpeg;base64,${payload}`);
        return;
      }

      // 캡처 이미지
      if (topic === "parking/web/entrance/capture") {
        console.log("캡처 이미지 수신");
        setCapturedImage(`data:image/jpeg;base64,${payload}`);
        return;
      }

      // 센서 데이터
      if (topic === "parking/web/repair/lift/angle") {
        try {
          const data = JSON.parse(payload);
          setAngleValue(data.angle);

          console.log("각도 데이터:", data);
        } catch (e) {
          console.error("센서 JSON 파싱 오류", e);
        }
      }
    });

    // 에러 처리
    mqttClient.on("error", (err) => {
      console.log("Connection오류: ", err);
      mqttClient.end();
    });

    setClient(mqttClient);

    // cleanup
    return () => {
      if (mqttClient) {
        mqttClient.publish("parking/web/carwash/cam/control", "stop");
        mqttClient.publish("parking/web/repair/cam/control", "stop");
        mqttClient.publish("parking/web/entrance/cam/control", "stop");
        mqttClient.publish("parking/web/parking/cam/control", "stop");

        mqttClient.end();
        setConnectStatus("connecting");
        console.log("MQTT연결종료");
      }
    };
  }, []);

  // publish 함수
  const publish = useCallback(
    (topic, message) => {
      if (client) {
        client.publish(topic, message);
      } else {
        console.error("Mqtt전송실패");
      }
    },
    [client]
  );

  return {
    connectStatus,
    imageSrc, // 실시간 CCTV
    capturedImage, // 캡처 이미지
    yoloBox,
    angleValue,
    publish,
  };
};

export default useMqtt;

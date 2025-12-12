const TOPIC_NAME = "parking/web/#"; // 토픽명

import React, { useCallback, useEffect, useState } from "react";
import mqtt from "mqtt";

const useMqtt = (brokerUrl) => {
  const [connectStatus, setConnectStatus] = useState("connecting");
  const [client, setClient] = useState(null);
  const [imageSrc, setImageState] = useState("");

  useEffect(() => {
    // 2. 브로커와 연결생성
    const mqttClient = mqtt.connect(brokerUrl, {
      clientId: `react_client_${Math.random().toString(16).substring(2, 8)}`, // 고유아이디
      //clientId: "test",
      keepalive: 60,
      protocolId: "MQTT",
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    });

    // 1. 연결이 완료되면 실행할 콜백함수
    //    브로커에 구독신청
    mqttClient.on("connect", () => {
      console.log("연결성공............");
      setConnectStatus("connected");
      // 토픽의 구독신청
      // subscribe함수는 토픽과 구독신청 결과 확인하는 용도로 함수정의
      mqttClient.subscribe(TOPIC_NAME, (err) => {
        if (!err) {
          console.log(`구독신청 ${TOPIC_NAME}`);
        } else {
          console.error("구독신청오류", err);
        }
      });
    });

    // 메시지가 subscribe되면 실행될 콜백함수를 등록
    mqttClient.on("message", (topic, message) => {
      if (topic == "parking/web/carwash/cam") {
        const base64Image = message.toString();
        setImageState(`data:image/jpeg;base64,${base64Image}`);
        const payload = message.toString();
        console.log(payload);
      } else if (topic === "heaves/home/web/sensor/dht11") {
        const payload = message.toString();
        //console.log(payload);
        // 수신된 dht11의 온도와 습도를 파싱 - 추후에 subscribe하는 것이 많아지면 이 코드를 수정
        try {
          // JSON 문자열을 자바스크립트 객체로 변환
          const data = JSON.parse(payload);
          console.log("받은 온도습도 데이터: ", data);

          // 온도습도데이터로 구글 게이지 차트를 생성 - 온도습도데이터를 state로 만들어서
          // 온도습도를 subscribe할때마다 state가 변경되도록 작업
          // setSensorData({ temp: data.temp, humi: data.humi });
          //   setsensorValues({
          //     temp: Number(data.temp),
          //     humi: Number(data.humi),
          //   });
        } catch (e) {
          console.error("JSON파싱오류(데이터의 형식이 JSON이 아님:::::", e);
        }
      }
    });

    // 연결시 에러가 발생되면 처리
    mqttClient.on("error", (err) => {
      console.log("Connection오류: ", err);
      mqttClient.end();
    });
    setClient(mqttClient);
    // cleanup코드를 정의 - 컴포넌트가 사라질때 연결 끊기
    return () => {
      if (mqttClient) {
        mqttClient.publish("parking/web/carwash/cam", "stop");
        mqttClient.end();
        setConnectStatus("connecting");
        console.log("MQTT연결종료");
      }
    };
  }, [brokerUrl]);

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
  return { connectStatus, imageSrc, publish };
};

export default useMqtt;

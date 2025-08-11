import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const useWebSocket = (url) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {

        const client = new Client({
            brokerURL: "ws://localhost:8080/ws", // Không dùng SockJS
            reconnectDelay: 5000, // Reconnect nếu mất kết nối
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            setIsConnected(true);
            console.log("✅ WebSocket đã kết nối!");

            client.subscribe(`${url}`, (message) => {
                try {
                    // console.log(message);

                    const data = JSON.parse(message.body);

                    // console.log("📩 Tin nhắn mới:", data);
                    setMessages((prev) => [...prev, data]);
                } catch (error) {
                    console.error("❌ Lỗi parse JSON:", error);
                }
            });
        };

        client.onDisconnect = () => {
            setIsConnected(false);
            console.log("🔌 WebSocket bị ngắt!");
        };

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [url]);

    return { isConnected, messages };
};

export default useWebSocket;

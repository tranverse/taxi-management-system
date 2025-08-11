import DriverService from "@services/Driver.service";
import mapboxgl from "mapbox-gl";

export default function movingDriver(driverId, driverMarker, route, map) {
    // console.log("Route received:", route);

    return new Promise((resolve) => {
        let index = 0;

        function step() {
            if (index < route.length) {
                const [lng, lat] = route[index];

                // Cập nhật vị trí marker trên bản đồ
                driverMarker.setLngLat([lng, lat]);
                // Thêm dấu chấm vào các điểm đã đi qua
                new mapboxgl.Marker({ color: "#ff0000", scale: 0.5 }) // Dấu chấm đỏ nhỏ
                    .setLngLat([lng, lat])
                    .addTo(map);
                // Nếu marker đã đến điểm cuối cùng
                if (index === route.length - 1) {
                    console.log("🚗 Tài xế đã đến điểm đón!");
                    resolve(); // Trả về kết quả cho hàm `picking()`
                    return;
                }

                index++;
                setTimeout(step, 1000); // Chờ 1 giây rồi di chuyển tiếp
            }
        }

        step();
    });
}

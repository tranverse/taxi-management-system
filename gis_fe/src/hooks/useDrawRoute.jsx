import { useEffect } from "react";
//  Higher-Order Function (HOF), Closure trong JavaScript.
const useDrawRoute = (mapRef) => {
    return (route, color, routeId) => {
        if (!mapRef.current || !route) return;

        const map = mapRef.current;
        const sourceId = routeId;
        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: "geojson",
                data: {
                    type: "Feature",  // 🛠 Sửa lỗi chữ cái
                    properties: {},
                    geometry: route
                }
            });

            map.addLayer({
                id: sourceId,
                type: "line",
                source: sourceId,
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": color,
                    "line-width": 5,
                },

            });

        } else {
            map.getSource(sourceId).setData({
                type: "Feature",
                properties: {},
                geometry: route,
            });
        }
    };
};

export default useDrawRoute;

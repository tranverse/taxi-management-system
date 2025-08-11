// import React from "react";
// import mapboxgl from "mapbox-gl";
// import useDrawRoute from "@hooks/useDrawRoute";

// mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN; 
// const MapService = {
//     async getRoute (start, end, mapRef) {
//         if (!start || !end) return; 
//         // console.log(start, end)

//         const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
//         const res = await fetch(url);
//         const data = await res.json();
//         const route = data.routes[0];


//         // Lấy điểm giữa của tuyến đường
//         const midPointIndex = Math.floor(route.geometry.coordinates.length / 2);
//         const midPoint = route.geometry.coordinates[midPointIndex];

//         // Hiển thị popup trên bản đồ
//         new mapboxgl.Popup({ closeOnClick: false, closeButton: false })
//             .setLngLat(midPoint)
//             .setHTML(`
//                 <p>
//                     <i class="fa-solid fa-car"></i>
//                    ${(route.distance / 1000).toFixed(2)} km<br>
//                     <i class="fa-regular fa-clock"></i>
//                    ${(route.duration / 60).toFixed(0)} phút
//                 </p>
//             `)
//             .addTo(mapRef.current);

//         return {route, kilometer: (route.distance / 1000).toFixed(2)};

//     },
//     async fetchNameLocation(longitude, latitude, type) {
//         const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
//         const response = await fetch(url)
//         const data = await response.json()
//         return data.features[0].place_name

//     }
// }

// export default MapService

import React from "react";
import mapboxgl from "mapbox-gl";
import useDrawRoute from "@hooks/useDrawRoute";

mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN; 

const popupRef = { current: null }; // Lưu popup

const MapService = {
    async getRoute(start, end, mapRef) {
        if (!start || !end) return;

        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
        const res = await fetch(url);
        const data = await res.json();
        const route = data.routes[0];

        // Lấy điểm giữa của tuyến đường
        const midPointIndex = Math.floor(route.geometry.coordinates.length / 2);
        const midPoint = route.geometry.coordinates[midPointIndex];

        // Xóa popup cũ nếu có
        if (popupRef.current) {
            popupRef.current.remove();
        }

        // Tạo popup mới
        popupRef.current = new mapboxgl.Popup({ closeOnClick: false, closeButton: false })
            .setLngLat(midPoint)
            .setHTML(`
                <p>
                    <i class="fa-solid fa-car"></i> ${(route.distance / 1000).toFixed(2)} km<br>
                    <i class="fa-regular fa-clock"></i> ${(route.duration / 60).toFixed(0)} phút
                </p>
            `)
            .addTo(mapRef.current);

        return { route, kilometer: (route.distance / 1000).toFixed(2) };
    },

    async fetchNameLocation(longitude, latitude) {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.features[0].place_name;
    }
};

export default MapService;

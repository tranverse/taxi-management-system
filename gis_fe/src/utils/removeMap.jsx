export const removeAllMarkers = (markerRef) => {
    if (!markerRef?.current || !Array.isArray(markerRef.current)) {
        console.warn("Marker reference is not valid:", markerRef);
        return;
    }

    markerRef.current.forEach(marker => {
        if (marker && typeof marker.remove === "function") {
            marker.remove(); // Xóa marker khỏi bản đồ
        }
    });

    markerRef.current = []; // Đặt lại danh sách marker

    console.log("All markers removed");
};


export const removeRoute = (map, routeIds = []) => {
    if (!map?.current || typeof map.current.getLayer !== "function") {
        console.warn("Map instance is not valid:", map);
        return;
    }

    const mapInstance = map.current;

    routeIds.forEach(routeId => {
        if (mapInstance.getLayer(routeId)) {
            mapInstance.removeLayer(routeId);
            console.log(`Removed layer: ${routeId}`);
        }
        if (mapInstance.getSource(routeId)) {
            mapInstance.removeSource(routeId);
            console.log(`Removed source: ${routeId}`);
        }
    });
};

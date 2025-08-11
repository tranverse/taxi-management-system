const drawDotsOnRoute = (geometry, color, dotId, map) => {
    if (!map) return;

    // Xóa layer cũ nếu tồn tại
    if (map.getSource(dotId)) {
        map.removeLayer(dotId);
        map.removeSource(dotId);
    }

    // Lấy các điểm từ tuyến đường
    const coordinates = geometry.coordinates;
    const dotFeatures = coordinates.map(coord => ({
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: coord
        }
    }));

    // Thêm source cho các chấm
    map.addSource(dotId, {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: dotFeatures
        }
    });

    // Vẽ các chấm trên đường
    map.addLayer({
        id: dotId,
        type: "circle",
        source: dotId,
        paint: {
            "circle-radius": 6, // Kích thước chấm
            "circle-color": color, // Màu chấm
            "circle-opacity": 1
        }
    });
};

export default drawDotsOnRoute
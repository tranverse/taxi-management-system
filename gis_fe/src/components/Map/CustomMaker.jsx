import mapboxgl from 'mapbox-gl';

const CustomMaker = ({ map, coordinates, imageUrl, name, description, link, car, driverImage, isBusy = "FREE", driverId = '', role = '' }) => {
    // Tạo phần tử HTML cho marker
    const markerEl = document.createElement('div');
    Object.assign(markerEl.style, {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid white',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: 'pointer'
    });

    // Nội dung popup (dùng chung)
    let popupContent = `
        <div style="display: grid; grid-template-columns: 70px 1fr; align-items: center; gap: 12px;">
            <div style="text-align: center;">
                <img src="${driverImage}" alt="Driver" style="width: 70px; height: 70px; border-radius: 50%;
                 border: 2px solid #007bff;">
            </div>
            <div style="text-align: left;">
                <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #333;">${name}</h3>
                <p style="margin: 4px 0; font-size: 12px; color: #555;">${description}</p>
                <p style="margin: 4px 0; font-size: 12px; color: #666;"><b>Biển số:</b> ${car.licensePlate}</p>
    `;

    // Nếu role không phải là "customer", thêm nút
    if (role !== "CUSTOMER") {
        popupContent += `
            <a href="/user/driver-detail/${driverId}" target="_blank" style="display: inline-block; margin-top: 6px; padding: 6px 12px; 
            font-size: 12px; font-weight: 500; color: white; background: #007bff; text-decoration: none; 
            border-radius: 6px; transition: 0.3s; width: 110px">
                Xem chi tiết
            </a>
        `;

        if (isBusy === "BUSY") {
            popupContent += `
            <a href="/user/driver-trip/${driverId}" target="_blank" style="display: inline-block; margin-top: 6px; padding: 6px 12px; 
            font-size: 12px; font-weight: 500; color: white; background: orange; text-decoration: none; 
            border-radius: 6px; transition: 0.3s; width: 110px">
                Xem chuyến xe
            </a>
            `;
        }
    }
    // Tạo popup
    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: true, offset: 25 })
        .setHTML(popupContent);

    // Tạo marker trên bản đồ
    return new mapboxgl.Marker(markerEl).setLngLat(coordinates).setPopup(popup).addTo(map);
};

export default CustomMaker;



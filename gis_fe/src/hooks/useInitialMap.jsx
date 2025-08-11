import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const useInitialMap = ({ mapRef, mapContainerRef}) => {
    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            zoom: 12,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [106.6297, 10.8231], 
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

        const geolocateControl = new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: false, 
            showUserHeading: true,    
        });

        mapRef.current.addControl(geolocateControl, "bottom-right");

        mapRef.current.on("load", () => {
            // geolocateControl.trigger();  
        });


       
        return () => mapRef.current?.remove();
    }, [mapContainerRef]);

    return null;
};

export default useInitialMap;

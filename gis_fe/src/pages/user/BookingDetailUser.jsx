import React, { useEffect, useRef, useState } from 'react'
import BookingDetailBox from '@components/BookingDetailBox'
import { useParams } from 'react-router-dom'
import BookingService from '@services/Booking.service'
import DriverService from '@services/Driver.service'
import mapboxgl from 'mapbox-gl'
import useInitialMap from '@hooks/useInitialMap'
import CustomMaker from '@components/Map/CustomMaker'
import MapService from '@services/Map.service'
import useDrawRoute from '@hooks/useDrawRoute'
import Breadcrumb from '@components/Breadcrumb'
import Heading from '@components/Heading'
import DriverRating from '@components/DriverRating'
import drawDotsOnRoute from '@utils/drawDotsOnRoute'
import ReviewService from '@services/Review.service'
mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN;
const BookingDetailUser = () => {
    const mapRef = useRef()
    const mapContainerRef = useRef()
    const markerRef = useRef([])
    const [booking, setBooking] = useState({})
    const { bookingId } = useParams()
    const [startLocationName, setStartLocationName] = useState('')
    const [endLocationName, setEndLocationName] = useState('')
    const [driver, setDriver] = useState({})
    const [startLocation, setStartLocation] = useState({})
    const [endLocation, setEndLocation] = useState({})
    const drawRoute = useDrawRoute(mapRef)
    const [driverMarker, setDriverMarker] = useState({})
    const [pointReview, setPointReview] = useState([])
    useInitialMap({ mapRef, mapContainerRef })

    const fecthBookingDetail = async () => {
        const [response, error] = await BookingService.getBooking(bookingId)
        if (error) {
            console.log("Lỗi không thể lấy thông tin chuyến xe: ", error)
            return
        }
        setBooking(response.data)
    }
    const fetchNameLocation = async (longitude, latitude, type) => {
        const response = await MapService.fetchNameLocation(longitude, latitude)
        if (type == 'start') {
            setStartLocationName(response)
        } else {
            setEndLocationName(response)
        }
    }
    const fetchDriverInfo = async () => {
        const [response, error] = await DriverService.getDriverDetail(booking?.user?.id)
        if (error) {
            console.log("Lỗi khi lấy thông tin tài xế: ", error)
        }
        setDriver(response.data)
    }

    const fetchPointReview = async () => {
        const [response, error] = await ReviewService.getReviewByBookingId(booking?.id);
        if (error) {
            console.log("Lỗi không thể lấy điểm đánh giá của chuyến xe: ", error)
            return
        }
        setPointReview(response.data)
    }
    useEffect(() => {
        const fetchDriverRoute = async () => {
            if (startLocation.lng && startLocation.lat) {
                const { route } = await MapService.getRoute(
                    { lat: booking.driverY, lng: booking.driverX },
                    startLocation,
                    mapRef
                );
                drawRoute(route.geometry, "green", "driverRoute")
                drawDotsOnRoute(route.geometry, "yellow", "driverRouteDots", mapRef.current); // Vẽ các chấm trên đường

            }
        };

        fetchDriverRoute();
    }, [driver, startLocation]);

    useEffect(() => {
        if (booking) {
            setStartLocation({ lng: booking.startingX, lat: booking.startingY })
            setEndLocation({ lng: booking.destinationX, lat: booking.destinationY })
            fetchPointReview()
        }
    }, [booking])
    useEffect(() => {
        const fetchRoute = async () => {
            if (mapRef.current && startLocation.lng && endLocation.lng) {
                mapRef.current.fitBounds(
                    [
                        [startLocation.lng, startLocation.lat],
                        [endLocation.lng, endLocation.lat]
                    ],
                    {
                        padding: 50,
                        duration: 1000
                    }
                );

                if (startLocation && endLocation) {
                    const { route } = await MapService.getRoute(startLocation, endLocation, mapRef);
                    drawRoute(route.geometry, "blue", "mainRoute")
                    drawDotsOnRoute(route.geometry, "red", "routeDots", mapRef.current); // Vẽ các chấm trên đường

                }
                new mapboxgl.Marker({ color: 'blue' })
                    .setLngLat(startLocation)
                    .setPopup(new mapboxgl.Popup({ closeButton: false, closeOnClick: false }).setHTML("<p>Điểm đón</p>"))
                    .addTo(mapRef.current)
                    .togglePopup()

                new mapboxgl.Marker({ color: 'red' })
                    .setLngLat(endLocation)
                    .setPopup(new mapboxgl.Popup({ closeButton: false, closeOnClick: false }).setHTML("<p>Điểm đến</p>"))
                    .addTo(mapRef.current)
                    .togglePopup()

            }

        }
        fetchRoute()
        if (driver.latitude && driver.longitude) {
            markerRef.current = []
            const driverMarker = CustomMaker({
                map: mapRef.current,
                coordinates: { lat: booking.driverY, lng: booking.driverX },
                car: driver.car,
                description: 'Vị trí hiện tại của bạn',
                imageUrl: driver.car?.image,
                link: '',
                name: driver.car.description
            })
            markerRef.current.push(driverMarker)
            setDriverMarker(driverMarker)
        }
    }, [startLocation, endLocation, driver])
    useEffect(() => {
        fecthBookingDetail()

    }, [])
    useEffect(() => {
        if (booking?.startingX && booking?.startingY) {
            fetchNameLocation(booking.startingX, booking.startingY, "start");
        }
        if (booking?.destinationX && booking?.destinationY) {
            fetchNameLocation(booking.destinationX, booking.destinationY, "end");
        }
        if (booking?.user?.id) {
            fetchDriverInfo();
        }
    }, [booking]);

    return (
        <>
            <div className='px-4 container'>
                <div className={`grid grid-cols-1 lg:grid-cols-[1.8fr_2fr]`}>

                    <BookingDetailBox customer={booking?.customer} driver={driver} startLocationName={startLocationName}
                        endLocationName={endLocationName} booking={booking}></BookingDetailBox>
                    <div className="border border-blue-400 rounded">
                        <div id='map-container' style={{ height: '650px' }} ref={mapContainerRef} />
                    </div>
                </div>

                <div className='mb-10'>
                    <Heading message="Đánh giá của khách hàng" className="mt-5 mb-5"></Heading>
                    <div className='border border-blue-400 rounded-lg p-3'>
                        <DriverRating
                            criteria={pointReview?.criteriaList ?? []}
                            text={pointReview?.text ?? ""}
                            rating={null} isAverage="false"
                        />
                    </div>
                </div>

            </div>
        </>
    )
}

export default BookingDetailUser
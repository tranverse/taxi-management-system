import BookingService from '@services/Booking.service'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BsCoin } from "react-icons/bs";
import { CiStar } from 'react-icons/ci'
import { formatNumber } from '@utils/formatNumber'
import useDrawRoute from '@hooks/useDrawRoute';
import useInitialMap from '@hooks/useInitialMap';
import SubmitButton from '@components/Form/SubmitButton';
import DriverService from '@services/Driver.service';
import ReadOnlyInput from '@components/ReadOnlyInput';
import MapService from '@services/Map.service';
import useWebSocket from '@hooks/useWebsocket';
import CustomMaker from '@components/Map/CustomMaker';
import mapboxgl from 'mapbox-gl';
import movingDriver from '@utils/movingDriver';
import { toast } from 'react-toastify';

const TrackingTrip = () => {
  const mapRef = useRef()
  const mapContainerRef = useRef()
  const markerRef = useRef([])
  const drawRoute = useDrawRoute(mapRef)
  const [booking, setBooking] = useState({})
  const [driver, setDriver] = useState({})
  const [startLocationName, setStartLocationName] = useState('')
  const [endLocationName, setEndLocationName] = useState('')
  const [startLocation, setStartLocation] = useState({})
  const [endLocation, setEndLocation] = useState({})
  const { driverId } = useParams()
  const [isArrived, setIsArrived] = useState(false)
  const [isFinshed, setIsFinished] = useState(false)
  const [driverMarker, setDriverMarker] = useState({})
  const [isTransporting, setIsTransporting] = useState(false)

  useInitialMap({ mapRef, mapContainerRef })

  const fetchBookingByDriverId = async () => {
    const [response, error] = await BookingService.getBookingByDriverId(driverId)
    if (error) {
      console.log("Lỗi khi lấy thông tin chuyến xe: ", error)
      return
    }
    setBooking(response.data)
  }
  console.log(booking)
  const fetchDriverInfo = async () => {
    const [response, error] = await DriverService.getDriverDetail(driverId)
    if (error) {
      console.log("Lỗi khi lấy thông tin tài xế: ", error)
    }
    console.log(response)
    setDriver(response.data)
  }
  const fetchNameLocation = async (longitude, latitude, type) => {
    const response = await MapService.fetchNameLocation(longitude, latitude)
    if (type == 'start') {
      setStartLocationName(response)
    } else {
      setEndLocationName(response)
    }
  }
  useEffect(() => {
    if (driverId) {
      fetchBookingByDriverId()
      fetchDriverInfo()
    }
  }, [])
  const { isConnected: pickingIsConnected, messages: pickingMessages } = useWebSocket(`/user/${driver?.id}/confirm-picking`)
  const { isConnected: transportingConnected, messages: transportingMessages } = useWebSocket(`/user/${driver?.id}/confirm-transporting`)
  const { isConnected: reviewConnected, messages: reviewMessage } = useWebSocket(`/user/${driver?.id}/review-status`)

  useEffect(() => {
    if (booking) {
      setStartLocation({ lng: booking.startingX, lat: booking.startingY })
      setEndLocation({ lng: booking.destinationX, lat: booking.destinationY })
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
        coordinates: { lat: driver.latitude, lng: driver.longitude },
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
    console.log(pickingMessages, transportingMessages, driverMarker, driver)
    const driverPicking = async () => {
      if (!isArrived && driverMarker && driverMarker.setLngLat && driver.latitude && driver.longitude) {
        console.log("Tài xế đang đến đón bạn")
        const { route } = await MapService.getRoute(
          { lng: driver.longitude, lat: driver.latitude },
          startLocation, mapRef
        );
        await movingDriver(driver.id, driverMarker, route.geometry.coordinates, mapRef.current)
      }
    }


    driverPicking()


  }, [pickingMessages, driverMarker, driver])

  useEffect(() => {
    const driverTransporting = async () => {

      if (transportingMessages.length > 0) {
        console.log("Đang thực hiện chuyến xe")
        setIsArrived(true)
        setIsTransporting(true)
        const { route } = await MapService.getRoute(startLocation, endLocation, mapRef);
        await movingDriver(driver.id, driverMarker, route.geometry.coordinates, mapRef.current);

      }
    }
    driverTransporting()

  }, [transportingMessages, driverMarker, driver])

  useEffect(() => {
    if (reviewMessage.length > 0) {
      setIsFinished(true);
      setIsTransporting(false)
      setIsArrived(true)

      toast.success("Hoàn thành chuyến xe");
    }

  }, [reviewMessage])

  useEffect(() => {
    const fetchDriverRoute = async () => {
      if (driver && driver.longitude && driver.latitude && startLocation.lng && startLocation.lat) {
        const { route } = await MapService.getRoute(
          { lat: driver.latitude, lng: driver.longitude },
          startLocation,
          mapRef
        );
        drawRoute(route.geometry, "green", "driverRoute")
      }
    };

    fetchDriverRoute();
  }, [driver, startLocation]);
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
      <div className="mx-10">
        <div className="grid grid-rows-2 gap-4">
          {/* Thông tin đặt xe */}
          <div className="p-3 border rounded-lg border-blue-400">

            <p className="uppercase text-center font-semibold text-lg text-blue-600">Thông tin đặt xe</p>
            <p className="my-2 text-base font-semibold">Thông tin khách hàng</p>

            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 mb-2">
              <ReadOnlyInput value={booking?.customer?.name} label="Họ tên"></ReadOnlyInput>
              <ReadOnlyInput value={booking?.customer?.phone} label="Số điện thoại"></ReadOnlyInput>
            </div>
            <p className="my-2 text-base font-semibold">Thông tin tài xế</p>
            <div className="grid grid-cols-1 lg:grid-cols-[3.5fr_1.5fr_1fr] gap-4">
              <ReadOnlyInput value={driver?.name} label="Họ tên"></ReadOnlyInput>

              <ReadOnlyInput value={driver?.phone} label="Số điện thoại"></ReadOnlyInput>

              <div className="w-full flex flex-col">
                <label htmlFor="" className="text-[12px] text-gray-600">Đánh giá</label>
                <div className="flex items-center ">
                  <p className="m-0">{(driver?.star)?.toFixed(1)}/5</p>
                  <CiStar className=""></CiStar>
                </div>
                <hr className="border-t border-black mt-1" />

              </div>
            </div>

            {/* Thông tin chuyến xe */}
            <p className="my-2 text-base font-semibold">Thông tin chuyến xe</p>
            <div>
              <ReadOnlyInput value={new Date(booking.bookingTime).toLocaleString("vi-VN")} label="Thời gian bắt đầu"></ReadOnlyInput>
              {booking.finishTime && (
                <ReadOnlyInput value={new Date(booking.finishTime).toLocaleString("vi-VN")} label="Thời gian kết thúc"></ReadOnlyInput>

              )}
              <ReadOnlyInput value={startLocationName} label="Điểm đón"></ReadOnlyInput>
              <ReadOnlyInput value={endLocationName} label="Điểm đến"></ReadOnlyInput>
              <div className="leading-7 mt-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold">Khoảng cách: {booking?.kilometer} km</p>
                  <p className="font-bold">Giá tiền: {formatNumber(booking?.price + booking?.memberDiscount + booking?.accumulatedDiscount)} đ</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold">Giảm thành viên:</p>
                  <p className="font-bold">- {formatNumber(booking?.memberDiscount)} đ</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BsCoin className="text-yellow-500 mr-2" />
                    <p className="font-bold">Điểm tích lũy:</p>
                  </div>
                  <p className="font-bold">-{formatNumber(booking?.accumulatedDiscount)} đ</p>
                </div>
                <hr />
                <div className="flex items-center justify-between">
                  <p className="font-bold">Tổng tiền:</p>
                  <p className="font-bold">{formatNumber(booking?.price)} đ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bản đồ */}
          <div className="border border-blue-400 rounded h-[400px]">
            <div id="map-container" className="w-full h-full" ref={mapContainerRef} />
          </div>
        </div>

        {/* Nút trạng thái */}
        <div className="mt-3 flex justify-center">
          {!isArrived ? (
            <SubmitButton disabled className="flex justify-center bg-white text-orange-400 border border-orange-400">
              Đang trên đường đón khách
              <div className="ml-3 flex space-x-2">
                <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce"></div>
              </div>
            </SubmitButton>
          ) : isTransporting ? (
            <SubmitButton disabled className="flex justify-center bg-blue-400 text-white">
              Đang thực hiện chuyến xe
              <div className="ml-3 flex space-x-2">
                <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
              </div>
            </SubmitButton>
          ) : (
            <SubmitButton disabled className="flex justify-center bg-blue-400 text-white">
              Hoàn thành chuyến xe
            </SubmitButton>
          )}

        </div>


      </div>


    </>
  )
}

export default TrackingTrip
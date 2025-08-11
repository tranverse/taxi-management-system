import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Breadcrumb from "@components/Breadcrumb";
import { Link } from "react-router-dom";
const ServiceCard = ({ imgSrc, title, description }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition duration-300">
        <img src={imgSrc} alt={title} className="h-16 w-16 rounded-lg object-cover" />
        <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-gray-600 text-sm mb-2">{description}</p>
            <Link to="#" className="text-teal-500 text-sm font-medium flex items-center">
                {/* Xem chi tiết <i className="fas fa-arrow-right ml-1"></i> */}
            </Link>
        </div>
    </div>
);

const Home = () => {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false
    };

    const sliderImages = [
        "https://cdn.xanhsm.com/2023/06/053b63ee-gia-taxi-vinfast-vf-8-luxurycar.jpg",
        "https://www.xanhsm.com/_next/image?url=https%3A%2F%2Fcdn.xanhsm.com%2F2024%2F10%2F16063dad-home-slider-6.webp&w=3840&q=75",
        "https://www.xanhsm.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fachievement-6.8dc5cc34.webp&w=1080&q=75"
    ];

    return (
        <>
            <Breadcrumb routes="" />
            <div className="max-w-7xl mx-auto  py-8">
                <main className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    {/* Text Section */}
                    <section>
                        {/* <h1 className="text-4xl font-bold mb-4 leading-tight">Hệ sinh thái dịch vụ 5 sao</h1> */}
                        <p className="text-lg text-gray-600 mb-6">
                            Trải nghiệm ngay những chuyến xe Xanh không khói bụi, không tiếng ồn cùng nhiều ưu đãi hấp dẫn.
                        </p>
                        <div className="flex space-x-4 mb-8">
                            <Link to="/booking">

                                <button className="bg-teal-500 cursor-pointer text-white px-6 py-3 rounded-lg font-medium transition hover:bg-teal-600">
                                    Đặt xe
                                </button>
                            </Link>

                        </div>
                        {/* Dịch vụ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ServiceCard
                                imgSrc="https://storage.googleapis.com/a1aa/image/iHYMWzmWnC_d9mcaHVGaATxb6ncso89OyQU6DmcQVSU.jpg"
                                title="Xanh SM Car"
                                description="Nổi bật với màu xanh cyan thương hiệu"
                            />
                            <ServiceCard
                                imgSrc="https://cdn.xanhsm.com/2023/06/053b63ee-gia-taxi-vinfast-vf-8-luxurycar.jpg"
                                title="Xanh SM Premium"
                                description="Dịch vụ di chuyển cao cấp với nhiều tiện ích đi kèm"
                            />
                            <ServiceCard
                                imgSrc="https://taxixanh.org/wp-content/uploads/2024/11/taxi-xanh-7-cho-binh-dinh-co-khong-tel-0909-39-38-39.jpg"
                                title="Xanh SM Bike"
                                description="Tiên phong di chuyển phong cách"
                            />
                            <ServiceCard
                                imgSrc="https://taxixanh.org/wp-content/uploads/2024/11/taxi-xanh-7-cho-bac-giang-co-khong-2.jpg"
                                title="Xanh SM Express"
                                description="Giao hàng siêu tốc với chi phí tối ưu"
                            />
                        </div>
                    </section>

                    {/* Slider Hình Ảnh */}
                    <section>
                        <Slider {...sliderSettings}>
                            {sliderImages.map((imgSrc, index) => (
                                <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                                    <img src={imgSrc} alt={`Slide ${index + 1}`} className="w-full h-[500px] object-cover" />
                                </div>
                            ))}
                        </Slider>
                    </section>



                </main>
                <div class="bg-white font-roboto">
                    <div class="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
                        <div class="md:w-1/2 text-center md:text-left">
                            <h2 class="text-yellow-500 font-bold text-lg mb-2">
                                ĐĂNG KÝ GIA NHẬP
                            </h2>
                            <h1 class="text-4xl font-bold text-gray-900 mb-4">
                                Cộng đồng tài xế VTaxi
                            </h1>
                            <p class="text-gray-700 mb-6">
                                Chúng tôi xin chào đón các tài xế gia nhập cộng đồng đối tác Tài xế VTaxi để trở thành những tài xế tiên phong mang sứ mệnh phổ cập trải nghiệm di chuyển điện hóa và lan tỏa lối sống xanh đến với cộng đồng.
                            </p>
                            <Link to="/diver-partner">
                            
                                <button class="bg-teal-500 text-white font-bold py-2 px-6 rounded-full hover:bg-teal-600 transition duration-300">
                                    ỨNG TUYỂN NGAY
                                    <i class="fas fa-arrow-right ml-2">
                                    </i>
                                </button>
                            </Link>
                        </div>
                        <div class="md:w-1/2 mt-8 md:mt-0 flex justify-center">
                            <img alt="Illustration of a driver standing next to a teal car with Xanh SM logo" class="w-full max-w-md" height="400" src="https://storage.googleapis.com/a1aa/image/ZgIg1Sgaa8SBfue9ihixP3A-mLsnturr7MslkjbXe2o.jpg" width="600" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;

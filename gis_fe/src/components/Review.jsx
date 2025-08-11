import ReviewService from '@services/Review.service';
import React, { useEffect, useState } from 'react';
import { Form } from './Form';
import SubmitButton from './Form/SubmitButton';
import { toast } from 'react-toastify';

const Review = ({ booking, onClose }) => {
  const [criteria, setCriteria] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [hoverRatings, setHoverRatings] = useState([]);
  const [reviewTitle, setReviewTitle] = useState(""); // ✅ Thêm state cho nội dung đánh giá
  const handleSkip = () => {
    onClose(); 
  };
  useEffect(() => {
    const fetchAllCriteria = async () => {
      const [response, error] = await ReviewService.getCriteria();
      if (error) {
        console.log("Lỗi không load được tiêu chí đánh giá: ", error);
        return;
      }
      setCriteria(response.data);
      setRatings(response.data.map(() => 0));
      setHoverRatings(response.data.map(() => 0));
    };
    fetchAllCriteria();
  }, []);

  const handleRating = (index, rating) => {
    const newRatings = [...ratings];
    newRatings[index] = rating;
    setRatings(newRatings);
  };

  const handleHover = (index, rating) => {
    const newHoverRatings = [...hoverRatings];
    newHoverRatings[index] = rating;
    setHoverRatings(newHoverRatings);
  };

  const handleSubmitReview = async () => {


    if (ratings.some(rating => rating === 0)) {
      toast.warning("Vui lòng đánh giá tất cả tiêu chí!");
      return;
    }

    const reviewData = {
      booking: booking,
      text: reviewTitle, // ✅ Sử dụng state `reviewTitle`
      criteriaList: criteria.map((item, index) => ({
        criteriaId: item.id, // ID tiêu chí
        star: ratings[index], // Điểm số
      })),
    };

    console.log("Dữ liệu gửi lên:", reviewData);

    const [response, error] = await ReviewService.createReview(reviewData);
    if (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      return;
    }

    toast.success("Gửi đánh giá thành công!");
    onClose()
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <Form className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmitReview}>
        <div className="">
          {/* Tiêu đề */}
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-800">Đánh giá chuyến xe</h2>
          </div>

          <div className="mt-4 space-y-4">
            {criteria.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-md border border-gray-200 bg-gray-50">
                <div className="flex items-center">
                  <p className="text-lg font-medium text-gray-700">{item.name}</p>
                  <span className="text-red-500 ml-1 text-lg font-bold">*</span>
                </div>

                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star text-lg cursor-pointer transition ${i < (hoverRatings[index] || ratings[index]) ? "text-yellow-400" : "text-gray-300"
                        }`}
                      onClick={() => handleRating(index, i + 1)}
                      onMouseEnter={() => handleHover(index, i + 1)}
                      onMouseLeave={() => handleHover(index, 0)}
                    />
                  ))}
                  <span className="text-gray-500 text-sm w-10 text-center">
                    {(hoverRatings[index] || ratings[index]) > 0 ? (hoverRatings[index] || ratings[index]) : "0"}/5
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Ô nhập bình luận */}
          <div className="mt-6">
            <label htmlFor="review-title" className="block text-gray-600 mb-2">Bình luận</label>
            <input
              name='text'
              type="text"
              id="review-title"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập bình luận"
              value={reviewTitle} // ✅ Gán giá trị từ state
              onChange={(e) => setReviewTitle(e.target.value)} // ✅ Cập nhật state khi nhập
            />
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end mt-6 space-x-3">
            <SubmitButton onClick={handleSkip} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition">
              Bỏ qua đánh giá
            </SubmitButton>
            <SubmitButton  
             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition">
              Gửi đánh giá
            </SubmitButton>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Review;

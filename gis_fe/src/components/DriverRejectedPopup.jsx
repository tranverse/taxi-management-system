import React from "react";
import Modal from "react-modal";
import { Loader2 } from "lucide-react";
import { Spin } from "antd";
import { Flex } from "antd";

Modal.setAppElement("#root"); // Đặt phần tử gốc của ứng dụng React

const DriverRejectedPopup = ({ isOpen, onClose, messages }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black/5 backdrop-blur-[2px] transition-opacity"
        >


            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full transform transition-all scale-100">
                {/* Tiêu đề */}
                <h2 className="text-xl font-semibold text-red-500 text-center">
                    Tài xế đã từ chối chuyến xe của bạn
                </h2>

                {/* Nội dung */}
                <div className="flex flex-col items-center space-y-4 mt-4">
                    {/* Icon loading */}
                    <Flex gap="middle" vertical>
                        <Spin tip="" size="large" style={{ fontSize: "3rem" }} />
                    </Flex>

                    <p className="text-gray-700 text-center text-base">
                        {messages}
                    </p>

                </div>
            </div>
        </Modal >
    );
};

export default DriverRejectedPopup;

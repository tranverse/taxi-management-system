import { useState } from 'react';
import Select from 'react-select';

const SelectOption = ({ options, placeholder, onInputChange, customStyle, onchange, type }) => {
    const defaultCustom = {
        dropdownIndicator: (provided) => ({
            ...provided,
            display: 'none'
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            display: 'none', // Ẩn đường phân cách giữa icon và input
        }),
        control: (provided, state) => ({
            ...provided,
            padding: '5px',
            borderRadius: '8px',
            borderColor: '#dde2e8', // Màu viền khi focus
            boxShadow: state.isFocused ? '0 0 8px 5px rgba(156, 188, 231, 0.5)' : 'none',
            textAlign: 'center'
        }),
    };

    // Loại bỏ vị trí hiện tại nếu type === "end"
    const filteredOptions = type === "end"
        ? options.filter(option => option.label !== "📍 Vị trí hiện tại")
        : options;

    return (
        <div className='m-2 w-full'>
            <Select
                options={filteredOptions} // Dùng danh sách đã lọc
                styles={defaultCustom || customStyle}
                onInputChange={onInputChange} // Xử lý khi nhập vào ô tìm kiếm
                onChange={onchange} // Xử lý khi chọn một địa điểm
                placeholder={placeholder}
                isClearable 
            />
        </div>
    );
};

export default SelectOption;

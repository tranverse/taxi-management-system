import React, { useState } from "react";
import { Form, Field, SelectOption } from "@components/Form";
import SubmitButton from "@components/Form/SubmitButton";
import MessageError from "@components/Form/ErrorMessage";
import { Link } from "react-router-dom";
import AuthService from "@services/auth.service";
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useMessageByApiCode from "@hooks/useMessageByApiCode";

const CustomerRegister = () => {
    const [errors, setErrors] = useState({});
    const getMessage = useMessageByApiCode()
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        detail: "",
        repassword: ""
    })
    const handleSubmit = async (data) => {
        if ((data.password != data.repassword)) {
            if (data.repassword == "" && data.password != "") {
                setErrors(prevErrors => ({ ...prevErrors, repassword: "Bạn cần nhập lại mật khẩu!" }));
                return
            }
            toast.warning("Mật khẩu và nhập lại mật khẩu không giống nhau");
            return;
        }
        
        const [response, error] = await AuthService.customerRegister(data);
        if (error) {
            setErrors(error.data)
            if(error.code) toast.error(getMessage(error.code))
            return
        }
        toast.success(getMessage(response.code))
        setData({
            name: "",
            email: "",
            password: "",
            phone: "",
            province: "",
            district: "",
            ward: "",
            detail: "",
            repassword: "",
        })
    }
    return (
        <>

            <section className="bg-white rounded-sm shadow-[0_0_20px_10px_rgba(156,188,231,0.5)] mt-0 ">
                <div className="container  px-6 py-10 w-[900px]">
                    <div className="mb-10">
                        <h1 className="text-center uppercase font-bold text-blue-500 text-2xl">Đăng ký</h1>
                    </div>

                    <div className="">
                        <Form onSubmit={handleSubmit} className="g-6 flex  flex-wrap justify-center lg:justify-between shawdow">

                            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
                                <div className="mb-6 relative">
                                    <Field name="name" type="text" label="Họ và tên" defaultValue={data.name} placeholder=" " className="" />
                                    <span className="text-red-500 text-xl absolute right-2  top-3 z-10">*</span>
                                    <MessageError message={errors.name}></MessageError>
                                </div>
                                <div className="mb-6 relative">
                                    <Field name="phone" type="text" label="Số điện thoại" defaultValue={data.phone} className="" />
                                    <span className="text-red-500 text-xl absolute right-2  top-3 z-10">*</span>
                                    <MessageError message={errors.phone}></MessageError>
                                </div>
                                <div className="mb-6 relative">
                                    <Field name="email" type="email" label="Email" defaultValue={data.email} className="" />
                                    <span className="text-red-500 text-xl absolute right-2  top-3 z-10">*</span>
                                    <MessageError message={errors.email}></MessageError>
                                </div>

                                <div className="mb-6 relative">
                                    <Field name="password" type="password" label="Mật khẩu" defaultValue={data.password} className="" />
                                    {/* <span className="text-red-500 text-xl absolute right-2  top-3 z-10">*</span> */}
                                    <MessageError message={errors.password}></MessageError>
                                </div>

                                <div className="mb-6 relative">
                                    <Field name="repassword" type="password" label="Nhập lại mật khẩu" defaultValue={data.repassword} className="" />
                                    {/* <span className="text-red-500 text-xl absolute right-2  top-3 z-10">*</span> */}
                                    <MessageError message={errors.repassword}></MessageError>
                                </div>

                            </div>

                            <div className="md:w-8/12 lg:ml-6 lg:w-5/12 ">
                                {/* <h1>Địa chỉ</h1> */}
                                <div className="mb-6">
                                    <Autocomplete
                                        disablePortal disableClearable
                                        options={[]}
                                        sx={{
                                            width: 359,
                                            '& .MuiAutocomplete-popupIndicator': { display: 'none' }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params} name="province" size="small" label="Chọn Tỉnh/Thành Phố"
                                                sx={{
                                                    '& .MuiInputBase-root': { padding: '' }, // Giảm chiều cao ô input
                                                }}

                                            />
                                        )}
                                    />

                                    {/* <MessageError message={errors.email}></MessageError> */}

                                </div>
                                <div className="mb-6">
                                    <Autocomplete
                                        disablePortal disableClearable
                                        options={[]}
                                        sx={{
                                            width: 359,
                                            '& .MuiAutocomplete-popupIndicator': { display: 'none' }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params} name="district" size="small" label="Chọn Quận/Huyện"
                                                sx={{
                                                    '& .MuiInputBase-root': { padding: '' }, // Giảm chiều cao ô input
                                                }}

                                            />
                                        )}
                                    />
                                    {/* <MessageError message={errors.email}></MessageError> */}

                                </div>
                                <div className="mb-6">
                                    <Autocomplete
                                        disablePortal disableClearable
                                        options={[]}
                                        sx={{
                                            width: 359,
                                            '& .MuiAutocomplete-popupIndicator': { display: 'none' }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params} name="ward" size="small" label="Chọn Phường/Xã"
                                                sx={{
                                                    '& .MuiInputBase-root': { padding: '' }, // Giảm chiều cao ô input
                                                }}

                                            />
                                        )}
                                    />
                                    {/* <MessageError message={errors.email}></MessageError> */}

                                </div>

                                <div className="mb-6">
                                    <Field label="Chi tiết" name="detail" />
                                    {/* <MessageError message={errors.detail}></MessageError> */}

                                </div>
                            </div>

                            <SubmitButton className="bg-[#f97d2a]" children="Đăng ký"></SubmitButton>
                        </Form>
                        <div className="flex justify-center mt-2">
                            <p className="text-sm   text-center">Đã có tài khoản
                                <Link to='/login' className="italic text-blue-400 font-bold"> Đăng nhập</Link> 
                            </p>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CustomerRegister
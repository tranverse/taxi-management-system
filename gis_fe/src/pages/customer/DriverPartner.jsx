import React from "react";
import { Form, Field } from "@components/Form";
import SubmitButton from "@components/Form/SubmitButton";

const DiverPartner = () => {
    return (
        <>
            <div className="mb-20">
                <div className="my-10 ">
                    <h1 className="font-bold text-2xl text-blue-500 text-center">Đăng ký đối tác với VTaxi</h1>
                </div>
                <div className="shadow-2xl mx-30 rounded border p-4">
                    <h1 className="font-bold text-lg mb-4">Thông tin cơ bản</h1>
                    <Form>
                        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 ">
                            <div className="">
                                <div className="mb-6">
                                    <Field name="name" label="Họ và tên" />
                                </div>
                                <div className="mb-6">
                                    <Field name="email" label="Email" />
                                </div>
                                <div className="mb-6">
                                    <Field name="phone" label="Số điện thoại" />

                                </div>
                                <div className="mb-6">
                                    <Field name="birth" label="Ngày sinh" />
                                </div>

                                <div className="mb-6">
                                    <Field name="birth" label="Ngày sinh" />
                                </div>
                                <div className="mb-6">
                                </div>
                            </div>
                            <div className="">
                                <div className="mb-6">
                                    <Field name="birth" label="Ngày sinh" />
                                </div>
                                <div className="mb-6">
                                    <Field name="username" label="Tên đăng nhập" />
                                </div>
                            </div>
                        </div>
                        <SubmitButton className="bg-blue-500">Tiếp</SubmitButton>
                    </Form>

                </div>
            </div>

        </>
    )
}

export default DiverPartner

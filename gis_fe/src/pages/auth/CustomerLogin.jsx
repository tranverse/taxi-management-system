import { Form } from "@components/Form";
import React, { useEffect, useState } from "react";
import { TEInput, TERipple } from "tw-elements-react";
import { Field } from "@components/Form";
import MessageError from "@components/Form/ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "@services/auth.service";
import { toast } from "react-toastify";
import useMessageByApiCode from "@hooks/useMessageByApiCode";
import { useNavigate } from "react-router-dom";
import SubmitButton from "@components/Form/SubmitButton";
import { setToken } from "@redux/slices/auth.slice";
import { SERVER_URL } from "@configs/const.config";
import Header from "@layouts/CustomerLayout/components/Header";
import { setLS } from "@tools/localStorage.tool";
const CustomerLogin = () => {
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const redirect = useSelector((state) => state.auth.redirect)
    const getMessage = useMessageByApiCode()
    const navigate = useNavigate()
    const isLoging = useSelector((state) => state.auth.isLoging)
    useEffect(() => {
 
        if (isLoging == false) {
            setLS("auth", {
                tokens: {
                    accessToken: "",
                    refreshToken: ""
                },
                role: "",
                redirect: "/",
                isLoging: false
            });
        }
    }, [])

    const handleSubmit = async ({ email, password }) => {
        const [response, error] = await AuthService.customerLogin({ email, password })
        if (error) {
            setErrors(error.data)
            console.log(errors)
            if (error.code) {
                toast.error(getMessage(error.code))
            }
            return
        }
        const token = response.data
        dispatch(setToken(token))
        toast.success(getMessage(response.code))
        navigate(redirect)
    }

    return (
        <>
            <section className="   bg-white rounded-sm shadow-[0_0_20px_10px_rgba(156,188,231,0.5)]">
                <div className="container  px-6 py-12 w-[1100px]">
                    <div className="mb-10">
                        <h1 className="text-center uppercase font-bold text-blue-500 text-2xl">Đăng nhập</h1>
                    </div>
                    <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between shawdow">
                        <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
                            <img
                                src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                                className="w-full"
                                alt="Phone image"
                            />
                        </div>

                        <div className="md:w-8/12 lg:ml-6 lg:w-5/12">
                            <Form onSubmit={handleSubmit} >
                                <div className="mb-6">
                                    <Field name="email" type="email" label="Email" placeholder=" " className="" />
                                    <MessageError message={errors.email}></MessageError>
                                </div>

                                <div className="mb-6">
                                    <Field name="password" type="password" label="Mật khẩu" placeholder=" " className="" />
                                    <MessageError message={errors.password}></MessageError>
                                </div>


                                {/* <!-- Remember me checkbox --> */}
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem] cursor-pointer">
                                        <input
                                            className="relative  float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            value=""
                                            id="exampleCheck3"
                                            defaultChecked
                                        />
                                        <label
                                            className="inline-block pl-[0.15rem] hover:cursor-pointer"
                                            htmlFor="exampleCheck3"
                                        >
                                            Ghi nhớ tôi
                                        </label>
                                    </div>

                                    {/* <!-- Forgot password link --> */}
                                    <a
                                        href="#!"
                                        className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                                    >
                                        Quên mật khẩu?
                                    </a>
                                </div>

                                {/* <!-- Submit button --> */}

                                <SubmitButton className="bg-[#f97d2a] cursor-pointer" children="Đăng nhập"></SubmitButton>

                                {/* <!-- Divider --> */}
                                <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                                    <p className="mx-4 mb-0 text-center font-semibold dark:text-neutral-200">
                                        HOẶC
                                    </p>
                                </div>

                                {/* <!-- Social login buttons --> */}
                                <TERipple rippleColor="light" className="w-full">
                                    <a
                                        className="mb-3 flex w-full items-center justify-center rounded bg-white px-7 pb-2.5 pt-3 text-center 
                                    text-sm font-medium uppercase leading-normal text-blue-600 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150
                                        ease-in-out hover:bg-blue-600 hover:text-white border-2 border-blue-600"
                                        role="button"
                                        href={SERVER_URL.OAUTH2_FACEBOOK}
                                    >
                                        {/* Facebook icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-2 h-3.5 w-3.5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                        </svg>
                                        Đăng nhập với Facebook
                                    </a>
                                </TERipple>
                                <TERipple rippleColor="light" className="w-full">
                                    <a
                                        className="mb-3 flex w-full items-center justify-center rounded bg-white px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-red-500 shadow-[0_4px_9px_-4px_#54b4d3] transition duration-150 ease-in-out hover:bg-red-500 hover:text-white border-2 border-red-500"
                                        role="button"
                                        href={SERVER_URL.OAUTH2_GOOGLE}
                                    >
                                        <svg
                                            className="mr-2 h-3.5 w-3.5 fill-current  "
                                            viewBox="0 0 488 512">
                                            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                        </svg>
                                        Đăng nhập với Google
                                    </a>
                                </TERipple>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

export default CustomerLogin
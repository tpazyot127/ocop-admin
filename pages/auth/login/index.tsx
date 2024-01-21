import { useRouter } from "next/router";
import React, { useContext, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { LayoutContext } from "../../../layout/context/layoutcontext";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Page } from "../../../types/types";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Messages } from "primereact/messages";
import Link from "next/link";

const LoginPage: Page = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const msgs = useRef<any>();

    const router = useRouter();
    const containerClassName = classNames(
        "surface-ground flex align-items-center justify-content-center min-h-screen w-full overflow-hidden",
        { "p-input-filled": layoutConfig.inputStyle === "filled" },
    );

    const schema = yup
        .object({
            email: yup.string().email("Email sai định dạng").required("Email không được để trống"),
            password: yup.string().required("Mật khẩu không được để trống"),
        })
        .required();

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
        reset,
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: yupResolver(schema),
    });

    const doLogin = async () => {
        setIsLoading(true);

        const values = getValues();

        try {
            await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            }).then(({ ok, error }: any) => {
                if (ok) {
                    reset();
                    router.push("/");
                } else {
                    let message = "";

                    switch (error) {
                        case "AUTHENTICATION_LOGIN_CREDENTIAL_NOT_FOUND":
                            message = "Email hoặc mật khẩu không đúng";
                    }

                    msgs.current.show({
                        sticky: true,
                        severity: "error",
                        detail: message,
                        closable: false,
                    });
                }
            });
        } catch (e) {
            console.error("E", e);

            msgs.current.show({
                sticky: true,
                severity: "error",
                detail: "Lỗi không xác định",
                closable: false,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: "56px",
                        padding: "0.3rem",
                        background: "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: "53px" }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Đăng nhập</div>
                        </div>

                        <Messages ref={msgs} />

                        <form onSubmit={handleSubmit(doLogin)} method="POST">
                            <Controller
                                name="email"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <div className="mb-5">
                                        <label
                                            htmlFor={field.name}
                                            className={classNames(
                                                { "p-error": fieldState.error },
                                                "block text-900 text-xl font-medium mb-2",
                                            )}
                                        >
                                            Email
                                        </label>

                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            type="text"
                                            placeholder="Địa chỉ email"
                                            className={classNames("w-full md:w-30rem", {
                                                "p-invalid": fieldState.error,
                                            })}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            style={{ padding: "1rem" }}
                                        />

                                        {errors.email?.message && (
                                            <small className="p-error block mt-2">{errors.email?.message}</small>
                                        )}
                                    </div>
                                )}
                            />

                            <Controller
                                name="password"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <div className="mb-5">
                                        <label
                                            htmlFor={field.name}
                                            className={classNames(
                                                { "p-error": fieldState.error },
                                                "block text-900 text-xl font-medium mb-2",
                                            )}
                                        >
                                            Mật khẩu
                                        </label>

                                        <Password
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            placeholder="Mật khẩu"
                                            toggleMask
                                            className={classNames("w-full md:w-30rem", {
                                                "p-invalid": fieldState.error,
                                            })}
                                            inputClassName="w-full p-3 md:w-30rem"
                                            feedback={false}
                                        />

                                        {errors.password?.message && (
                                            <small className="p-error block mt-2">{errors.password?.message}</small>
                                        )}
                                    </div>
                                )}
                            />

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <a
                                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                                    style={{ color: "var(--primary-color)" }}
                                >
                                    Quên mật khẩu?
                                </a>
                            </div>

                            <Button
                                label="Đăng nhập"
                                className="w-full p-3 text-xl"
                                type="submit"
                                loading={isLoading}
                            />
                        </form>

                        <div className="text-center mt-5">
                            <div className="text-300 text-base">
                                Chưa có tài khoản? <Link href={"/auth/register"}>Đăng ký ngay</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return <>{page}</>;
};

export default LoginPage;
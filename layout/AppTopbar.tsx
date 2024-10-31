/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { classNames } from "primereact/utils";
import React, { forwardRef, useContext, useImperativeHandle, useRef } from "react";
import { AppTopbarRef } from "../types/types";
import { LayoutContext } from "./context/layoutcontext";
import { Menubar } from "primereact/menubar";
import { TieredMenu } from "primereact/tieredmenu";
import { signOut } from "next-auth/react";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    const items = [
        {
            label: "Khách hàng",
            icon: "pi pi-fw pi-table",
            items: [
                {
                    label: "New",
                    icon: "pi pi-fw pi-user-plus",
                    items: [
                        {
                            label: "Tạo mới",
                            icon: "pi pi-fw pi-plus",
                        },
                        {
                            label: "Sao chép",
                            icon: "pi pi-fw pi-copy",
                        },
                    ],
                },
                {
                    label: "Chỉnh sửa",
                    icon: "pi pi-fw pi-user-edit",
                },
            ],
        },
        {
            label: "Sản phẩm",
            icon: "pi pi-fw pi-shopping-cart",
            items: [
                {
                    label: "Xem sản phẩm",
                    icon: "pi pi-fw pi-list",
                },
                {
                    label: "Tìm kiếm",
                    icon: "pi pi-fw pi-search",
                },
            ],
        },
        {
            label: "Người dùng",
            icon: "pi pi-fw pi-user",
            url: "/user/info",
        },
        {
            separator: true,
        },
        {
            label: "Đăng xuất",
            icon: "pi pi-fw pi-sign-out",
            command: ()=>{
                signOut();
            }
        },
    ];

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img
                    src={`/layout/images/logo-${layoutConfig.colorScheme !== "light" ? "white" : "dark"}.svg`}
                    width="70px"
                    height={"50px"}
                    alt="logo"
                />
                <span>{"VRDC"}</span>
            </Link>

            <button
                ref={menubuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button"
                onClick={onMenuToggle}
            >
                <i className="pi pi-bars" />
            </button>

            <button
                ref={topbarmenubuttonRef}
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={showProfileSidebar}
            >
                <i className="pi pi-ellipsis-v" />
            </button>

            <div
                ref={topbarmenuRef}
                className={classNames("layout-topbar-menu", {
                    "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
                })}
            >
                {layoutState.profileSidebarVisible ? <TieredMenu model={items} /> : <Menubar model={items}></Menubar>}
            </div>
        </div>
    );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
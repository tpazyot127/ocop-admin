/* eslint-disable @next/next/no-img-element */

import React from "react";
import ProductDetailDialog, { CurrentProductProvider } from "./components/productDialog";
import ProductDashboard from "./components/productDashboard";

const Dashboard = () => {
    return (
        <CurrentProductProvider>
            <div className="grid">
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Đơn hàng</span>
                                <div className="text-900 font-medium text-xl">152</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                style={{ width: "2.5rem", height: "2.5rem" }}
                            >
                                <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">24 new </span>
                        <span className="text-500">since last visit</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Doanh thu</span>
                                <div className="text-900 font-medium text-xl">$2.100</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-orange-100 border-round"
                                style={{ width: "2.5rem", height: "2.5rem" }}
                            >
                                <i className="pi pi-map-marker text-orange-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">%52+ </span>
                        <span className="text-500">since last week</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Khách hàng</span>
                                <div className="text-900 font-medium text-xl">28441</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-cyan-100 border-round"
                                style={{ width: "2.5rem", height: "2.5rem" }}
                            >
                                <i className="pi pi-inbox text-cyan-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">520 </span>
                        <span className="text-500">newly registered</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Bình luận</span>
                                <div className="text-900 font-medium text-xl">152 Unread</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-purple-100 border-round"
                                style={{ width: "2.5rem", height: "2.5rem" }}
                            >
                                <i className="pi pi-comment text-purple-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">85 </span>
                        <span className="text-500">responded</span>
                    </div>
                </div>

                <div className="col-12">
                    <ProductDashboard />
                </div>
            </div>
            <ProductDetailDialog />
        </CurrentProductProvider>
    );
};

export default Dashboard;

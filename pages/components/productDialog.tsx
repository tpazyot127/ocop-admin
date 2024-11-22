import { Dialog, DialogProps } from "primereact/dialog";
import { Demo } from "types/types";
import { createContext, ReactNode, useContext, useState } from "react";
import { formatCurrency } from "@utils/index";

export interface CurrentProductContext {
    currentProduct: Demo.Product | null;
    setCurrentProduct: (currentProduct: Demo.Product | null) => void;
}

export const CurrentProductContext = createContext<CurrentProductContext | null>(null);

export function CurrentProductProvider({ children }: { children: ReactNode }) {
    const [currentProduct, setCurrentProduct] = useState<Demo.Product | null>(null);

    return (
        <CurrentProductContext.Provider value={{ currentProduct, setCurrentProduct }}>
            {children}
        </CurrentProductContext.Provider>
    );
}

export default function ProductDetailDialog() {
    const productContext = useContext(CurrentProductContext);

    if (!productContext) {
        return <></>;
    }

    const { currentProduct: product, setCurrentProduct } = productContext;

    if (!product) {
        return <></>;
    }

    return (
        <Dialog
            visible={product ? true : false}
            style={{ width: "450px" }}
            header="Chi tiết sản phẩm"
            modal
            className="p-fluid"
            onHide={() => {
                setCurrentProduct(null);
            }}
        >
            {/* ADD IMAGE */}
            <div className="field">
                <label className="font-medium" htmlFor="name">Tên sản phẩm</label>
                <p>{product.title}</p>
            </div>
            <div className="field">
                <label className="font-medium" htmlFor="description">Mô tả</label>
                <p>{product?.description || "Không có mô tả nào"}</p>
            </div>

            {/* ADD CATEGORY */}

            <div className="formgrid grid">
                <div className="field col">
                    <label className="font-medium" htmlFor="price">Giá</label>
                    <p>{formatCurrency(product?.price)}</p>
                </div>

                <div className="field col">
                    <label className="font-medium" htmlFor="price">Giá cũ</label>
                    <p>{formatCurrency(product?.price)}</p>
                </div>
                <div className="field col">
                    <label className="font-medium" htmlFor="quantity">Số lượng</label>
                    <p>{product?.quantity || "0"}</p>
                </div>
            </div>
        </Dialog>
    );
}

import { Dialog } from "primereact/dialog";
import { Demo } from "types/types";
import { formatCurrency } from "@utils/index";
import { Galleria } from "primereact/galleria";
import ProductImages from "./productImages";
import { Rating } from "primereact/rating";

export interface ProductDetailDialogProps {
    product: Demo.Product | null;
    onHide: () => void;
}

export default function ProductDetailDialog(props: ProductDetailDialogProps) {
    const { product, onHide } = props;

    if (!product) {
        return <></>;
    }

    return (
        <Dialog
            visible={product ? true : false}
            style={{ width: "760px" }}
            header="Chi tiết sản phẩm"
            modal
            className="p-fluid"
            onHide={onHide}
        >
            <div className="grid">
                <div className="col-6">
                    <ProductImages product={product} />
                </div>
                <div className="col-6 px-4">
                    <div className="field">
                        <label className="font-medium" htmlFor="name">
                            Tên sản phẩm
                        </label>
                        <p>{product.title}</p>
                    </div>
                    <div className="field">
                        <label className="font-medium" htmlFor="description">
                            Mô tả
                        </label>
                        <p>{product?.desc || "Không có mô tả nào"}</p>
                    </div>

                    {/* ADD CATEGORY */}

                    <div className="field">
                        <label className="font-medium" htmlFor="name">Đánh giá</label>
                        <Rating value={product.rating} cancel={false}/>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label className="font-medium" htmlFor="price">
                                Giá
                            </label>
                            <p>{formatCurrency(product?.price)}</p>
                        </div>

                        <div className="field col">
                            <label className="font-medium" htmlFor="price">
                                Giá cũ
                            </label>
                            <p>{formatCurrency(product?.price)}</p>
                        </div>
                        <div className="field col">
                            <label className="font-medium" htmlFor="quantity">
                                Số lượng
                            </label>
                            <p>{product?.stock || "0"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

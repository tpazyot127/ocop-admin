import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { formatCurrency } from "@utils/index";
import { Demo } from "types/types";
import { ProductService } from "demo/service/ProductService";
import { useState } from "react";
import ProductDetailDialog from "./productDialog";

const imageBody = (data: Demo.Product) => {
    return (
        <>
            <span className="p-column-title">Hình ảnh</span>
            <img
                src={data.images[0]?.img || "/demo/images/product/no-image.jpg"}
                alt={data.images[0]?.img}
                className="shadow-2"
                width="100"
            />
        </>
    );
};

export default function ProductDashboard() {
    const { data: products } = ProductService.useGetProducts();

    const [currentProduct, setCurrentProduct] = useState<Demo.Product | null>(null);

    return (
        <>
            <div className="card">
                <h5>Sản phẩm đã bán gần đây</h5>
                <DataTable value={products} rows={5} paginator responsiveLayout="scroll">
                    <Column header="Hình ảnh" body={imageBody} />
                    <Column
                        field="name"
                        header="Tên sản phẩm"
                        sortable
                        body={(data) => {
                            return data.title;
                        }}
                        style={{ width: "35%" }}
                    />
                    <Column
                        field="price"
                        header="Giá"
                        sortable
                        style={{ width: "35%" }}
                        body={(data) => formatCurrency(data.price)}
                    />
                    <Column
                        header="Chi tiết"
                        style={{ width: "15%" }}
                        body={(data) => (
                            <>
                                <Button
                                    icon="pi pi-search"
                                    text
                                    onClick={(e) => {
                                        if (setCurrentProduct) {
                                            setCurrentProduct(data);
                                        }
                                    }}
                                />
                            </>
                        )}
                    />
                </DataTable>
            </div>
            <ProductDetailDialog
                product={currentProduct}
                onHide={() => {
                    setCurrentProduct(null);
                }}
            />
        </>
    );
}

/* eslint-disable @next/next/no-img-element */

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FileUpload, FileUploadFilesEvent } from "primereact/fileupload";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { ProductService } from "../../../demo/service/ProductService";
import { Demo } from "../../../types/types";
import { formatCurrency } from "@utils/index";
import { Galleria } from "primereact/galleria";
import ProductImages from "@pages/components/productImages";


const Products = () => {
    let emptyProduct: Demo.Product = {
        _id: "",
        title: "",
        images: [],
        gallery: [],
        desc: "",
        category: "",
        oldPrice: 0,
        price: 0,
        quantity: 0,
        slug: "",
        stock: 0,
        rating: 0,
        inventoryStatus: "INSTOCK",
    };

    // const toast = useRef<Toast>(null);

    // const [products, setProducts] = useState<Demo.Product[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<Demo.Product[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Demo.Product[]>>(null);

    const { data: products } = ProductService.useGetProducts();
    const { data: categories } = ProductService.useGetProductCategories();
    const { mutateAsync: addProduct } = ProductService.useCreateProduct();
    const { mutateAsync: updateProduct } = ProductService.useEditProduct();
    const { mutateAsync: uploadProductImages } = ProductService.useUploadProductImages();

    const onUpload = async (image: FileUploadFilesEvent) => {
        const files = image.files as File[];
        const formData = new FormData();

        files.forEach((file) => {
            formData.append(`image`, file);
        });

        try {
            const res = await uploadProductImages(formData);
            if (res) {
                setProduct((prev) => ({
                    ...prev,
                    images: [
                        ...prev.images,
                        ...res.map((item: string) => {
                            return { img: item };
                        }),
                    ],
                    gallery: [
                        ...prev.gallery,
                        ...res.map((item: string) => {
                            return { thumb: item };
                        }),
                    ],
                }));
            }
        } catch (error) {
            console.error("Error uploading images:", error);
        }
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);

        if (product._id) {
            await updateProduct(
                { id: product._id, product: product },
                {
                    onSuccess: () => {
                        toast.current?.show({
                            severity: "success",
                            summary: "Successful",
                            detail: "Cập nhật sản phẩm thành công",
                            life: 3000,
                        });
                    },
                    onError: (error) => {
                        toast.current?.show({
                            severity: "error",
                            summary: "Error",
                            detail: error.message,
                            life: 3000,
                        });
                    },
                },
            );
        } else {
            const { _id, ...newProduct } = product;
            await addProduct(newProduct, {
                onSuccess: () => {
                    toast.current?.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Tạo sản phẩm thành công",
                        life: 3000,
                    });
                },
                onError: (error) => {
                    toast.current?.show({
                        severity: "error",
                        summary: "Error",
                        detail: error.message,
                        life: 3000,
                    });
                },
            });
        }

        setProductDialog(false);
        setProduct(emptyProduct);
    };

    const editProduct = (product: Demo.Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products?.filter((val: any) => val.id !== product.id);
        // setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({ severity: "success", summary: "Successful", detail: "Product Deleted", life: 3000 });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        // let _products = products.filter((val: any) => !selectedProducts?.includes(val));
        // setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts([]);
        toast.current?.show({ severity: "success", summary: "Successful", detail: "Products Deleted", life: 3000 });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...product };
        _product["category"] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Thêm mới" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button
                        label="Xoá"
                        icon="pi pi-trash"
                        severity="danger"
                        onClick={confirmDeleteSelected}
                        disabled={!selectedProducts || !selectedProducts.length}
                    />
                </div>
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Tên</span>
                {rowData.title}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Hình ảnh</span>
                <img
                    src={rowData.images[0]?.img || "/demo/images/product/no-image.jpg"}
                    alt={rowData.images[0]?.img}
                    className="shadow-2"
                    width="100"
                />
            </>
        );
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Giá</span>
                {formatCurrency(rowData.price as number)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Danh Mục</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readOnly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {rowData.stock as number}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    severity="success"
                    className="mr-2"
                    onClick={() => editProduct(rowData)}
                />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Quản trị sản phẩm</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder="Tìm kiếm..."
                />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Huỷ" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Lưu" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products?.reverse()}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="Không có sản phẩm"
                        header={header}
                        responsiveLayout="scroll"
                        selectionMode="multiple"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "4rem" }}></Column>
                        <Column
                            field="title"
                            header="Tên sản phẩm"
                            sortable
                            body={nameBodyTemplate}
                            headerStyle={{ minWidth: "15rem" }}
                        ></Column>
                        <Column header="Hình ảnh" body={imageBodyTemplate}></Column>
                        <Column field="price" header="Giá" body={priceBodyTemplate} sortable></Column>
                        <Column
                            field="category"
                            header="Danh mục"
                            sortable
                            body={categoryBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                        <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable></Column>
                        <Column
                            field="stock"
                            header="Số lượng"
                            body={statusBodyTemplate}
                            sortable
                            headerStyle={{ minWidth: "10rem" }}
                        ></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: "10rem" }}></Column>
                    </DataTable>

                    <Dialog
                        visible={productDialog}
                        style={{ width: "450px" }}
                        header="Chi tiết sản phẩm"
                        modal
                        className="p-fluid"
                        footer={productDialogFooter}
                        onHide={hideDialog}
                    >
                        {product.image && (
                            <img
                                src={product.images[0]?.img}
                                alt={product.images[0]?.img}
                                width="150"
                                className="mt-0 mx-auto mb-5 block shadow-2"
                            />
                        )}
                        <div className="field">
                            <label htmlFor="title">Tên sản phẩm</label>
                            <InputText
                                id="title"
                                value={product.title}
                                onChange={(e) => onInputChange(e, "title")}
                                required
                                autoFocus
                                className={classNames({ "p-invalid": submitted && !product.title })}
                            />
                            {submitted && !product.title && <small className="p-invalid">Name is required.</small>}
                        </div>

                        <ProductImages product={product}/>
                        
                        <div className="field">
                            <label htmlFor="name">Hình ảnh sản phẩm</label>
                            <FileUpload
                                name="file"
                                url="/upload"
                                onSelect={onUpload}
                                multiple
                                accept="image/*"
                                maxFileSize={1000000}
                                chooseLabel="Thêm hình ảnh"
                                uploadLabel="Tải lên"
                                cancelLabel="Huỷ"
                            />

                            {submitted && !product.image && <small className="p-invalid">Hình ảnh là bắt buộc</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Mô tả</label>
                            <InputTextarea
                                id="desc"
                                value={product.desc}
                                onChange={(e) => onInputChange(e, "desc")}
                                required
                                rows={3}
                                cols={20}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="name">Đánh giá</label>
                            <Rating
                                value={product.rating}
                                onChange={(e) => onInputNumberChange(e, "rating")}
                                cancel={false}
                            />

                            {submitted && !product.rating && <small className="p-invalid">Đánh giá là bắt buộc</small>}
                        </div>
                        <div className="field">
                            <label className="mb-3">Danh mục</label>
                            <div className="formgrid grid">
                                {categories?.map((category, index) => (
                                    <div key={category.id} className="field-radiobutton col-6">
                                        <RadioButton
                                            inputId={`category${index}`}
                                            name="category"
                                            value={category.category}
                                            onChange={onCategoryChange}
                                            checked={product.category === category.category}
                                        />
                                        <label htmlFor={`category${index}`}>{category.title}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Giá</label>
                                <InputNumber
                                    id="price"
                                    value={product.price}
                                    onValueChange={(e) => onInputNumberChange(e, "price")}
                                    mode="currency"
                                    currency="VND"
                                    locale="en-US"
                                />
                            </div>

                            <div className="field col">
                                <label htmlFor="price">Giá cũ</label>
                                <InputNumber
                                    id="oldPrice"
                                    value={product.oldPrice as number}
                                    onValueChange={(e) => onInputNumberChange(e, "oldPrice")}
                                    mode="currency"
                                    currency="VND"
                                    locale="en-US"
                                />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Số lượng</label>
                                <InputNumber
                                    id="stock"
                                    value={product.stock as number}
                                    onValueChange={(e) => onInputNumberChange(e, "stock")}
                                />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog
                        visible={deleteProductDialog}
                        style={{ width: "450px" }}
                        header="Xác nhận"
                        modal
                        footer={deleteProductDialogFooter}
                        onHide={hideDeleteProductDialog}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {product && (
                                <span>
                                    Bạn có chắc muốn xoá bản ghi <b>{product.title}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog
                        visible={deleteProductsDialog}
                        style={{ width: "450px" }}
                        header="Xác nhận"
                        modal
                        footer={deleteProductsDialogFooter}
                        onHide={hideDeleteProductsDialog}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Products;
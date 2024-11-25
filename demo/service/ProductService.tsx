import axiosClient from "@lib/axios";
import { Demo } from "../../types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PRODUCT_CACHE_KEYS = {
    list: "list",
    byId: "byId",
    category: "category",
};
export const ProductService = {
    getProductsSmall() {
        return fetch("/demo/data/products-small.json", { headers: { "Cache-Control": "no-cache" } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    getProducts() {
        return fetch("/demo/data/products.json", { headers: { "Cache-Control": "no-cache" } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    useGetProducts() {
        const getProducts = async () => {
            const res = await axiosClient.get("/products");
            return res.data.products;
        };

        return useQuery({ queryKey: [PRODUCT_CACHE_KEYS.list], queryFn: getProducts });
    },

    useGetProductCategories() {
        const getProductCategories = async () => {
            const res = await axiosClient.get("/product-categories");
            return res.data as Demo.ProductCategory[];
        };

        return useQuery({ queryKey: [PRODUCT_CACHE_KEYS.category], queryFn: getProductCategories });
    },

    useCreateProduct() {
        const queryClient = useQueryClient();

        const createProduct = async (product: Demo.Product) => {
            const res = await axiosClient.post("/products/create", {
                ...product,
                brand: product.brand || "OCOP",
                category: product.category || "hatdinhduong",
                slug: product.title,
            });

            return res.data;
        };
        return useMutation({
            mutationFn: createProduct,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [PRODUCT_CACHE_KEYS.list] });
            },
        });
    },
    useUploadProductImages() {
        const queryClient = useQueryClient();

        const uploadProductImages = async (file: FormData) => {
            const res = await axiosClient.post("/upload/images", file, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        };

        return useMutation({
            mutationFn: uploadProductImages,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [PRODUCT_CACHE_KEYS.list] });
            },
        });
    },

    useEditProduct() {
        const queryClient = useQueryClient();

        const editProduct = async ({ id, product }: { id: string; product: Demo.Product }) => {
            const res = await axiosClient.put(`products/${id}`, {
                ...product,
            });

            return res.data;
        };

        return useMutation({
            mutationFn: editProduct,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [PRODUCT_CACHE_KEYS.list] });
            },
        });
    },

    getProductsWithOrdersSmall() {
        return fetch("/demo/data/products-orders-small.json", { headers: { "Cache-Control": "no-cache" } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },
};
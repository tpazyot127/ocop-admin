import axiosClient from "@lib/axios";
import { Demo } from "../../types/types";
import { useQuery } from "@tanstack/react-query";

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

    getProductsWithOrdersSmall() {
        return fetch("/demo/data/products-orders-small.json", { headers: { "Cache-Control": "no-cache" } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },
};
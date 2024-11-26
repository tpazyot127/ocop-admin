import { Galleria } from "primereact/galleria";
import { Demo } from "types/types";

const galleriaResponsiveOptions = [
    {
        breakpoint: "1024px",
        numVisible: 5,
    },
    {
        breakpoint: "960px",
        numVisible: 4,
    },
    {
        breakpoint: "768px",
        numVisible: 3,
    },
    {
        breakpoint: "560px",
        numVisible: 1,
    },
];

const galleriaItemTemplate = (item: any) => {
    return <img src={item.img} alt={item.alt} style={{ width: "100%", display: "block" }} />;
};

const galleriaThumbnailTemplate = (item: any) => (
    <img src={item.img} alt={item.alt} style={{ width: "100%", display: "block" }} />
);

interface ProductImagesProps {
    product: Demo.Product;
}

export default function ProductImages(props: ProductImagesProps) {
  const {product} = props
    return (
        <>
            {product?.images.length > 0 && (
                <div className="field">
                    <div className="card">
                        <h5>Hình ảnh</h5>
                        <Galleria
                            value={product.images}
                            responsiveOptions={galleriaResponsiveOptions}
                            numVisible={7}
                            circular
                            style={{ maxWidth: "800px", margin: "auto" }}
                            item={galleriaItemTemplate}
                            thumbnail={galleriaThumbnailTemplate}
                        ></Galleria>
                    </div>
                </div>
            )}
        </>
    );
}

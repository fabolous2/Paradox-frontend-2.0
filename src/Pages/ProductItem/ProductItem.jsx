import React, {useState, useEffect} from 'react';
import Button from "../../Components/Button";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getOneProduct, getUser } from '../../db/db';

function ProductItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const product = await getOneProduct(id);
            setProduct(product);
        }
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            setUser(user);
        }
        fetchUser();
    }, []);

    if (!product) {
        return <div>Loading...</div>;
    }

    const handlePurchase = () => {
        let balance = parseInt(user.balance);
        let price = parseInt(product.price);
        if (balance >= price) {
            navigate(`/product/checkout/${id}`);
        } else {
            navigate(`/deficiency/${id}`);
        }
    };

    return (
        <div style={{height: "100vh", display: "flex", flexDirection: "column"}} className='relative'>
            <div className="flex-grow overflow-auto">
                <div className="">
                    <img className='card__image rounded-1' src={product.image_url} alt={product.name} style={{maxHeight: "90vh", objectFit: "cover", width: "100%"}}/>
                </div>
                <div className="flex column justify-between px-08 py-04">
                    <div className="flex justify-between">
                        <b>
                            {product.name}
                        </b>
                        <b>{product.price} ₽</b>
                    </div>
                    <div className="flex py-04">
                        <h3>Описание</h3>
                    </div>
                    <span className="bg-lightgray rounded px-08 word-pre py-08">
                        {product.description}
                    </span>
                </div>
            </div>
            <div className="w-100 flex">
                <div className="px-04 w-100 py-04">
                    <Button onClick={handlePurchase} className="w-100 text__center"
                            type="checkout"
                            title="Купить"></Button>
                </div>
            </div>
        </div>
    );
}

export default ProductItem;
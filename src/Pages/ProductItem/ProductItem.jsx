import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getOneProduct, getUser } from '../../db/db';
import { useTelegram } from '../../hooks/useTelegram';

function ProductItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const { tg } = useTelegram();
 
    useEffect(() => {
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        window.history.back();
      });
  
      return () => {
        tg.BackButton.offClick();
        tg.BackButton.hide();
      };
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            const product = await getOneProduct(id);
            setProduct(product);
        }
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser(tg.initData);
            setUser(user);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Купить',
        });
        tg.MainButton.onClick(handlePurchase);
        tg.MainButton.show();

        return () => {
            tg.MainButton.offClick(handlePurchase);
            tg.MainButton.hide();
        };
    }, [user, product]);

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
        </div>
    );
}

export default ProductItem;
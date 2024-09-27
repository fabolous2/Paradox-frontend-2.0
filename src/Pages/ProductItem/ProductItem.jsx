import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getOneProduct, getUser } from '../../db/db';
import { useTelegram } from '../../hooks/useTelegram';
import CircularProgress from '@mui/material/CircularProgress';

function ProductItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { tg } = useTelegram();

    const handlePurchase = () => {
        if (user && product) {
            let balance = parseInt(user.balance);
            let price = parseInt(product.price);
            
            if (balance >= price) {
                navigate(`/product/checkout/${id}`);
            } else {
                navigate(`/deficiency/${id}`);
            }
        }
    };
 
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
            try {
                const product = await getOneProduct(id);
                setProduct(product);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
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
        tg.MainButton.setText('Купить');
        tg.MainButton.show();
        tg.MainButton.onClick(handlePurchase);

        return () => {
            tg.MainButton.offClick(handlePurchase);
            tg.MainButton.hide();
        };
    }, [user, product, id]);

    if (loading) {
        return (
            <div className="flex justify-center align-items-center" style={{height: '100vh'}}>
                <CircularProgress />
            </div>
        );
    }

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
                    
                    <div className="flex justify-between py-04">
                        <span>Ваш баланс: {user ? user.balance : 0} ₽</span>
                        <span>Стоимость товара: {product.price} ₽</span>
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
import './App.css';
import React, {useEffect} from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route, useNavigate,
} from "react-router-dom";
import Main from "./Pages/Main/Main";
import Profile from "./Pages/Profile/Profile";
import OrderDetails from "./Pages/OrderDetails/OrderDetails";
import PromoCode from "./Pages/PromoCode/PromoCode";
import MyReferral from "./Pages/MyReferral/MyReferral";
import Deposit from "./Pages/Deposit/Deposit";
import Products from "./Pages/Products/Products";
import ProductItem from "./Pages/ProductItem/ProductItem";
import {useTelegram} from "./hooks/useTelegram";

const tele = window.Telegram.WebApp;

function App() {
    const {tg} = useTelegram();

    useEffect(() => {
        tg.ready();
    }, []);

    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<MainWithBackButton/>}/>
                <Route exact path="/profile" element={<ProfileWithBackButton/>}/>
                <Route exact path="/orders/:id" element={<OrderDetailsWithBackButton/>}/>
                <Route exact path="/deposit" element={<DepositWithBackButton/>}/>
                <Route exact path="/my-referral" element={<MyReferralWithBackButton/>}/>
                <Route exact path="/promo-code" element={<PromoCodeWithBackButton/>}/>
                <Route exact path="/game/:id/" element={<ProductsWithBackButton/>}/>
                <Route exact path="/product/:id/" element={<ProductItemWithBackButton/>}/>
                <Route path="*" element={<MainWithBackButton/>}/>
            </Routes>
        </Router>
    );
}

// Higher-order component to handle BackButton logic
function withBackButton(Component) {
    return function WrappedComponent(props) {
        tele.onEvent('backButtonClicked', function (e) {
            e.preventDefault();
            window.history.back();
        });

        React.useEffect(() => {
            tele.ready();
            let page = window.location.pathname;
            if (page !== '/') {
                tele.BackButton.show();
            } else {
                tele.BackButton.hide();
            }
        });

        return <Component {...props} />;
    };
}

// Wrap each page component with the BackButton logic
const MainWithBackButton = withBackButton(Main);
const ProfileWithBackButton = withBackButton(Profile);
const OrderDetailsWithBackButton = withBackButton(OrderDetails);
const PromoCodeWithBackButton = withBackButton(PromoCode);
const MyReferralWithBackButton = withBackButton(MyReferral);
const DepositWithBackButton = withBackButton(Deposit);
const ProductsWithBackButton = withBackButton(Products);
const ProductItemWithBackButton = withBackButton(ProductItem);

export default App;

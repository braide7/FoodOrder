import Modal from "./UI/Modal.Jsx";
import Button from "./UI/Button";

import CartContext from "../context/CartContext";
import UserProgressContext from '../context/UserProgressContext.jsx';

import { useContext } from "react";
import { currencyFormatter } from "../util/formatting";
import CartItem from "./CartItem.jsx";



export default function Cart() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext)

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);

    function handleCloseCart() {
        userProgressCtx.hideCart();
    }

    function handleOpenCheckout(){
        userProgressCtx.showCheckout();
    }

    function handleEmptyCart(){
        cartCtx.clearCart();
        userProgressCtx.hideCart();
    }

    return (
        <Modal className="cart" open={userProgressCtx.progress === 'cart'} onClose={userProgressCtx.progress === 'cart' ? handleCloseCart : null}>
            <h2>Your Cart</h2>
            <ul>
                {cartCtx.items.map((item) => (
                    <CartItem key={item.id} name={item.name} price={item.price} quantity={item.quantity} onIncrease={() => cartCtx.addItem(item)} onDecrease={() =>cartCtx.removeItem(item.id)}/>
                ))
                }
            </ul>
            <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
            <p className="modal-actions">
                <Button textOnly onClick={handleCloseCart}>Close</Button>
                {cartCtx.items.length > 0 &&<> <Button onClick={handleEmptyCart}>Empty Cart</Button> <Button onClick={handleOpenCheckout}>Go To Checkout</Button>
                </> }
            </p>
        </Modal >
    )
}
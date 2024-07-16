import { useContext } from "react";

import CartContext from "../context/CartContext";
import UserProgressContext from "../context/UserProgressContext.jsx";

import Modal from "./UI/Modal.Jsx";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import Error from "./Error.jsx";

import { currencyFormatter } from "../util/formatting";
import useHttp from "../hooks/useHttp.js";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}

export default function Checkout() {
    const cartCtx = useContext(CartContext)
    const userProgressCtx = useContext(UserProgressContext)

    const { data, isLoading: isSending, error, sendRequest, clearData } = useHttp('http://localhost:3000/orders', requestConfig,)

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);

    function handleClose() {
        userProgressCtx.hideCheckout();
    }

    function handleFinish() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();

    }

    function handleSubmit(event) {
        event.preventDefault();

        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        sendRequest(
            JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData,
                },
            })
        );


    }

    let actions = (
        <>
            <Button type="button" onClick={handleClose} textOnly>Close</Button>
            <Button>Submit Order</Button>'
        </>
    )

    if (isSending) {
        actions = <span>Sending over order...</span>;
    }

    if (data && !error) {
        return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
            <h2>Success!</h2>
            <p>Your order was submitted successfully</p>
            <p>You will receive a confirmation email shortly</p>

            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal>
    }

    return (
        <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
                <Input label="Full Name" type="text" id="name" />
                <Input label="Email Address" type="email" id="email" />
                <Input label="Street Address" type="text" id="street" />
                <div className="control-row">
                    <Input label="Postal Code" type="text" id="postal-code" />
                    <Input label="City" type="text" id="city" />
                </div>

                {error && <Error title="failed to submit order" message={error} />}

                <p className="modal-actions">
                    {actions}
                </p>
            </form>
        </Modal>
    )
}
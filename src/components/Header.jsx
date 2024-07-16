import Button from './UI/Button.jsx';
import logoImg from '../assets/logo.jpg';
import CartContext from '../context/CartContext.jsx';
import UserProgressContext from '../context/UserProgressContext.jsx';

import { useContext } from 'react';


export default function Header() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext)

    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item)=>{
        return totalNumberOfItems + item.quantity
    },0);

    function handleShowCart(){
        userProgressCtx.showCart();
    }

    return (
        <header id="main-header"> 
            <div id="title">
                <img src={logoImg} alt="restaurant logo"/>
                <h1>Food Order</h1>
            </div>
            <nav>
                <Button textOnly onClick={handleShowCart}>Cart ({totalCartItems})</Button>
            </nav>

        </header>
    )
}
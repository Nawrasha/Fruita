import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: any;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems() {
    this.cartService.getCartItems().subscribe(
      (data: any) => {
        this.cartItems = data;
      },
      (error: any) => {
        console.error('Error fetching cart items', error);
      }
    );
  }

  updateQuantity(cartitemID: number, quantity: number) {
    if (quantity < 1) quantity = 1; // sécurité
    this.cartService.updateQuantity(cartitemID,quantity).subscribe({
      next: () => {
        console.log('Quantité mise à jour');
      },
      error: (error: any) => console.error('Erreur mise à jour quantité', error)
    });
  }

  removeFromCart(cartitemID: number) {
    this.cartService.removeFromCart(cartitemID).subscribe({
      next: () => {
        console.log('Item removed from cart');
        this.getCartItems(); // Refresh the cart items
      },
      error: (error: any) => console.error('Error removing item from cart', error)
    });
  }

  getSubtotal(): number {
    let subtotal = 0;
    if (this.cartItems) {
      for (let item of this.cartItems) {
        subtotal += item.prix * item.quantity;
      }
    }
    return subtotal;
  }

  getTotal(): number {
    return this.getSubtotal();
  }

}

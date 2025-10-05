import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  produits: any;
  produitsFiltres: any[] = [];
  categories: string[] = [];
  categorie: string = '';

   constructor(
    private produitService: ProduitService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

cartitem: any[] = [];

  ngOnInit(): void {
  // Charger les items du panier
  this.cartService.getCartItems().subscribe(
    (items: any) => {
      this.cartitem = items;
      console.log('Cart items:', this.cartitem);

      // Après avoir récupéré le panier, on charge les produits
      this.getProduitsWithCartStatus();
    },
    (error) => console.error(error)
  );

   // Récupère la catégorie depuis l'URL
    this.route.paramMap.subscribe(params => {
      this.categorie = params.get('categorie') || '';
      this.getProduitsWithCartStatus();
    });
  }



   getProduitsWithCartStatus() {
     this.produitService.getProduits().subscribe((data: any) => {
      this.produits = data;


      this.categories = Array.from(new Set(this.produits.map((p: any) => p.categorie)));

      if (!this.categories.includes(this.categorie)) {
      this.categorie = this.categories.length > 0 ? this.categories[0] : '';
      this.router.navigate(['/menu', this.categorie]);
    }

    this.produitsFiltres = this.produits.filter(
        (produit: any) => produit.categorie === this.categorie
      );

        // Initialiser addedToCart pour chaque produit
    this.produitsFiltres.forEach(produit => {
      produit.addedToCart = this.cartitem.some(item => item.product_id === produit.id);
    });
    });
}

  goToPreviousCategory() {
    const index = this.categories.indexOf(this.categorie);
    const prevIndex = (index - 1 + this.categories.length) % this.categories.length;
    this.router.navigate(['/user/menu', this.categories[prevIndex]]);
  }

  goToNextCategory() {
    const index = this.categories.indexOf(this.categorie);
    const nextIndex = (index + 1) % this.categories.length;
    this.router.navigate(['/user/menu', this.categories[nextIndex]]);
  }





  addToCart(produit: any) {
  // Vérifier si le produit est déjà dans le panier
  const cartEntry = this.cartitem.find(item => item.product_id === produit.id);

  if (cartEntry) {
    // Si existe déjà -> le retirer du panier
    this.cartService.removeFromCart(cartEntry.id).subscribe(
      () => {
        produit.addedToCart = false;
        this.cartitem = this.cartitem.filter(item => item.product_id !== produit.id);
        console.log('Produit retiré du panier:', produit);
      },
      (error) => console.error('Erreur lors du retrait du panier:', error)
    );
  } else {
    // Sinon -> l’ajouter au panier
    this.cartService.addToCart(produit.id).subscribe(
      (data: any) => {
        produit.addedToCart = true;
        console.log('Produit ajouté au panier:', produit);
      },
      (error: any) => console.error('Erreur lors de l\'ajout au panier', error)
    );
  }


}

}

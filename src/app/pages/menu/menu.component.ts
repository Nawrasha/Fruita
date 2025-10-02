import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
   // Récupère la catégorie depuis l'URL
    this.route.paramMap.subscribe(params => {
      this.categorie = params.get('categorie') || '';
      this.getProduits();
    });
  }

   getProduits() {
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
    produit.addedToCart = true;

}

}

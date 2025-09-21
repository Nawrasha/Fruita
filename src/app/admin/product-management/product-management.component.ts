import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {

  produits: any[] = [];

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.getProduits();
    this.loadProducts();
  }

  getProduits() {
    this.produitService.getProduits().subscribe(
      (data: any) => {
        this.produits = data as any[]; // récupération des produits depuis le serveur
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
      }
    );
  }

  loadProducts() {
    this.produitService.getProduits().subscribe(data => {
      this.produits = data as any[];
    });
  }

  deleteProduct(id: number) {
    if (confirm("Tu es sûr de vouloir supprimer ce produit ?")) {
      this.produitService.deleteProduit(id).subscribe(() => {
        // recharge la liste après suppression
        this.loadProducts();
      });
    }
  }

  selectedProduct: any = null;

  editProduct(produit: any) {
      this.selectedProduct = { ...produit }; // copie du produit
    }

  updateProduct() {
    this.produitService.updateProduit(this.selectedProduct.id, this.selectedProduct)
      .subscribe(() => {
        this.getProduits();
        this.selectedProduct = null; // fermer formulaire
      });
  }

  cancelEdit() {
    this.selectedProduct = null;
  }



  newProduct: any = {}; // objet pour le nouveau produit
  showAddModal: boolean = false;

  // Ouvrir le modal ajouter
  openAddModal() {
    this.newProduct = {}; // reset form
    this.showAddModal = true;
  }

  cancelAdd() {
    this.showAddModal = false;
  }

  addProduct(form: NgForm) {
    if (form.invalid) {
    // touche tous les champs pour afficher les messages
    Object.values(form.controls).forEach(control => control.markAsTouched());
    return;
      }
    this.produitService.addProduit(this.newProduct).subscribe({
      next: () => {
        this.getProduits();
        this.showAddModal = false;
      },
      error: (err: any) => console.error(err)
    });

  }




}

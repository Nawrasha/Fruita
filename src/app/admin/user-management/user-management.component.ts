import { Component, OnInit } from '@angular/core';
import { error } from 'console';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
userForm: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  users: any[] = [];

  getUsers() {
    this.userService.getUsers().subscribe(
      (data: any) => {
        this.users = data as any[]; // récupération des utilisateurs depuis le serveur
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }

  deleteUser(id: number) {
    if (confirm("Tu es sûr de vouloir supprimer cet utilisateur ?")) {
      this.userService.deleteUser(id).subscribe(() => {
        // recharge la liste après suppression
        this.getUsers();
      });
    }
  }

  selectedUser: any = null;
  
  editUser(user: any) {
      this.selectedUser = { ...user }; 
    }

  cancelEdit() {
    this.selectedUser = null;
  }   
  updateUser() {
    this.userService.updateUser(this.selectedUser.id, this.selectedUser)
      .subscribe(() => {
        this.getUsers();
        this.selectedUser = null; 
      });
  }

showAddModal = false;
newUser: any = {};

messageErreur: string = '';
messageSucces: string = '';

  addUser(form: any) {
    if (!form.valid) {
      alert("Formulaire invalide. Veuillez vérifier les champs.");
      return;
    }
    if (form.valid) {
      this.userService.addUser(this.newUser).subscribe({
        next: () => {
          this.getUsers();
          this.showAddModal = false;
          this.newUser = {};
        },
        error: (err) => {
          if (err.error && err.error.message) {
            this.messageErreur = err.error.message; // e.g. "Cet email est déjà utilisé"
          } else {
            this.messageErreur = "Erreur lors de l'ajout de l'utilisateur";
          }
          this.messageSucces = '';
        }
      });
    }
  }


  cancelAdd() {
    this.showAddModal = false;
    this.newUser = {};
  }

  openAddModal() {
    this.showAddModal = true;
  }

  motCle: string = '';
  
  rechercher() {    
    this.userService.rechercherUsers(this.motCle).subscribe(data => {
      this.users = data as any[];
    });
  }
}

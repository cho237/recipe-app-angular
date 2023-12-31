import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;
  collapsed = true;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;

      console.log(!!user);
      console.log(!user);

    });
  }
  onSaveData() {
    this.dataStorageService.storeRecipe();
  }
  onLogout(){
    this.authService.logout()
  }
  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}

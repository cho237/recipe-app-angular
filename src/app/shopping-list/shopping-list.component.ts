import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  providers: [],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  constructor(private shoppingListService: ShoppingListService) {}
  private igChangedSub: Subscription;

  ingredients: Ingredient[];
  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.igChangedSub =
      this.shoppingListService.ingredientsChanged.subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
      );
  }
  ngOnDestroy(): void {
    this.igChangedSub.unsubscribe();
  }
}

import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  reipeSelected = new EventEmitter<Recipe>();
  private recipes: Recipe[] = [
    new Recipe(
      'A test Recipe',
      'this is simply a test',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505',
      [new Ingredient('beans', 1), new Ingredient('fish', 2)]
    ),
    new Recipe(
      'Pizza',
      'Best Pizza ever',
      'https://static.toiimg.com/thumb/56933159.cms?imgsize=686279&width=800&height=800',
      [new Ingredient('meat', 7), new Ingredient('flour', 2)]
    ),
  ];

  constructor(private slService: ShoppingListService) {}
  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  getRecipe(index: number){
    return this.recipes[index];
  }
}

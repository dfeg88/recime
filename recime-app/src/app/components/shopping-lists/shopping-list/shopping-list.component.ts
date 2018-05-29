import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FlashMessagesService } from 'angular2-flash-messages';
import { RecipeService } from 'app/services/recipe.service';
import { Router } from '@angular/router';
import { Recipe, Ingredient, yields } from 'app/components/recipes/shared/recipe.model';
import { forEach } from '@angular/router/src/utils/collection';
import { ShoppingListService } from 'app/services/shopping-list.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  recipes: Recipe[] = [];
  shoppingListForm: FormGroup;
  servings = yields;

  constructor(
    private fb: FormBuilder,
    private flashMessage: FlashMessagesService,
    private recipeService: RecipeService,
    private shoppingListService: ShoppingListService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.getUserRecipes();
  }

  createForm() {
    this.shoppingListForm = this.fb.group({
      shoppingListName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      ingredients: this.fb.array([])
    });
  }

  clearShoppingList() {
    while (this.ingredients.length !== 0) {
      this.deleteIngredient(0);
    }
    this.ingredients.reset();
  }

  deleteIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  getUserRecipes() {
    this.recipeService.getRecipes()
      .subscribe(
        recipes => this.recipes = recipes,
        error => console.log(error)
      );
  }

  get ingredients(): FormArray {
    return this.shoppingListForm.get('ingredients') as FormArray;
  };

  setIngredients(ingredients: Ingredient[]) {
    const ingredientFGs = ingredients.map(ingredient => this.fb.group(ingredient));
    const ingredientFormArray = this.fb.array(ingredientFGs);
    this.shoppingListForm.setControl('ingredients', ingredientFormArray);
  }

  addRecipeIngredientsToShoppingList(ingredients) {
     for (const ingredient of ingredients) {
       this.ingredients.push(this.fb.group(ingredient));
     }
     this.resolveDuplicateIgredients();
  }

  resolveDuplicateIgredients() {
    for (const i of this.ingredients.value) {
      console.log(i);
    }
  }

  removeRecipeIngredientsToShoppingList(ingredients) {
    for (const ingredient of ingredients) {
      let index = 0;
      for (const formIngredient of this.ingredients.value) {
        if (ingredient._id === formIngredient._id) {
          this.ingredients.removeAt(index);
        } else {
          index++;
        }
      }
    }
  }

  onSubmit() {
    const shoppingList = this.shoppingListForm.value;
    console.log(shoppingList)

    this.shoppingListService.createShoppingList(shoppingList).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.message, {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/shopping-lists/my-shopping-lists']);
      } else {
        this.flashMessage.show(data.message, {cssClass: 'alert-danger', timeout: 3000});
      }
    });
  }

}

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Router } from '@angular/router';

import { FlashMessagesService } from 'angular2-flash-messages';
import {
  Recipe,
  Ingredient,
  measurements,
  categories,
  cuisines,
  yields
} from './../shared/recipe.model';
import { RecipeService } from './../../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  @Input() recipe;
  isLoading = true;
  errorMessage = '';

  recipeForm: FormGroup;
  measurements = measurements;
  cuisines = cuisines;
  categories = categories;
  servings = yields;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getRecipe();
  }

  ngOnDestroy() {}

  createForm() {
    this.recipeForm = this.fb.group({
      recipeName: '',
      category: '',
      servings: '',
      cuisine: '',
      prepTime: '',
      cookingTime: '',
      instructions: '',
      ingredients: this.fb.array([])
    });
  }

  setValues() {
    this.recipeForm.patchValue({
      recipeName: this.recipe.recipeName,
      category: this.recipe.category,
      servings: this.recipe.servings,
      cuisine: this.recipe.cuisine,
      prepTime: this.recipe.prepTime,
      cookingTime: this.recipe.cookingTime,
      instructions: this.recipe.instructions
    });
    this.setIngredients(this.recipe.ingredients);
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  setIngredients(ingredients: Ingredient[]) {
    // tslint:disable-next-line:no-shadowed-variable
    const ingredientFGs = ingredients.map(ingredients =>
      this.fb.group(ingredients)
    );
    const ingredientFormArray = this.fb.array(ingredientFGs);
    this.recipeForm.setControl('ingredients', ingredientFormArray);
  }

  addIngredient() {
    this.ingredients.push(this.fb.group(new Ingredient()));
  }

  resetIngredients() {
    while (this.ingredients.length > 1) {
      this.deleteIngredient(0);
    }
    this.ingredients.reset();
  }

  deleteIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  getRecipe() {
    this.recipeService
      .getRecipe(this.route.snapshot.paramMap.get('id'))
      .subscribe(
        (recipe: Recipe) => {
          this.recipe = recipe;
        },
        e => (this.errorMessage = e),
        () => {
          (this.isLoading = false), this.setValues();
        }
      );
  }

  onDeleteConfirm() {
    this.recipeService
      .deleteRecipe(this.route.snapshot.paramMap.get('id'))
      .subscribe(data => {
        if (data.success) {
          this.flashMessage.show('Recipe Deleted', {
            cssClass: 'alert-success',
            timeout: 2500
          });
          this.router.navigate(['recipes/my-recipes']);
        }
      });
  }

  onSubmit() {
    this.recipe = this.prepareSaveRecipe();
    this.recipeService
      .updateRecipe(this.recipe)
      .subscribe(data => {
        if (data.success) {
          this.flashMessage.show('Recipe Updated', {
            cssClass: 'alert-success',
            timeout: 2500
          });
          this.router.navigate(['/recipes/my-recipes']);
        }
      });
  }

  prepareSaveRecipe() {
    const formModel = this.recipeForm.value;

    const saveRecipe = {
      id: this.route.snapshot.paramMap.get('id'),
      recipeName: formModel.recipeName,
      category: formModel.category,
      servings: formModel.servings,
      cuisine: formModel.cuisine,
      prepTime: formModel.prepTime,
      cookingTime: formModel.cookingTime,
      instructions: formModel.instructions,
      ingredients: formModel.ingredients
    }
    return saveRecipe;
  }
}

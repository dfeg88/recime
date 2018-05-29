import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

import { Recipe, Ingredient, measurements, categories, cuisines, yields } from './../shared/recipe.model';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../../services/auth.service';
import {RecipeService} from '../../../services/recipe.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  recipeForm: FormGroup;
  measurements = measurements;
  cuisines = cuisines;
  categories = categories;
  servings = yields;
  recipeURL: string;

  constructor(
    private fb: FormBuilder,
    private flashMessage: FlashMessagesService,
    private recipeService: RecipeService,
    private router: Router
  ) { }

  createForm() {
    this.recipeForm = this.fb.group({
      recipeName: ['', Validators.required],
      category: ['', Validators.required],
      serving: ['', Validators.required],
      cuisine: ['', Validators.required],
      prepTime: '',
      cookingTime: '',
      instructions: '',
      ingredients: this.fb.array([])
    });
  }

  ngOnInit() {
    this.createForm();
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  };

  addIngredient(input) {
    const ingredientObj = {
      ingredientName: '',
      quantity: 0,
      measurement: ''
    };

    ingredientObj.quantity = input.replace(/\D/g, '');

    // ingredient name
    let ingredientName = input.replace(/[0-9]/g, '');
    ingredientName = ingredientName
                      .replace(/ *\b\S*?tsp\s|tbsp\s|g\s|pack\s|cup\s|ml\s|small\s|medium\s|large\s|kg\s|half\s|1⁄2\s\S*\b/g, '');
    ingredientName = ingredientName.replace(/^g\s/, '');
    ingredientName = ingredientName.replace('1⁄2', '');
    ingredientObj.ingredientName = ingredientName.trim();

    // quantity
    let splitText = input.replace(/[0-9]/g, '');
    splitText = splitText.replace(/[^0-9a-z-A-Z ]/g, '').trim().split(' ');
    const measurementOptions = ['tsp', 'tbsp', 'cup', 'ml', 'g', 'small', 'medium', 'large', 'kg', 'bunch', 'pack'];
    const measurement = splitText[0];

    // compare measurement from imported ingredient to list of measurements used by splitText
    // if match, set value
    if ((measurementOptions.indexOf(measurement) > -1)) {
      ingredientObj.measurement = measurement;
    }

    this.ingredients.push(this.fb.group(new Ingredient(ingredientObj.ingredientName, ingredientObj.quantity, ingredientObj.measurement)));
  }

  resetIngredients() {
    while (this.ingredients.length) {
      this.deleteIngredient(0);
    }
  }

  deleteIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  getImportedRecipe(url: string) {
    this.recipeService.importFromURL(url).subscribe(data => {
      if (data.success) {
        this.recipeForm.patchValue({
          recipeName: data.recipeDetails.recipeName,
          instructions: data.recipeDetails.instructions,
          prepTime: data.recipeDetails.prepTime,
          cookingTime: data.recipeDetails.cookingTime,
          serving: data.recipeDetails.serving,
          category: data.recipeDetails.category
        });
        this.setIngredients(data.recipeDetails.ingredients);
      }
    });
    this.recipeURL = ''
  }

  setIngredients(ingredients: Ingredient[]) {
    // tslint:disable-next-line:no-shadowed-variable
    const ingredientFGs = ingredients.map(ingredients =>
      this.fb.group(ingredients)
    );
    const ingredientFormArray = this.fb.array(ingredientFGs);
    this.recipeForm.setControl('ingredients', ingredientFormArray);
  }

  onSubmit() {
    const recipe = this.recipeForm.value;

    this.recipeService.addRecipe(recipe).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.message, {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/recipes/my-recipes']);
      } else {
        this.flashMessage.show(data.message, {cssClass: 'alert-danger', timeout: 3000});
      }
    });
  }

  isURLEntered() {
    if (this.recipeURL) {
      return true;
    }
    return false;
  }
}

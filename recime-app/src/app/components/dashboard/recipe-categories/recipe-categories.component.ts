import { ViewChild, Component, ElementRef, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

import { Recipe, categories } from './../../recipes/shared/recipe.model';
import { RecipeService } from '../../../services/recipe.service';

@Component({
  selector: 'app-recipe-categories',
  templateUrl: './recipe-categories.component.html',
  styleUrls: ['./recipe-categories.component.css']
})
export class RecipeCategoriesComponent implements OnInit {

  @ViewChild('donut') donut: ElementRef;
  recipes: Recipe[] = [];
  categories = categories.slice(1);
  breakfasts: number;
  lunches: number;
  dinners: number;
  snacks: number;

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.getRecipes();
  }

  loadRecipeCategoriesChart() {
    console.log(this.recipes.length);
    const donutCtx = this.donut.nativeElement.getContext('2d');
    const data = {
      labels: this.categories,
      datasets: [
        {
          data: [this.breakfasts, this.lunches, this.dinners, this.snacks],
          backgroundColor: [
            '#1fc8f8',
            '#76a346',
            '#e84118',
            '#40739e']
        }
      ]
    };

    const chart = new Chart(donutCtx, {
      type: 'doughnut',
      data: data,
      options: {
        cutoutPercentage: 40,
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }

  getRecipes() {
    this.recipeService
      .getRecipes()
      .subscribe(
        recipes => this.recipes = recipes,
        error => console.log(error),
        () => {
          this.getCategoryBreakdown();
          this.loadRecipeCategoriesChart();
        }
      );
  }

  getCategoryBreakdown() {
    const breakfasts = this.recipes.filter(recipe => recipe.category === 'Breakfast');
    const lunches = this.recipes.filter(recipe => recipe.category === 'Lunch');
    const dinners = this.recipes.filter(recipe => recipe.category === 'Dinner');
    const snacks = this.recipes.filter(recipe => recipe.category === 'Snack');

    this.breakfasts = breakfasts.length;
    this.lunches = lunches.length;
    this.dinners = dinners.length;
    this.snacks = snacks.length;
  }

}

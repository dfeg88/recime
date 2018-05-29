import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';

import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../../services/auth.service';
import {RecipeService} from '../../../services/recipe.service';
import { Recipe, categories } from './../shared/recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  animations: [
    trigger('recipeAnim', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: 'translateX(-50px)'}), {optional: true}),
        query(':enter', stagger('110ms', [
          animate('1000ms 20ms ease-out', style({opacity: 1, transform: 'translateX(0)'}))
        ]), {optional: true})
      ])
    ])
  ]
})

export class RecipeListComponent implements OnInit {

  @Input() recipes: Recipe[] = [];
  @Input() categories = categories;

  constructor(
    private flashMessage: FlashMessagesService,
    private recipeService: RecipeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUserRecipes();
  }

  goToCreateRecipe() {
    this.router.navigate(['recipes/create']);
  }

  getUserRecipes() {
    this.recipeService.getRecipes()
      .subscribe(
        recipes => this.recipes = recipes,
        error => console.log(error)
      );
  }

  goToDetail(id) {
    this.router.navigate(['/recipes/detail', id]);
  }

  onDeleteConfirm(id) {
    this.recipeService.deleteRecipe(id)
    .subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Recipe Deleted', {
          cssClass: 'alert-success',
          timeout: 2500
        });
        this.router.navigate(['recipes']);
      }
    });
  }

}

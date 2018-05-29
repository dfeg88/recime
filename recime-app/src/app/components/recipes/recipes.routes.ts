import { Routes } from '@angular/router';

import { RecipeComponent } from './recipe/recipe.component';
import { RecipesComponent } from './recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';

export const recipeRoutes: Routes = [
  {path: 'my-recipes', component: RecipeListComponent},
  {path: 'create', component: RecipeComponent},
  {path: 'detail/:id', component: RecipeDetailComponent}
];

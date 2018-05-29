import {Routes, RouterModule} from '@angular/router';

import { RecipesComponent } from './components/recipes/recipes.component';
import { ShoppingListsComponent } from './components/shopping-lists/shopping-lists.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RecipeComponent } from './components/recipes/recipe/recipe.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';

import { recipeRoutes } from './components/recipes/recipes.routes';
import { shoppingListRoutes } from './components/shopping-lists/shopping-lists.routes';
import { AuthGuard } from './services/auth-guard.guard';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'recipes', component: RecipesComponent, children: recipeRoutes, canActivate: [AuthGuard]},
  {path: 'shopping-lists', component: ShoppingListsComponent, children: shoppingListRoutes},
  {path: '**', component: PagenotfoundComponent}
]

export const routing = RouterModule.forRoot(appRoutes);

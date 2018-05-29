import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { RecipeService } from './services/recipe.service';

import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { RecipeComponent } from './components/recipes/recipe/recipe.component';
import { FooterComponent } from './components/footer/footer.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { RecipeListComponent } from './components/recipes/recipe-list/recipe-list.component';
import { GroceryListsComponent } from './components/grocery-lists/grocery-lists.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { routing } from './app.routing';
import { FilterPipe } from './filter.pipe';
import { Recipe } from './components/recipes/shared/recipe.model';
import { RecipeDetailComponent } from './components/recipes/recipe-detail/recipe-detail.component';
import { ShoppingListsComponent } from './components/shopping-lists/shopping-lists.component';
import { ShoppingListComponent } from './components/shopping-lists/shopping-list/shopping-list.component';
import { ShoppingListListComponent } from './components/shopping-lists/shopping-list-list/shopping-list-list.component';
import { ShoppingListService } from 'app/services/shopping-list.service';
import { ShoppingListDetailComponent } from './components/shopping-lists/shopping-list-detail/shopping-list-detail.component';
import { AuthGuard } from './services/auth-guard.guard';
import { RecipeCategoriesComponent } from './components/dashboard/recipe-categories/recipe-categories.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    RecipeComponent,
    FooterComponent,
    RecipesComponent,
    RecipeListComponent,
    GroceryListsComponent,
    PagenotfoundComponent,
    FilterPipe,
    RecipeDetailComponent,
    ShoppingListsComponent,
    ShoppingListComponent,
    ShoppingListListComponent,
    ShoppingListDetailComponent,
    RecipeCategoriesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    FlashMessagesModule
  ],
  providers: [ValidateService, AuthService, RecipeService, FlashMessagesService, ShoppingListService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

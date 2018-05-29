import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { Recipe, Ingredient } from './../components/recipes/shared/recipe.model';

@Injectable()
export class RecipeService {
  authToken: any;
  recipe: Recipe[];
  ingredient: Ingredient[];

  constructor(private http: Http) { }

  addRecipe(recipe) {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http
      .post('http://localhost:3000/recipes', recipe, { headers: headers })
      .map(res => res.json());
  }

  getRecipes() {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http
      .get('http://localhost:3000/recipes', { headers: headers })
      .map((response: Response) => {
        const recipes = response.json().recipes;
        return recipes;
      });
  }

  // GET /recipe/:id
  getRecipe(id: string) {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http
      .get(`http://localhost:3000/recipes/${id}`, { headers: headers })
      .map((response: Response) => {
        const recipe = response.json().recipe;
        return recipe;
      });
  }

  // DELETE /recipe/:id
  deleteRecipe(id: string) {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http
      .delete(`http://localhost:3000/recipes/${id}`, { headers: headers })
      .map(res => res.json());
  }

  // PATCH /recipe/:id
  updateRecipe(recipe) {
    console.log(recipe);
    const id = recipe._id;
    const headers = new Headers();

    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http
      .patch(`http://localhost:3000/recipes/${id}`, recipe, { headers: headers })
      .map(res => res.json());
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  // GET /import
  importFromURL(url: string) {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http
      .get(`http://localhost:3000/recipes/import/${url}`, { headers: headers })
      .map((response: Response) => {
        return response.json();
      });
  }
}



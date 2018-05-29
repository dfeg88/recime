import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { Recipe, Ingredient } from './../components/recipes/shared/recipe.model';
import { ShoppingList } from 'app/components/shopping-lists/shared/shopping-list.model';

@Injectable()
export class ShoppingListService {
  authToken: any;

  constructor(private http: Http) { }

  // POST
  createShoppingList(shoppingList) {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http
      .post('http://localhost:3000/shopping-lists', shoppingList, { headers: this.initHeaders() })
      .map(res => res.json());
  }

  // GET all
  getShoppingLists() {
    return this.http
      .get('http://localhost:3000/shopping-lists', { headers: this.initHeaders() })
      .map((response: Response) => {
        const shoppingLists = response.json().shoppingLists;
        return shoppingLists;
      });
  }

  // GET /:id
  getShoppingList(id: string) {
    return this.http
      .get(`http://localhost:3000/shopping-lists/${id}`, { headers: this.initHeaders() })
      .map((response: Response) => {
        const shoppingList = response.json().shoppingList;
        return shoppingList;
      }
    );
  }

  // DELETE/:id
  deleteShoppingList(id: string) {
    return this.http
    .delete(`http://localhost:3000/shopping-lists/${id}`, { headers: this.initHeaders() })
    .map(res => res.json());
  }

  loadToken() {
    this.authToken = localStorage.getItem('id_token');
  }

  initHeaders() {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return headers;
  }

}

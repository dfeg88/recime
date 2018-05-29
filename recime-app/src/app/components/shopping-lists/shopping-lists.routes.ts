import { Routes } from '@angular/router';

import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingListsComponent } from './shopping-lists.component';
import { ShoppingListListComponent } from './shopping-list-list/shopping-list-list.component';
import { ShoppingListDetailComponent } from './shopping-list-detail/shopping-list-detail.component';

export const shoppingListRoutes: Routes = [
  {path: 'my-shopping-lists', component: ShoppingListListComponent},
  {path: 'create', component: ShoppingListComponent},
  {path: 'my-shopping-lists', component: ShoppingListListComponent},
  {path: 'detail/:id', component: ShoppingListDetailComponent}
];

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';

import { FlashMessagesService } from 'angular2-flash-messages';

import { ShoppingListService } from '../../../services/shopping-list.service';
import { shoppingListRoutes } from 'app/components/shopping-lists/shopping-lists.routes';
import { ShoppingList } from '../shared/shopping-list.model';


@Component({
  selector: 'app-shopping-list-list',
  templateUrl: './shopping-list-list.component.html',
  styleUrls: ['./shopping-list-list.component.css'],
  animations: [
    trigger('shoppingListAnim', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: 'translateX(-50px)'}), {optional: true}),
        query(':enter', stagger('110ms', [
          animate('1000ms 20ms ease-out', style({opacity: 1, transform: 'translateX(0)'}))
        ]), {optional: true})
      ]),
    ]),
  ]
})

export class ShoppingListListComponent implements OnInit {

  shoppingLists: ShoppingListService[] = [];

  constructor(
    private shoppingListService: ShoppingListService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.getShoppingLists();
  }

  goToCreateSL() {
    this.router.navigate(['/shopping-lists/create']);
  }

  goToDetail(id: string) {
    this.router.navigate(['/shopping-lists/detail', id]);
  }

  getShoppingLists() {
    this.shoppingListService.getShoppingLists()
      .subscribe(
        shoppingLists => this.shoppingLists = shoppingLists,
        error => console.log(error),
        () => console.log(this.shoppingLists)
      );
  }

  deleteShoppingList(id: string, name: string) {
    const confirmMessage = confirm(`Are you sure you want to delete ${name}?`);

    if (confirmMessage) {
      this.shoppingListService.deleteShoppingList(id)
      .subscribe((data => {
        if (data.success) {
          this.flashMessage.show('Shopping List Deleted', {cssClass: 'alert-success', timeout: 2500});
          this.getShoppingLists();
        } else {
          this.flashMessage.show('Oops, something went wrong', {cssClass: 'alert-danger', timeout: 2500});
        }
      }));
    }
  }
}

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { FlashMessagesService } from 'angular2-flash-messages';

import {ShoppingList } from './../shared/shopping-list.model';
import { ShoppingListService } from './../../../services/shopping-list.service';

@Component({
  selector: 'app-shopping-list-detail',
  templateUrl: './shopping-list-detail.component.html',
  styleUrls: ['./shopping-list-detail.component.css']
})
export class ShoppingListDetailComponent implements OnInit {

  shoppingList: ShoppingList;
  errorMessage: any;

  constructor(
    private slService: ShoppingListService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    this.getShoppingList();
  }

  getShoppingList() {
    this.slService
      .getShoppingList(this.route.snapshot.paramMap.get('id'))
      .subscribe(
        (shoppingList: ShoppingList) => {
          this.shoppingList = shoppingList;
        },
        e => (this.errorMessage = e)
      );
  }

  orderChecklist(event) {
    console.log(event);
    console.log(this.shoppingList.ingredients);
  }

}

import { Ingredient } from '../../recipes/shared/recipe.model';

export class ShoppingList {
  constructor(
    public shoppingListName: string,
    public ingredients?: Ingredient[]
  ) {}
}

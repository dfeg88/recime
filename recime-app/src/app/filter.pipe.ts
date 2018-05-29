import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(recipes: any, term: any, category: any): any {
    // check if search term is undefined
    if (term === undefined && category === undefined) {
      return recipes;
    }

    return recipes.filter((recipe) => {
      if (term && !category) {
        return recipe.recipeName.toLowerCase().includes(term.toLowerCase());
      } else if (category && !term) {
        return recipe.category.toLowerCase().includes(category.toLowerCase());
      } else if (term && category) {
        return recipe.recipeName.toLowerCase().includes(term.toLowerCase())
            && recipe.category.toLowerCase().includes(category.toLowerCase());
      } else {
        return recipes;
      }
    });
  }

}

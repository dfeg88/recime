export class Recipe {
  constructor(
    public recipeName: string,
    public category: string,
    public servings: number,
    public cuisine: string,
    public prepTime?: number,
    public cookingTime?: number,
    public instructions?: string,
    public ingredients?: Ingredient[]
  ) {}
}

export class Ingredient {
  constructor(
    public ingredientName?: string,
    public quantity?: number,
    public measurement?: string
  ) {}
}

// Arrays for <select> lists
export const categories = ['', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

export const cuisines = [
  '',
  'American',
  'Asian',
  'British',
  'Caribbean',
  'Chinese',
  'French',
  'Greek',
  'Indian',
  'Italian',
  'Japanese',
  'Mediterranean',
  'Mexican',
  'Moroccan',
  'Spanish',
  'Thai',
  'Vietnamese'
];

export const measurements = ['', 'tsp', 'tbsp', 'cup', 'ml', 'g', 'small', 'medium', 'large', 'kg', 'bunch', 'pack'];

export const yields = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

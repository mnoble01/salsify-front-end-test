# salsify-front-end-test

#### Live Site
https://mnoble01.github.io/salsify-front-end-test/

#### Setup
`npm install`

#### Build
`gulp build`

#### Test
`gulp test`

#### Lint
`gulp lint`

#### Run
`gulp server`, on localhost:3000

#### Make changes
`gulp watch`

#### Deploy to GH Pages
`gulp deploy` to https://mnoble01.github.io/salsify-front-end-test/

# Development Notes

## Time Spent
About 7.5 hours

## Tour
- `src/`
  - `src/collections` contains all models and collections representing the `datastore`
  - `src/components` contains all React view components, save for the app outline component and React router, which are within `src/app.js`
  - `src/lib` contains the navigation menu, with links from the menu items to top-level content components
  - `src/index.html` is a very simple index file
  - `src/style.less` is where the css lives
- `test/` contains limited tests (see [below](#notes-and-thoughts))

## Notes (stream of consciousness while developing)

### Things I need to work on, as evidenced by this project
- React
  - I used React because I haven't used it much and I'd like to get better at it. This project probably would have taken less time if I had used Backbone, but I'm enjoying learning a new technology.
  - Therefore, I'm not sure I did things the "right" way here
- Testing
  - I have very limited experience with TDD/BDD except for in college during a few courses. This is something I'd like to get better at, and to be exposed to in my day-to-day.

### Notes and Thoughts
- Allow for a variable number of menu items in `src/lib/nav-links.js` in case this app is expanded
- Properties (i.e. `PropertyModels`) should know what types they can be, and allow others to access this information, hence the class properties
- You'll see the `titleize` function is used even in places where the data is always titleized. I find, if it's not too much of a burden, that being clear and consistent about your return values is important, even if it matches what's in the database (or `datastore.js` as the case may be).
- I could have split models into their own files, but since both Models and Collections are so small, and ES6 can export multiple values, I decided to leave them. Perhaps the folder `collections` could have been renamed.
- I think it's important for values to have a single point of truth, as shown by my class property values on the `OperatorModel.IDS` and `PropertyModel.TYPES`
- When overriding `Backbone.Collection.fetch` for each collection, I ignored then `option.success` method because I've found it's clearer to use the `jQuery.Deferred` callbacks everywhere.
- Every model gets a basic display method because I think a model should know how it wants to be represented in the general case. Maybe a better place for this would be a `ViewModel` or even a small React `Component`.
- Pseudo-code outline before writing code for form inputs:
```
    // if operatorId == CONTAINS
    //   show text input
    // if operatorId == GREATER_THAN, LESS_THAN
    //   show text input, number validation
    // if operatorId == NO_VALUE || ANY_VALUE
    //   hide propertyValue
    // if operatorId == EQUAL,
    //   if propertyValue == STRING, text input
    //   if propertyValue == NUMBER, text input, number validation
    //   if propertyValue == ENUM, select field
    // if operatorId == IS_ANY_OF
    //   if propertyValue == STRING, multiple text input
    //   if propertyValue == NUMBER, multiple text input, number validation
    //   if propertyValue == ENUM, multiselect field
```
- An `OperatorModel` should know how to compare its LHS and RHS. See `OperatorModel.compare`
- You'll see `typeof X === 'string'` in some places. It would have been a little more complicated to associate `ProductValueModels` with their `PropertyTypeModel`. Not too complicated, but enough to warrant not doing it for this small project.
- I was trying to make the `<select multiple>` input nicer than default html (for longer than I'd like to admit), but had a hard time finding a good `Component` with validation.


# Salsify Properties Types/Operators

Operators define the relationship between properties and property values. Certain operators are only valid for certain property types, operator behavior and valid operators for each property type are defined as follows:

| Operator | Description |
-----------|--------------
| Equals   | Value exactly matches |
| Is greater than | Value is greater than |
| Is less than  | Value is less than |
| Has any value | Value is present |
| Has no value  | Value is absent  |
| Is any of     | Value exactly matches one of several values |
| Contains      | Value contains the specified text |


| Property Type | Valid Operators |
---------------- | ----------------
| string | Equals |
| | Has any value |
| | Has no value |
| | Is any of |
| | Contains |
| number | Equals |
| | Is greater than |
| | Is less than |
| | Has any value |
| | Has no value |
| | Is any of |
| enumerated | equals |
| | Has any value |
| | Has no value |
| | Is any of |

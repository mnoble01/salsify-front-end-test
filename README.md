# salsify-front-end-test

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

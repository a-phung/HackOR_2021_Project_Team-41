# lookup-csv
A node module to quickly search and lookup rows from a CSV file using a JSON API.

An input CSV file is converted to an array of JSON objects using [treeize](https://www.npmjs.com/package/treeize). This is used to build a lookup table by specifying a coumn name as an index using [hasharray](https://www.npmjs.com/package/hasharray).

### Installation

Install module `npm i lookup-csv`

### Simple usage

For a given data.csv, ensure the first row contains the column names. Adding a `.` delimiter in the column names will nest the property in the JSON result

```csv
animal,type,sound.type,sound.pitch
cow,mammal,moo-moo,low
swiss cow,mammal,moo-moo,low
crow,bird,kaa-kaa,high
donkey,mammal,yee-haw,low
```

**Search a single column**

```js
const lookupCSV = require('lookup-csv');

// Create a lookup table using lookup column name to use from the csv data
const lookupTable = lookupCSV('./path/to/data.csv', 'animal')

// Get rows matching lookup value
matchingRows = lookupTable.get('cow')
// {
//     animal: 'cow',
//     type: 'mammal',
//     sound: {
//          type: 'moo-moo',
//          pitch: 'low'
//     }
// }
```

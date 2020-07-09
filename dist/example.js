const filter = require("./filter");
const customers = require('./data.json');

console.log(filter(customers, 'Berlin'));
console.log(filter(customers, { 'city': 'Mars' }));
console.log(filter(customers, { 'name': 'O', 'city': 'London' }));
console.log(filter(customers, { 'city': 's' }));
console.log(filter(customers, { 'city': 'B', 'city': 'L' }));
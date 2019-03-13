const filter = require(".")
const customers = require('./data.json')

console.log(filter(customers, 'Berlin' ))
console.log(filter(customers, {'city' : 'Marseille'} ))
console.log(filter(customers, {'name' : 'O', 'city' : 'London'}))
console.log(filter(customers, {'city' : 's'} ))
console.log(filter(customers, {'city' : 'B', 'city' : 'L'} ))
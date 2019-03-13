const filter = require("./");

const customers = [
  {"name" : "Alfreds Futterkiste", "city" : "Berlin"},
  {"name" : "Around the Horn", "city" : "London"},
  {"name" : "B's Beverages", "city" : "London"},
  {"name" : "Bolido Comidas preparadas", "city" : "Madrid"},
  {"name" : "Bon app", "city" : "Marseille"},
  {"name" : "Bottom-Dollar Marketse" ,"city" : "Tsawassen"},
  {"name" : "Cactus Comidas para llevar", "city" : "Buenos Aires", continent: {name: "America"}}
];

console.log(filter(customers, {'name' : 'O', 'city' : 'London'}, ))
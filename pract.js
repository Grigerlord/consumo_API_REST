let array = [
    {
        name: "Product 1",
        price: 1000,
        stock: 10,
    },
    {
        name: "Product 2",
        price: 2000,
        stock: 20,
    },
];

let solution = array.map(elem => elem.taxes = (elem.price * 19) / 100 )

console.log(solution);
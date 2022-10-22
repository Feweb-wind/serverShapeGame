let arr1 = [[0, 1], [1, 2], [3, 4]]
let arr2 = JSON.parse(JSON.stringify(arr1))
// let arr2 = arr1.slice(0)
console.log(arr2)
arr1[1][1] = 3
console.log(arr2)
console.log(arr1)
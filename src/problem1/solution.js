/** Provide 3 unique implementations of the following function in JavaScript.

**Input**: `n` - any integer

*Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

**Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.
 */

var sum_to_n_a = function (n) {
  // your code here
  // Using a simple loop
  let sum = 0;

  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};

var sum_to_n_b = function (n) {
  // your code here
  // using recursive technique

  if (n === 1) {
    return 1;
  }

  return n + sum_to_n_b(n - 1);
};

var sum_to_n_c = function (n) {
  // your code here
  // using mathematical formula

  return (n * (n + 1)) / 2;
};

var sum_to_n_d = function (n) {
  // your code here
  // Using array reduce method
  const idxNumbers = Array.from(new Array(n).keys()); // [0, 1, .. , n - 1]

  return idxNumbers.reduce((sum, current) => sum + current + 1, 0);
};

console.log("sum_to_n_a(5)", sum_to_n_a(5)); // sum_to_n_a(5) 15
console.log("sum_to_n_b(5)", sum_to_n_b(5)); // sum_to_n_b(5) 15
console.log("sum_to_n_c(5)", sum_to_n_c(5)); // sum_to_n_c(5) 15
console.log("sum_to_n_d(5)", sum_to_n_d(5)); // sum_to_n_d(5) 15

let input =
  "11 4 11 8 10 12 10 10 12 10 11 8 7 8 8 9 9 15 13 14 15 9 9 11 11 11 14 9 8 15 11 5 14 10 9 9 8 18 6 7 12 7 14 7 6 18 15 13 11 8 9 8 9 17 10 10 8 12 14 4 13 6 15 12 13 6 7 12 3 11 7 7 8 10 12 13 9 6 11 9 3 12 14 6 10 7 12 7 11 7 8 8 13 8 7 10 12 12 13 9";
input = input.split(" ");
arr = input;

for (let n in arr) {
  if (!result[n]) result[n] = 0;
  if (!result[arr[n]]) result[arr[n]] = 0;

  result[arr[n]] += 1;
}

console.log(result);

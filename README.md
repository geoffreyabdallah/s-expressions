# s-expressions
s-(ish)-expressions in JavaScript

```
npm install s-expressions
```

# Purpose
This library is meant to be a thought experiment in creating s-expressions and common higher order functions found in Clojure and other lisp dialects. The impetus of this library was creating something cool in JavaScript in 100 lines or less. This library enables the user to write JavaScript with prefix notation similar to Clojure:

Clojure:

```clojure
(map #(* % 2) (list 1 2 3)) ;; returns (2 4 6)
```

s-expressions.js:

```js
s(map, x => x * 2, s(seq, [1, 2, 3]))

/**
  returns * -- * -- *
          |    |    |
          2    4    6

  or: { value: 2, next: { value: 4, next: { value : 6, next: undefined } } }
**/
```

# What is an s-expression?

An s-expression is an unbalanced binary tree of data that is the backbone for Lisp programs. S-expressions represent any list of data, and Lisp programs specifically look at the first element of each one of these expressions as the operator - with every subsequent element recursively evaluated as operands (prefix notation). For example both of the following are valid s-expressions, with the latter only being a valid Lisp program:

```clojure
(1 2 3)
```
or:

```
  *
 / \
1   *
   / \
  2   *
     / \
    3  nil
```

```clojure
(+ 1 2)
```

or:

```
  *
 / \
+   *
   / \
  1   *
     / \
    2  nil
```

s-expressions and lisp programs can take s-expressions as elements as well:

```clojure
(+ 1 2 (+ 3 4)) ;; Evaluates to 10
```

or:

```
  *
 / \
+   *
   / \
  1   *
     / \
    2   *
       / \
      *  nil
     / \
    +   *
       / \
      3   *
         / \
        4  nil
```

You'll notice that the trees above look similar to linked lists - that's because they are!

```
* -- * -- * -- * -- nil
|    |    |    |
+    1    2    * -- * -- * -- *
               |    |    |    |
               +    3    4    nil
```

# General API

## Node

Takes a value and returns a node (a new list) to be used in a linked list:

```js
  let newNode = Node(1) // returns { value: 1, next: undefined };
```

## cons

Takes a node and appends it to the head of a list:

```js
  let node = Node(1) // returns { value: 1, next: undefined };
  let list = linkList(2, 3, 4) // returns  { value: 2, next: { value: 3, next: { value: 4, next: undefined} } };
  let newList = cons(node, list) // returns { value: 1, next: { value: 2, next: { value: 3, next: { value: 4, next: undefined} } } };
```

## first

Retrieves the value of the head of a list

```js
  let list = linkList(1, 2, 3);
  first(list) //returns 1;
```

## rest

Retrieves the tail of a list

```js
  let list = linkList(1, 2, 3);
  rest(list) //returns { value: 2, next: { value: 3, next: undefined} };
```

## linkList

Creates a linked list from an arbitrary number of arguments

```js
  let list = linkList(2, 3, 4) // returns  { value: 2, next: { value: 3, next: { value: 4, next: undefined} } };
```

## s

The backbone of this library, created with the above functions as well as a non-exposed curry and evaluate functions. s takes a form to be evaluated as an s-expression in the style of a lisp program (prefix notation). The first element (function) is taken and curried and then each other element is evaluated recursively and passed into the function. s can take nested s-expressions as well:

```js
s((x,y,z) => x+y+z, 1 2, s((a,b) => a*b, 3, 4)); //returns 15

Conceptual evaluation steps as follows:
s((a, b) => a * b, 3, 4)
  // (a, b) => a * b becomes a => b => a * b
  // first argument (3) passed in becomes 3 => b => 3 * b
  // second argument (4) passed in becomes 4 => 3 * 4 -> 12
s((x,y,z) => x+y+z, 1 2, 12)
  // (x, y, z) => x + y + z becomes x => y => z => x + y + z
  // first argument (1) passed in becomes 1 => y => z => 1 + y + z
  // second argument (2) passed in becomes 2 => z => 1 + 2 + z
  // third argument (12) passed in becomes 12 => 1 + 2 + 12 -> 15;

``` 

# Higher Order Functions API

The following higher order functions were created using the general api and s() wherever possible. For example the src of map:

```js
let map = (fn, list) => {
  let head = s(first, list);
  let tail = s(rest, list);
  return s(cons, s(Node, s(fn, head)), (tail ? s(map, fn, tail) : undefined));
};
```

## map

Takes a mapper function and a list. Returns a new list, where each element of the new list is the return value of the element passed into the function. The function supplied takes current element in the position of the list as its only parameter.

```js
s(map, x => x * 2, s(seq, [1, 2, 3])); //without s() invocation - map(x => x * 2, seq([1, 2, 3]))

/**
  returns * -- * -- *
          |    |    |
          2    4    6

  or: { value: 2, next: { value: 4, next: { value : 6, next: undefined } } }
**/
```

## filter

Takes a predicate function and a list. Returns a new list, where each element of the new list are those from the original list that passed the predicate test. Returns undefined if no values match the predicate test. The function supplied takes current element in the position of the list as its only parameter.

```js
let list = linkList(1, 2, 3, 4, 5);
s(filter, x => x % 2, list) //without s() invocation - filter(x => x % 2, list);
/**
  returns * -- * -- *
          |    |    |
          1    3    5

  or: { value: 1, next: { value: 3, next: { value : 5, next: undefined } } }
**/ 
```

## reduce

Takes a reducer function, an optional initial accumulator value and a list. Returns the final accumulator value. If no initial accumulator is supplied, defaults to the first value in the list. The function takes the accumulator and current element in the position of the list as its parameters.

```js
let list = linkList(1, 2, 3, 4, 5);
s(reduce, (accum, curr) => accum + curr, undefined, list;) //returns 15
//without s() invocation - reduce((accum, curr) => accum + curr, undefined, list);

s(reduce, (accum, curr) => accum + curr, 6, list); //returns 21
//without s() invocation - reduce((accum, curr) => accum + curr, 6, list);

```

## seq

Takes a an array or object and converts it to a list (if object is passed in, coverst to a list of [k, v] pairs);

```js
s(seq, [1, 2, 3]) //without s() invocation - seq([1,2,3]);
/**
  returns * -- * -- *
          |    |    |
          1    2    3

  or: { value: 1, next: { value: 2, next: { value : 3, next: undefined } } }
**/
s(seq, {a: 1, b: 2, c: 3}) //without s() invocation - seq({a: 1, b: 2, c: 3});
/**
  returns * ------- * ------- *
          |         |         | 
      ['a', 1]  ['b', 2]  ['c', 3]

  or: { value: ['a', 1], next: { value: ['b', 2], next: { value : ['c', 3], next: undefined } } }
**/
```

## into

Takes a list and converts it into an array or object (in which case a list of [k, v] pairs);

```js
s(into, [], s(map, x => x * 2, s(seq, [1, 2, 3]))) //returns [2, 4, 6]
//without s() invocation - into([], map(x => x * 2, seq([1, 2, 3])));

s(into, {}, s(map, ([k, v]) => [k, v * 2], s(seq, {a: 1, b: 2, c: 3}))) //returns {a: 2, b: 4, c: 6}
//without s() invocation - into({}, map(([k, v]) => [k, v * 2], seq({a: 1, b: 2, c: 3})));

```





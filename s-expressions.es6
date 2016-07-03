// 'use strict';
//create node for element of linked list
export let Node = value => ({ value, next: undefined});

//appends list onto a node - making node new head of list
export let cons = (node, list) => {
  node.next = list;
  return node;
};

//get the head (value) of the list
export let first = list => list.value;

//get the tail of the list
export let rest = list => list.next;

//create a linked list out of an arbitrary amount of arguments
export let linkList = (head, ...tail) => {
  let first = Node(head);
  return cons(first, (tail.length ? linkList.apply(null, tail) : undefined));
};

const curry = (fn, ...xs) => {
  return function(...ys) {
    const allArgs = xs.concat(ys);
    if (allArgs.length >= fn.length) return fn.apply(null, allArgs);
    return curry.apply(null, [fn].concat(allArgs));
  }
}

/****
  evaluate each element of the s-expression recursively
  passing each element as an argument into the function (first element of s-expression) to execute program
****/
let evaluate = (fn, list) => {
  let head = first(list);
  let tail = rest(list);
  return (tail ? evaluate(fn(head), tail) : fn(head));
};

/****
  create s expression from a list of arguments that will be immediately evaluated
  ie -  s((x,y,z) => x+y+z, 1, 2,
          s((a,b) => a*b, 3, 4))
  returns 15
****/
export let s = (...list) => {
  let expression = linkList.apply(null, list);
  if (first(expression).length < (list.length - 1)) throw new Error("Too many arguments supplied to function")
  if (first(expression).length > (list.length - 1)) throw new Error("Too few arguments supplied to function")
  let fn = curry(first(expression));
  return evaluate(fn, rest(expression));
};

//From hereon using s() when possible

//map funciton for linked list
export let map = (fn, list) => {
  let head = s(first, list);
  let tail = s(rest, list);
  return s(cons, s(Node, s(fn, head)), (tail ? s(map, fn, tail) : undefined));
};

//filter function for linked list
export let filter = (fn, list) => {
  if (list) {
    let head = s(first, list);
    let tail = s(rest, list);
    if (s(fn, head)) return s(cons, s(Node, head), s(filter, fn, tail));
    if (tail) return s(filter, fn, tail);
  }
};

//reduce function for linked list
export let reduce = (fn, accum, list, index) => {
  let i = index || 0;
  let head = s(first, list);
  let tail = s(rest, list);
  let next = (i === 0 && accum === undefined) ? head : s(fn, accum, head);
  return (tail ? s(reduce, fn, next, tail, (i + 1)) : next);
};

//creates a linked list out of an array or obj so they can be passed into the higher order functions above 
export let seq = arrayOrObj => {
  if (s(Array.isArray, arrayOrObj)) return linkList.apply(null, arrayOrObj);
  if (arrayOrObj && typeof arrayOrObj === 'object') return s(seq, s(reduce, (listOfTuples, key) => {
    listOfTuples.push([key, arrayOrObj[key]]);
    return listOfTuples;
  }, [], s(seq, s(Object.keys, arrayOrObj)), 0));
  throw new TypeError("Invalid data structure provided, must pass array or object into seq");
};

//turns linked list back into JS array or obj
export let into = (arrayOrObj, list) => {
  if (s(Array.isArray, arrayOrObj)) return s(reduce, (arrayOrObj, value) => {
    arrayOrObj.push(value);
    return arrayOrObj;
  }, [], list, 0);
  if (arrayOrObj && typeof arrayOrObj === 'object') return s(reduce, (arrayOrObj, tuple) => {
    let [key, value] = tuple;
    arrayOrObj[key] = value;
    return arrayOrObj;
  }, {}, list, 0);
  throw new TypeError("Invalid data structure provided, must pass array or object as first argument of into");
};


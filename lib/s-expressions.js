'use strict'
//create node for element of linked list
;

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var node = exports.node = function node(value) {
  return { value: value, next: undefined };
};

//appends list onto a node - making node new head of list
var cons = exports.cons = function cons(node, list) {
  node.next = list;
  return node;
};

//get the head (value) of the list
var first = exports.first = function first(list) {
  return list.value;
};

//get the tail of the list
var rest = exports.rest = function rest(list) {
  return list.next;
};

//create a linked list out of an arbitrary amount of arguments
var linkList = exports.linkList = function linkList(head) {
  for (var _len = arguments.length, tail = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    tail[_key - 1] = arguments[_key];
  }

  var first = node(head);
  return cons(first, tail.length ? linkList.apply(null, tail) : undefined);
};

//not a proper curry - but good enough for what we need for the s expression eval
var curry = function curry(fn) {
  return function (arg) {
    if (fn.length > 1) return curry(fn.bind(fn, arg));
    return fn(arg);
  };
};

/****
  evaluate each element of the s-expression recursively
  passing each element as an argument into the function (first element of s-expression) to execute program
****/
var evaluate = function evaluate(fn, list) {
  var head = first(list);
  var tail = rest(list);
  return tail ? evaluate(fn(head), tail) : fn(head);
};

/****
  create s expression from a list of arguments that will be immediately evaluated
  ie -  s((x,y,z) => x+y+z, 1, 2,
          s((a,b) => a*b, 3, 4))
  returns 15
****/
var s = exports.s = function s() {
  for (var _len2 = arguments.length, list = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    list[_key2] = arguments[_key2];
  }

  var expression = linkList.apply(null, list);
  if (first(expression).length < list.length - 1) throw new Error("Too many arguments supplied to function");
  if (first(expression).length > list.length - 1) throw new Error("Too few arguments supplied to function");
  var fn = curry(first(expression));
  return evaluate(fn, rest(expression));
};

//From hereon using s() when possible

//map funciton for linked list
var map = exports.map = function map(fn, list) {
  var head = s(first, list);
  var tail = s(rest, list);
  return s(cons, s(node, s(fn, head)), tail ? s(map, fn, tail) : undefined);
};

//filter function for linked list
var filter = exports.filter = function filter(fn, list) {
  if (list) {
    var head = s(first, list);
    var tail = s(rest, list);
    if (s(fn, head)) return s(cons, s(node, head), s(filter, fn, tail));
    if (tail) return s(filter, fn, tail);
  }
};

//reduce function for linked list
var reduce = exports.reduce = function reduce(fn, accum, list) {
  var head = s(first, list);
  var tail = s(rest, list);
  var next = accum ? s(fn, accum, head) : head;
  return tail ? s(reduce, fn, next, tail) : next;
};

//creates a linked list out of an array or obj so they can be passed into the higher order functions above
var seq = exports.seq = function seq(arrayOrObj) {
  if (s(Array.isArray, arrayOrObj)) return linkList.apply(null, arrayOrObj);
  if (arrayOrObj && (typeof arrayOrObj === "undefined" ? "undefined" : _typeof(arrayOrObj)) === 'object') return s(seq, s(reduce, function (listOfTuples, key) {
    listOfTuples.push([key, arrayOrObj[key]]);
    return listOfTuples;
  }, [], s(seq, s(Object.keys, arrayOrObj))));
  throw new TypeError("Invalid data structure provided, must pass array or object into seq");
};

//turns linked list back into JS array or obj
var into = exports.into = function into(arrayOrObj, list) {
  if (s(Array.isArray, arrayOrObj)) return s(reduce, function (arrayOrObj, value) {
    arrayOrObj.push(value);
    return arrayOrObj;
  }, [], list);
  if (arrayOrObj && (typeof arrayOrObj === "undefined" ? "undefined" : _typeof(arrayOrObj)) === 'object') return s(reduce, function (arrayOrObj, tuple) {
    var _tuple = _slicedToArray(tuple, 2);

    var key = _tuple[0];
    var value = _tuple[1];

    arrayOrObj[key] = value;
    return arrayOrObj;
  }, {}, list);
  throw new TypeError("Invalid data structure provided, must pass array or object as first argument of into");
};
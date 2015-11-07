'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _sExpressions = require('../lib/s-expressions');

var expect = require('chai').expect;

describe('first', function () {

  it('should give the value of head of a list list', function () {
    var list = (0, _sExpressions.linkList)(1, 2, 3, 4, 5);
    expect((0, _sExpressions.first)(list)).to.equal(1);
  });
});

describe('rest', function () {

  it('should give the tail of a list', function () {
    var list = (0, _sExpressions.linkList)(2, 3, 4, 5);
    var newList = (0, _sExpressions.cons)((0, _sExpressions.Node)(1), list);
    expect((0, _sExpressions.rest)(newList)).to.equal(list);
  });
});

describe('linkList', function () {

  it('should convert an arbitrary number of arguments into a linked list', function () {
    var list = (0, _sExpressions.linkList)(1, 2, 3, 4, 5);

    var _reduce = [1, 2, 3, 4, 5].reduce(function (_ref, elem) {
      var _ref2 = _slicedToArray(_ref, 2);

      var bool = _ref2[0];
      var nextList = _ref2[1];

      return [elem === (0, _sExpressions.first)(nextList), (0, _sExpressions.rest)(nextList)];
    }, [false, list]);

    var _reduce2 = _slicedToArray(_reduce, 1);

    var result = _reduce2[0];

    expect(result).to.equal(true);
  });
});

describe('cons', function () {

  it('should take a node and prepend it to a list', function () {
    var list = (0, _sExpressions.linkList)(2, 3, 4, 5);
    var newList = (0, _sExpressions.cons)((0, _sExpressions.Node)(1), list);
    var head = (0, _sExpressions.first)(newList);
    var tail = (0, _sExpressions.rest)(newList);
    expect(head).to.equal(1);
    expect(tail).to.equal(list);
  });
});

describe('s', function () {

  it('should turn an arbitrary number of arguments into an s expression and evaluate them (prefix)', function () {
    expect((0, _sExpressions.s)(function (x, y, z) {
      return x + y + z;
    }, 1, 2, (0, _sExpressions.s)(function (a, b) {
      return a * b;
    }, 3, 4))).to.equal(15);
    expect((0, _sExpressions.s)(_sExpressions.reduce, function (x, y) {
      return x + y;
    }, undefined, (0, _sExpressions.s)(_sExpressions.filter, function (x) {
      return x === 4 || x === 10;
    }, (0, _sExpressions.s)(_sExpressions.map, function (x) {
      return x * 2;
    }, (0, _sExpressions.linkList)(1, 2, 3, 4, 5))))).to.equal(14);
  });
});

describe('map', function () {

  it('should map over a list, apply a function, and return a new list with the new values', function () {
    var list = (0, _sExpressions.linkList)(1, 2, 3, 4, 5);
    var mapper = function mapper(x) {
      return x * 2;
    };
    var mapped = (0, _sExpressions.map)(mapper, list);

    var _reduce3 = [2, 4, 6, 8, 10].reduce(function (_ref3, elem) {
      var _ref4 = _slicedToArray(_ref3, 2);

      var bool = _ref4[0];
      var nextList = _ref4[1];

      return [elem === mapper((0, _sExpressions.first)(nextList)), (0, _sExpressions.rest)(nextList)];
    }, [false, list]);

    var _reduce4 = _slicedToArray(_reduce3, 1);

    var result = _reduce4[0];

    expect(result).to.equal(true);
  });
});

describe('filter', function () {

  it('should filter through a list, returning a new list with all elements that pass the predicate', function () {
    var list = (0, _sExpressions.linkList)(1, 2, 3, 4, 5);
    var filtered = (0, _sExpressions.filter)(function (x) {
      return x % 2;
    }, list);

    var _reduce5 = [1, 3, 5].reduce(function (_ref5, elem) {
      var _ref6 = _slicedToArray(_ref5, 2);

      var bool = _ref6[0];
      var nextList = _ref6[1];

      return [elem === (0, _sExpressions.first)(nextList), (0, _sExpressions.rest)(nextList)];
    }, [false, filtered]);

    var _reduce6 = _slicedToArray(_reduce5, 1);

    var result = _reduce6[0];

    expect(result).to.equal(true);
  });
});

describe('reduce', function () {

  it('should apply a function to the previous and next element of a list, or if an inital value is given, the inital will be set as the first value to accumulate to', function () {
    var list = (0, _sExpressions.linkList)(1, 2, 3, 4, 5);
    expect((0, _sExpressions.reduce)(function (x, y) {
      return x + y;
    }, undefined, list)).to.equal(15);
    expect((0, _sExpressions.reduce)(function (x, y) {
      return x + y;
    }, 6, list)).to.equal(21);
  });
});

describe('seq', function () {

  it('should turn an array into a list', function () {
    var list = (0, _sExpressions.seq)([1, 2, 3, 4, 5]);

    var _reduce7 = [1, 2, 3, 4, 5].reduce(function (_ref7, elem) {
      var _ref8 = _slicedToArray(_ref7, 2);

      var bool = _ref8[0];
      var nextList = _ref8[1];

      return [elem === (0, _sExpressions.first)(nextList), (0, _sExpressions.rest)(nextList)];
    }, [false, list]);

    var _reduce8 = _slicedToArray(_reduce7, 1);

    var result = _reduce8[0];

    expect(result).to.equal(true);
  });

  it('should turn an object into a list of key value pairs', function () {
    var list = (0, _sExpressions.seq)({ a: '1', b: '2' });

    var _reduce9 = [['a', '1'], ['b', '2']].reduce(function (_ref9, _ref10) {
      var _ref12 = _slicedToArray(_ref9, 2);

      var bool = _ref12[0];
      var nextList = _ref12[1];

      var _ref11 = _slicedToArray(_ref10, 2);

      var k = _ref11[0];
      var v = _ref11[1];

      var _first = (0, _sExpressions.first)(nextList);

      var _first2 = _slicedToArray(_first, 2);

      var listKey = _first2[0];
      var listValue = _first2[1];

      return [k === listKey && v === listValue, (0, _sExpressions.rest)(nextList)];
    }, [false, list]);

    var _reduce10 = _slicedToArray(_reduce9, 1);

    var result = _reduce10[0];

    expect(result).to.equal(true);
  });
});

describe('into', function () {

  it('should turn an list into an array', function () {
    var array = (0, _sExpressions.into)([], (0, _sExpressions.linkList)(1, 2, 3, 4, 5));
    var resultArray = [1, 2, 3, 4, 5];
    var result = resultArray.every(function (num, index) {
      return num === array[index];
    }) && array.length === resultArray.length;
    expect(result).to.equal(true);
  });

  it('should turn an list of key value pairs into an object', function () {
    var obj = (0, _sExpressions.into)({}, (0, _sExpressions.linkList)(['a', 1], ['b', 2]));
    var testObj = { a: 1, b: 2 };
    var result = Object.keys(obj).every(function (key) {
      return testObj[key] === obj[key];
    }) && Object.keys(obj).length === Object.keys(testObj).length;
    expect(result).to.equal(true);
    expect(result).to.equal(true);
  });
});
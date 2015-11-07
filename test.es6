'use strict';

import {
  node,
  first,
  rest,
  linkList,
  cons,
  s,
  map,
  filter,
  reduce,
  seq,
  into } from '../lib/s-expressions';
var expect = require('chai').expect;

describe('first', function(){

  it('should give the value of head of a list list', function(){
    let list = linkList(1, 2, 3, 4, 5);
    expect(first(list)).to.equal(1);
  });

});

describe('rest', function(){

  it('should give the tail of a list', function(){
    let list = linkList(2, 3, 4, 5);
    let newList = cons(node(1), list);
    expect(rest(newList)).to.equal(list);
  });

});

describe('linkList', function(){

  it('should convert an arbitrary number of arguments into a linked list', function(){
    let list = linkList(1, 2, 3, 4, 5);
    let [ result ] = [1,2,3,4,5].reduce(([bool, nextList], elem) => {
      return [elem === first(nextList), rest(nextList)];
    }, [false, list]);
    expect(result).to.equal(true);
  });

});

describe('cons', function(){

  it('should take a node and prepend it to a list', function(){
    let list = linkList(2,3,4,5);
    let newList = cons(node(1), list);
    let head = first(newList);
    let tail = rest(newList);
    expect(head).to.equal(1);
    expect(tail).to.equal(list);
  });
  
});

describe('s', function(){

  it('should turn an arbitrary number of arguments into an s expression and evaluate them (prefix)', function(){
    expect(s((x, y, z) => x + y + z, 1, 2, s((a, b) => a * b, 3, 4))).to.equal(15);
    expect(s(reduce,
      (x, y) => x + y,
      undefined,
      s(filter,
        x => (x === 4 || x === 10),
        s(map, x => x * 2, linkList(1, 2, 3, 4, 5))
      )
    )).to.equal(14);
  });

});

describe('map', function(){

  it('should map over a list, apply a function, and return a new list with the new values', function(){
    let list = linkList(1, 2, 3, 4, 5);
    let mapper = x => x * 2;
    let mapped = map(mapper, list);
    let [ result ] = [2, 4, 6, 8, 10].reduce(([bool, nextList], elem) => {
      return [elem === mapper(first(nextList)), rest(nextList)];
    }, [false, list]);
    expect(result).to.equal(true);
  });

});

describe('filter', function(){

  it('should filter through a list, returning a new list with all elements that pass the predicate', function(){
    let list = linkList(1, 2, 3, 4, 5);
    let filtered = filter(x => x % 2, list);
    let [ result ] = [1, 3, 5].reduce(([bool, nextList], elem) => {
      return [elem === first(nextList), rest(nextList)];
    }, [false, filtered]);
    expect(result).to.equal(true);
  });

});

describe('reduce', function(){

  it('should apply a function to the previous and next element of a list, or if an inital value is given, the inital will be set as the first value to accumulate to', function(){
    let list = linkList(1, 2, 3, 4, 5);
    expect(reduce((x, y) => x + y, undefined, list)).to.equal(15);
    expect(reduce((x, y) => x + y, 6, list)).to.equal(21);
  });

});

describe('seq', function(){

  it('should turn an array into a list', function(){
    let list = seq([1,2,3,4,5]);
    let [ result ] = [1,2,3,4,5].reduce(([bool, nextList], elem) => {
      return [elem === first(nextList), rest(nextList)];
    }, [false, list]);
    expect(result).to.equal(true);
  });

  it('should turn an object into a list of key value pairs', function(){
    let list = seq({a: '1', b: '2'});
    let [ result ] = [['a', '1'], ['b', '2']].reduce(([bool, nextList], [k, v]) => {
      let [listKey, listValue] = first(nextList)
      return [(k === listKey && v === listValue), rest(nextList)];
    }, [false, list]);
    expect(result).to.equal(true);
  });

});

describe('into', function(){

  it('should turn an list into an array', function(){
    let array = into([], linkList(1,2,3,4,5));
    let resultArray = [1,2,3,4,5]
    let result = (
      resultArray.every((num, index) => num === array[index]) &&
      array.length === resultArray.length
    );
    expect(result).to.equal(true);
  });

  it('should turn an list of key value pairs into an object', function(){
    let obj = into({}, linkList(['a', 1],['b', 2]));
    let testObj = {a: 1, b: 2};
    let result = (
      Object.keys(obj).every(key => testObj[key] === obj[key]) &&
      Object.keys(obj).length === Object.keys(testObj).length
    );
    expect(result).to.equal(true);
    expect(result).to.equal(true);
  });

});


// Copied from https://github.com/peerigon/angular-expressions/blob/master/lib/parse.js

/* remove eslint errors to see if there is something really wrong */
/*eslint quotes: [0]*/
/*eslint indent: [0]*/
/*eslint vars-on-top: [0]*/
/*eslint yoda: 0*/
/*eslint curly: 0*/
/*eslint no-implicit-coercion: 0*/
/*eslint newline-after-var: 0*/
/*eslint space-before-function-paren: 0*/
/*eslint block-spacing: 0*/
/*eslint brace-style: 0*/
/*eslint complexity: 0*/
/*eslint one-var: 0*/
/*eslint eqeqeq: 0*/
/*eslint object-curly-spacing: 0*/
/*eslint quote-props: 0*/
/*eslint key-spacing: 0*/
/*eslint valid-jsdoc: 0*/
/*eslint func-style: 0*/
/*eslint no-nested-ternary: 0*/
/*eslint operator-linebreak: 0*/
/*eslint no-multi-spaces: 0*/
/*eslint no-constant-condition: 0*/
/*eslint comma-spacing: 0*/
/*eslint no-else-return: 0*/
/*eslint no-warning-comments: 0*/
/*eslint default-case: 0*/
/*eslint consistent-return: 0*/
/*eslint no-undefined: 0*/
/*eslint no-new-func: 0*/
/*eslint max-nested-callbacks: 0*/
/*eslint padded-blocks: 0*/
/*eslint no-self-compare: 0*/
/*eslint no-multiple-empty-lines: 0*/
/*eslint no-new: 0*/
/*eslint no-unused-vars: 0*/
"use strict";

var _window_ = window || { document: {} };

/* We need to tell ESLint what variables are being exported */
/* exported
  angular,
  msie,
  jqLite,
  jQuery,
  slice,
  splice,
  push,
  toString,
  ngMinErr,
  angularModule,
  uid,
  REGEX_STRING_REGEXP,
  VALIDITY_STATE_PROPERTY,

  lowercase,
  uppercase,
  manualLowercase,
  manualUppercase,
  nodeName_,
  isArrayLike,
  forEach,
  forEachSorted,
  reverseParams,
  nextUid,
  setHashKey,
  extend,
  toInt,
  inherit,
  merge,
  noop,
  identity,
  valueFn,
  isUndefined,
  isDefined,
  isObject,
  isBlankObject,
  isString,
  isNumber,
  isNumberNaN,
  isDate,
  isArray,
  isFunction,
  isRegExp,
  isWindow,
  isScope,
  isFile,
  isFormData,
  isBlob,
  isBoolean,
  isPromiseLike,
  trim,
  escapeForRegexp,
  isElement,
  makeMap,
  includes,
  arrayRemove,
  copy,
  equals,
  csp,
  jq,
  concat,
  sliceArgs,
  bind,
  toJsonReplacer,
  toJson,
  fromJson,
  convertTimezoneToLocal,
  timezoneToOffset,
  startingTag,
  tryDecodeURIComponent,
  parseKeyValue,
  toKeyValue,
  encodeUriSegment,
  encodeUriQuery,
  angularInit,
  bootstrap,
  getTestability,
  snake_case,
  bindJQuery,
  assertArg,
  assertArgFn,
  assertNotHasOwnProperty,
  getter,
  getBlockNodes,
  hasOwnProperty,
  createMap,
  stringify,

  NODE_TYPE_ELEMENT,
  NODE_TYPE_ATTRIBUTE,
  NODE_TYPE_TEXT,
  NODE_TYPE_COMMENT,
  NODE_TYPE_DOCUMENT,
  NODE_TYPE_DOCUMENT_FRAGMENT
*/

////////////////////////////////////

/**
 * @ngdoc module
 * @name ng
 * @module ng
 * @installation
 * @description
 *
 * # ng (core module)
 * The ng module is loaded by default when an AngularJS application is started. The module itself
 * contains the essential components for an AngularJS application to function. The table below
 * lists a high level breakdown of each of the services/factories, filters, directives and testing
 * components available within this core module.
 *
 * <div doc-module-components="ng"></div>
 */

var NODE_TYPE_ELEMENT = 1;
var NODE_TYPE_ATTRIBUTE = 2;
var NODE_TYPE_TEXT = 3;
var NODE_TYPE_COMMENT = 8;
var NODE_TYPE_DOCUMENT = 9;
var NODE_TYPE_DOCUMENT_FRAGMENT = 11;
var REGEX_STRING_REGEXP = /^\/(.+)\/([a-z]*)$/;

// The name of a form control's ValidityState property.
// This is used so that it's possible for internal tests to create mock ValidityStates.
var VALIDITY_STATE_PROPERTY = "validity";

var hasOwnProperty = Object.prototype.hasOwnProperty;

var lowercase = function(string) {
	return isString(string) ? string.toLowerCase() : string;
};
var uppercase = function(string) {
	return isString(string) ? string.toUpperCase() : string;
};

/**
 * @ngdoc function
 * @name angular.isArray
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is an `Array`.
 *
 */
var isArray = Array.isArray;

var ngAttrPrefixes = ["ng-", "data-ng-", "ng:", "x-ng-"];

var manualLowercase = function(s) {
	/* eslint-disable no-bitwise */
	return isString(s)
		? s.replace(/[A-Z]/g, function(ch) {
				return String.fromCharCode(ch.charCodeAt(0) | 32);
		  })
		: s;
	/* eslint-enable */
};
var manualUppercase = function(s) {
	/* eslint-disable no-bitwise */
	return isString(s)
		? s.replace(/[a-z]/g, function(ch) {
				return String.fromCharCode(ch.charCodeAt(0) & ~32);
		  })
		: s;
	/* eslint-enable */
};

// String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
// locale, for this reason we need to detect this case and redefine lowercase/uppercase methods
// with correct but slower alternatives. See https://github.com/angular/angular.js/issues/11387
if ("i" !== "I".toLowerCase()) {
	lowercase = manualLowercase;
	uppercase = manualUppercase;
}

var msie, // holds major version number for IE, or NaN if UA is not IE.
	jqLite, // delay binding since jQuery could be loaded after us.
	jQuery, // delay binding
	slice = [].slice,
	splice = [].splice,
	push = [].push,
	// toString = Object.prototype.toString,
	getPrototypeOf = Object.getPrototypeOf,
	// ngMinErr = minErr("ng"),
	/** @name angular */
	// angular = window.angular || (window.angular = {}),
	// angularModule,
	uid = 0;

/**
 * private
 * param {*} obj
 * return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
 *                   String ...)
 */
function isArrayLike(obj) {
	// `null`, `undefined` and `window` are not array-like
	if (obj == null || isWindow(obj)) return false;

	// arrays, strings and jQuery/jqLite objects are array like
	// * jqLite is either the jQuery or jqLite constructor function
	// * we have to check the existence of jqLite first as this method is called
	//   via the forEach method when constructing the jqLite object in the first place
	if (isArray(obj) || isString(obj) || (jqLite && obj instanceof jqLite))
		return true;

	// Support: iOS 8.2 (not reproducible in simulator)
	// "length" in obj used to prevent JIT error (gh-11508)
	var length = "length" in Object(obj) && obj.length;

	// NodeList objects (with `item` method) and
	// other objects with suitable length characteristics are array-like
	return (
		isNumber(length) &&
		((length >= 0 && (length - 1 in obj || obj instanceof Array)) ||
			typeof obj.item === "function")
	);
}

/**
 * @ngdoc function
 * @name angular.forEach
 * @module ng
 * @kind function
 *
 * @description
 * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
 * object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`
 * is the value of an object property or an array element, `key` is the object property key or
 * array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.
 *
 * It is worth noting that `.forEach` does not iterate over inherited properties because it filters
 * using the `hasOwnProperty` method.
 *
 * Unlike ES262's
 * [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18),
 * providing 'undefined' or 'null' values for `obj` will not throw a TypeError, but rather just
 * return the value provided.
 *
   ```js
     var values = {name: 'misko', gender: 'male'};
     var log = [];
     angular.forEach(values, function(value, key) {
       this.push(key + ': ' + value);
     }, log);
     expect(log).toEqual(['name: misko', 'gender: male']);
   ```
 *
 * param {Object|Array} obj Object to iterate over.
 * param {Function} iterator Iterator function.
 * param {Object=} context Object to become context (`this`) for the iterator function.
 * returns {Object|Array} Reference to `obj`.
 */

function forEach(obj, iterator, context) {
	var key, length;
	if (obj) {
		if (isFunction(obj)) {
			for (key in obj) {
				if (
					key !== "prototype" &&
					key !== "length" &&
					key !== "name" &&
					obj.hasOwnProperty(key)
				) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		} else if (isArray(obj) || isArrayLike(obj)) {
			var isPrimitive = typeof obj !== "object";
			for (key = 0, length = obj.length; key < length; key++) {
				if (isPrimitive || key in obj) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		} else if (obj.forEach && obj.forEach !== forEach) {
			obj.forEach(iterator, context, obj);
		} else if (isBlankObject(obj)) {
			// createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
			// eslint-disable-next-line guard-for-in
			for (key in obj) {
				iterator.call(context, obj[key], key, obj);
			}
		} else if (typeof obj.hasOwnProperty === "function") {
			// Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		} else {
			// Slow path for objects which do not have a method `hasOwnProperty`
			for (key in obj) {
				if (hasOwnProperty.call(obj, key)) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		}
	}
	return obj;
}

function forEachSorted(obj, iterator, context) {
	var keys = Object.keys(obj).sort();
	for (var i = 0; i < keys.length; i++) {
		iterator.call(context, obj[keys[i]], keys[i]);
	}
	return keys;
}

/**
 * when using forEach the params are value, key, but it is often useful to have key, value.
 * param {function(string, *)} iteratorFn
 * returns {function(*, string)}
 */
function reverseParams(iteratorFn) {
	return function(value, key) {
		iteratorFn(key, value);
	};
}

/**
 * A consistent way of creating unique IDs in angular.
 *
 * Using simple numbers allows us to generate 28.6 million unique ids per second for 10 years before
 * we hit number precision issues in JavaScript.
 *
 * Math.pow(2,53) / 60 / 60 / 24 / 365 / 10 = 28.6M
 *
 * returns {number} an unique alpha-numeric string
 */
function nextUid() {
	return ++uid;
}

/**
 * Set or clear the hashkey for an object.
 * param obj object
 * param h the hashkey (!truthy to delete the hashkey)
 */
function setHashKey(obj, h) {
	if (h) {
		obj.$$hashKey = h;
	} else {
		delete obj.$$hashKey;
	}
}

function baseExtend(dst, objs, deep) {
	var h = dst.$$hashKey;

	for (var i = 0, ii = objs.length; i < ii; ++i) {
		var obj = objs[i];
		if (!isObject(obj) && !isFunction(obj)) continue;
		var keys = Object.keys(obj);
		for (var j = 0, jj = keys.length; j < jj; j++) {
			var key = keys[j];
			var src = obj[key];

			if (deep && isObject(src)) {
				if (isDate(src)) {
					dst[key] = new Date(src.valueOf());
				} else if (isRegExp(src)) {
					dst[key] = new RegExp(src);
				} else if (src.nodeName) {
					dst[key] = src.cloneNode(true);
				} else if (isElement(src)) {
					dst[key] = src.clone();
				} else {
					if (!isObject(dst[key])) dst[key] = isArray(src) ? [] : {};
					baseExtend(dst[key], [src], true);
				}
			} else {
				dst[key] = src;
			}
		}
	}

	setHashKey(dst, h);
	return dst;
}

/**
 * @ngdoc function
 * @name angular.extend
 * @module ng
 * @kind function
 *
 * @description
 * Extends the destination object `dst` by copying own enumerable properties from the `src` object(s)
 * to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so
 * by passing an empty object as the target: `var object = angular.extend({}, object1, object2)`.
 *
 * **Note:** Keep in mind that `angular.extend` does not support recursive merge (deep copy). Use
 * {@link angular.merge} for this.
 *
 * param {Object} dst Destination object.
 * param {...Object} src Source object(s).
 * returns {Object} Reference to `dst`.
 */
function extend(dst, ex?) {
	return baseExtend(dst, slice.call(arguments, 1), false);
}

/**
 * @ngdoc function
 * @name angular.merge
 * @module ng
 * @kind function
 *
 * @description
 * Deeply extends the destination object `dst` by copying own enumerable properties from the `src` object(s)
 * to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so
 * by passing an empty object as the target: `var object = angular.merge({}, object1, object2)`.
 *
 * Unlike {@link angular.extend extend()}, `merge()` recursively descends into object properties of source
 * objects, performing a deep copy.
 *
 * param {Object} dst Destination object.
 * param {...Object} src Source object(s).
 * returns {Object} Reference to `dst`.
 */
function merge(dst) {
	return baseExtend(dst, slice.call(arguments, 1), true);
}

function toInt(str) {
	return parseInt(str, 10);
}

var isNumberNaN =
	Number.isNaN ||
	function isNumberNaN(num) {
		// eslint-disable-next-line no-self-compare
		return num !== num;
	};

function inherit(parent, extra) {
	return extend(Object.create(parent), extra);
}

/**
 * @ngdoc function
 * @name angular.noop
 * @module ng
 * @kind function
 *
 * @description
 * A function that performs no operations. This function can be useful when writing code in the
 * functional style.
   ```js
     function foo(callback) {
       var result = calculateResult();
       (callback || angular.noop)(result);
     }
   ```
 */
function noop() {}
noop.$inject = [];

/**
 * @ngdoc function
 * @name angular.identity
 * @module ng
 * @kind function
 *
 * @description
 * A function that returns its first argument. This function is useful when writing code in the
 * functional style.
 *
   ```js
   function transformer(transformationFn, value) {
     return (transformationFn || angular.identity)(value);
   };

   // E.g.
   function getResult(fn, input) {
     return (fn || angular.identity)(input);
   };

   getResult(function(n) { return n * 2; }, 21);   // returns 42
   getResult(null, 21);                            // returns 21
   getResult(undefined, 21);                       // returns 21
   ```
 *
 * param {*} value to be returned.
 * returns {*} the value passed in.
 */
function identity($) {
	return $;
}
identity.$inject = [];

function valueFn(value) {
	return function valueRef() {
		return value;
	};
}

function hasCustomToString(obj) {
	return isFunction(obj.toString) && obj.toString !== toString;
}

/**
 * @ngdoc function
 * @name angular.isUndefined
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is undefined.
 *
 * param {*} value Reference to check.
 * returns {boolean} True if `value` is undefined.
 */
function isUndefined(value) {
	return typeof value === "undefined";
}

/**
 * @ngdoc function
 * @name angular.isDefined
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is defined.
 *
 * param {*} value Reference to check.
 * returns {boolean} True if `value` is defined.
 */
function isDefined(value) {
	return typeof value !== "undefined";
}

/**
 * @ngdoc function
 * @name angular.isObject
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
 * considered to be objects. Note that JavaScript arrays are objects.
 *
 * param {*} value Reference to check.
 * returns {boolean} True if `value` is an `Object` but not `null`.
 */
function isObject(value) {
	// http://jsperf.com/isobject4
	return value !== null && typeof value === "object";
}

/**
 * Determine if a value is an object with a null prototype
 *
 * returns {boolean} True if `value` is an `Object` with a null prototype
 */
function isBlankObject(value) {
	return value !== null && typeof value === "object" && !getPrototypeOf(value);
}

/**
 * @ngdoc function
 * @name angular.isString
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `String`.
 *
 * param {*} value Reference to check.
 * returns {boolean} True if `value` is a `String`.
 */
function isString(value) {
	return typeof value === "string";
}

/**
 * @ngdoc function
 * @name angular.isNumber
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `Number`.
 *
 * This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.
 *
 * If you wish to exclude these then you can use the native
 * [`isFinite'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
 * method.
 *
 * param {*} value Reference to check.
 * returns {boolean} True if `value` is a `Number`.
 */
function isNumber(value) {
	return typeof value === "number";
}

/**
 * @ngdoc function
 * @name angular.isDate
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a value is a date.
 *
 * param {*} value Reference to check.
 * returns {boolean} True if `value` is a `Date`.
 */
function isDate(value) {
	return toString.call(value) === "[object Date]";
}

/**
 * @ngdoc function
 * @name angular.isFunction
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `Function`.
 *
 * param {*} value Reference to check.
 * returns {boolean} True if `value` is a `Function`.
 */
function isFunction(value) {
	return typeof value === "function";
}

/**
 * Determines if a value is a regular expression object.
 *
 * private
 * param {*} value Reference to check.
 * returns {boolean} True if `value` is a `RegExp`.
 */
function isRegExp(value) {
	return toString.call(value) === "[object RegExp]";
}

/**
 * Checks if `obj` is a window object.
 *
 * private
 * param {*} obj Object to check
 * returns {boolean} True if `obj` is a window obj.
 */
function isWindow(obj) {
	return obj && obj.window === obj;
}

function isScope(obj) {
	return obj && obj.$evalAsync && obj.$watch;
}

function isFile(obj) {
	return toString.call(obj) === "[object File]";
}

function isFormData(obj) {
	return toString.call(obj) === "[object FormData]";
}

function isBlob(obj) {
	return toString.call(obj) === "[object Blob]";
}

function isBoolean(value) {
	return typeof value === "boolean";
}

function isPromiseLike(obj) {
	return obj && isFunction(obj.then);
}

var TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/;
function isTypedArray(value) {
	return (
		value &&
		isNumber(value.length) &&
		TYPED_ARRAY_REGEXP.test(toString.call(value))
	);
}

function isArrayBuffer(obj) {
	return toString.call(obj) === "[object ArrayBuffer]";
}

var trim = function(value) {
	return isString(value) ? value.trim() : value;
};

// Copied from:
// http://docs.closure-library.googlecode.com/git/local_closure_goog_string_string.js.source.html#line1021
// Prereq: s is a string.
var escapeForRegexp = function(s) {
	return (
		s
			.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1")
			// eslint-disable-next-line no-control-regex
			.replace(/\x08/g, "\\x08")
	);
};

/**
 * @ngdoc function
 * @name angular.isElement
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a DOM element (or wrapped jQuery element).
 *
 * param {*} value Reference to check.
 * returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).
 */
function isElement(node) {
	return !!(
		node &&
		(node.nodeName || // We are a direct element.
			(node.prop && node.attr && node.find))
	); // We have an on and find method part of jQuery API.
}

/**
 * param str 'key1,key2,...'
 * returns {object} in the form of {key1:true, key2:true, ...}
 */
function makeMap(str) {
	var obj = {},
		items = str.split(","),
		i;
	for (i = 0; i < items.length; i++) {
		obj[items[i]] = true;
	}
	return obj;
}

function nodeName_(element) {
	return lowercase(element.nodeName || (element[0] && element[0].nodeName));
}

function includes(array, obj) {
	return Array.prototype.indexOf.call(array, obj) !== -1;
}

function arrayRemove(array, value) {
	var index = array.indexOf(value);
	if (index >= 0) {
		array.splice(index, 1);
	}
	return index;
}


/**
 * @ngdoc function
 * @name angular.equals
 * @module ng
 * @kind function
 *
 * @description
 * Determines if two objects or two values are equivalent. Supports value types, regular
 * expressions, arrays and objects.
 *
 * Two objects or values are considered equivalent if at least one of the following is true:
 *
 * * Both objects or values pass `===` comparison.
 * * Both objects or values are of the same type and all of their properties are equal by
 *   comparing them with `angular.equals`.
 * * Both values are NaN. (In JavaScript, NaN == NaN => false. But we consider two NaN as equal)
 * * Both values represent the same regular expression (In JavaScript,
 *   /abc/ == /abc/ => false. But we consider two regular expressions as equal when their textual
 *   representation matches).
 *
 * During a property comparison, properties of `function` type and properties with names
 * that begin with `$` are ignored.
 *
 * Scope and DOMWindow objects are being compared only by identify (`===`).
 *
 * param {*} o1 Object or value to compare.
 * param {*} o2 Object or value to compare.
 * returns {boolean} True if arguments are equal.
 *
 * @example
   <example module="equalsExample" name="equalsExample">
     <file name="index.html">
      <div ng-controller="ExampleController">
        <form novalidate>
          <h3>User 1</h3>
          Name: <input type="text" ng-model="user1.name">
          Age: <input type="number" ng-model="user1.age">

          <h3>User 2</h3>
          Name: <input type="text" ng-model="user2.name">
          Age: <input type="number" ng-model="user2.age">

          <div>
            <br/>
            <input type="button" value="Compare" ng-click="compare()">
          </div>
          User 1: <pre>{{user1 | json}}</pre>
          User 2: <pre>{{user2 | json}}</pre>
          Equal: <pre>{{result}}</pre>
        </form>
      </div>
    </file>
    <file name="script.js">
        angular.module('equalsExample', []).controller('ExampleController', ['$scope', function($scope) {
          $scope.user1 = {};
          $scope.user2 = {};
          $scope.compare = function() {
            $scope.result = angular.equals($scope.user1, $scope.user2);
          };
        }]);
    </file>
  </example>
 */
function equals(o1, o2) {
	if (o1 === o2) return true;
	if (o1 === null || o2 === null) return false;
	// eslint-disable-next-line no-self-compare
	if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
	var t1 = typeof o1,
		t2 = typeof o2,
		length,
		key,
		keySet;
	if (t1 === t2 && t1 === "object") {
		if (isArray(o1)) {
			if (!isArray(o2)) return false;
			if ((length = o1.length) === o2.length) {
				for (key = 0; key < length; key++) {
					if (!equals(o1[key], o2[key])) return false;
				}
				return true;
			}
		} else if (isDate(o1)) {
			if (!isDate(o2)) return false;
			return equals(o1.getTime(), o2.getTime());
		} else if (isRegExp(o1)) {
			if (!isRegExp(o2)) return false;
			return o1.toString() === o2.toString();
		} else {
			if (
				isScope(o1) ||
				isScope(o2) ||
				isWindow(o1) ||
				isWindow(o2) ||
				isArray(o2) ||
				isDate(o2) ||
				isRegExp(o2)
			)
				return false;
			keySet = createMap();
			for (key in o1) {
				if (key.charAt(0) === "$" || isFunction(o1[key])) continue;
				if (!equals(o1[key], o2[key])) return false;
				keySet[key] = true;
			}
			for (key in o2) {
				if (
					!(key in keySet) &&
					key.charAt(0) !== "$" &&
					isDefined(o2[key]) &&
					!isFunction(o2[key])
				)
					return false;
			}
			return true;
		}
	}
	return false;
}

function concat(array1, array2, index) {
	return array1.concat(slice.call(array2, index));
}

function sliceArgs(args, startIndex) {
	return slice.call(args, startIndex || 0);
}

/**
 * @ngdoc function
 * @name angular.bind
 * @module ng
 * @kind function
 *
 * @description
 * Returns a function which calls function `fn` bound to `self` (`self` becomes the `this` for
 * `fn`). You can supply optional `args` that are prebound to the function. This feature is also
 * known as [partial application](http://en.wikipedia.org/wiki/Partial_application), as
 * distinguished from [function currying](http://en.wikipedia.org/wiki/Currying#Contrast_with_partial_function_application).
 *
 * param {Object} self Context which `fn` should be evaluated in.
 * param {function()} fn Function to be bound.
 * param {...*} args Optional arguments to be prebound to the `fn` function call.
 * returns {function()} Function that wraps the `fn` with all the specified bindings.
 */
// eslint-disable-next-line consistent-this
function bind(self, fn) {
	var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
	if (isFunction(fn) && !(fn instanceof RegExp)) {
		return curryArgs.length
			? function() {
					return arguments.length
						? fn.apply(self, concat(curryArgs, arguments, 0))
						: fn.apply(self, curryArgs);
			  }
			: function() {
					return arguments.length ? fn.apply(self, arguments) : fn.call(self);
			  };
	} else {
		// In IE, native methods are not functions so they cannot be bound (note: they don't need to be).
		return fn;
	}
}

function toJsonReplacer(key, value) {
	var val = value;

	if (
		typeof key === "string" &&
		key.charAt(0) === "$" &&
		key.charAt(1) === "$"
	) {
		val = undefined;
	} else if (isWindow(value)) {
		val = "$WINDOW";
	} else if (value && window.document === value) {
		val = "$DOCUMENT";
	} else if (isScope(value)) {
		val = "$SCOPE";
	}

	return val;
}

/**
 * @ngdoc function
 * @name angular.toJson
 * @module ng
 * @kind function
 *
 * @description
 * Serializes input into a JSON-formatted string. Properties with leading $$ characters will be
 * stripped since angular uses this notation internally.
 *
 * param {Object|Array|Date|string|number|boolean} obj Input to be serialized into JSON.
 * param {boolean|number} [pretty=2] If set to true, the JSON output will contain newlines and whitespace.
 *    If set to an integer, the JSON output will contain that many spaces per indentation.
 * returns {string|undefined} JSON-ified string representing `obj`.
 * @knownIssue
 *
 * The Safari browser throws a `RangeError` instead of returning `null` when it tries to stringify a `Date`
 * object with an invalid date value. The only reliable way to prevent this is to monkeypatch the
 * `Date.prototype.toJSON` method as follows:
 *
 * ```
 * var _DatetoJSON = Date.prototype.toJSON;
 * Date.prototype.toJSON = function() {
 *   try {
 *     return _DatetoJSON.call(this);
 *   } catch(e) {
 *     if (e instanceof RangeError) {
 *       return null;
 *     }
 *     throw e;
 *   }
 * };
 * ```
 *
 * See https://github.com/angular/angular.js/pull/14221 for more information.
 */
function toJson(obj, pretty) {
	if (isUndefined(obj)) return undefined;
	if (!isNumber(pretty)) {
		pretty = pretty ? 2 : null;
	}
	return JSON.stringify(obj, toJsonReplacer, pretty);
}

/**
 * @ngdoc function
 * @name angular.fromJson
 * @module ng
 * @kind function
 *
 * @description
 * Deserializes a JSON string.
 *
 * param {string} json JSON string to deserialize.
 * returns {Object|Array|string|number} Deserialized JSON string.
 */
function fromJson(json) {
	return isString(json) ? JSON.parse(json) : json;
}

var ALL_COLONS = /:/g;
function timezoneToOffset(timezone, fallback) {
	// IE/Edge do not "understand" colon (`:`) in timezone
	timezone = timezone.replace(ALL_COLONS, "");
	var requestedTimezoneOffset =
		Date.parse("Jan 01, 1970 00:00:00 " + timezone) / 60000;
	return isNumberNaN(requestedTimezoneOffset)
		? fallback
		: requestedTimezoneOffset;
}

function addDateMinutes(date, minutes) {
	date = new Date(date.getTime());
	date.setMinutes(date.getMinutes() + minutes);
	return date;
}

function convertTimezoneToLocal(date, timezone, reverse) {
	reverse = reverse ? -1 : 1;
	var dateTimezoneOffset = date.getTimezoneOffset();
	var timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
	return addDateMinutes(date, reverse * (timezoneOffset - dateTimezoneOffset));
}

/**
 * returns {string} Returns the string representation of the element.
 */
function startingTag(element) {
	element = jqLite(element).clone();
	try {
		// turns out IE does not let you set .html() on elements which
		// are not allowed to have children. So we just ignore it.
		element.empty();
	} catch (e) {
		/* empty */
	}
	var elemHtml = jqLite("<div>")
		.append(element)
		.html();
	try {
		return element[0].nodeType === NODE_TYPE_TEXT
			? lowercase(elemHtml)
			: elemHtml
					.match(/^(<[^>]+>)/)[1]
					.replace(/^<([\w\-]+)/, function(match, nodeName) {
						return "<" + lowercase(nodeName);
					});
	} catch (e) {
		return lowercase(elemHtml);
	}
}

/////////////////////////////////////////////////

/**
 * Tries to decode the URI component without throwing an exception.
 *
 * private
 * param str value potential URI component to check.
 * returns {boolean} True if `value` can be decoded
 * with the decodeURIComponent function.
 */
function tryDecodeURIComponent(value) {
	try {
		return decodeURIComponent(value);
	} catch (e) {
		// Ignore any invalid uri component.
	}
}


/**
 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path
 * segments:
 *    segment       = *pchar
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriSegment(val) {
	return encodeUriQuery(val, true)
		.replace(/%26/gi, "&")
		.replace(/%3D/gi, "=")
		.replace(/%2B/gi, "+");
}

/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 * encoded per http://tools.ietf.org/html/rfc3986:
 *    query         = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriQuery(val, pctEncodeSpaces) {
	return encodeURIComponent(val)
		.replace(/%40/gi, "@")
		.replace(/%3A/gi, ":")
		.replace(/%24/g, "$")
		.replace(/%2C/gi, ",")
		.replace(/%3B/gi, ";")
		.replace(/%20/g, pctEncodeSpaces ? "%20" : "+");
}

function getNgAttribute(element, ngAttr) {
	var attr,
		i,
		ii = ngAttrPrefixes.length;
	for (i = 0; i < ii; ++i) {
		attr = ngAttrPrefixes[i] + ngAttr;
		if (isString((attr = element.getAttribute(attr)))) {
			return attr;
		}
	}
	return null;
}

function allowAutoBootstrap(document) {
	if (!document.currentScript) {
		return true;
	}
	var src = document.currentScript.getAttribute("src");
	var link = document.createElement("a");
	link.href = src;
	var scriptProtocol = link.protocol;
	var docLoadProtocol = document.location.protocol;
	if (
		(scriptProtocol === "resource:" ||
			scriptProtocol === "chrome-extension:") &&
		docLoadProtocol !== scriptProtocol
	) {
		return false;
	}
	return true;
}

var SNAKE_CASE_REGEXP = /[A-Z]/g;
function snake_case(name, separator) {
	separator = separator || "_";
	return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
		return (pos ? separator : "") + letter.toLowerCase();
	});
}


/**
 * throw error if the argument is falsy.
 */
function assertArg(arg, name, reason) {
	if (!arg) {
		throw new Error(
			"areq" + 
			"Argument '{0}' is {1}" + 
			name || "?" +
			reason || "required"
		);
	}
	return arg;
}

function assertArgFn(arg, name, acceptArrayAnnotation) {
	if (acceptArrayAnnotation && isArray(arg)) {
		arg = arg[arg.length - 1];
	}

	assertArg(
		isFunction(arg),
		name,
		"not a function, got " +
			(arg && typeof arg === "object"
				? arg.constructor.name || "Object"
				: typeof arg)
	);
	return arg;
}

/**
 * throw error if the name given is hasOwnProperty
 * param  {String} name    the name to test
 * param  {String} context the context in which the name is used, such as module or directive
 */
function assertNotHasOwnProperty(name, context) {
	if (name === "hasOwnProperty") {
		throw new Error(
			"badname" +
			"hasOwnProperty is not a valid {0} name" +
			context
		);
	}
}

/**
 * Return the value accessible from the object by path. Any undefined traversals are ignored
 * param {Object} obj starting object
 * param {String} path path to traverse
 * param {boolean} [bindFnToScope=true]
 * returns {Object} value as accessible by path
 */
//TODO(misko): this function needs to be removed
function getter(obj, path, bindFnToScope) {
	if (!path) return obj;
	var keys = path.split(".");
	var key;
	var lastInstance = obj;
	var len = keys.length;

	for (var i = 0; i < len; i++) {
		key = keys[i];
		if (obj) {
			obj = (lastInstance = obj)[key];
		}
	}
	if (!bindFnToScope && isFunction(obj)) {
		return bind(lastInstance, obj);
	}
	return obj;
}

/**
 * Return the DOM siblings between the first and last node in the given array.
 * param {Array} array like object
 * returns {Array} the inputted object or a jqLite collection containing the nodes
 */
function getBlockNodes(nodes) {
	// TODO(perf): update `nodes` instead of creating a new object?
	var node = nodes[0];
	var endNode = nodes[nodes.length - 1];
	var blockNodes;

	for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
		if (blockNodes || nodes[i] !== node) {
			if (!blockNodes) {
				blockNodes = jqLite(slice.call(nodes, 0, i));
			}
			blockNodes.push(node);
		}
	}

	return blockNodes || nodes;
}

/**
 * Creates a new object without a prototype. This object is useful for lookup without having to
 * guard against prototypically inherited properties via hasOwnProperty.
 *
 * Related micro-benchmarks:
 * - http://jsperf.com/object-create2
 * - http://jsperf.com/proto-map-lookup/2
 * - http://jsperf.com/for-in-vs-object-keys2
 *
 * returns {Object}
 */
function createMap() {
	return Object.create(null);
}

function stringify(value) {
	return JSON.stringify(value);
}

/* global toDebugString: true */

function serializeObject(obj) {
	var seen = [];

	return JSON.stringify(obj, function(key, val) {
		val = toJsonReplacer(key, val);
		if (isObject(val)) {
			if (seen.indexOf(val) >= 0) return "...";

			seen.push(val);
		}
		return val;
	});
}

function toDebugString(obj) {
	if (typeof obj === "function") {
		return obj.toString().replace(/ \{[\s\S]*$/, "");
	} else if (isUndefined(obj)) {
		return "undefined";
	} else if (typeof obj !== "string") {
		return serializeObject(obj);
	}
	return obj;
}



var objectValueOf = {}.constructor.prototype.valueOf;

// Sandboxing Angular Expressions
// ------------------------------
// Angular expressions are no longer sandboxed. So it is now even easier to access arbitrary JS code by
// various means such as obtaining a reference to native JS functions like the Function constructor.
//
// As an example, consider the following Angular expression:
//
//   {}.toString.constructor('alert("evil JS code")')
//
// It is important to realize that if you create an expression from a string that contains user provided
// content then it is possible that your application contains a security vulnerability to an XSS style attack.
//
// See https://docs.angularjs.org/guide/security

function getStringValue(name) {
	// Property names must be strings. This means that non-string objects cannot be used
	// as keys in an object. Any non-string object, including a number, is typecasted
	// into a string via the toString method.
	// -- MDN, https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Property_accessors#Property_names
	//
	// So, to ensure that we are checking the same `name` that JavaScript would use, we cast it
	// to a string. It's not always possible. If `name` is an object and its `toString` method is
	// 'broken' (doesn't return a string, isn't a function, etc.), an error will be thrown:
	//
	// TypeError: Cannot convert object to primitive value
	//
	// For performance reasons, we don't catch this error here and allow it to propagate up the call
	// stack. Note that you'll get the same error in JavaScript if you try to access a property using
	// such a 'broken' object as a key.
	return name + "";
}

var OPERATORS = createMap();
"+ - * / % === !== == != < > <= >= && || ! = |".split(" ").forEach(function(
	operator
) {
	OPERATORS[operator] = true;
});
var ESCAPE = {
	n: "\n",
	f: "\f",
	r: "\r",
	t: "\t",
	v: "\v",
	"'": "'",
	'"': '"'
};

/////////////////////////////////////////

/**
 * constructor
 */
export function Lexer(options) {
	this.options = options;
};

Lexer.prototype = {
	constructor: Lexer,

	lex: function(text) {
		this.text = text;
		this.index = 0;
		this.tokens = [];

		while (this.index < this.text.length) {
			var ch = this.text.charAt(this.index);
			if (ch === '"' || ch === "'") {
				this.readString(ch);
			} else if (
				this.isNumber(ch) ||
				(ch === "." && this.isNumber(this.peek()))
			) {
				this.readNumber();
			} else if (this.isIdentifierStart(this.peekMultichar())) {
				this.readIdent();
			} else if (this.is(ch, "(){}[].,;:?")) {
				this.tokens.push({ index: this.index, text: ch });
				this.index++;
			} else if (this.isWhitespace(ch)) {
				this.index++;
			} else {
				var ch2 = ch + this.peek();
				var ch3 = ch2 + this.peek(2);
				var op1 = OPERATORS[ch];
				var op2 = OPERATORS[ch2];
				var op3 = OPERATORS[ch3];
				if (op1 || op2 || op3) {
					var token = op3 ? ch3 : op2 ? ch2 : ch;
					this.tokens.push({ index: this.index, text: token, operator: true });
					this.index += token.length;
				} else {
					this.throwError(
						"Unexpected next character ",
						this.index,
						this.index + 1
					);
				}
			}
		}
		return this.tokens;
	},

	is: function(ch, chars) {
		return chars.indexOf(ch) !== -1;
	},

	peek: function(i) {
		var num = i || 1;
		return this.index + num < this.text.length
			? this.text.charAt(this.index + num)
			: false;
	},

	isNumber: function(ch) {
		return "0" <= ch && ch <= "9" && typeof ch === "string";
	},

	isWhitespace: function(ch) {
		// IE treats non-breaking space as \u00A0
		return (
			ch === " " ||
			ch === "\r" ||
			ch === "\t" ||
			ch === "\n" ||
			ch === "\v" ||
			ch === "\u00A0"
		);
	},

	isIdentifierStart: function(ch) {
		return this.options.isIdentifierStart
			? this.options.isIdentifierStart(ch, this.codePointAt(ch))
			: this.isValidIdentifierStart(ch);
	},

	isValidIdentifierStart: function(ch) {
		return (
			("a" <= ch && ch <= "z") ||
			("A" <= ch && ch <= "Z") ||
			"_" === ch ||
			ch === "$"
		);
	},

	isIdentifierContinue: function(ch) {
		return this.options.isIdentifierContinue
			? this.options.isIdentifierContinue(ch, this.codePointAt(ch))
			: this.isValidIdentifierContinue(ch);
	},

	isValidIdentifierContinue: function(ch, cp) {
		return this.isValidIdentifierStart(ch, cp) || this.isNumber(ch);
	},

	codePointAt: function(ch) {
		if (ch.length === 1) return ch.charCodeAt(0);
		// eslint-disable-next-line no-bitwise
		return (ch.charCodeAt(0) << 10) + ch.charCodeAt(1) - 0x35fdc00;
	},

	peekMultichar: function() {
		var ch = this.text.charAt(this.index);
		var peek = this.peek();
		if (!peek) {
			return ch;
		}
		var cp1 = ch.charCodeAt(0);
		var cp2 = peek.charCodeAt(0);
		if (cp1 >= 0xd800 && cp1 <= 0xdbff && cp2 >= 0xdc00 && cp2 <= 0xdfff) {
			return ch + peek;
		}
		return ch;
	},

	isExpOperator: function(ch) {
		return ch === "-" || ch === "+" || this.isNumber(ch);
	},

	throwError: function(error, start, end) {
		end = end || this.index;
		var colStr = isDefined(start)
			? "s " +
			  start +
			  "-" +
			  this.index +
			  " [" +
			  this.text.substring(start, end) +
			  "]"
			: " " + end;
		throw this.throwError(
			"lexerr",
			"Lexer Error: {0} at column{1} in expression [{2}].",
			error,
			colStr,
			this.text
		);
	},

	readNumber: function() {
		var number = "";
		var start = this.index;
		while (this.index < this.text.length) {
			var ch = lowercase(this.text.charAt(this.index));
			if (ch === "." || this.isNumber(ch)) {
				number += ch;
			} else {
				var peekCh = this.peek();
				if (ch === "e" && this.isExpOperator(peekCh)) {
					number += ch;
				} else if (
					this.isExpOperator(ch) &&
					peekCh &&
					this.isNumber(peekCh) &&
					number.charAt(number.length - 1) === "e"
				) {
					number += ch;
				} else if (
					this.isExpOperator(ch) &&
					(!peekCh || !this.isNumber(peekCh)) &&
					number.charAt(number.length - 1) === "e"
				) {
					this.throwError("Invalid exponent");
				} else {
					break;
				}
			}
			this.index++;
		}
		this.tokens.push({
			index: start,
			text: number,
			constant: true,
			value: Number(number)
		});
	},

	readIdent: function() {
		var start = this.index;
		this.index += this.peekMultichar().length;
		while (this.index < this.text.length) {
			var ch = this.peekMultichar();
			if (!this.isIdentifierContinue(ch)) {
				break;
			}
			this.index += ch.length;
		}
		this.tokens.push({
			index: start,
			text: this.text.slice(start, this.index),
			identifier: true
		});
	},

	readString: function(quote) {
		var start = this.index;
		this.index++;
		var string = "";
		var rawString = quote;
		var escape = false;
		while (this.index < this.text.length) {
			var ch = this.text.charAt(this.index);
			rawString += ch;
			if (escape) {
				if (ch === "u") {
					var hex = this.text.substring(this.index + 1, this.index + 5);
					if (!hex.match(/[\da-f]{4}/i)) {
						this.throwError("Invalid unicode escape [\\u" + hex + "]");
					}
					this.index += 4;
					string += String.fromCharCode(parseInt(hex, 16));
				} else {
					var rep = ESCAPE[ch];
					string = string + (rep || ch);
				}
				escape = false;
			} else if (ch === "\\") {
				escape = true;
			} else if (ch === quote) {
				this.index++;
				this.tokens.push({
					index: start,
					text: rawString,
					constant: true,
					value: string
				});
				return;
			} else {
				string += ch;
			}
			this.index++;
		}
		this.throwError("Unterminated quote", start);
	}
};

var AST = function AST(lexer, options) {
	this.lexer = lexer;
	this.options = options;
};

AST.prototype = {
	ast: function(text) {
		this.text = text;
		this.tokens = this.lexer.lex(text);

		var value = this.program();

		if (this.tokens.length !== 0) {
			this.throwError("is an unexpected token", this.tokens[0]);
		}

		return value;
	},

	program: function() {
		var body = [];
		while (true) {
			if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]"))
				body.push(this.expressionStatement());
			if (!this.expect(";")) {
				return { type: AST.prototype.Program, body: body };
			}
		}
	},

	expressionStatement: function() {
		return { type: AST.prototype.ExpressionStatement, expression: this.filterChain() };
	},

	filterChain: function() {
		var left = this.expression();
		while (this.expect("|")) {
			left = this.filter(left);
		}
		return left;
	},

	expression: function() {
		return this.assignment();
	},

	assignment: function() {
		var result = this.ternary();
		if (this.expect("=")) {
			if (!isAssignable(result)) {
				throw this.throwError("lval", "Trying to assign a value to a non l-value");
			}

			result = {
				type: AST.prototype.AssignmentExpression,
				left: result,
				right: this.assignment(),
				operator: "="
			};
		}
		return result;
	},

	ternary: function() {
		var test = this.logicalOR();
		var alternate;
		var consequent;
		if (this.expect("?")) {
			alternate = this.expression();
			if (this.consume(":")) {
				consequent = this.expression();
				return {
					type: AST.prototype.ConditionalExpression,
					test: test,
					alternate: alternate,
					consequent: consequent
				};
			}
		}
		return test;
	},

	logicalOR: function() {
		var left = this.logicalAND();
		while (this.expect("||")) {
			left = {
				type: AST.prototype.LogicalExpression,
				operator: "||",
				left: left,
				right: this.logicalAND()
			};
		}
		return left;
	},

	logicalAND: function() {
		var left = this.equality();
		while (this.expect("&&")) {
			left = {
				type: AST.prototype.LogicalExpression,
				operator: "&&",
				left: left,
				right: this.equality()
			};
		}
		return left;
	},

	equality: function() {
		var left = this.relational();
		var token;
		while ((token = this.expect("==", "!=", "===", "!=="))) {
			left = {
				type: AST.prototype.BinaryExpression,
				operator: token.text,
				left: left,
				right: this.relational()
			};
		}
		return left;
	},

	relational: function() {
		var left = this.additive();
		var token;
		while ((token = this.expect("<", ">", "<=", ">="))) {
			left = {
				type: AST.prototype.BinaryExpression,
				operator: token.text,
				left: left,
				right: this.additive()
			};
		}
		return left;
	},

	additive: function() {
		var left = this.multiplicative();
		var token;
		while ((token = this.expect("+", "-"))) {
			left = {
				type: AST.prototype.BinaryExpression,
				operator: token.text,
				left: left,
				right: this.multiplicative()
			};
		}
		return left;
	},

	multiplicative: function() {
		var left = this.unary();
		var token;
		while ((token = this.expect("*", "/", "%"))) {
			left = {
				type: AST.prototype.BinaryExpression,
				operator: token.text,
				left: left,
				right: this.unary()
			};
		}
		return left;
	},

	unary: function() {
		var token;
		if ((token = this.expect("+", "-", "!"))) {
			return {
				type: AST.prototype.UnaryExpression,
				operator: token.text,
				prefix: true,
				argument: this.unary()
			};
		} else {
			return this.primary();
		}
	},

	primary: function() {
		var primary;
		if (this.expect("(")) {
			primary = this.filterChain();
			this.consume(")");
		} else if (this.expect("[")) {
			primary = this.arrayDeclaration();
		} else if (this.expect("{")) {
			primary = this.object();
		} else if (this.selfReferential.hasOwnProperty(this.peek().text)) {
			primary = this.selfReferential[this.consume().text];
		} else if (this.options.literals.hasOwnProperty(this.peek().text)) {
			primary = {
				type: AST.prototype.Literal,
				value: this.options.literals[this.consume().text]
			};
		} else if (this.peek().identifier) {
			primary = this.identifier();
		} else if (this.peek().constant) {
			primary = this.constant();
		} else {
			this.throwError("not a primary expression", this.peek());
		}

		var next;
		while ((next = this.expect("(", "[", "."))) {
			if (next.text === "(") {
				primary = {
					type: AST.prototype.CallExpression,
					callee: primary,
					arguments: this.parseArguments()
				};
				this.consume(")");
			} else if (next.text === "[") {
				primary = {
					type: AST.prototype.MemberExpression,
					object: primary,
					property: this.expression(),
					computed: true
				};
				this.consume("]");
			} else if (next.text === ".") {
				primary = {
					type: AST.prototype.MemberExpression,
					object: primary,
					property: this.identifier(),
					computed: false
				};
			} else {
				this.throwError("IMPOSSIBLE");
			}
		}
		return primary;
	},

	filter: function(baseExpression) {
		var args = [baseExpression];
		var result = {
			type: AST.prototype.CallExpression,
			callee: this.identifier(),
			arguments: args,
			filter: true
		};

		while (this.expect(":")) {
			args.push(this.expression());
		}

		return result;
	},

	parseArguments: function() {
		var args = [];
		if (this.peekToken().text !== ")") {
			do {
				args.push(this.filterChain());
			} while (this.expect(","));
		}
		return args;
	},

	identifier: function() {
		var token = this.consume();
		if (!token.identifier) {
			this.throwError("is not a valid identifier", token);
		}
		return { type: AST.prototype.Identifier, name: token.text };
	},

	constant: function() {
		// TODO check that it is a constant
		return { type: AST.prototype.Literal, value: this.consume().value };
	},

	arrayDeclaration: function() {
		var elements = [];
		if (this.peekToken().text !== "]") {
			do {
				if (this.peek("]")) {
					// Support trailing commas per ES5.1.
					break;
				}
				elements.push(this.expression());
			} while (this.expect(","));
		}
		this.consume("]");

		return { type: AST.prototype.ArrayExpression, elements: elements };
	},

	object: function() {
		var properties = [],
			property;
		if (this.peekToken().text !== "}") {
			do {
				if (this.peek("}")) {
					// Support trailing commas per ES5.1.
					break;
				}
				property = { type: AST.prototype.Property, kind: "init" };
				if (this.peek().constant) {
					property.key = this.constant();
					property.computed = false;
					this.consume(":");
					property.value = this.expression();
				} else if (this.peek().identifier) {
					property.key = this.identifier();
					property.computed = false;
					if (this.peek(":")) {
						this.consume(":");
						property.value = this.expression();
					} else {
						property.value = property.key;
					}
				} else if (this.peek("[")) {
					this.consume("[");
					property.key = this.expression();
					this.consume("]");
					property.computed = true;
					this.consume(":");
					property.value = this.expression();
				} else {
					this.throwError("invalid key", this.peek());
				}
				properties.push(property);
			} while (this.expect(","));
		}
		this.consume("}");

		return { type: AST.prototype.ObjectExpression, properties: properties };
	},

	throwError: function(msg, token) {
		throw this.throwError(
			"syntax",
			"Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].",
			token.text,
			msg,
			token.index + 1,
			this.text,
			this.text.substring(token.index)
		);
	},

	consume: function(e1) {
		if (this.tokens.length === 0) {
			throw this.throwError(
				"ueoe",
				"Unexpected end of expression: {0}",
				this.text
			);
		}

		var token = this.expect(e1);
		if (!token) {
			this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
		}
		return token;
	},

	peekToken: function() {
		if (this.tokens.length === 0) {
			throw this.throwError(
				"ueoe",
				"Unexpected end of expression: {0}",
				this.text
			);
		}
		return this.tokens[0];
	},

	peek: function(e1, e2, e3, e4) {
		return this.peekAhead(0, e1, e2, e3, e4);
	},

	peekAhead: function(i, e1, e2, e3, e4) {
		if (this.tokens.length > i) {
			var token = this.tokens[i];
			var t = token.text;
			if (
				t === e1 ||
				t === e2 ||
				t === e3 ||
				t === e4 ||
				(!e1 && !e2 && !e3 && !e4)
			) {
				return token;
			}
		}
		return false;
	},

	expect: function(e1, e2, e3, e4) {
		var token = this.peek(e1, e2, e3, e4);
		if (token) {
			this.tokens.shift();
			return token;
		}
		return false;
	},

	selfReferential: {
		this: { type: AST.prototype.ThisExpression },
		$locals: { type: AST.prototype.LocalsExpression }
	}
};

AST.prototype.Program = "Program";
AST.prototype.ExpressionStatement = "ExpressionStatement";
AST.prototype.AssignmentExpression = "AssignmentExpression";
AST.prototype.ConditionalExpression = "ConditionalExpression";
AST.prototype.LogicalExpression = "LogicalExpression";
AST.prototype.BinaryExpression = "BinaryExpression";
AST.prototype.UnaryExpression = "UnaryExpression";
AST.prototype.CallExpression = "CallExpression";
AST.prototype.MemberExpression = "MemberExpression";
AST.prototype.Identifier = "Identifier";
AST.prototype.Literal = "Literal";
AST.prototype.ArrayExpression = "ArrayExpression";
AST.prototype.Property = "Property";
AST.prototype.ObjectExpression = "ObjectExpression";
AST.prototype.ThisExpression = "ThisExpression";
AST.prototype.LocalsExpression = "LocalsExpression";

// Internal use only
AST.prototype.NGValueParameter = "NGValueParameter";



function ifDefined(v, d) {
	return typeof v !== "undefined" ? v : d;
}

function plusFn(l, r) {
	if (typeof l === "undefined") return r;
	if (typeof r === "undefined") return l;
	return l + r;
}

function isStateless($filter, filterName) {
	var fn = $filter(filterName);
	return !fn.$stateful;
}

function findConstantAndWatchExpressions(ast, $filter) {
	var allConstants;
	var argsToWatch;
	var isStatelessFilter;
	switch (ast.type) {
		case AST.prototype.Program:
			allConstants = true;
			ast.body.forEach(function(expr) {
				findConstantAndWatchExpressions(expr.expression, $filter);
				allConstants = allConstants && expr.expression.constant;
			});
			ast.constant = allConstants;
			break;
		case AST.prototype.Literal:
			ast.constant = true;
			ast.toWatch = [];
			break;
		case AST.prototype.UnaryExpression:
			findConstantAndWatchExpressions(ast.argument, $filter);
			ast.constant = ast.argument.constant;
			ast.toWatch = ast.argument.toWatch;
			break;
		case AST.prototype.BinaryExpression:
			findConstantAndWatchExpressions(ast.left, $filter);
			findConstantAndWatchExpressions(ast.right, $filter);
			ast.constant = ast.left.constant && ast.right.constant;
			ast.toWatch = ast.left.toWatch.concat(ast.right.toWatch);
			break;
		case AST.prototype.LogicalExpression:
			findConstantAndWatchExpressions(ast.left, $filter);
			findConstantAndWatchExpressions(ast.right, $filter);
			ast.constant = ast.left.constant && ast.right.constant;
			ast.toWatch = ast.constant ? [] : [ast];
			break;
		case AST.prototype.ConditionalExpression:
			findConstantAndWatchExpressions(ast.test, $filter);
			findConstantAndWatchExpressions(ast.alternate, $filter);
			findConstantAndWatchExpressions(ast.consequent, $filter);
			ast.constant =
				ast.test.constant && ast.alternate.constant && ast.consequent.constant;
			ast.toWatch = ast.constant ? [] : [ast];
			break;
		case AST.prototype.Identifier:
			ast.constant = false;
			ast.toWatch = [ast];
			break;
		case AST.prototype.MemberExpression:
			findConstantAndWatchExpressions(ast.object, $filter);
			if (ast.computed) {
				findConstantAndWatchExpressions(ast.property, $filter);
			}
			ast.constant =
				ast.object.constant && (!ast.computed || ast.property.constant);
			ast.toWatch = [ast];
			break;
		case AST.prototype.CallExpression:
			isStatelessFilter = ast.filter
				? isStateless($filter, ast.callee.name)
				: false;
			allConstants = isStatelessFilter;
			argsToWatch = [];
			ast.arguments.forEach(function(expr) {
				findConstantAndWatchExpressions(expr, $filter);
				allConstants = allConstants && expr.constant;
				if (!expr.constant) {
					argsToWatch.push.apply(argsToWatch, expr.toWatch);
				}
			});
			ast.constant = allConstants;
			ast.toWatch = isStatelessFilter ? argsToWatch : [ast];
			break;
		case AST.prototype.AssignmentExpression:
			findConstantAndWatchExpressions(ast.left, $filter);
			findConstantAndWatchExpressions(ast.right, $filter);
			ast.constant = ast.left.constant && ast.right.constant;
			ast.toWatch = [ast];
			break;
		case AST.prototype.ArrayExpression:
			allConstants = true;
			argsToWatch = [];
			ast.elements.forEach(function(expr) {
				findConstantAndWatchExpressions(expr, $filter);
				allConstants = allConstants && expr.constant;
				if (!expr.constant) {
					argsToWatch.push.apply(argsToWatch, expr.toWatch);
				}
			});
			ast.constant = allConstants;
			ast.toWatch = argsToWatch;
			break;
		case AST.prototype.ObjectExpression:
			allConstants = true;
			argsToWatch = [];
			ast.properties.forEach(function(property) {
				findConstantAndWatchExpressions(property.value, $filter);
				allConstants =
					allConstants && property.value.constant && !property.computed;
				if (!property.value.constant) {
					argsToWatch.push.apply(argsToWatch, property.value.toWatch);
				}
			});
			ast.constant = allConstants;
			ast.toWatch = argsToWatch;
			break;
		case AST.prototype.ThisExpression:
			ast.constant = false;
			ast.toWatch = [];
			break;
		case AST.prototype.LocalsExpression:
			ast.constant = false;
			ast.toWatch = [];
			break;
	}
}

function getInputs(body) {
	if (body.length !== 1) return;
	var lastExpression = body[0].expression;
	var candidate = lastExpression.toWatch;
	if (candidate.length !== 1) return candidate;
	return candidate[0] !== lastExpression ? candidate : undefined;
}

function isAssignable(ast) {
	return ast.type === AST.prototype.Identifier || ast.type === AST.prototype.MemberExpression;
}

function assignableAST(ast) {
	if (ast.body.length === 1 && isAssignable(ast.body[0].expression)) {
		return {
			type: AST.prototype.AssignmentExpression,
			left: ast.body[0].expression,
			right: { type: AST.prototype.NGValueParameter },
			operator: "="
		};
	}
}

function isLiteral(ast) {
	return (
		ast.body.length === 0 ||
		(ast.body.length === 1 &&
			(ast.body[0].expression.type === AST.prototype.Literal ||
				ast.body[0].expression.type === AST.prototype.ArrayExpression ||
				ast.body[0].expression.type === AST.prototype.ObjectExpression))
	);
}

function isConstant(ast) {
	return ast.constant;
}

function ASTCompiler(astBuilder, $filter) {
	this.astBuilder = astBuilder;
	this.$filter = $filter;
}

ASTCompiler.prototype = {
	compile: function(expression) {
		var self = this;
		var ast = this.astBuilder.ast(expression);
		this.state = {
			nextId: 0,
			filters: {},
			fn: { vars: [], body: [], own: {} },
			assign: { vars: [], body: [], own: {} },
			inputs: []
		};
		findConstantAndWatchExpressions(ast, self.$filter);
		var extra = "";
		var assignable;
		this.stage = "assign";
		if ((assignable = assignableAST(ast))) {
			this.state.computing = "assign";
			var result = this.nextId();
			this.recurse(assignable, result);
			this.return_(result);
			extra = "fn.assign=" + this.generateFunction("assign", "s,v,l");
		}
		var toWatch = getInputs(ast.body);
		self.stage = "inputs";
		if (!!toWatch) {
			toWatch.forEach(function (watch, key) {
				var fnKey = "fn" + key;
				self.state[fnKey] = { vars: [], body: [], own: {} };
				self.state.computing = fnKey;
				var intoId = self.nextId();
				self.recurse(watch, intoId);
				self.return_(intoId);
				self.state.inputs.push(fnKey);
				watch.watchId = key;
			});
		}
		this.state.computing = "fn";
		this.stage = "main";
		this.recurse(ast);
		var fnString =
			// The build and minification steps remove the string "use strict" from the code, but this is done using a regex.
			// This is a workaround for this until we do a better job at only removing the prefix only when we should.
			'"' +
			this.USE +
			" " +
			this.STRICT +
			'";\n' +
			this.filterPrefix() +
			"var fn=" +
			this.generateFunction("fn", "s,l,a,i") +
			extra +
			this.watchFns() +
			"return fn;";
		// eslint-disable-next-line no-new-func
		var fn = new Function(
			"$filter",
			"getStringValue",
			"ifDefined",
			"plus",
			fnString
		)(this.$filter, getStringValue, ifDefined, plusFn);

		this.state = this.stage = undefined;
		fn.ast = ast;
		fn.literal = isLiteral(ast);
		fn.constant = isConstant(ast);
		return fn;
	},

	USE: "use",

	STRICT: "strict",

	watchFns: function() {
		var result = [];
		var fns = this.state.inputs;
		var self = this;
		fns.forEach(function(name) {
			result.push("var " + name + "=" + self.generateFunction(name, "s"));
		});
		if (fns.length) {
			result.push("fn.inputs=[" + fns.join(",") + "];");
		}
		return result.join("");
	},

	generateFunction: function(name, params) {
		return (
			"function(" +
			params +
			"){" +
			this.varsPrefix(name) +
			this.body(name) +
			"};"
		);
	},

	filterPrefix: function() {
		var parts = [];
		var self = this;
		Object.keys(this.state.filters).forEach(function(id) {
            let filter = this.state.filters[id];
			parts.push(id + "=$filter(" + self.escape(filter) + ")");
		});
		if (parts.length) return "var " + parts.join(",") + ";";
		return "";
	},

	varsPrefix: function(section) {
		return this.state[section].vars.length
			? "var " + this.state[section].vars.join(",") + ";"
			: "";
	},

	body: function(section) {
		return this.state[section].body.join("");
	},

	recurse: function(
		ast,
		intoId,
		nameId,
		recursionFn,
		create,
		skipWatchIdCheck
	) {
		var left,
			right,
			self = this,
			args,
			expression,
			computed;
		recursionFn = recursionFn || noop;
		if (!skipWatchIdCheck && isDefined(ast.watchId)) {
			intoId = intoId || this.nextId();
			this.if_(
				"i",
				this.lazyAssign(intoId, this.computedMember("i", ast.watchId)),
				this.lazyRecurse(ast, intoId, nameId, recursionFn, create, true)
			);
			return;
		}
		switch (ast.type) {
			case AST.prototype.Program:
				ast.body.forEach(function(expression, pos) {
					self.recurse(expression.expression, undefined, undefined, function(
						expr
					) {
						right = expr;
					});
					if (pos !== ast.body.length - 1) {
						self.current().body.push(right, ";");
					} else {
						self.return_(right);
					}
				});
				break;
			case AST.prototype.Literal:
				expression = this.escape(ast.value);
				this.assign(intoId, expression);
				recursionFn(intoId || expression);
				break;
			case AST.prototype.UnaryExpression:
				this.recurse(ast.argument, undefined, undefined, function(expr) {
					right = expr;
				});
				expression = ast.operator + "(" + this.ifDefined(right, 0) + ")";
				this.assign(intoId, expression);
				recursionFn(expression);
				break;
			case AST.prototype.BinaryExpression:
				this.recurse(ast.left, undefined, undefined, function(expr) {
					left = expr;
				});
				this.recurse(ast.right, undefined, undefined, function(expr) {
					right = expr;
				});
				if (ast.operator === "+") {
					expression = this.plus(left, right);
				} else if (ast.operator === "-") {
					expression =
						this.ifDefined(left, 0) + ast.operator + this.ifDefined(right, 0);
				} else {
					expression = "(" + left + ")" + ast.operator + "(" + right + ")";
				}
				this.assign(intoId, expression);
				recursionFn(expression);
				break;
			case AST.prototype.LogicalExpression:
				intoId = intoId || this.nextId();
				self.recurse(ast.left, intoId);
				self.if_(
					ast.operator === "&&" ? intoId : self.not(intoId),
					self.lazyRecurse(ast.right, intoId)
				);
				recursionFn(intoId);
				break;
			case AST.prototype.ConditionalExpression:
				intoId = intoId || this.nextId();
				self.recurse(ast.test, intoId);
				self.if_(
					intoId,
					self.lazyRecurse(ast.alternate, intoId),
					self.lazyRecurse(ast.consequent, intoId)
				);
				recursionFn(intoId);
				break;
			case AST.prototype.Identifier:
				intoId = intoId || this.nextId();
				if (nameId) {
					nameId.context =
						self.stage === "inputs"
							? "s"
							: this.assign(
									this.nextId(),
									this.getHasOwnProperty("l", ast.name) + "?l:s"
							  );
					nameId.computed = false;
					nameId.name = ast.name;
				}
				self.if_(
					self.stage === "inputs" ||
						self.not(self.getHasOwnProperty("l", ast.name)),
					function() {
						self.if_(
							self.stage === "inputs" ||
								self.and_(
									"s",
									self.or_(
										self.isNull(self.nonComputedMember("s", ast.name)),
										self.hasOwnProperty_("s", ast.name)
									)
								),
							function() {
								if (create && create !== 1) {
									self.if_(
										self.isNull(self.nonComputedMember("s", ast.name)),
										self.lazyAssign(self.nonComputedMember("s", ast.name), "{}")
									);
								}
								self.assign(intoId, self.nonComputedMember("s", ast.name));
							}
						);
					},
					intoId &&
						self.lazyAssign(intoId, self.nonComputedMember("l", ast.name))
				);
				recursionFn(intoId);
				break;
			case AST.prototype.MemberExpression:
				left = (nameId && (nameId.context = this.nextId())) || this.nextId();
				intoId = intoId || this.nextId();
				self.recurse(
					ast.object,
					left,
					undefined,
					function() {
						var member = null;
						if (ast.computed) {
							right = self.nextId();
							member = self.computedMember(left, right);
						} else {
							member = self.nonComputedMember(left, ast.property.name);
							right = ast.property.name;
						}

						if (ast.computed) {
							if (ast.property.type === AST.prototype.Literal) {
								self.recurse(ast.property, right);
							}
						}
						self.if_(
							self.and_(
								self.notNull(left),
								self.or_(
									self.isNull(member),
									self.hasOwnProperty_(left, right, ast.computed)
								)
							),
							function() {
								if (ast.computed) {
									if (ast.property.type !== AST.prototype.Literal) {
										self.recurse(ast.property, right);
									}
									if (create && create !== 1) {
										self.if_(self.not(member), self.lazyAssign(member, "{}"));
									}
									self.assign(intoId, member);
									if (nameId) {
										nameId.computed = true;
										nameId.name = right;
									}
								} else {
									if (create && create !== 1) {
										self.if_(
											self.isNull(member),
											self.lazyAssign(member, "{}")
										);
									}
									self.assign(intoId, member);
									if (nameId) {
										nameId.computed = false;
										nameId.name = ast.property.name;
									}
								}
							},
							function() {
								self.assign(intoId, "undefined");
							}
						);
						recursionFn(intoId);
					},
					!!create
				);
				break;
			case AST.prototype.CallExpression:
				intoId = intoId || this.nextId();
				if (ast.filter) {
					right = self.filter(ast.callee.name);
					args = [];
					ast.arguments.forEach(function(expr) {
						var argument = self.nextId();
						self.recurse(expr, argument);
						args.push(argument);
					});
					expression = right + ".call(" + right + "," + args.join(",") + ")";
					self.assign(intoId, expression);
					recursionFn(intoId);
				} else {
					right = self.nextId();
					left = {};
					args = [];
					self.recurse(ast.callee, right, left, function() {
						self.if_(
							self.notNull(right),
							function() {
								ast.arguments.forEach(function(expr) {
									self.recurse(
										expr,
										ast.constant ? undefined : self.nextId(),
										undefined,
										function(argument) {
											args.push(argument);
										}
									);
								});
								if (left.name) {
									var x = self.member(left.context, left.name, left.computed);
									expression =
										x + ".call(" + [left.context].concat(args).join(",") + ")";
								} else {
									expression = right + "(" + args.join(",") + ")";
								}
								self.assign(intoId, expression);
							},
							function() {
								self.assign(intoId, "undefined");
							}
						);
						recursionFn(intoId);
					});
				}
				break;
			case AST.prototype.AssignmentExpression:
				right = this.nextId();
				left = {};
				this.recurse(
					ast.left,
					undefined,
					left,
					function() {
						self.if_(
							self.and_(
								self.notNull(left.context),
								self.or_(
									self.hasOwnProperty_(left.context, left.name),
									self.isNull(
										self.member(left.context, left.name, left.computed)
									)
								)
							),
							function() {
								self.recurse(ast.right, right);
								expression =
									self.member(left.context, left.name, left.computed) +
									ast.operator +
									right;
								self.assign(intoId, expression);
								recursionFn(intoId || expression);
							}
						);
					},
					1
				);
				break;
			case AST.prototype.ArrayExpression:
				args = [];
				ast.elements.forEach(function(expr) {
					self.recurse(
						expr,
						ast.constant ? undefined : self.nextId(),
						undefined,
						function(argument) {
							args.push(argument);
						}
					);
				});
				expression = "[" + args.join(",") + "]";
				this.assign(intoId, expression);
				recursionFn(intoId || expression);
				break;
			case AST.prototype.ObjectExpression:
				args = [];
				computed = false;
				ast.properties.forEach(function(property) {
					if (property.computed) {
						computed = true;
					}
				});
				if (computed) {
					intoId = intoId || this.nextId();
					this.assign(intoId, "{}");
					ast.properties.forEach( function(property) {
						if (property.computed) {
							left = self.nextId();
							self.recurse(property.key, left);
						} else {
							left =
								property.key.type === AST.prototype.Identifier
									? property.key.name
									: "" + property.key.value;
						}
						right = self.nextId();
						self.recurse(property.value, right);
						self.assign(self.member(intoId, left, property.computed), right);
					});
				} else {
					ast.properties.forEach( function(property) {
						self.recurse(
							property.value,
							ast.constant ? undefined : self.nextId(),
							undefined,
							function(expr) {
								args.push(
									self.escape(
										property.key.type === AST.prototype.Identifier
											? property.key.name
											: "" + property.key.value
									) +
										":" +
										expr
								);
							}
						);
					});
					expression = "{" + args.join(",") + "}";
					this.assign(intoId, expression);
				}
				recursionFn(intoId || expression);
				break;
			case AST.prototype.ThisExpression:
				this.assign(intoId, "s");
				recursionFn(intoId || "s");
				break;
			case AST.prototype.LocalsExpression:
				this.assign(intoId, "l");
				recursionFn(intoId || "l");
				break;
			case AST.prototype.NGValueParameter:
				this.assign(intoId, "v");
				recursionFn(intoId || "v");
				break;
		}
	},

	getHasOwnProperty: function(element, property) {
		var key = element + "." + property;
		var own = this.current().own;
		if (!own.hasOwnProperty(key)) {
			own[key] = this.nextId(
				false,
				element + "&&(" + this.escape(property) + " in " + element + ")"
			);
		}
		return own[key];
	},

	assign: function(id, value) {
		if (!id) return;
		this.current().body.push(id, "=", value, ";");
		return id;
	},

	filter: function(filterName) {
		if (!this.state.filters.hasOwnProperty(filterName)) {
			this.state.filters[filterName] = this.nextId(true);
		}
		return this.state.filters[filterName];
	},

	ifDefined: function(id, defaultValue) {
		return "ifDefined(" + id + "," + this.escape(defaultValue) + ")";
	},

	plus: function(left, right) {
		return "plus(" + left + "," + right + ")";
	},

	return_: function(id) {
		this.current().body.push("return ", id, ";");
	},

	if_: function(test, alternate, consequent) {
		if (test === true) {
			alternate();
		} else {
			var body = this.current().body;
			body.push("if(", test, "){");
			alternate();
			body.push("}");
			if (consequent) {
				body.push("else{");
				consequent();
				body.push("}");
			}
		}
	},
	or_: function(expr1, expr2) {
		return "(" + expr1 + ") || (" + expr2 + ")";
	},
	hasOwnProperty_: function(obj, prop, computed) {
		if (computed) {
			return "(Object.prototype.hasOwnProperty.call(" + obj + "," + prop + "))";
		} else {
			return (
				"(Object.prototype.hasOwnProperty.call(" + obj + ",'" + prop + "'))"
			);
		}
	},
	and_: function(expr1, expr2) {
		return "(" + expr1 + ") && (" + expr2 + ")";
	},
	not: function(expression) {
		return "!(" + expression + ")";
	},

	isNull: function(expression) {
		return expression + "==null";
	},

	notNull: function(expression) {
		return expression + "!=null";
	},

	nonComputedMember: function(left, right) {
		var SAFE_IDENTIFIER = /^[$_a-zA-Z][$_a-zA-Z0-9]*$/;
		var UNSAFE_CHARACTERS = /[^$_a-zA-Z0-9]/g;
		var expr = "";
		if (SAFE_IDENTIFIER.test(right)) {
			expr = left + "." + right;
		} else {
			right = right.replace(UNSAFE_CHARACTERS, this.stringEscapeFn);
			expr = left + '["' + right + '"]';
		}

		return expr;
	},

	computedMember: function(left, right) {
		return left + "[" + right + "]";
	},

	member: function(left, right, computed) {
		if (computed) return this.computedMember(left, right);
		return this.nonComputedMember(left, right);
	},

	getStringValue: function(item) {
		this.assign(item, "getStringValue(" + item + ")");
	},

	lazyRecurse: function(
		ast,
		intoId,
		nameId,
		recursionFn,
		create,
		skipWatchIdCheck
	) {
		var self = this;
		return function() {
			self.recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck);
		};
	},

	lazyAssign: function(id, value) {
		var self = this;
		return function() {
			self.assign(id, value);
		};
	},

	stringEscapeRegex: /[^ a-zA-Z0-9]/g,

	stringEscapeFn: function(c) {
		return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
	},

	escape: function(value) {
		if (isString(value))
			return (
				"'" + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'"
			);
		if (isNumber(value)) return value.toString();
		if (value === true) return "true";
		if (value === false) return "false";
		if (value === null) return "null";
		if (typeof value === "undefined") return "undefined";

		throw this.throwError("esc", "IMPOSSIBLE");
	},

	nextId: function(skip, init) {
		var id = "v" + this.state.nextId++;
		if (!skip) {
			this.current().vars.push(id + (init ? "=" + init : ""));
		}
		return id;
	},

	current: function() {
		return this.state[this.state.computing];
	}
};

function ASTInterpreter(astBuilder, $filter) {
	this.astBuilder = astBuilder;
	this.$filter = $filter;
}

ASTInterpreter.prototype = {
	compile: function(expression) {
		var self = this;
		var ast = this.astBuilder.ast(expression);
		findConstantAndWatchExpressions(ast, self.$filter);
		var assignable;
		var assign;
		if ((assignable = assignableAST(ast))) {
			assign = this.recurse(assignable);
		}
		var toWatch = getInputs(ast.body);
		var inputs;
		if (toWatch) {
			inputs = [];
			toWatch.forEach(function(watch, key) {
				var input = self.recurse(watch);
				watch.input = input;
				inputs.push(input);
				watch.watchId = key;
			});
		}
		var expressions = [];
		ast.body.forEach(function(expression) {
			expressions.push(self.recurse(expression.expression));
		});
		var fn =
			ast.body.length === 0
				? noop
				: ast.body.length === 1
				? expressions[0]
				: function(scope, locals) {
						var lastValue;
						expressions.forEach(function(exp) {
							lastValue = exp(scope, locals);
						});
						return lastValue;
				  };

		if (assign) {
			fn.assign = function(scope, value, locals) {
				return assign(scope, locals, value);
			};
		}
		if (inputs) {
			fn.inputs = inputs;
		}
		fn.ast = ast;
		fn.literal = isLiteral(ast);
		fn.constant = isConstant(ast);
		return fn;
	},

	recurse: function(ast, context, create) {
		var left,
			right,
			self = this,
			args;
		if (ast.input) {
			return this.inputs(ast.input, ast.watchId);
		}
		switch (ast.type) {
			case AST.prototype.Literal:
				return this.value(ast.value, context);
			case AST.prototype.UnaryExpression:
				right = this.recurse(ast.argument);
				return this["unary" + ast.operator](right, context);
			case AST.prototype.BinaryExpression:
				left = this.recurse(ast.left);
				right = this.recurse(ast.right);
				return this["binary" + ast.operator](left, right, context);
			case AST.prototype.LogicalExpression:
				left = this.recurse(ast.left);
				right = this.recurse(ast.right);
				return this["binary" + ast.operator](left, right, context);
			case AST.prototype.ConditionalExpression:
				return this["ternary?:"](
					this.recurse(ast.test),
					this.recurse(ast.alternate),
					this.recurse(ast.consequent),
					context
				);
			case AST.prototype.Identifier:
				return self.identifier(ast.name, context, create);
			case AST.prototype.MemberExpression:
				left = this.recurse(ast.object, false, !!create);
				if (!ast.computed) {
					right = ast.property.name;
				}
				if (ast.computed) right = this.recurse(ast.property);
				return ast.computed
					? this.computedMember(left, right, context, create)
					: this.nonComputedMember(left, right, context, create);
			case AST.prototype.CallExpression:
				args = [];
				ast.arguments.forEach(function(expr) {
					args.push(self.recurse(expr));
				});
				if (ast.filter) right = this.$filter(ast.callee.name);
				if (!ast.filter) right = this.recurse(ast.callee, true);
				return ast.filter
					? function(scope, locals, assign, inputs) {
							var values = [];
							for (var i = 0; i < args.length; ++i) {
								values.push(args[i](scope, locals, assign, inputs));
							}
							var value = right.apply(undefined, values, inputs);
							return context
								? { context: undefined, name: undefined, value: value }
								: value;
					  }
					: function(scope, locals, assign, inputs) {
							var rhs = right(scope, locals, assign, inputs);
							var value;
							if (rhs.value != null) {
								var values = [];
								for (var i = 0; i < args.length; ++i) {
									values.push(args[i](scope, locals, assign, inputs));
								}
								value = rhs.value.apply(rhs.context, values);
							}
							return context ? { value: value } : value;
					  };
			case AST.prototype.AssignmentExpression:
				left = this.recurse(ast.left, true, 1);
				right = this.recurse(ast.right);
				return function(scope, locals, assign, inputs) {
					var lhs = left(scope, locals, assign, inputs);
					var rhs = right(scope, locals, assign, inputs);
					lhs.context[lhs.name] = rhs;
					return context ? { value: rhs } : rhs;
				};
			case AST.prototype.ArrayExpression:
				args = [];
				ast.elements.forEach(function(expr) {
					args.push(self.recurse(expr));
				});
				return function(scope, locals, assign, inputs) {
					var value = [];
					for (var i = 0; i < args.length; ++i) {
						value.push(args[i](scope, locals, assign, inputs));
					}
					return context ? { value: value } : value;
				};
			case AST.prototype.ObjectExpression:
				args = [];
				ast.properties.forEach(function(property) {
					if (property.computed) {
						args.push({
							key: self.recurse(property.key),
							computed: true,
							value: self.recurse(property.value)
						});
					} else {
						args.push({
							key:
								property.key.type === AST.prototype.Identifier
									? property.key.name
									: "" + property.key.value,
							computed: false,
							value: self.recurse(property.value)
						});
					}
				});
				return function(scope, locals, assign, inputs) {
					var value = {};
					for (var i = 0; i < args.length; ++i) {
						if (args[i].computed) {
							value[args[i].key(scope, locals, assign, inputs)] = args[i].value(
								scope,
								locals,
								assign,
								inputs
							);
						} else {
							value[args[i].key] = args[i].value(scope, locals, assign, inputs);
						}
					}
					return context ? { value: value } : value;
				};
			case AST.prototype.ThisExpression:
				return function(scope) {
					return context ? { value: scope } : scope;
				};
			case AST.prototype.LocalsExpression:
				return function(scope, locals) {
					return context ? { value: locals } : locals;
				};
			case AST.prototype.NGValueParameter:
				return function(scope, locals, assign) {
					return context ? { value: assign } : assign;
				};
		}
	},

	"unary+": function(argument, context) {
		return function(scope, locals, assign, inputs) {
			var arg = argument(scope, locals, assign, inputs);
			if (isDefined(arg)) {
				arg = +arg;
			} else {
				arg = 0;
			}
			return context ? { value: arg } : arg;
		};
	},
	"unary-": function(argument, context) {
		return function(scope, locals, assign, inputs) {
			var arg = argument(scope, locals, assign, inputs);
			if (isDefined(arg)) {
				arg = -arg;
			} else {
				arg = -0;
			}
			return context ? { value: arg } : arg;
		};
	},
	"unary!": function(argument, context) {
		return function(scope, locals, assign, inputs) {
			var arg = !argument(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary+": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var lhs = left(scope, locals, assign, inputs);
			var rhs = right(scope, locals, assign, inputs);
			var arg = plusFn(lhs, rhs);
			return context ? { value: arg } : arg;
		};
	},
	"binary-": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var lhs = left(scope, locals, assign, inputs);
			var rhs = right(scope, locals, assign, inputs);
			var arg = (isDefined(lhs) ? lhs : 0) - (isDefined(rhs) ? rhs : 0);
			return context ? { value: arg } : arg;
		};
	},
	"binary*": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) *
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary/": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) /
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary%": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) %
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary===": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) ===
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary!==": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) !==
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary==": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			// eslint-disable-next-line eqeqeq
			var arg =
				left(scope, locals, assign, inputs) ==
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary!=": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			// eslint-disable-next-line eqeqeq
			var arg =
				left(scope, locals, assign, inputs) !=
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary<": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) <
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary>": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) >
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary<=": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) <=
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary>=": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) >=
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary&&": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) &&
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary||": function(left, right, context) {
		return function(scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) ||
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"ternary?:": function(test, alternate, consequent, context) {
		return function(scope, locals, assign, inputs) {
			var arg = test(scope, locals, assign, inputs)
				? alternate(scope, locals, assign, inputs)
				: consequent(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	value: function(value, context) {
		return function() {
			return context
				? { context: undefined, name: undefined, value: value }
				: value;
		};
	},
	identifier: function(name, context, create) {
		return function(scope, locals, assign, inputs) {
			var base = locals && name in locals ? locals : scope;
			if (create && create !== 1 && base && base[name] == null) {
				base[name] = {};
			}
			var value = base ? base[name] : undefined;
			if (context) {
				return { context: base, name: name, value: value };
			} else {
				return value;
			}
		};
	},
	computedMember: function(left, right, context, create) {
		return function(scope, locals, assign, inputs) {
			var lhs = left(scope, locals, assign, inputs);
			var rhs;
			var value;
			if (lhs != null) {
				rhs = right(scope, locals, assign, inputs);
				rhs = getStringValue(rhs);
				if (create && create !== 1) {
					if (lhs && !lhs[rhs]) {
						lhs[rhs] = {};
					}
				}
				if (Object.prototype.hasOwnProperty.call(lhs, rhs)) {
					value = lhs[rhs];
				}
			}
			if (context) {
				return { context: lhs, name: rhs, value: value };
			} else {
				return value;
			}
		};
	},
	nonComputedMember: function(left, right, context, create) {
		return function(scope, locals, assign, inputs) {
			var lhs = left(scope, locals, assign, inputs);
			if (create && create !== 1) {
				if (lhs && lhs[right] == null) {
					lhs[right] = {};
				}
			}
			var value = undefined;
			if (lhs != null && Object.prototype.hasOwnProperty.call(lhs, right)) {
				value = lhs[right];
			}

			if (context) {
				return { context: lhs, name: right, value: value };
			} else {
				return value;
			}
		};
	},
	inputs: function(input, watchId) {
		return function(scope, value, locals, inputs) {
			if (inputs) return inputs[watchId];
			return input(scope, value, locals);
		};
	}
};

/**
 * constructor
 */
export function Parser(lexer, $filter, options) {
	this.lexer = lexer;
	this.$filter = $filter;
	this.options = options;
	this.ast = new AST(lexer, options);
	this.astCompiler = options.csp
		? new ASTInterpreter(this.ast, $filter)
		: new ASTCompiler(this.ast, $filter);
};

Parser.prototype = {
	constructor: Parser,

	parse: function(text) {
		return this.astCompiler.compile(text);
	}
};

function getValueOf(value) {
	return isFunction(value.valueOf)
		? value.valueOf()
		: objectValueOf.call(value);
}

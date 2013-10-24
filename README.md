bit-vector.jsx
===========================================

Synopsis
---------------

Succinct Bit Vector implementation for JSX/JS/AMD/CommonJS

Motivation
---------------

This code is a part of [Oktavia](http://oktavia.info). Bit Vector is used to reduce memory foot print to store suffix array and
provides some high speed operation in O(1) - O(N).

Code Example
---------------

### Use from JSX

```js
import "bit-vector.jsx";

class _Main {
    static function main(argv : string[]) : void
    {
        // Rank: number of bits before specified position

        var bv = new Uint32BitVector(8);
        bv.set(2);
        bv.set(3);
        bv.set(6):
        bv.build(); // 00110010

        console.log(bv.rank(0)); // -> 0
        console.log(bv.rank(1)); // -> 0
        console.log(bv.rank(2)); // -> 1
        console.log(bv.rank(3)); // -> 2
        console.log(bv.rank(4)); // -> 2
        console.log(bv.rank(5)); // -> 2
        console.log(bv.rank(6)); // -> 3
        console.log(bv.rank(7)); // -> 3

        // Compress array that has many empty spaces by using BitVector.rank()
        var original = [0, 0, 200, 300, 0, 0, 500, 0]; < 8 x 8 = 64 byte
        var pos = 7;
        var getNum = original[pos]; // => 500;

        var values = [200, 300, 500]; // => 24 byte + 4 byte(uint32).
        var getNum2 = values[bv.rank(pos)]; // => 500; Same value!

        // Select: return x-th bit from first
        console.log(bv.select(0)); // -> 0
        console.log(bv.select(1)); // -> 2
        console.log(bv.select(2)); // -> 3
        console.log(bv.select(3)); // -> 6

        // Find the word that specified character belongs to.
        var words = "hello world succinct bit vector";
        var bv2 = new Uint32BitVector(words.length);
        bv.set(6);
        bv.set(12);
        bv.set(21);
        bv.set(25);
        bv.build();

        console.log(bv.select(10)); // -> 1: 10th character belongs to second word.
    }
}
```

### Use from node.js

```js
var ArrayBitVector = require('bit-vector.common.js').ArrayBitVector;
var Uint32BitVector = require('bit-vector.common.js').Uint32BitVector;
```

### Use from require.js

```js
// use bit-vector.amd.js
define(['bit-vector.jsx'], function (bitvector) {

    ArrayBitVector = bitvector.ArrayBitVector;
    Uint32BitVector = bitvector.Uint32BitVector;
});
```

### Use via standard JSX function

```html
<script src="bit-vector.js}}" type="text/javascript"></script>
<script type="text/javascript">
window.onload = function () {
    var ArrayBitVector = JSX.require("src/bit-vector.js").ArrayBitVector;
    var Uint32BitVector = JSX.require("src/bit-vector.js").Uint32BitVector;
});
</script>
```

### Use via global variables

```html
<script src="bit-vector.global.js}}" type="text/javascript"></script>
<script type="text/javascript">
window.onload = function () {
    var bv = new ArrayBitVector();
    var bv2 = new Uint32BitVector(10);
});
</script>
```

Installation
---------------

```sh
$ npm install bit-vector.jsx
```

API Reference
------------------

### ArrayBitVector implements BitVector

Constructor for bit vector based on int[]. This version resizes length automatically, but each only memory efficiency is 50%.
This is JavaScript limitation because it has only 64bit floating point number and it uses only 32bit part as integer.

### Uint32BitVector(size : int) implements BitVector

Constructor for bit vector based on Uint32bitVector. This version is fixed size, but memory efficiency is better than `ArrayBitVector`.

### BitVector.size() : int

It returns BitVector size. `set` extends this size.

### BitVector.set(pos : int, flag : boolean = true) : void

It sets bit. If `flag` is `false`, it inverts bit at specified position.

### BitVector.get(pos : int) : boolean

It returns bit of specified position.

### BitVector.build() : void

Precalculates rank() number. It should be called before using `select()` and `rank()`.

### BitVector.rank(pos : int, flag : boolean = true) : int

Counts number of bits before specified position. If flag is `false` it calcs count inverted bits.

### BitVector.select(pos : int, flag : boolean = true) : int

Returns x-th bit from first. If flag is `false` it returns position of specified x-th inverted bits.

### BitVector.dump(output : BinaryOutput) : void

Export bit-vector.

### BitVector.load(input : BinaryInput) : void

Import bit-vector.

Development
-------------

## JSX

Don't afraid [JSX](http://jsx.github.io)! If you have an experience of JavaScript, you can learn JSX
quickly.

* Static type system and unified class syntax.
* All variables and methods belong to class.
* JSX includes optimizer. You don't have to write tricky unreadalbe code for speed.
* You can use almost all JavaScript API as you know. Some functions become static class functions. See [reference](http://jsx.github.io/doc/stdlibref.html).

## Setup

To create development environment, call following command:

```sh
$ npm install
```

## Repository

* Repository: git:/github.com/shibukawa/bit-vector.jsx.git
* Issues: Repository: https:/github.com/shibukawa/bit-vector.jsx/issues

## Run Test

```sh
$ grunt test
```

## Build

```sh
$ grunt build
```

## Generate API reference

```sh
$ grunt doc
```

Author
---------

* shibukawa / yoshiki@shibu.jp

License
------------

MIT

Complete license is written in `LICENSE.md`.

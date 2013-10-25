/**
 * This is a JSX version of shellinford library:
 * https://code.google.com/p/shellinford/
 *
 * License: http://shibu.mit-license.org/
 */

import "binary-io.jsx";

class _BitVectorConst
{
    static const SMALL_BLOCK_SIZE : int =  32;
    static const LARGE_BLOCK_SIZE : int = 256;
    static const BLOCK_RATE       : int =   8;
}

mixin _BitVector.<T>
{
    var _v : T;
    var _r : T;
    var _size : int;
    var _size1 : int;

    /**
     * Clears bit-vector.
     */
    abstract function clear () : void;
    /**
     * Precalculates rank() number. It should be called before using select() and rank().
     */
    abstract function build () : void;

    /**
     * It returns bit-vector length
     */
    function size () : int
    {
        return this._size;
    }

    /**
     * It returns number of 0 bit in bit-vector.
     */
    function size0 () : int
    {
        return this._size - this._size1;
    }

    /**
     * It returns number of 1 bit in bit-vector.
     */
    function size1 () : int
    {
        return this._size1;
    }

    abstract function set0 (pos : int) : void;
    abstract function set1 (pos : int) : void;

    function get (value : int) : boolean
    {
        if (value >= this.size())
        {
            throw new Error("BitVector.get() : range error");
        }
        var q : int = value / _BitVectorConst.SMALL_BLOCK_SIZE;
        var r : int = value % _BitVectorConst.SMALL_BLOCK_SIZE;
        var m : int = 0x1 << r;
        return (this._v[q] & m) as boolean;
    }

    function rank0 (i : int) : int
    {
        return this._rank(i, false);
    }

    function rank1 (i : int) : int
    {
        return this._rank(i, true);
    }

    function _rank (i : int, b : boolean) : int
    {
        if (i > this.size())
        {
            throw new Error("BitVector.rank() : range error");
        }
        if (i == 0)
        {
            return 0;
        }
        i--;
        var q_large : int = Math.floor(i / _BitVectorConst.LARGE_BLOCK_SIZE);
        var q_small : int = Math.floor(i / _BitVectorConst.SMALL_BLOCK_SIZE);
        var r       : int = Math.floor(i % _BitVectorConst.SMALL_BLOCK_SIZE);
        var rank : int = this._r[q_large];
        if (!b)
        {
            rank = q_large * _BitVectorConst.LARGE_BLOCK_SIZE - rank;
        }
        var begin = q_large * _BitVectorConst.BLOCK_RATE;
        for (var j = begin; j < q_small; j++)
        {
            rank += this._rank32(this._v[j], _BitVectorConst.SMALL_BLOCK_SIZE, b);
        }
        rank += this._rank32(this._v[q_small], r + 1, b);
        return rank;
    }

    function select0 (i : int) : int
    {
        return this._select(i, false, this.size0());
    }

    function select1 (i : int) : int
    {
        return this._select(i, true, this.size1());
    }

    function _select (i : int, b : boolean, size : int) : int
    {
        if (i >= size)
        {
            throw new Error("BitVector.select() : range error");
        }

        var left  = 0;
        var right = this._r.length;
        while (left < right)
        {
            var pivot = Math.floor((left + right) / 2);
            var rank  = this._r[pivot];
            if (!b)
            {
                rank = pivot * _BitVectorConst.LARGE_BLOCK_SIZE - rank;
            }
            if (i < rank)
            {
                right = pivot;
            }
            else
            {
                left = pivot + 1;
            }
        }
        right--;

        if (b)
        {
            i -= this._r[right];
        }
        else
        {
            i -= right * _BitVectorConst.LARGE_BLOCK_SIZE - this._r[right];
        }
        var j = right * _BitVectorConst.BLOCK_RATE;
        while (1)
        {
            var rank = this._rank32(this._v[j], _BitVectorConst.SMALL_BLOCK_SIZE, b);
            if (i < rank)
            {
                break;
            }
            j++;
            i -= rank;
        }
        return j * _BitVectorConst.SMALL_BLOCK_SIZE + this._select32(this._v[j], i, b);
    }

    function _rank32 (x : int, i : int, b : boolean) : int
    {
        if (!b)
        {
            x = ~x;
        }
        x <<= (_BitVectorConst.SMALL_BLOCK_SIZE - i);
        x = ((x & 0xaaaaaaaa) >>>  1)
          +  (x & 0x55555555);
        x = ((x & 0xcccccccc) >>>  2)
          +  (x & 0x33333333);
        x = ((x & 0xf0f0f0f0) >>>  4)
          +  (x & 0x0f0f0f0f);
        x = ((x & 0xff00ff00) >>>  8)
          +  (x & 0x00ff00ff);
        x = ((x & 0xffff0000) >>> 16)
          +  (x & 0x0000ffff);
        return x;
    }

    function _select32(x : int, i : int, b : boolean) : int
    {
        if (!b)
        {
            x = ~x;
        }
        var x1 = ((x  & 0xaaaaaaaa) >>>  1)
               +  (x  & 0x55555555);
        var x2 = ((x1 & 0xcccccccc) >>>  2)
               +  (x1 & 0x33333333);
        var x3 = ((x2 & 0xf0f0f0f0) >>>  4)
               +  (x2 & 0x0f0f0f0f);
        var x4 = ((x3 & 0xff00ff00) >>>  8)
               +  (x3 & 0x00ff00ff);
        var x5 = ((x4 & 0xffff0000) >>> 16)
               +  (x4 & 0x0000ffff);
        i++;
        var pos = 0;
        var v5 = x5 & 0xffffffff;
        if (i > v5)
        {
            i -= v5;
            pos += 32;
        }
        var v4 = (x4 >>> pos) & 0x0000ffff;
        if (i > v4)
        {
            i -= v4;
            pos += 16;
        }
        var v3 = (x3 >>> pos) & 0x000000ff;
        if (i > v3)
        {
            i -= v3;
            pos += 8;
        }
        var v2 = (x2 >>> pos) & 0x0000000f;
        if (i > v2)
        {
            i -= v2;
            pos += 4;
        }
        var v1 = (x1 >>> pos) & 0x00000003;
        if (i > v1)
        {
            i -= v1;
            pos += 2;
        }
        var v0 = (x >>> pos) & 0x00000001;
        if (i > v0)
        {
            i -= v0;
            pos += 1;
        }
        return pos;
    }

    abstract function dump (output : BinaryOutput) : void;
    abstract function load (input : BinaryInput) : void;
}

class ArrayBitVector implements _BitVector.<number[]>
{
    /**
     * Constructor for bit vector based on int[]. This version resizes length
     * automatically, but each only memory efficiency is 50%.
     * This is JavaScript limitation because it has only 64bit floating point
     * number and it uses only 32bit part as integer.
     */
    function constructor ()
    {
        this._v = [] : number[];
        this._r = [] : number[];
        this.clear();
    }

    /**
     * Clears bit vector.
     */
    override function clear () : void
    {
        this._v.length = 0;
        this._r.length = 0;
        this._size = 0;
        this._size1 = 0;
    }

    /**
     * Precalculates <code>rank()</code> number. It should be called before using
     * <code>select()</code> and <code>rank()</code>.
     */
    override function build () : void
    {
        this._size1 = 0;
        for (var i = 0; i < this._v.length; i++)
        {
            if (i % _BitVectorConst.BLOCK_RATE == 0)
            {
                this._r.push(this.size1());
            }
            this._size1 += this._rank32(this._v[i], _BitVectorConst.SMALL_BLOCK_SIZE, true);
        }
    }

    /**
     * Clear bit.
     *
     * @param value The position you want to operate.
     */
    override function set0 (value : int) : void
    {
        if (value >= this.size())
        {
            this._size = value + 1;
        }
        var q : int = value / _BitVectorConst.SMALL_BLOCK_SIZE;
        var r : int = value % _BitVectorConst.SMALL_BLOCK_SIZE;
        while (q >= this._v.length)
        {
            this._v.push(0);
        }
        var m : int = 0x1 << r;
        this._v[q] &= ~m;
    }

    /**
     * Set bit.
     *
     * @param value The position you want to operate.
     */
    override function set1 (value : int) : void
    {
        if (value >= this.size())
        {
            this._size = value + 1;
        }
        var q : int = value / _BitVectorConst.SMALL_BLOCK_SIZE;
        var r : int = value % _BitVectorConst.SMALL_BLOCK_SIZE;
        while (q >= this._v.length)
        {
            this._v.push(0);
        }
        var m : int = 0x1 << r;
        this._v[q] |=  m;
    }

    override function dump (output : BinaryOutput) : void
    {
        output.dump32bitNumber(this._size);
        output.dump32bitNumberList(this._v);
    }

    override function load (input : BinaryInput) : void
    {
        this.clear();
        this._size = input.load32bitNumber();
        this._v = input.load32bitNumberList();
        this.build();
    }
}

class Uint32BitVector implements _BitVector.<Uint32Array>
{
    /**
     * Constructor for bit vector based on Uint32bitVector. This version
     * is fixed size, but memory efficiency is better than `ArrayBitVector`.
     *
     * @param size BitVector size
     */
    function constructor (size : int)
    {
        this._v = new Uint32Array(Math.ceil(size / _BitVectorConst.SMALL_BLOCK_SIZE));
        this._r = new Uint32Array(Math.ceil(size / _BitVectorConst.LARGE_BLOCK_SIZE));
        this.clear();
    }

    /**
     * Clears bit vector.
     */
    override function clear () : void
    {
        this._size = 0;
        this._size1 = 0;
    }

    /**
     * Precalculates <code>rank()</code> number. It should be called before using
     * <code>select()</code> and <code>rank()</code>.
     */
    override function build () : void
    {
        this._size1 = 0;
        for (var i = 0; i < this._v.length; i++)
        {
            if (i % _BitVectorConst.BLOCK_RATE == 0)
            {
                this._r[i / _BitVectorConst.BLOCK_RATE] = this.size1();
            }
            this._size1 += this._rank32(this._v[i], _BitVectorConst.SMALL_BLOCK_SIZE, true);
        }
    }

    /**
     * Sets bit.
     *
     * @param value The position you want to operate.
     */
    override function set1 (value : int) : void
    {
        if (value >= this.size())
        {
            this._size = value + 1;
        }
        var q : int = value / _BitVectorConst.SMALL_BLOCK_SIZE;
        var r : int = value % _BitVectorConst.SMALL_BLOCK_SIZE;
        if (q >= this._v.length)
        {
            throw new Error("BitVector.set() : range error. value should be < initial size / 32");
        }
        var m : int = 0x1 << r;
        this._v[q] |=  m;
    }

    /**
     * Clears bit.
     *
     * @param value The position you want to operate.
     */
    override function set0 (value : int) : void
    {
        if (value >= this.size())
        {
            this._size = value + 1;
        }
        var q : int = value / _BitVectorConst.SMALL_BLOCK_SIZE;
        var r : int = value % _BitVectorConst.SMALL_BLOCK_SIZE;
        if (q >= this._v.length)
        {
            throw new Error("BitVector.set() : range error. value should be < initial size / 32");
        }
        var m : int = 0x1 << r;
        this._v[q] &= ~m;
    }

    override function dump (output : BinaryOutput) : void
    {
        output.dump32bitNumber(this._size);
        var a = [] : number[];
        for (var i = 0; i < this._v.length; i++)
        {
            a.push(this._v[i]);
        }
        output.dump32bitNumberList(a);
    }

    override function load (input : BinaryInput) : void
    {
        this.clear();
        this._size = input.load32bitNumber();
        this._v = new Uint32Array(input.load32bitNumberList());
        this.build();
    }
}

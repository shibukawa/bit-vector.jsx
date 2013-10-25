import "test-case.jsx";
import "bit-vector.jsx";
import "binary-io.jsx";
import "console.jsx";

class _Test extends TestCase
{
    var src_values : int[];
    var bv0 : ArrayBitVector;
    var bv1 : ArrayBitVector;

    override function setUp () : void
    {
        this.bv0 = new ArrayBitVector();
        this.bv1 = new ArrayBitVector();

        this.src_values = [0, 511, 512, 1000, 2000, 3000] : int[];

        for (var i = 0; i <= this.src_values[this.src_values.length - 1]; i++)
        {
            this.bv0.set1(i);
        }

        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.bv1.set1(v);
            this.bv0.set0(v);
        }
        this.bv1.build();
        this.bv0.build();
    }

    function test_size () : void
    {
        this.expect(this.bv1.size()).toBe(this.src_values[this.src_values.length - 1] + 1); // == 3001
        this.expect(this.bv1.size1()).toBe(this.src_values.length); // == 6
        this.expect(this.bv0.size()).toBe(this.src_values[this.src_values.length - 1] + 1); // == 3001
        this.expect(this.bv0.size0()).toBe(this.src_values.length); // == 6
    }

    function test_get () : void
    {
        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.expect(this.bv1.get(v)).toBe(true);
            this.expect(this.bv0.get(v)).toBe(false);
        }
    }

    function test_rank () : void
    {
        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.expect(this.bv1.rank1(v)).toBe(i);
            this.expect(this.bv0.rank0(v)).toBe(i);
        }
    }

    function test_select () : void
    {
        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.expect(this.bv1.select1(i)).toBe(v);
            this.expect(this.bv0.select0(i)).toBe(v);
        }
    }

    function test_load_dump_and_size () : void
    {
        var dump1 = new BinaryOutput();
        var dump0 = new BinaryOutput();
        this.bv1.dump(dump1);
        this.bv0.dump(dump0);
        this.bv1.load(new BinaryInput(dump1.result()));
        this.bv0.load(new BinaryInput(dump0.result()));

        this.expect(this.bv1.size()).toBe(this.src_values[this.src_values.length - 1] + 1); // == 3001
        this.expect(this.bv1.size1()).toBe(this.src_values.length); // == 6
        this.expect(this.bv0.size()).toBe(this.src_values[this.src_values.length - 1] + 1); // == 3001
        this.expect(this.bv0.size0()).toBe(this.src_values.length); // == 6
    }

    function test_load_dump_and_get () : void
    {
        var dump1 = new BinaryOutput();
        var dump0 = new BinaryOutput();
        this.bv1.dump(dump1);
        this.bv0.dump(dump0);
        this.bv1.load(new BinaryInput(dump1.result()));
        this.bv0.load(new BinaryInput(dump0.result()));

        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.expect(this.bv1.get(v)).toBe(true);
            this.expect(this.bv0.get(v)).toBe(false);
        }
    }

    function test_load_dump_and_rank () : void
    {
        var dump1 = new BinaryOutput();
        var dump0 = new BinaryOutput();
        this.bv1.dump(dump1);
        this.bv0.dump(dump0);
        this.bv1.load(new BinaryInput(dump1.result()));
        this.bv0.load(new BinaryInput(dump0.result()));

        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.expect(this.bv1.rank1(v)).toBe(i);
            this.expect(this.bv0.rank0(v)).toBe(i);
        }
    }

    function test_load_dump_and_select () : void
    {
        var dump1 = new BinaryOutput();
        var dump0 = new BinaryOutput();
        this.bv1.dump(dump1);
        this.bv0.dump(dump0);
        this.bv1.load(new BinaryInput(dump1.result()));
        this.bv0.load(new BinaryInput(dump0.result()));

        for (var i = 0; i < this.src_values.length; i++)
        {
            var v = this.src_values[i];
            this.expect(this.bv1.select1(i)).toBe(v);
            this.expect(this.bv0.select0(i)).toBe(v);
        }
    }
}

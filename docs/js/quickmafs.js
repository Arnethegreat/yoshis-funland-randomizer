Uint8Array.prototype.slice = Uint8Array.prototype.slice || function (start, end) {
    var src = this.subarray(start, end);
    var dst = new Uint8Array(src.byteLength);
    dst.set(src); return dst;
}

Uint8Array.prototype.writeBytes = function (b, addr, val) { var _b = b; for (; b--; val >>= 8) this[addr++] = val & 0xFF; return _b; }

//Uint8Array.prototype.readBytes = function(b, addr)
//{ var x = 0, s = 0; for (; b--; s += 8, addr++) x |= (this[addr] & 0xFF) << s; return x; }

function bitsToHex(_arr) {
    var arr = _arr.slice(0);

    var h = '', x, i;
    while (arr.length) {
        var z = arr.splice(0, 4);
        for (x = 0, i = 0; i < z.length; ++i)
            x |= (z[i] ? 1 : 0) << i;
        h += x.toString(16);
    }

    return h;
}

function hexToBits(x) {
    for (var a = [], i = 0; i < x.length; ++i) {
        var v = parseInt(x[i], 16);
        for (var j = 0; j < 4; v >>= 1, ++j) a.push(v & 1);
    }
    return a;
}

function bitset(x, mask) { return (x & mask) == mask; }

function Random(seed) { this.seed = Math.floor(seed || (Math.random() * 0xFFFFFFFF)) % 0xFFFFFFFF; }

Random.prototype.clone = function () { return new Random(this.seed); }

Random.prototype.pull = function (n) { while (n--) this.next(); }

Random.prototype.next = function (z) { return this.seed = ((214013 * this.seed + 2531011) & 0x7fffffff) >> 16; }

Random.prototype.nextFloat = function () { return this.next() / 0x7fff; }

Random.prototype.flipCoin = function (x) { return this.nextFloat() < x; }

// Box-Muller transform, converts uniform distribution to normal distribution
// depends on uniformity of nextFloat(), which I'm not confident of
Random.prototype.nextGaussian = function () {
    var u = this.nextFloat(), v = this.nextFloat();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

Random.prototype.nextInt = function (z) { return (this.nextFloat() * z) | 0; }

Random.prototype.nextIntRange = function (a, b) { return a + this.nextInt(b - a); }

Random.prototype.from = function (arr) { return arr[this.nextInt(arr.length)]; }

Random.prototype.fromWeighted = function (arr) {
    if (!arr._weight) {
        arr._weight = 0;
        for (var i = 0; i < arr.length; ++i)
            arr._weight += arr[i].weight || 1;
    }

    var x = this.nextFloat() * arr._weight;
    for (var i = 0; i < arr.length; ++i)
        if ((x -= arr[i].weight || 1) < 0.0) return arr[i];
    return arr[0];
}

Random.prototype.draw = function (arr) {
    var which = this.nextInt(arr.length);
    return arr.splice(which, 1)[0];
}


Array.prototype.shuffle = function (random) {
    if (!random) random = new Random();
    for (var t, i = 1, j; i < this.length; ++i) {
        j = random.nextInt(i + 1);
        t = this[j]; this[j] = this[i]; this[i] = t;
    }

    return this;
}

Array.prototype.contains = function (x) { return this.indexOf(x) != -1; }

Array.prototype.uniq = function () { return this.filter(function (a) { return !this[a] ? this[a] = true : false; }, {}); }

function __range(n) {
    for (var x = [], i = 0; i < n; ++i) x.push(i);
    return x;
}

Number.prototype.toBin = function (p) {
    var s = p || 'b#', x = (this & 0xFF);
    for (var i = 0x80; i > 0; i >>= 1)
        s += (x & i) ? '1' : '0';
    return s;
}

Number.prototype.toHex = function (n, p) {
    var hex = this.toString(16);
    while (hex.length < n) hex = '0' + hex;
    return (p != null ? p : '') + hex;
}

Number.prototype.toPrintHex = function (n) { return '0x' + this.toHex(n).toUpperCase(); }

function ROMLogger(rom) { this.rom = rom; }

ROMLogger.prototype.start = function () {
    this.orig = new Uint8Array(this.rom.byteLength);
    this.orig.set(this.rom);
    return this;
}

ROMLogger.prototype.print = function () {
    for (var i = 0; i < this.rom.length; ++i) {
        if (this.rom[i] == this.orig[i]) continue;
        console.log(i.toHex(6, '0x') + ' - ' + this.orig[i].toHex(2) + '->' + this.rom[i].toHex(2));
    }
}

var makeCRCTable = function () {
    var c;
    var crcTable = [];
    for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

var CRC_TABLE = [];
for (var i = 0; i < 256; ++i) {
    var c = i;
    for (var j = 0; j < 8; ++j)
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    CRC_TABLE[i] = c;
}

function crc32(arr) {
    var crc = 0 ^ (-1);
    for (var i = 0; i < arr.length; ++i)
        crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ arr[i]) & 0xFF];
    return (crc ^ (-1)) >>> 0;
}

// practically reverses order of array?
function bytesToLittleEndian(arr) {
    for (var i = 0, x = 0; i < arr.length; ++i)
        x |= (arr[i] << (i * 8));
    return x;
}

function littleEndianToBytes(x, k) {
    var arr = [];
    for (var i = 0; i < k; ++i, x >>= 8)
        arr.push(x & 0xFF);
    return arr;
}

// assumes little-endian
function getPointer(off, len, rom) {
    for (var i = 0, x = 0; i < len; ++i)
        x |= (rom[off + i] << (i * 8));
    return x;
}

function getBigEndian(off, len, rom) {
    for (var i = 0, x = 0; i < len; ++i)
        x = (x << 8) | rom[off + i];
    return x;
}

function snesAddressToOffset(addr) {
    // bank (high byte) * 0x8000 + addr (low 2 bytes) - 0x8000
    // TODO: Add dickbutt addressing support
    return ((addr & 0xFF0000) >> 1) + (addr & 0x00FFFF) - 0x8000;
}

function offsetToSnesAddress(x) {
    // thank kaizoman for this because i had no idea how to write this
    // TODO: Add dickbutt addressing support
    return ((x & 0xFF8000) << 1) + (x & 0xFFFF) + ((x & 0x8000) ? 0 : 0x8000);
}

function getChecksum(rom) {
	var checksum = 0;
	for (var i = 0; i < rom.length; ++i)
	{
		checksum += rom[i];
		checksum &= 0xFFFF;
	}
	return checksum;
}

function fixChecksum(rom) {
	var checksum = getChecksum(rom);

	// checksum
	rom.writeBytes(2, 0x7FDE, checksum);
	rom.writeBytes(2, 0x7FDC, checksum ^ 0xFFFF);
}

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

/**
* Shuffles array in place.
* @param {Array} a items An array containing the items.
 */
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}


/* Two options
 * 1. Get FileSaver.js from here
 *     https://github.com/eligrey/FileSaver.js/blob/master/FileSaver.min.js -->
 *     <script src="FileSaver.min.js" />
 *
 * Or
 *
 * 2. If you want to support only modern browsers like Chrome, Edge, Firefox, etc., 
 *    then a simple implementation of saveAs function can be:
 */
function saveAs(blob, fileName) {
    var url = window.URL.createObjectURL(blob);

    var anchorElem = document.createElement("a");
    anchorElem.style = "display: none";
    anchorElem.href = url;
    anchorElem.download = fileName;

    document.body.appendChild(anchorElem);
    anchorElem.click();

    document.body.removeChild(anchorElem);

    // On Edge, revokeObjectURL should be called only after
    // a.click() has completed, atleast on EdgeHTML 15.15048
    setTimeout(function () {
        window.URL.revokeObjectURL(url);
    }, 1000);
}
export function readString8(wasm, ptr, len) {
	const buf = new Uint8Array(wasm.memory.buffer, ptr, len);
	return (new TextDecoder("utf-8")).decode(buf)
}

export function readString16(wasm, ptr, len) {
	const buf = new Uint16Array(wasm.memory.buffer, ptr, len);
	return String.fromCharCode.apply(null, buf)
}

export function withDiplomatWrite(wasm, callback) {
	const write = wasm.diplomat_buffer_write_create(0);
	try {
	callback(write);
	const outStringPtr = wasm.diplomat_buffer_write_get_bytes(write);
	if (outStringPtr == null) {
		throw FFIError("Out of memory");
	}
	const outStringLen = wasm.diplomat_buffer_write_len(write);
	return readString8(wasm, outStringPtr, outStringLen);
	} finally {
	wasm.diplomat_buffer_write_destroy(write);
	}
}

export class FFIError extends Error {
	constructor(error_value) {
	super("Error over FFI");
	this.error_value = error_value; // (2)
	}
}

export function extractCodePoint(str, param) {
	const cp = str.codePointAt?.(0);
	if ((!cp && cp !== 0) || [...str]?.length != 1) {
	throw new TypeError(`Expected single-character string for char parameter ${param}, found ${str}`);
	}
	return cp;
}

// Get the pointer returned by an FFI function
//
// It's tempting to call `(new Uint32Array(wasm.memory.buffer, FFI_func(), 1))[0]`.
// However, there's a chance that `wasm.memory.buffer` will be resized between
// the time it's accessed and the time it's used, invalidating the view.
// This function ensures that the view into wasm memory is fresh.
//
// This is used for methods that return multiple types into a wasm buffer, where
// one of those types is another ptr. Call this method to get access to the returned
// ptr, so the return buffer can be freed.
export function ptrRead(wasm, ptr) {
	return (new Uint32Array(wasm.memory.buffer, ptr, 1))[0];
}

// Get the flag of a result type.
export function resultFlag(wasm, ptr, offset) {
	return (new Uint8Array(wasm.memory.buffer, ptr + offset, 1))[0];
}

// Get the discriminant of a Rust enum.
export function enumDiscriminant(wasm, ptr) {
	return (new Int32Array(wasm.memory.buffer, ptr, 1))[0]
}

// A wrapper around a slice of WASM memory that can be freed manually or
// automatically by the garbage collector.
//
// This type is necessary for Rust functions that take a `&str` or `&[T]`, since
// they can create an edge to this object if they borrow from the str/slice,
// or we can manually free the WASM memory if they don't.
export class DiplomatBuf {
	static str8 = (wasm, string) => {
	var utf8Length = 0;
	for (const codepointString of string) {
		let codepoint = codepointString.codePointAt(0);
		if (codepoint < 0x80) {
		utf8Length += 1
		} else if (codepoint < 0x800) {
		utf8Length += 2
		} else if (codepoint < 0x10000) {
		utf8Length += 3
		} else {
		utf8Length += 4
		}
	}

	const ptr = wasm.diplomat_alloc(utf8Length, 1);

	const result = (new TextEncoder()).encodeInto(string, new Uint8Array(wasm.memory.buffer, ptr, utf8Length));
	console.assert(string.length == result.read && utf8Length == result.written, "UTF-8 write error");

	return new DiplomatBuf(ptr, utf8Length, () => wasm.diplomat_free(ptr, utf8Length, 1));
	}

	static str16 = (wasm, string) => {
	const byteLength = string.length * 2;
	const ptr = wasm.diplomat_alloc(byteLength, 2);

	const destination = new Uint16Array(wasm.memory.buffer, ptr, string.length);
	for (let i = 0; i < string.length; i++) {
		destination[i] = string.charCodeAt(i);
	}

	return new DiplomatBuf(ptr, string.length, () => wasm.diplomat_free(ptr, byteLength, 2));
	}

	static slice = (wasm, list, rustType) => {
	const elementSize = rustType == "u8" || rustType == "i8" || rustType == "bool" ? 1 :
		rustType == "u16" || rustType == "i16" ? 2 :
		rustType == "u64" || rustType == "i64" || rustType == "f64" ? 8 :
			4;

	const byteLength = list.length * elementSize;
	const ptr = wasm.diplomat_alloc(byteLength, elementSize);

	// Create an array view of the buffer. This gives us the `set` method which correctly handles untyped values
	const destination =
		rustType == "u8" || rustType == "bool" ? new Uint8Array(wasm.memory.buffer, ptr, byteLength) :
		rustType == "i8" ? new Int8Array(wasm.memory.buffer, ptr, byteLength) :
			rustType == "u16" ? new Uint16Array(wasm.memory.buffer, ptr, byteLength) :
			rustType == "i16" ? new Int16Array(wasm.memory.buffer, ptr, byteLength) :
				rustType == "i32" || rustType == "isize" ? new Int32Array(wasm.memory.buffer, ptr, byteLength) :
				rustType == "u64" ? new BigUint64Array(wasm.memory.buffer, ptr, byteLength) :
					rustType == "i64" ? new BigInt64Array(wasm.memory.buffer, ptr, byteLength) :
					rustType == "f32" ? new Float32Array(wasm.memory.buffer, ptr, byteLength) :
						rustType == "f64" ? new Float64Array(wasm.memory.buffer, ptr, byteLength) :
						new Uint32Array(wasm.memory.buffer, ptr, byteLength);
	destination.set(list);

	return new DiplomatBuf(ptr, list.length, () => wasm.diplomat_free(ptr, byteLength, elementSize));
	}

	static stringsFromPtr(wasm, stringsPtr, stringEncoding) {
		const [ptr, size] = new Uint32Array(wasm.memory.buffer, stringsPtr, 2);

		let strings = [];
		for (var arrayPtr = ptr; arrayPtr < size; arrayPtr += 1) {
			var out = this.stringFromPtr(wasm, arrayPtr, stringEncoding);
			strings.push(out);
		}
		return strings;
	}

	static stringFromPtr(wasm, stringPtr, stringEncoding) {
		const [ptr, size] = new Uint32Array(wasm.memory.buffer, stringPtr, 2);
		switch (stringEncoding) {
			case "string8":
				return readString8(wasm, ptr, size);
			case "string16":
				return readString16(wasm, ptr, size);
			default:
				console.error("Unrecognized stringEncoding ", stringEncoding);
				break;
		}
	}

	static sliceFromPtr(wasm, slicePtr, bufferType) {
		const [ptr, size] = new Uint32Array(wasm.memory.buffer, slicePtr, 2);

		var arrayType;
		switch (bufferType) {
			case "u8":
			case "bool":
				arrayType = Uint8Array;
				break;
			case "i8":
				arrayType = Int8Array;
				break;
			case "u16":
				arrayType = Uint16Array;
				break;
			case "i16":
				arrayType = Int16Array;
				break;
			case "i32":
			case "isize":
				arrayType = Int32Array;
				break;
			case "u32":
			case "usize":
				arrayType = Uint32Array;
				break;
			case "i64":
				arrayType = BigInt64Array;
				break;
			case "u64":
				arrayType = BigUint64Array;
				break;
			case "f32":
				arrayType = Float32Array;
				break;
			case "f64":
				arrayType = Float64Array;
				break;
			default:
				console.error("Unrecognized bufferType ", bufferType);
		}
		return arrayType.from(new arrayType(wasm.memory.buffer, ptr, size));
	}

	constructor(ptr, size, free) {
	this.ptr = ptr;
	this.size = size;
	// Generated code calls one of methods these for each allocation, to either
	// free directly after the FFI call, to leak (to create a &'static), or to
	// register the buffer with the garbage collector (to create a &'a).
	this.free = free;
	this.leak = () => { };
	this.garbageCollect = () => DiplomatBufferFinalizer.register(this, this.free);
	}
}

const DiplomatBufferFinalizer = new FinalizationRegistry(free => free());

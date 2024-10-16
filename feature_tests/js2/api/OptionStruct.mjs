// generated by diplomat-tool
import { OptionOpaque } from "./OptionOpaque.mjs"
import { OptionOpaqueChar } from "./OptionOpaqueChar.mjs"
import wasm from "./diplomat-wasm.mjs";
import * as diplomatRuntime from "./diplomat-runtime.mjs";

export class OptionStruct {
    #a;
    get a()  {
        return this.#a;
    }
    
    #b;
    get b()  {
        return this.#b;
    }
    
    #c;
    get c()  {
        return this.#c;
    }
    
    #d;
    get d()  {
        return this.#d;
    }
    

    // Return this struct in FFI function friendly format.
    // Returns an array that can be expanded with spread syntax (...)
    
    _intoFFI(
        slice_cleanup_callbacks,
        appendArrayMap
    ) {
        return [this.#a.ffiValue ?? 0, this.#b.ffiValue ?? 0, this.#c, this.#d.ffiValue ?? 0]
    }

    // This struct contains borrowed fields, so this takes in a list of
    // "edges" corresponding to where each lifetime's data may have been borrowed from
    // and passes it down to individual fields containing the borrow.
    // This method does not attempt to handle any dependencies between lifetimes, the caller
    // should handle this when constructing edge arrays.
    _fromFFI(ptr) {
        const aDeref = diplomatRuntime.ptrRead(wasm, ptr);
        this.#a = ((aDeref == 0) ? undefined : new OptionOpaque(aDeref, []));
        const bDeref = diplomatRuntime.ptrRead(wasm, ptr + 4);
        this.#b = ((bDeref == 0) ? undefined : new OptionOpaqueChar(bDeref, []));
        const cDeref = (new Uint32Array(wasm.memory.buffer, ptr + 8, 1))[0];
        this.#c = cDeref;
        const dDeref = diplomatRuntime.ptrRead(wasm, ptr + 12);
        this.#d = ((dDeref == 0) ? undefined : new OptionOpaque(dDeref, []));

        return this;
    }
    // This is an out struct. You need to call other methods to be able to get this struct.
    constructor(ptr) {
        this._fromFFI(ptr);
    }
    

}
// generated by diplomat-tool
import wasm from "./diplomat-wasm.mjs";
import * as diplomatRuntime from "./diplomat-runtime.mjs";

// Base enumerator definition
export class AttrEnum {
    #value = undefined;

    static values = new Map([
        ["A", 0],
        ["B", 1],
        ["C", 2]
    ]);
    constructor(value) {
        if (value instanceof AttrEnum) {
            this.#value = value.value;
            return;
        }

        if (AttrEnum.values.has(value)) {
            this.#value = value;
            return;
        }

        throw TypeError(value + " is not a AttrEnum and does not correspond to any of its enumerator values.");
    }

    get value() {
        return this.#value;
    }

    get ffiValue() {
        return AttrEnum.values.get(this.#value);
    }

    static A = new AttrEnum("A");

    static B = new AttrEnum("B");

    static C = new AttrEnum("C");


    

}
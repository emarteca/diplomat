// generated by diplomat-tool
import type { u8, i8, u16, i16, u32, i32, u64, i64, usize, isize, f32, f64, pointer, char } from "./diplomat-runtime.d.ts";


/** See the [Rust documentation for `FixedDecimal`](https://docs.rs/fixed_decimal/latest/fixed_decimal/struct.FixedDecimal.html) for more information.
*/
export class ICU4XFixedDecimal {
    

    get ffiValue(): pointer;


    static new_(v: number): ICU4XFixedDecimal;

    multiplyPow10(power: number): void;

    toString(): string | undefined;

    

}
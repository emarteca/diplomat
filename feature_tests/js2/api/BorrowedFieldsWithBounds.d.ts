// generated by diplomat-tool
import type { Foo } from "./Foo"
import type { u8, i8, u16, i16, u32, i32, u64, i64, usize, isize, f32, f64, pointer, char } from "./diplomat-runtime.d.ts";

export class BorrowedFieldsWithBounds {
    #fieldA;
    get fieldA() : string;
    set fieldA(value: string); 
    #fieldB;
    get fieldB() : string;
    set fieldB(value: string); 
    #fieldC;
    get fieldC() : string;
    set fieldC(value: string); 

    static fromFooAndStrings(foo: Foo, dstr16X: string, utf8StrZ: string): BorrowedFieldsWithBounds;

    

}
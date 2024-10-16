// generated by diplomat-tool
import type { Bar } from "./Bar"
import type { BorrowedFields } from "./BorrowedFields"
import type { BorrowedFieldsWithBounds } from "./BorrowedFieldsWithBounds"
import type { Foo } from "./Foo"
import type { u8, i8, u16, i16, u32, i32, u64, i64, usize, isize, f32, f64, pointer, char } from "./diplomat-runtime.d.ts";

export class NestedBorrowedFields {
    #fields;
    get fields() : BorrowedFields;
    set fields(value: BorrowedFields); 
    #bounds;
    get bounds() : BorrowedFieldsWithBounds;
    set bounds(value: BorrowedFieldsWithBounds); 
    #bounds2;
    get bounds2() : BorrowedFieldsWithBounds;
    set bounds2(value: BorrowedFieldsWithBounds); 

    static fromBarAndFooAndStrings(bar: Bar, foo: Foo, dstr16X: string, dstr16Z: string, utf8StrY: string, utf8StrZ: string): NestedBorrowedFields;

    

}
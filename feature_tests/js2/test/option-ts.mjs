import test from 'ava';
import { OptionOpaque } from "diplomat-wasm-js2-feature-tests";
test("Verify option methods", t => {
    const o = OptionOpaque.new_(5);
    o?.assertInteger(5);
    const on = OptionOpaque.newNone();
    t.assert(!on);
    const s = OptionOpaque.newStruct();
    s.a?.assertInteger(101);
    s.b?.assertChar('餐');
    t.is(s.c, 904);
    s.d?.assertInteger(926535);
    const sn = OptionOpaque.newStructNones();
    t.assert(!sn.a);
    t.assert(!sn.b);
    t.is(sn.c, 908);
    t.assert(!sn.d);
});

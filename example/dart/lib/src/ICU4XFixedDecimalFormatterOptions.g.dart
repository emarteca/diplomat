// generated by diplomat-tool

part of 'lib.g.dart';

final class _ICU4XFixedDecimalFormatterOptionsFfi extends ffi.Struct {
  @ffi.Int32()
  external int groupingStrategy;
  @ffi.Bool()
  external bool someOtherConfig;
}

final class ICU4XFixedDecimalFormatterOptions {
  ICU4XFixedDecimalGroupingStrategy groupingStrategy;
  bool someOtherConfig;

  // This struct contains borrowed fields, so this takes in a list of
  // "edges" corresponding to where each lifetime's data may have been borrowed from
  // and passes it down to individual fields containing the borrow.
  // This method does not attempt to handle any dependencies between lifetimes, the caller
  // should handle this when constructing edge arrays.
  // ignore: unused_element
  ICU4XFixedDecimalFormatterOptions._fromFfi(_ICU4XFixedDecimalFormatterOptionsFfi ffi) :
    groupingStrategy = ICU4XFixedDecimalGroupingStrategy.values[ffi.groupingStrategy],
    someOtherConfig = ffi.someOtherConfig;

  // ignore: unused_element
  _ICU4XFixedDecimalFormatterOptionsFfi _toFfi(ffi.Allocator temp) {
    final struct = ffi.Struct.create<_ICU4XFixedDecimalFormatterOptionsFfi>();
    struct.groupingStrategy = groupingStrategy.index;
    struct.someOtherConfig = someOtherConfig;
    return struct;
  }

  factory ICU4XFixedDecimalFormatterOptions({ICU4XFixedDecimalGroupingStrategy? groupingStrategy, bool? someOtherConfig}) {
    final result = _icu4x_ICU4XFixedDecimalFormatterOptions_default_mv1();
    final dart = ICU4XFixedDecimalFormatterOptions._fromFfi(result);
    if (groupingStrategy != null) {
      dart.groupingStrategy = groupingStrategy;
    }
    if (someOtherConfig != null) {
      dart.someOtherConfig = someOtherConfig;
    }
    return dart;
  }

  @override
  bool operator ==(Object other) =>
      other is ICU4XFixedDecimalFormatterOptions &&
      other.groupingStrategy == groupingStrategy &&
      other.someOtherConfig == someOtherConfig;

  @override
  int get hashCode => Object.hashAll([
        groupingStrategy,
        someOtherConfig,
      ]);
}

@meta.ResourceIdentifier('icu4x_ICU4XFixedDecimalFormatterOptions_default_mv1')
@ffi.Native<_ICU4XFixedDecimalFormatterOptionsFfi Function()>(isLeaf: true, symbol: 'icu4x_ICU4XFixedDecimalFormatterOptions_default_mv1')
// ignore: non_constant_identifier_names
external _ICU4XFixedDecimalFormatterOptionsFfi _icu4x_ICU4XFixedDecimalFormatterOptions_default_mv1();

#include <iostream>
#include "../include/ICU4XFixedDecimalFormatter.hpp"
#include "../include/ICU4XLocale.hpp"
#include "assert.hpp"

int main(int argc, char *argv[]) {
    std::unique_ptr<icu4x::ICU4XFixedDecimal> fd = icu4x::ICU4XFixedDecimal::new_(123);

    simple_assert("constructing FixedDecimal", !fd->to_string().is_err());

    std::string fd_out = fd->to_string().ok().value();

    simple_assert_eq("Stringifying FixedDecimal", fd_out, "123");

    fd->multiply_pow10(-1);

    fd_out = fd->to_string().ok().value();

    simple_assert_eq("Multiplying FixedDecimal", fd_out, "12.3");

    // std::string out;

    // fd->to_string_to_write(out);

    // simple_assert_eq("Formatting FixedDecimal to DiplomatWrite", fd_out, "12.3");

    std::unique_ptr<icu4x::ICU4XLocale> locale = icu4x::ICU4XLocale::new_("bn");

    std::unique_ptr<icu4x::ICU4XDataProvider> data_provider = icu4x::ICU4XDataProvider::new_static();

    auto fdf = icu4x::ICU4XFixedDecimalFormatter::try_new(*locale, *data_provider, icu4x::ICU4XFixedDecimalFormatterOptions::default_());

    simple_assert("Formatting FixedDecimal", fdf.is_ok());

    std::string fdf_out = std::move(fdf).ok().value()->format_write(*fd);

    simple_assert_eq("Formatting FixedDecimal", fdf_out, "১২.৩");

    std::cout << "Formatted value is " << fdf_out << std::endl;
}

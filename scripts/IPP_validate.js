(function ($) {
    var $val = $.validator;
    var $valUnob = $.validator.unobtrusive;
    fixRequiredAdapterForCheckboxes();

    $val.addMethod('notEqualTo', function (value, element, parms) {
        var equalTo = $val.methods['equalTo'];
        if (equalTo != null) {
            return !(equalTo.call(this, value, element, parms));
        }
        else {
            throw "equalTo method not defined";
        }
    });
    $valUnob.adapters.add("notEqualTo", ["other"], function (options) {
        var other = options.params.other,
            element = $(options.form).find(":input[name='" + other + "']")[0];
        options.rules['notEqualTo'] = element;
        options.messages['notEqualTo'] = options.message;
    });
    $val.addMethod(
        "multiemail",
         function (value, element) {
             if (this.optional(element)) // return true on optional element 
                 return true;
             var emails = value.split(/[;,]+/); // split element by , and ;
             let valid = true;
             for (var i in emails) {
                 value = emails[i];
                 valid = valid &&
                         jQuery.validator.methods.email.call(this, $.trim(value), element);
             }
             return valid;
         }
    );
    $valUnob.adapters.add("multiemail", function (options) {
        options.rules["multiemail"] = options.params;
        options.messages["multiemail"] = options.message;
    });

    $val.addMethod('isbn13', function (value, element) {
        var isbntrim = $.trim(value).toUpperCase();
        if (isbntrim.length < 1) return false;
        isbntrim = isbntrim.replace(/-/g, "");
        if (isbntrim.length == 13) {
            var prefix = isbntrim.substring(0, 3);
            var checkdigit = calculate13CheckDigit(isbntrim.substring(0, 12));
            return checkdigit.length == 1 && checkdigit == isbntrim[12];
        }
        return false;
    });
    $valUnob.adapters.add("isbn13", [], function (options) {
        options.rules['isbn13'] = options.params;
        options.messages['isbn13'] = options.message;
    });


    $val.addMethod('evenNumber', function (value, element, parms) {
        var number = new Number(value);
        if (isNaN(number)) return false;
        return number % 2 == 0;
    });
    $valUnob.adapters.add("evenNumber", [], function (options) {
        options.rules['evenNumber'] = options.params;
        options.messages['evenNumber'] = options.message;
    });

    function calculate13CheckDigit(first12) {
        //
        //  This algorithm is documented at several places, including:
        //     http://12.35.238.145/standards/home/isbn/international/html/usm7.htm#chap7p5
        //     http://www.ean-int.org/cdcalcul.html#001  [NOTE: Bookland EAN-13 is used here - prefix = 978]
        //     http://www.idautomation.com/upceanfaq.html#CalculationExamples
        //
        var sum = 0, factor = 1, length = 12;
        if (first12.length < length) length = first12.length;
        for (var i = 0; i < length; ++i) {
            sum += factor * parseInt(first12[i]);
            factor = 4 - factor;
        }
        var check = ((1000 - sum) % 10);
        return check.toString();
    };


    function fixRequiredAdapterForCheckboxes() {
        // The implementation of the required adapter for checkboxes in the jQuery unobtrusive validation
        // ignores the fact that you might want to validate a list of checkboxes, so it is not true that
        // required implies mandatory
        var requiredAdapter;
        for (var i = 0; i < $valUnob.adapters.length; i++) {
            if ($valUnob.adapters[i].name == "required") {
                requiredAdapter = $valUnob.adapters[i];
                break;
            }
        }
        if (requiredAdapter) {
            requiredAdapter.adapt = function (options) {
                options.rules["required"] = true;
                if (options.message) {
                    options.messages["required"] = options.message;
                }
            };
        }
    };

})(jQuery);
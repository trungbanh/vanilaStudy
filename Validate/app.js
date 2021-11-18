var Validator = function (options) {
  var formElement = document.querySelector(options.form);

  var selectorRules = {}

  function getPattern(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  function validate(inputElement, rule) {
    var errorMessage

    var errorElement = getPattern(inputElement, options.fromGroup).querySelector(options.errorLabel)

    var rules = selectorRules[rule.selector]

    rules.some((_rule) => {
      switch (inputElement.type) {
        case 'radio':
        case 'checkbox':
          errorMessage = _rule(
            formElement.querySelector(rule.selector + ':checked')
          )

          break;
        default:
          errorMessage = _rule(inputElement.value)
          break;
      }

      return errorMessage ? true : false;
    })

    if (errorMessage) {
      inputElement.classList.add('is-invalid')
      errorElement.innerText = errorMessage
    } else {
      inputElement.classList.remove('is-invalid')
      errorElement.innerText = ''
    }

    return !errorMessage;
  }

  if (formElement) {

    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        isValid = validate(inputElement, rule)

        if (!isValid) {
          isFormValid = false;
        }
      })


      if (isFormValid) {
        if (typeof options.onSubmit === 'function') {
          var formInput = formElement.querySelectorAll('[name]')
          var formValue = Array.from(formInput).reduce(function (values, input) {
            switch (input.type) {
              case 'radio':
              case 'checkbox':
                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value
                break;

              default:
                values[input.name] = input.value
            }

            return values;
          }, {})

          options.onSubmit(formValue)
        } else {
          formElement.submit()
        }
      }
    }

    // Xử lý rule và sự kiện
    options.rules.forEach(function (rule) {

      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      }
      else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElements = formElement.querySelectorAll(rule.selector);

      Array.from(inputElements).forEach((inputElement) => {

        var errorElement = getPattern(inputElement, options.fromGroup).querySelector(options.errorLabel)

        inputElement.onblur = function () {
          validate(inputElement, rule)
        }

        inputElement.oninput = function () {
          inputElement.classList.remove('is-invalid')
          errorElement.innerText = ''
        }
      })

    })
  }
}

Validator.required = function (selector) {
  return {
    selector,
    test: function (value) {
      return value ? undefined : 'this field is required';
    }
  }
}

Validator.email = function (selector) {
  return {
    selector,
    test: function (value) {
      re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value) ? undefined : 'this field is email template';
    }
  }
}

Validator.password = function (selector, min) {
  return {
    selector,
    test: function (value) {
      return value.trim().length >= min ? undefined : `this field min ${min} character`;
    }
  }
}

Validator.confirm = function (selector, comfirm, message) {
  return {
    selector,
    test: function (value) {
      return value === comfirm() ? undefined : message || 'this field not matching';
    }
  }
}
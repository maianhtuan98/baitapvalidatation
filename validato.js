function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }
  let selectorRules = {};
//dùng hàm dùng thực hiện validate
  function validate(inputElement, rule) {
    let errorElement = getParent(inputElement, options.formGroup).querySelector(options.errorSelector);
    let errorMessage;
    
//dùng lấy ra các rule của selector
   let rules = selectorRules[rule.selector];

 //dùng để lặp qua từng rule và kiểm tra
    for (let i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");// báo lỗi đỏ
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");//kh có lỗi đỏ
    }

    return !errorMessage;
  }

  //dùng để lấy element của form cần validate
  let formElement = document.querySelector(options.form);

  if (formElement) { // dùng khi submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();

      let isFormValid = true;

      // dùng lặp qua từng rule và validate
      options.rules.forEach(function (rule) {
        let inputElement = formElement.querySelector(rule.selector);
        let isValid = validate(inputElement, rule);

        if (!isValid) {
          isFormValid = false;
        }
      });
      if (isFormValid) {
        return options.onSubmit();
      }
    };

    //dùng lặp qua mỗi rule và sử lý blur output
    options.rules.forEach(function (rule) {
      
      //dùng lưu lại các rules cho mỗi input
      
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test]; 
      }
      let inputElement = formElement.querySelector(rule.selector);
   
      if (inputElement) {
        // dùng sử lý blur ra khỏi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };
        // dùng khi người dùng nhập vào input
        inputElement.oninput = function () {
          let errorElement = getParent.parentElement.querySelector(options.errorSelector);
          errorElement.innerText = '';
          getParent.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}

Validator.isRequired = function (selector, message) {
  return {
    selector,

    test: function (value) {
      return value.trim() ? undefined : message || "vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector,
    test: function (value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message || " Vui lòng nhập email";
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector,
    test: function (value) {
      return value.length >= 8
        ? undefined
        : `vui lòng nhập tối thiểu ${min} ký tự và có ít nhất 1 chữ hoa` ;
    },
  };
};

Validator.isConfirm = function (selector, getConfirmValue, message) {
  return {
    selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "giá trị nhập vào không chính xác";
    },
  };
};

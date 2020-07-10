interface IVerifyObj {
  [key: string]: {
    [propName: string]: { [key: string]: any };
  };
}

const verifyObj: IVerifyObj = {};

function generateVerificaton(target: any, propName: string, extraData: object) {
  let prevPropData = {};
  if (
    verifyObj[target.constructor.name] &&
    verifyObj[target.constructor.name][propName]
  ) {
    prevPropData = { ...verifyObj[target.constructor.name][propName] };
  }
  verifyObj[target.constructor.name] = {
    ...verifyObj[target.constructor.name],
    [propName]: { ...prevPropData, ...extraData },
  };
}

export function Required(target: any, propName: string) {
  generateVerificaton(target, propName, { required: true });
}

export function MaxLength(length: number) {
  return function (target: any, propName: string) {
    generateVerificaton(target, propName, { maxLength: length });
  };
}

export function MinLength(length: number) {
  return function (target: any, propName: string) {
    generateVerificaton(target, propName, { minLength: length });
  };
}

export function validate(obj: any): boolean {
  let isValid = true;
  if (Object.keys(obj).length === 0) {
    return isValid;
  }

  Object.keys(verifyObj).forEach((form) => {
    Object.keys(verifyObj[form]).forEach((propName) => {
      const formField = verifyObj[form][propName];
      if (formField.required) {
        if (!obj[propName]) {
          isValid = false;
        }
      }
      if (formField.maxLength) {
        if (obj[propName] > formField.maxLength) {
          isValid = false;
        }
      }
      if (formField.minLength) {
        if (obj[propName] < formField.minLength) {
          isValid = false;
        }
      }
    });
  });

  return isValid;
}

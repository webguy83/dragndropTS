/// <reference path="../utils/index.ts" />

namespace App {
  export function WithTemplate(tmp: HTMLTemplateElement, hookId: HTMLElement) {
    return function (_: any) {
      const importedNode = document.importNode(tmp.content, true);
      hookId.appendChild(importedNode);
    };
  }

  export function autobind(
    _target: any,
    _methodName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        const boundFn = originalMethod.bind(this);
        return boundFn;
      },
    };
    return adjDescriptor;
  }

  export function Required(target: any, propName: string) {
    generateVerificaton(target, propName, { required: true });
  }

  export function MaxNum(num: number) {
    return function (target: any, propName: string) {
      generateVerificaton(target, propName, { maxNum: num });
    };
  }

  export function MinNum(num: number) {
    return function (target: any, propName: string) {
      generateVerificaton(target, propName, { minNum: num });
    };
  }

  export function MaxTextLength(length: number) {
    return function (target: any, propName: string) {
      generateVerificaton(target, propName, { maxTextLength: length });
    };
  }

  export function MinTextLength(length: number) {
    return function (target: any, propName: string) {
      generateVerificaton(target, propName, { minTextLength: length });
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
        if (formField.maxNum) {
          if (obj[propName] > formField.maxNum) {
            isValid = false;
          }
        }
        if (formField.minNum) {
          if (obj[propName] < formField.minNum) {
            isValid = false;
          }
        }
        if (formField.maxTextLength) {
          if (obj[propName].length > formField.maxTextLength) {
            isValid = false;
          }
        }
        if (formField.minTextLength) {
          if (obj[propName].length < formField.minTextLength) {
            isValid = false;
          }
        }
      });
    });

    return isValid;
  }
}

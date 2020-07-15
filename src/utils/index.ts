namespace App {
  export const verifyObj: IVerifyObj = {};

  export function generateVerificaton(
    target: any,
    propName: string,
    extraData: object
  ) {
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
}

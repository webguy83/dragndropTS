namespace App {
  export interface IVerifyObj {
    [key: string]: {
      [propName: string]: { [key: string]: any };
    };
  }
}

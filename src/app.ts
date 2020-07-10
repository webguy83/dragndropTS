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

function Required(target: any, propName: string) {
  generateVerificaton(target, propName, { required: true });
}

function MaxNum(num: number) {
  return function (target: any, propName: string) {
    generateVerificaton(target, propName, { maxNum: num });
  };
}

function MinNum(num: number) {
  return function (target: any, propName: string) {
    generateVerificaton(target, propName, { minNum: num });
  };
}

function MaxTextLength(length: number) {
  return function (target: any, propName: string) {
    generateVerificaton(target, propName, { maxTextLength: length });
  };
}

function MinTextLength(length: number) {
  return function (target: any, propName: string) {
    generateVerificaton(target, propName, { minTextLength: length });
  };
}

function validate(obj: any): boolean {
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

const formTemplateEl = document.getElementById(
  'project-input'
) as HTMLTemplateElement;
const projectListTemplateEl = document.getElementById(
  'project-list'
) as HTMLTemplateElement;
// const singleProjectTemplateEl = document.getElementById(
//   'single-project'
// ) as HTMLTemplateElement;
// const formEl = formTemplateEl.firstChild as HTMLFormElement;
const appEl = document.getElementById('app') as HTMLDivElement;

interface IUserData {
  title: string;
  description: string;
  people: number;
}

function WithTemplate(tmp: HTMLTemplateElement, hookId: HTMLElement) {
  return function (_: any) {
    const el = tmp.content.cloneNode(true);
    hookId.appendChild(el);
  };
}

function autobind(
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

@WithTemplate(formTemplateEl, appEl)
class CustomForm {
  private customFormEl: HTMLFormElement;
  private titleEl: HTMLInputElement;
  private descriptionEl: HTMLTextAreaElement;
  private peopleEl: HTMLInputElement;

  @MinTextLength(2)
  @MaxTextLength(4)
  @Required
  private title: string = '';

  @MinTextLength(10)
  @Required
  private description: string = '';

  @MinNum(2)
  @MaxNum(3)
  @Required
  private people: number = 0;

  constructor() {
    this.customFormEl = document.getElementById(
      'user-input'
    ) as HTMLFormElement;
    this.titleEl = document.getElementById('title') as HTMLInputElement;
    this.descriptionEl = document.getElementById(
      'description'
    ) as HTMLTextAreaElement;
    this.peopleEl = document.getElementById('people') as HTMLInputElement;
    this.attachListeners();
  }

  attachListeners() {
    this.customFormEl.addEventListener('submit', this.onSubmit);
  }
  @autobind
  onSubmit(event: Event) {
    event.preventDefault();
    this.title = this.titleEl.value;
    this.description = this.descriptionEl.value;

    this.people = +this.peopleEl.value;
    const project: IUserData = {
      title: this.title,
      description: this.description,
      people: this.people,
    };

    if (validate(project)) {
      pl.add(project);
    } else {
      alert('get the fuck off me');
    }
  }
}

@WithTemplate(projectListTemplateEl, appEl)
class ProjectList {
  private projects: IUserData[] = [];
  private projectPlacementElm: HTMLUListElement = document.querySelector(
    '.projects ul'
  ) as HTMLUListElement;

  constructor(private type: 'active' | 'finished') {
    this.projectPlacementElm.id = `${this.type}-projects`;
  }

  add(project: IUserData) {
    this.projects.push(project);
    this.refresh(project);
  }

  refresh(project: IUserData) {
    const li = document.createElement('li');
    li.textContent = project.title;
    this.projectPlacementElm.appendChild(li);
  }
}

// const projectPlacementElm = document.querySelector('.projects ul') as HTMLUListElement;
// @WithTemplate(singleProjectTemplateEl, projectPlacementElm)
// class SingleProject {
//   addContent(project: IUserData) {
//     console.log(projectPlacementElm.children);
//     projectPlacementElm.children[0].textContent = project.title;
//     projectPlacementElm.appendChild(projectPlacementElm.children[0]);
//   }
// }

const cf = new CustomForm();
const pl = new ProjectList('active');
const finished = new ProjectList('finished');
console.log(finished);

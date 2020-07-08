// Code goes here!
// import { Required, PersonRange, validate } from './decorators/validators';

const formTemplateEl = document.getElementById(
  'project-input'
) as HTMLTemplateElement;
const projectListTemplateEl = document.getElementById(
  'project-list'
) as HTMLTemplateElement;
const singleProjectTemplateEl = document.getElementById(
  'single-project'
) as HTMLTemplateElement;
const formEl = formTemplateEl.firstChild as HTMLFormElement;
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
    // @Required
    const title = this.titleEl.value;
    // @Required
    const description = this.descriptionEl.value;
    // // @Required
    // @PersonRange
    const people = +this.peopleEl.value;
    const project: IUserData = {
      title,
      description,
      people,
    };
    pl.add(project);
  }
}

@WithTemplate(projectListTemplateEl, appEl)
class ProjectList {
  private projects: IUserData[] = [];

  add(project: IUserData) {
    this.projects.push(project);
    this.refresh(project);
  }

  refresh(project: IUserData) {
    const projectPlacementElm = document.querySelector(
      '.projects ul'
    ) as HTMLUListElement;
    const li = document.createElement('li');
    li.textContent = project.title;
    projectPlacementElm.appendChild(li);
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
const pl = new ProjectList();

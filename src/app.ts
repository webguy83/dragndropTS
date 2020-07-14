interface IDraggable {
  dragStartHandler: (event: DragEvent) => void;
  dragEndHandler: (event: DragEvent) => void;
}

interface IDragTarget {
  dragOverHandler: (event: DragEvent) => void;
  dropHandler: (event: DragEvent) => void;
  dragLeaveHandler: (event: DragEvent) => void;
}

type Listener = (projects: IProjectData[]) => void;

class State {
  private projects: IProjectData[] = [];
  private listeners: Listener[] = [];
  private static instance: State;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new State();
    return this.instance;
  }

  addProject(project: IProjectData) {
    this.projects.push(project);
    this.updateListeners();
  }

  moveProject(projId: string, newStatus: ProjectStatus) {
    const proj = this.projects.find((prj) => prj.id.toString() === projId);
    if (proj && proj.status !== newStatus) {
      proj.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }
}

const state = State.getInstance();

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

enum ProjectStatus {
  Active,
  Finished,
}

interface IProjectData {
  id: number;
  title: string;
  description: string;
  people: number;
  status: ProjectStatus;
}

function WithTemplate(tmp: HTMLTemplateElement, hookId: HTMLElement) {
  return function (_: any) {
    const importedNode = document.importNode(tmp.content, true);
    hookId.appendChild(importedNode);
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

  @Required
  private title: string = '';

  @MinTextLength(10)
  @Required
  private description: string = '';

  @MinNum(1)
  @MaxNum(8)
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
    const project: IProjectData = {
      id: Math.random(),
      title: this.title,
      description: this.description,
      people: this.people,
      status: ProjectStatus.Active,
    };

    if (validate(project)) {
      state.addProject(project);
    } else {
      alert('GET FUCKED');
    }
  }
}

class ProjectList implements IDragTarget {
  private projects: IProjectData[] = [];
  private element: HTMLElement;

  constructor(private type: 'active' | 'finished') {
    const importedNode = document.importNode(
      projectListTemplateEl.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;
    appEl.insertAdjacentElement('beforeend', this.element);
    this.renderContent();
  }

  @autobind
  dragOverHandler(evt: DragEvent) {
    if (evt.dataTransfer && evt.dataTransfer.types[0] === 'text/plain') {
      evt.preventDefault();
      const listEl = this.element.querySelector('ul') as HTMLUListElement;
      listEl.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(evt: DragEvent) {
    const projId = evt.dataTransfer!.getData('text/plain');
    state.moveProject(
      projId,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul') as HTMLUListElement;
    listEl.classList.remove('droppable');
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';

    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    state.addListener((projects: IProjectData[]) => {
      this.projects = projects.filter((project) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Finished;
      });
      this.renderProjects();
    });
  }

  renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    ) as HTMLUListElement;
    listEl.innerHTML = '';
    for (const project of this.projects) {
      const projectItem = new ProjectItem(project, listEl);
      projectItem.addItem();
    }
  }
}

class ProjectItem implements IDraggable {
  tmp: HTMLTemplateElement = document.getElementById(
    'single-project'
  ) as HTMLTemplateElement;

  constructor(private project: IProjectData, private hookEl: HTMLUListElement) {
    this.config();
  }

  get person() {
    return this.project.people !== 1 ? ' people added.' : ' person added.';
  }

  addItem() {
    const importedNode = document.importNode(this.tmp.content, true);
    this.hookEl.appendChild(importedNode);

    if (this.hookEl.lastElementChild) {
      const h2El = this.hookEl.lastElementChild.querySelector(
        'h2'
      ) as HTMLHeadingElement;
      const h3El = this.hookEl.lastElementChild.querySelector(
        'h3'
      ) as HTMLHeadingElement;
      const p = this.hookEl.lastElementChild.querySelector(
        'p'
      ) as HTMLParagraphElement;

      this.hookEl.lastElementChild.id = this.project.id.toString();
      h2El.textContent = this.project.title;
      h3El.textContent = this.project.people.toString() + this.person;
      p.textContent = this.project.description;
    }
  }

  config() {
    this.hookEl.addEventListener('dragstart', this.dragStartHandler);
  }

  @autobind
  dragStartHandler(evt: DragEvent) {
    evt.dataTransfer!.setData('text/plain', this.project.id.toString());
    evt.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(_evt: DragEvent) {}
}

const cf = new CustomForm();
const pl = new ProjectList('active');
const finished = new ProjectList('finished');

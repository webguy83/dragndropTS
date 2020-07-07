// Code goes here!
const formTemplateEl = document.getElementById('project-input') as HTMLTemplateElement;
const projectListTemplateEl = document.getElementById('project-list') as HTMLTemplateElement;
const singleProjectTemplateEl = document.getElementById('single-project') as HTMLTemplateElement;
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

@WithTemplate(formTemplateEl, appEl)
class CustomForm {
  private customFormEl: HTMLFormElement;
  private titleEl: HTMLInputElement;
  private descriptionEl: HTMLTextAreaElement;
  private peopleEl: HTMLInputElement;

  constructor() {
   this.customFormEl = document.getElementById('user-input') as HTMLFormElement;
   this.titleEl = document.getElementById('title') as HTMLInputElement;
   this.descriptionEl = document.getElementById('description') as HTMLTextAreaElement;
   this.peopleEl = document.getElementById('people') as HTMLInputElement;
   this.attachListeners();
  }

  attachListeners() {
    this.customFormEl.addEventListener("submit", this.onSubmit.bind(this));
  }

  onSubmit(event:Event) {
    event.preventDefault();
    const title = this.titleEl.value;
    const description = this.descriptionEl.value;
    const people = +this.peopleEl.value;
    const project: IUserData = {
      title, description, people
    }
    pl.add(project);
  }
}

@WithTemplate(projectListTemplateEl, appEl)
class ProjectList {
  private projects: IUserData[] = [];

  add(project: IUserData) {
    this.projects.push(project);
    this.refresh();
  }

  refresh() {
    const projectPlacementElm = document.querySelector('.projects ul') as HTMLUListElement;
    projectPlacementElm.appendChild(document.createElement('li'));
      console.log(projectPlacementElm.children)
    this.projects.forEach((_proj, _i) => {
      
      // projectPlacementElm.children[0].textContent = proj.title;
      // projectPlacementElm.appendChild(projectPlacementElm.children[0]);
      // const sp = new SingleProject();
      // sp.addContent(proj);
      
    });
    // console.log(this.projects)
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
// Code goes here!
const formTemplateEl = document.getElementById(
  'project-input'
) as HTMLTemplateElement;
const appEl = document.getElementById('app') as HTMLDivElement;

const titleEl = document.getElementById('title') as HTMLInputElement;
const descriptionEl = document.getElementById(
  'description'
) as HTMLTextAreaElement;
const peopleEl = document.getElementById('people') as HTMLInputElement;

interface IUserData {
  title: string;
  description: string;
  people: number;
}

const data: IUserData = {
  title: '',
  description: '',
  people: 0,
};

function onSubmit() {}

function WithTemplate(tmp: HTMLTemplateElement, hookId: HTMLElement) {
  return function (_: any) {
    const el = tmp.content.cloneNode(true);
    hookId.appendChild(el);
  };
}

@WithTemplate(formTemplateEl, appEl)
class CustomForm {
  constructor(public temp: number) {}

  run() {
    console.log(this.temp);
  }
}

const f = new CustomForm(3);
f.run();

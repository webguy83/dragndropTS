/// <reference path="../decorators/form.ts" />

namespace App {
  export const appEl = document.getElementById('app') as HTMLDivElement;
  const formTemplateEl = document.getElementById(
    'project-input'
  ) as HTMLTemplateElement;

  @WithTemplate(formTemplateEl, appEl)
  export class CustomForm {
    private customFormEl: HTMLFormElement;
    private titleEl: HTMLInputElement;
    private descriptionEl: HTMLTextAreaElement;
    private peopleEl: HTMLInputElement;

    @Required
    private title: string = '';

    @MaxTextLength(99)
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
}

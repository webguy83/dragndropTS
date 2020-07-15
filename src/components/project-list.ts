namespace App {
  const projectListTemplateEl = document.getElementById(
    'project-list'
  ) as HTMLTemplateElement;

  export class ProjectList implements IDragTarget {
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
}

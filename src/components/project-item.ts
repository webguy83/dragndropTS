namespace App {
  export class ProjectItem implements IDraggable {
    tmp: HTMLTemplateElement = document.getElementById(
      'single-project'
    ) as HTMLTemplateElement;

    constructor(
      private project: IProjectData,
      private hookEl: HTMLUListElement
    ) {
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
}

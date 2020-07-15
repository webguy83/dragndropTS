namespace App {
  export type Listener = (projects: IProjectData[]) => void;

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

  export const state = State.getInstance();
}

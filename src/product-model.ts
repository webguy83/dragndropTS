namespace App {
  export enum ProjectStatus {
    Active,
    Finished,
  }

  export interface IProjectData {
    id: number;
    title: string;
    description: string;
    people: number;
    status: ProjectStatus;
  }
}

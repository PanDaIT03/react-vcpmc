export interface IRole {
  docId: string;
  role: string;
}

export type Role = {
  docId: string;
  role: string;
  name: string;
  description: string;
  functionalsId: string[];
  allowDelete: boolean;
};

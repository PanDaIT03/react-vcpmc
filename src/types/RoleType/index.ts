export interface IRole {
    docId: string;
    role: string;
};

export type Role = {
    docId: string;
    role: string;
    name: string;
    description: string;
    functionalsId: Array<string>;
    allowDelete: boolean;
}
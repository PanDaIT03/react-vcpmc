export interface IGlobalConstantsType {
    id: number
    title?: string
    value?: string | Array<{ id: number, icon: string, title: string }>
    icon?: string
    to?: string
    isActive?: boolean
};
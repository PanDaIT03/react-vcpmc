import { ReactNode } from "react";

export interface IGlobalConstantsType {
  id?: number | string;
  title?: string;
  isRequired?: boolean;
  value?: string | Array<{ id: number; icon: string; title: string }>;
  icon?: string;
  to?: string;
  isActive?: boolean;
  tag?: ReactNode | "radio" | "none";
  radioTitle?: string;
  isChecked?: boolean;
  setState?: any;
  subTitle?: string;
}

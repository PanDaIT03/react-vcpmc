import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ReactNode } from "react";

export interface InputProps {
  id?: string;
  name: string;
  value?: string | number;
  title?: string;
  checked?: boolean;
  placeholder?: string;
  className?: string;
  errorMessage?: string;
  isRequire?: boolean;
  border?: "orange-4-default" | "default-border" | "none";
  min?: any;
  max?: any;
  steps?: number;
  iconLeft?: string; //path
  iconRight?: string; //path
  status?: "disable" | "editable";
  type?: "text" | "password" | "number" | "date" | "range";
  size?:
    | "extra-small"
    | "small"
    | "small-pl"
    | "medium"
    | "large"
    | "extra-large"
    | "custom"
    | "none";
  onBlur?: any;
  onFocus?: any;
  inputRef?: any;
  touched?: boolean;
  readOnly?: boolean;
  iconLeftAwesome?: IconProp;
  iconRightAwesome?: IconProp;
  children?: ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onIconLeftClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
  onIconRightClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
}

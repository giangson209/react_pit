import { ButtonSize } from "./enum";

type DefaultProps = {
  children?: React.ReactNode;
  size?: ButtonSize | null;
  bold?: boolean;

  btnStyle?: "primary" | "secondary" | "secondary_dark";

  border?: boolean;
  fill?: boolean;
};
export type ButtonProps<D = {}> = D & DefaultProps & JSX.IntrinsicElements["button"];

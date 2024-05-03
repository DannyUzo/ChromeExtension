import { Close } from "./close";
import { Logo } from "./logo";

export const Header = () => {
  return (
    <div className="header">
      <Logo />
      <Close />
    </div>
  );
};

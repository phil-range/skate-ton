import { TonConnectButton } from "@tonconnect/ui-react";
import "./header.scss";
import logoUrl from "@/assets/logo.svg";

export const Header = () => {
  return (
    <header>
      <img src={logoUrl} />
      <TonConnectButton />
    </header>
  );
};

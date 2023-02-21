import Link from "next/link";
import React from "react";
import { Routers } from "src/routers";
import MainHeader from "./MainHeader";
import styles from "./MainLayout.module.scss";

type Props = { children?: React.ReactNode };
const menuList = [
  { title: "WORKS", href: Routers.HOME },
  { title: "WORKS", href: Routers.HOME },
  { title: "WORKS", href: Routers.HOME },
  { title: "WORKS", href: Routers.HOME },
];

const logoName = "PIT STUDIO";

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <MainHeader />
      {children}
    </>
  );
};

export default MainLayout;

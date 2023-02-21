import IconMenu from "@components/icons/IconMenu";
import Logo from "@components/logo/Logo";
import RotateText from "@components/text/RotateText";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Routers } from "src/routers";
import styles from "./MainLayout.module.scss";

type Props = {
  children?: React.ReactNode;
  isDark?: boolean;
  animationDisable?: boolean;
  isBgTransparent?: boolean;
  isFixed?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;
const menuList = [
  { title: "WORKS", href: Routers.PROJECTS, prefix: "/works" },
  { title: "SERVICES", href: Routers.SERVICES, prefix: "/services" },
  { title: "STUDIO", href: Routers.STUDIO, prefix: "/studio" },
  { title: "CONTACT", href: Routers.CONTACT, prefix: "/contact" },
];

const MainHeader = ({
  children,
  isDark,
  animationDisable,
  isBgTransparent,
  isFixed,
  ...rest
}: Props) => {
  const [isShow, setIsShow] = useState(false);
  const router = useRouter();
  const href = router.asPath;
  return (
    <div {...rest}>
      <header
        className={clsx(
          styles.nav,
          isDark && styles.dark,
          animationDisable ? undefined : styles.animation,
          isBgTransparent && styles.noBack,
          isFixed && styles.fixed
        )}
      >
        <div className={styles.nav__container}>
          <Link className={styles.navLogo} href={Routers.HOME}>
            <Logo />
          </Link>
          <nav className={styles.nav__menu}>
            <ul className={styles.nav__menu_container}>
              {menuList.map((menuItem, id) => (
                <li key={id}>
                  <Link href={menuItem.href}>
                    <RotateText active={href.startsWith(menuItem.prefix)} className="translate-z-2">
                      {menuItem.title}
                    </RotateText>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button className={styles.nav__btn_menu} type="button" onClick={() => setIsShow(true)}>
            <IconMenu size={24} />
          </button>
        </div>
      </header>

      <div>
        <div
          data-mode="dark"
          className={clsx(
            "fixed inset-0 bg-neutral-800 z-10 transition-transform text-neutral-0 duration-500",
            isShow ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className={styles.nav__container}>
            <Link className={styles.navLogo} href={Routers.HOME}>
              <Logo />
            </Link>
            <button className={styles.nav__btn_menu} type="button" onClick={() => setIsShow(false)}>
              <IconMenu size={24} />
            </button>
          </div>
          <div className="flex justify-center mt-14">
            <ul className="text-h7 font-medium space-y-4 text-center">
              {menuList.map((menuItem, id) => (
                <li key={id}>
                  <Link href={menuItem.href}>{menuItem.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;

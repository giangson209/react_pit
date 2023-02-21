import ElementWithCursor from "@components/cursor/ElementWithCursor";
import React, { JSXElementConstructor } from "react";

type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  T extends JSXElementConstructor<infer P>
    ? P
    : T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : {};

declare let __: "1D45E01E-AF44-47C4-988A-19A94EBAF55C";
export declare type __ = typeof __;
export type ReactTag = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
type PropsOf<TTag extends ReactTag> = TTag extends React.ElementType
  ? React.ComponentProps<TTag>
  : never;

type OurProps<TTag extends ReactTag, TSlot> = {
  ref?: React.Ref<HTMLElement>;
  as?: TTag;
  children?: React.ReactNode | ((bag: TSlot) => React.ReactElement);
};
type PropsWeControl = keyof OurProps<any, any>;
declare type CleanProps<
  TTag extends ReactTag,
  TOmitableProps extends PropertyKey = __
> = TOmitableProps extends __
  ? Omit<PropsOf<TTag>, PropsWeControl>
  : Omit<PropsOf<TTag>, TOmitableProps | PropsWeControl>;

type PropsWithStandardRef<T extends ReactTag, Props = unknown> = Props &
  CleanProps<T> &
  OurProps<T, {}>;
export type CustomElementProps<T extends React.ElementType<any> = "div", P = unknown> = P &
  Omit<CleanProps<T>, keyof P> &
  OurProps<T, {}>;

export type CustomElement<Props> = <T extends React.ElementType<Props> | ReactTag = "section">(
  props: PropsWithStandardRef<T, Props>
) => React.ReactElement<any, any> | null;

export type Props<T extends ReactTag, P = unknown, TSlot = {}> = P &
  CleanProps<T> &
  OurProps<T, TSlot>;

type GetObject<T extends object> = { [K in keyof T]: T[K] };

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { CustomElement, CustomElementProps, ReactTag } from "src/types/element.d";
import { useCursor } from "./CursorContext";
import { CursorStyle, CursorVariant } from "./CursorDefault";

type Props = {
  variant?: CursorVariant;
  theme?: CursorStyle;
  stretch?: boolean;
  mixed?: boolean;
  content?: string;

  tag?: ReactTag;
  backable?: boolean;
};

const ElementWithCursor: CustomElement<Props> = forwardRef<any, any>(function ElementWithCursor(
  props,
  ref
) {
  const {
    as: asElement,
    tag = "div",
    onMouseEnter,
    onMouseLeave,
    variant,
    theme,
    stretch,
    mixed,
    content,
    backable,
    ...rest
  } = props;
  const cursor = useCursor();
  const Element = asElement || tag;
  return (
    <Element
      {...rest}
      ref={ref}
      onMouseEnter={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        onMouseEnter?.(e);
        backable ? cursor.mouseEventWithPrevious.onMouseEnter(e) : cursor.onMouseEnter(e);
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        onMouseLeave?.(e);
        backable ? cursor.mouseEventWithPrevious.onMouseLeave(e) : cursor.onMouseLeave(e);
      }}
      data-cursor-variant={variant}
      data-cursor-theme={theme}
      data-cursor-stretch={stretch}
      data-cursor-mixed={mixed}
      data-cursor-text={content}
    />
  );
});

export default ElementWithCursor;

import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { R as Root } from "../_chunks/_libs/@radix-ui/react-separator.mjs";
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        className
      ),
      ...props
    }
  );
}
export {
  Separator as S
};

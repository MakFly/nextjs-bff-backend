import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { R as Root } from "../_chunks/_libs/@radix-ui/react-label.mjs";
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
      ),
      ...props
    }
  );
}
export {
  Label as L
};

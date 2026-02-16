import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
function GrainOverlay() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "pointer-events-none fixed inset-0 z-50 opacity-[0.03]",
      style: {
        backgroundImage: "url(/noise.svg)",
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px"
      }
    }
  );
}
export {
  GrainOverlay as G
};

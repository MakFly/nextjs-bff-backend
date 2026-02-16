import { r as reactExports } from "../react.mjs";
var defaultAttributes = {
  outline: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  },
  filled: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "none"
  }
};
const createReactComponent = (type, iconName, iconNamePascal, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ color = "currentColor", size = 24, stroke = 2, title, className, children, ...rest }, ref) => reactExports.createElement(
      "svg",
      {
        ref,
        ...defaultAttributes[type],
        width: size,
        height: size,
        className: [`tabler-icon`, `tabler-icon-${iconName}`, className].join(" "),
        ...{
          strokeWidth: stroke,
          stroke: color
        },
        ...rest
      },
      [
        title && reactExports.createElement("title", { key: "svg-title" }, title),
        ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    )
  );
  Component.displayName = `${iconNamePascal}`;
  return Component;
};
const __iconNode$2 = [["path", { "d": "M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "key": "svg-0" }], ["path", { "d": "M11 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "key": "svg-1" }], ["path", { "d": "M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "key": "svg-2" }]];
const IconDotsVertical = createReactComponent("outline", "dots-vertical", "DotsVertical", __iconNode$2);
const __iconNode$1 = [["path", { "d": "M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2", "key": "svg-0" }], ["path", { "d": "M9 12h12l-3 -3", "key": "svg-1" }], ["path", { "d": "M18 15l3 -3", "key": "svg-2" }]];
const IconLogout = createReactComponent("outline", "logout", "Logout", __iconNode$1);
const __iconNode = [["path", { "d": "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "key": "svg-0" }], ["path", { "d": "M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", "key": "svg-1" }], ["path", { "d": "M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855", "key": "svg-2" }]];
const IconUserCircle = createReactComponent("outline", "user-circle", "UserCircle", __iconNode);
export {
  IconDotsVertical as I,
  IconUserCircle as a,
  IconLogout as b
};

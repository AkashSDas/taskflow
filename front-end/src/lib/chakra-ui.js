import { extendTheme } from "@chakra-ui/react";

export function pxToRem(px) {
  if (typeof px != "number") throw new TypeError("pxToRem expects a number");
  return `${px / 16}rem`;
}

export var chakraTheme = extendTheme({
  fonts: {
    heading: `'Cubano', sans-serif`,
    body: `'Urbanist', sans-serif`,
    button: `'Urbanist', sans-serif`,
  },
  color: {
    border: "#EBE8E8",
    primary: "#278BFF",
    bg1: "#FCFCFC",
    bg2: "#F3F3F3",
    text1: "#17191B",
    text2: "#4D4D4D",
    text3: "#FFFFFF",
    icon1: "#8B8B8B",
    icon2: "#B9B9B9",
  },
  components: {
    Button: {
      variants: {
        primarySolid: {
          bg: "#278BFF",
          color: "#FFFFFF",
          fontFamily: "heading",
          px: pxToRem(12),
        },

        secondarySolid: {
          bg: "#8B8B8B",
          color: "#FFFFFF",
          fontFamily: "heading",
          px: pxToRem(12),
        },
      },
    },
  },
});

import { extendTheme } from "@chakra-ui/react";
import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

export function pxToRem(px) {
  if (typeof px != "number") throw new TypeError("pxToRem expects a number");
  return `${px / 16}rem`;
}

var { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

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
    Modal: getModalStyle(),
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
    FormLabel: {
      baseStyle: {
        color: "#4D4D4D",
        fontFamily: "heading",
        fontSize: "sm",
      },
    },
    Input: {
      defaultProps: {
        variant: "base",
      },
      variants: {
        base: {
          field: {
            border: "0px solid",
            borderBottom: "2px solid",
            bg: "#F3F3F3",
            borderColor: "#EBE8E8",
            borderRadius: "0",
            h: pxToRem(44),
            fontFamily: "body",
            fontWeight: "semibold",
            outline: "0",
            color: "#17191B",
          },
        },
      },
    },
  },
});

function getModalStyle() {
  var baseStyle = definePartsStyle({
    overlay: { bg: "rgba(0, 0, 0, 0.8)" },
    dialog: { borderRadius: "xl", bg: "#FCFCFC" },
  });
  var modalTheme = defineMultiStyleConfig({ baseStyle });
  return modalTheme;
}

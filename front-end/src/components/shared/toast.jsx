import { toast } from "react-hot-toast";
import { HStack, Image, Text } from "@chakra-ui/react";
import { pxToRem, chakraTheme } from "../../lib/chakra-ui";

export function customToast(imgURL, text, type) {
  toast.custom(
    (t) => (
      <HStack
        p={pxToRem(16)}
        rounded="md"
        gap={pxToRem(3)}
        bg={chakraTheme.color.bg1}
        border="1px solid"
        borderColor={chakraTheme.color.border}
        shadow="md"
      >
        <Image
          src={imgURL}
          h={pxToRem(100)}
          w={pxToRem(200)}
          rounded="md"
          objectFit="cover"
        />

        <Text
          fontFamily="heading"
          fontSize="md"
          color={
            type == "error"
              ? "red.500"
              : type == "success"
              ? "green.500"
              : "black"
          }
        >
          {text}
        </Text>
      </HStack>
    ),
    { position: "bottom-center", duration: 2000 }
  );
}

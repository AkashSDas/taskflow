import { Box, Image, VStack, Text } from "@chakra-ui/react";
import { chakraTheme, pxToRem } from "../lib/chakra-ui";

export default function NotFoundPage() {
  return (
    <Box>
      <VStack w="full">
        <Image
          src="https://media.giphy.com/media/2LNbVZrfm05G/giphy.gif"
          h={pxToRem(180)}
          w={pxToRem(300)}
          rounded="md"
          objectFit="cover"
        />

        <Text color={chakraTheme.color.text2} fontFamily="heading">
          Page Not Found
        </Text>
      </VStack>
    </Box>
  );
}

import { VStack, Spinner } from "@chakra-ui/react";

export default function Loader() {
  return (
    <VStack>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="#EBE8E8"
        color="#278BFF"
        size="xl"
      />
    </VStack>
  );
}

import { Box, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import Navbar from "./navbar";
import { pxToRem } from "../../lib/chakra-ui";

export default function Layout() {
  return (
    <VStack gap={pxToRem(56)}>
      <Navbar />

      <Box w="full">
        <Outlet />
      </Box>
    </VStack>
  );
}

import { Box, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";

import Navbar from "./navbar";
import { pxToRem } from "../../lib/chakra-ui";
import { useUser } from "../../lib/hooks";
import Loader from "../shared/loader";

export default function Layout() {
  var { loading } = useUser();

  return (
    <VStack gap={pxToRem(56)}>
      <Navbar />

      <Box w="full">
        {loading && <Loader />}
        {!loading && <Outlet />}
      </Box>
    </VStack>
  );
}

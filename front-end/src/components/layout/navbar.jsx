import { Button, HStack, Icon, Text, useDisclosure } from "@chakra-ui/react";
import { chakraTheme, pxToRem } from "../../lib/chakra-ui";
import SignupModal from "../modal/signup";

export default function Navbar() {
  var { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      gap={pxToRem(16)}
      h={pxToRem(48)}
      px={{ base: pxToRem(16), md: pxToRem(32) }}
      borderBottom="1px solid"
      borderColor={chakraTheme.color.border}
    >
      <Text fontFamily="heading" fontSize="xl" className="brand-text-gradient">
        TaskFlow
      </Text>

      <HStack gap={pxToRem(24)} justifyContent="flex-end" alignItems="center">
        {/* Login button */}
        <Button variant="secondarySolid">Login</Button>

        {/* Add task button */}
        <Button onClick={onOpen} variant="primarySolid">
          <HStack>
            <AddIcon />
            <Text>Add Task</Text>
          </HStack>

          <SignupModal isOpen={isOpen} onClose={onClose} />
        </Button>
      </HStack>
    </HStack>
  );
}

function AddIcon() {
  return (
    <Icon
      display="block"
      className="icon"
      w={pxToRem(24)}
      h={pxToRem(24)}
      cursor="pointer"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 12H18"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12 18V6"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </Icon>
  );
}

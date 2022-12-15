import {
  Box,
  Modal,
  HStack,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { authModalFormAtom } from "../../lib/atom";
import { pxToRem } from "../../lib/chakra-ui";
import SignupForm from "../auth/signup";

export default function AuthModal({ isOpen, onClose }) {
  var [form] = useAtom(authModalFormAtom);

  if (["signup", "login", null].includes(form) == false) {
    throw new TypeError(`Invalid form: ${form}`);
  }

  function AuthForm() {
    if (form == "login") return <LoginForm />;
    return <SignupForm />;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnEsc>
      <ModalOverlay />

      <ModalContent p={pxToRem(16)}>
        <HStack justifyContent="space-between" alignItems={"center"}>
          <ModalHeader fontFamily="heading" p={pxToRem(16)}>
            {form && form[0].toUpperCase() + form.slice(1)}
          </ModalHeader>
          <ModalCloseButton position="relative" top="unset" />
        </HStack>

        {/* Modal main content */}
        <ModalBody>
          <AuthForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function LoginForm() {
  return <Box></Box>;
}

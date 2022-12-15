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
import { pxToRem } from "../../lib/chakra-ui";
import SignupForm from "../auth/signup";

export default function AuthModal({ isOpen, onClose, form }) {
  if (["signup", "login"].includes(form) == false) {
    throw new TypeError(`Invalid form: ${form}`);
  }

  var heading = form[0].toUpperCase() + form.slice(1);

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
            {heading}
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

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Button,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { chakraTheme, pxToRem } from "../../lib/chakra-ui";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../lib/validation";

export default function SignupModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnEsc>
      <ModalOverlay />

      <ModalContent>
        <HStack justifyContent="space-between" alignItems={"center"}>
          <ModalHeader fontFamily="heading" p={pxToRem(16)}>
            Signup
          </ModalHeader>
          <ModalCloseButton position="relative" top="unset" />
        </HStack>

        <ModalBody p={pxToRem(16)}>
          <SignupForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function SignupForm() {
  var { reset, register, handleSubmit, formState } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(signupSchema),
  });

  return (
    <VStack
      as="form"
      gap={pxToRem(32)}
      onSubmit={handleSubmit((data) => console.log(data))}
    >
      {/* Email input */}
      <FormControl isInvalid={formState.errors.email ? true : false}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          type="email"
          {...register("email")}
          borderColor={
            formState.errors.email
              ? "red.500"
              : formState.touchedFields.email
              ? "green.500"
              : "#EBE8E8"
          }
        />
        <FormErrorMessage>{formState.errors.email?.message}</FormErrorMessage>
      </FormControl>

      {/* Password input */}
      <FormControl isInvalid={formState.errors.password ? true : false}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          {...register("password")}
          fontFamily="heading"
          borderColor={
            formState.errors.password
              ? "red.500"
              : formState.touchedFields.password
              ? "green.500"
              : "#EBE8E8"
          }
        />

        <FormErrorMessage>
          {formState.errors.password?.message}
        </FormErrorMessage>
      </FormControl>

      {/* Submit button */}
      <Button
        variant="primarySolid"
        type="submit"
        disabled={formState.isSubmitting}
        px={pxToRem(32)}
      >
        {formState.isSubmitting ? "Loading..." : "Signup"}
      </Button>

      <Text fontWeight="medium" color={chakraTheme.color.text2}>
        Already have an account?{" "}
        <Link>
          <Text display="inline" color={chakraTheme.color.primary}>
            Login
          </Text>
        </Link>
      </Text>
    </VStack>
  );
}

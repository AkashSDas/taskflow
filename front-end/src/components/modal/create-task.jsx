import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Text,
  Button,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { createTaskSchema } from "../../lib/validation";
import { pxToRem } from "../../lib/chakra-ui";

export default function CreateTaskModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnEsc>
      <ModalOverlay />

      <ModalContent p={pxToRem(16)}>
        <HStack justifyContent="space-between" alignItems={"center"}>
          <ModalHeader fontFamily="heading">Task</ModalHeader>
          <ModalCloseButton position="relative" top="unset" />
        </HStack>

        {/* Modal main content */}
        <ModalBody>
          <AddTaskForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function AddTaskForm() {
  var { reset, register, handleSubmit, formState } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(createTaskSchema),
  });

  return (
    <VStack
      as="form"
      gap={pxToRem(32)}
      onSubmit={handleSubmit((data) => console.log(data))}
    >
      {/* Title input */}
      <FormControl isInvalid={formState.errors.title ? true : false}>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input
          type="text"
          {...register("title")}
          borderColor={
            formState.errors.title
              ? "red.500"
              : formState.touchedFields.title
              ? "green.500"
              : "#EBE8E8"
          }
        />
        <FormErrorMessage>{formState.errors.title?.message}</FormErrorMessage>
      </FormControl>

      {/* Submit button */}
      <Button
        variant="primarySolid"
        type="submit"
        disabled={formState.isSubmitting}
        px={pxToRem(32)}
      >
        {formState.isSubmitting ? "Loading..." : "Add"}
      </Button>
    </VStack>
  );
}

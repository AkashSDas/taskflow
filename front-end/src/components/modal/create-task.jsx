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
import { createTask } from "../../services/task";
import { useUser } from "../../lib/hooks";
import { customToast } from "../shared/toast";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { queryClient } from "../../lib/react-query";

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
          <AddTaskForm onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function AddTaskForm({ onClose }) {
  var { accessToken } = useUser();
  var { reset, register, handleSubmit, formState } = useForm({
    defaultValues: { title: "" },
    resolver: yupResolver(createTaskSchema),
  });

  var mutation = useMutation({
    mutationFn: (data) => createTask(data.title, accessToken),
    onSuccess: async (response) => {
      if (response.success) {
        await queryClient.invalidateQueries(["tasks"]);
        reset();
        onClose();
        customToast(
          "https://media.giphy.com/media/e2nYWcTk0s8TK/giphy.gif",
          "Task Added",
          "success"
        );
      } else {
        customToast(
          "https://media.giphy.com/media/CM67cI6BSH9ks/giphy-downsized.gif",
          response.error ?? "Something went wrong",
          "error"
        );
      }
    },
    onError: (error) => {
      let errorMsg = error?.message ?? "Something went wrong";
      customToast(
        "https://media.giphy.com/media/YrNSnsXGZHXO/giphy.gif",
        errorMsg,
        "error"
      );
    },
  });

  async function onSubmit(data) {
    if (!accessToken) return;
    await mutation.mutateAsync(data);
  }

  return (
    <VStack
      as="form"
      gap={pxToRem(32)}
      onSubmit={handleSubmit((data) => onSubmit(data))}
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

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
  Button,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { searchSchema } from "../../lib/validation";
import { pxToRem } from "../../lib/chakra-ui";
import { useUser } from "../../lib/hooks";

export default function SearchModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnEsc>
      <ModalOverlay />

      <ModalContent p={pxToRem(16)}>
        <HStack justifyContent="space-between" alignItems={"center"}>
          <ModalHeader fontFamily="heading">Search</ModalHeader>
          <ModalCloseButton position="relative" top="unset" />
        </HStack>

        {/* Modal main content */}
        <ModalBody>
          <SearchForm onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function SearchForm({ onClose }) {
  var { accessToken } = useUser();
  var { reset, register, handleSubmit, formState } = useForm({
    defaultValues: { query: "" },
    resolver: yupResolver(searchSchema),
  });

  async function onSubmit(data) {
    if (!accessToken || !taskId) return;
  }

  return (
    <VStack
      as="form"
      gap={pxToRem(32)}
      onSubmit={handleSubmit((data) => onSubmit(data))}
    >
      {/* Title input */}
      <FormControl isInvalid={formState.errors.query ? true : false}>
        <FormLabel htmlFor="query">Query</FormLabel>
        <Input
          type="text"
          {...register("query")}
          autoFocus
          borderColor={
            formState.errors.query
              ? "red.500"
              : formState.touchedFields.query
              ? "green.500"
              : "#EBE8E8"
          }
        />
        <FormErrorMessage>{formState.errors.query?.message}</FormErrorMessage>
      </FormControl>

      {/* Submit button */}
      <Button
        variant="primarySolid"
        type="submit"
        disabled={formState.isSubmitting}
        px={pxToRem(32)}
      >
        {formState.isSubmitting ? "Loading..." : "Search"}
      </Button>
    </VStack>
  );
}

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
  Divider,
  Heading,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { searchSchema } from "../../lib/validation";
import { chakraTheme, pxToRem } from "../../lib/chakra-ui";
import { useUser } from "../../lib/hooks";
import debounce from "lodash.debounce";
import { useCallback, useState } from "react";
import { searchTasks } from "../../services/task";

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
  var [search, setSearch] = useState("");
  var [results, setResults] = useState([]);

  var queryCallback = useCallback(
    debounce(async (value) => {
      var response = await searchTasks(value, accessToken);
      console.log(response);
    }, 500)
  );

  async function onSubmit(data) {
    if (!accessToken || data.query.length < 3) return;
    await queryCallback(data.query);
  }

  return (
    <VStack
      as="form"
      gap={pxToRem(32)}
      onSubmit={(e) => e.preventDefault()}
      alignItems="flex-start"
    >
      {/* Title input */}
      <FormControl>
        <FormLabel htmlFor="query">Query</FormLabel>
        <Input
          type="text"
          value={search}
          onChange={async (e) => {
            setSearch(e.target.value);
            await onSubmit({ query: e.target.value });
          }}
          autoFocus
        />
      </FormControl>

      <Divider bg={chakraTheme.color.border} />

      <Heading fontSize="lg">Results</Heading>
    </VStack>
  );
}

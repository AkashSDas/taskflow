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
  Text,
  Image,
} from "@chakra-ui/react";
import { chakraTheme, pxToRem } from "../../lib/chakra-ui";
import { useUser } from "../../lib/hooks";
import debounce from "lodash.debounce";
import { useCallback, useState } from "react";
import { searchTasks } from "../../services/task";
import { DoneIcon, Status } from "../tasks/task";

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
      if (response.success) {
        setResults(response.tasks);
      }
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

      <VStack w="full">
        {results.map((task) => (
          <Task key={task._id} task={task} />
        ))}

        {results.length == 0 && (
          <VStack>
            <Image
              src="https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif"
              h={pxToRem(100)}
              w={pxToRem(200)}
              rounded="md"
              objectFit="cover"
            />

            <Text color={chakraTheme.color.text2} fontFamily="heading">
              No results
            </Text>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
}

function Task({ task }) {
  return (
    <HStack
      role="group"
      w="full"
      maxW={pxToRem(600)}
      alignItems="center"
      gap={pxToRem(12)}
      px={pxToRem(8)}
      py={pxToRem(6)}
      rounded="md"
      _hover={{ bg: chakraTheme.color.bg2 }}
    >
      <DoneIcon done={task.status == Status.DONE ? true : false} />

      <Text flexGrow={1} color={chakraTheme.color.text2} fontWeight="semibold">
        {task.title}
      </Text>
    </HStack>
  );
}

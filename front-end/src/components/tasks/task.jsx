import {
  Badge,
  Button,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { chakraTheme, pxToRem } from "../../lib/chakra-ui";
import Loader from "../shared/loader";
import { useTask } from "../../lib/hooks";

export default function Task() {
  var { loading, task } = useTask();

  if (loading || !task) {
    return (
      <VStack>
        <Loader />
      </VStack>
    );
  }

  function TaskStatus() {
    return <Badge variant="solid">{task.status}</Badge>;
  }

  function Assignee() {
    return (
      <Text
        fontSize="base"
        fontWeight="semibold"
        color={chakraTheme.color.text2}
      >
        Task assigned to {task.assigns[0].email}
      </Text>
    );
  }

  function AddTodoButton() {
    return (
      <Button
        h={pxToRem(34)}
        px={pxToRem(12)}
        color="#278BFF"
        bg="#DDEDFF"
        fontFamily="heading"
      >
        Add Todo
      </Button>
    );
  }

  return (
    <VStack alignItems="center">
      <VStack w="full" maxW={pxToRem(600)} gap={pxToRem(16)} alignItems="start">
        <Heading fontSize="3xl">{task.title}</Heading>
        <Assignee />
        <TaskStatus />

        <Divider my={pxToRem(16)} bg={chakraTheme.color.border} />

        <HStack
          w="full"
          gap={pxToRem(16)}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading fontSize="xl">Todos</Heading>
          <AddTodoButton />
        </HStack>

        <Todos todos={task.todos} />
      </VStack>
    </VStack>
  );
}

function Todos({ todos }) {
  return (
    <VStack>
      {todos.map((todo) => (
        <Todo todo={todo} />
      ))}
    </VStack>
  );
}

function Todo({ todo }) {
  return (
    <VStack w="full" maxW={pxToRem(600)} alignItems="start">
      <Heading fontSize="xl">{todo.title}</Heading>
    </VStack>
  );
}

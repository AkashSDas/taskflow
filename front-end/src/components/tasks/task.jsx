import {
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { chakraTheme, pxToRem } from "../../lib/chakra-ui";
import Loader from "../shared/loader";
import { useDropdown, useTask, useUser } from "../../lib/hooks";
import CreateTodoModal from "../modal/create-todo";
import { DeleteIcon } from "./tasks-list";
import { useMutation } from "react-query";
import {
  deleteTodo,
  updateTaskStatus,
  updateTodoStatus,
} from "../../services/task";
import { queryClient } from "../../lib/react-query";
import { customToast } from "../shared/toast";

export var Status = {
  NOT_STARTED: "not started",
  IN_PROGRESS: "in progress",
  DONE: "done",
};

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
    var { accessToken } = useUser();
    var { isOpen, setIsOpen, wrapperRef } = useDropdown();

    var mutate = useMutation({
      mutationFn: (status) => updateTaskStatus(task._id, status, accessToken),
      onMutate: async (status) => {
        await queryClient.cancelQueries({ queryKey: ["task", task._id] });
        var previousData = queryClient.getQueryData(["task", task._id]);
        queryClient.setQueryData(["task", task._id], {
          ...previousData,
          task: { ...previousData.task, status },
        });
        return { previousData };
      },
      onError: (_err, _status, context) => {
        queryClient.setQueryData(["task", task._id], context.previousData);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["task", task._id] });
      },
    });

    return (
      <Box ref={wrapperRef} position="relative">
        <Badge
          cursor="pointer"
          variant="solid"
          onClick={() => setIsOpen(!isOpen)}
        >
          {task.status}
        </Badge>

        {isOpen && (
          <VStack
            position="absolute"
            shadow="md"
            border="1px solid"
            borderColor={chakraTheme.color.border}
            rounded="md"
            bg={chakraTheme.color.bg1}
            gap={pxToRem(2)}
            alignItems="start"
            px={pxToRem(4)}
            py={pxToRem(8)}
            w={pxToRem(120)}
            top={0}
            zIndex={1}
          >
            <Badge
              bg="gray.100"
              color="gray.500"
              cursor="pointer"
              variant="solid"
              onClick={() => {
                setIsOpen(!isOpen);
                mutate.mutate(Status.NOT_STARTED);
              }}
              _hover={{ filter: "brightness(0.95)" }}
            >
              Not started
            </Badge>
            <Badge
              cursor="pointer"
              variant="solid"
              onClick={() => {
                setIsOpen(!isOpen);
                mutate.mutate(Status.IN_PROGRESS);
              }}
              _hover={{ filter: "brightness(0.95)" }}
            >
              In progress
            </Badge>
            <Badge
              bg="green.100"
              color="green.500"
              cursor="pointer"
              variant="solid"
              onClick={() => {
                setIsOpen(!isOpen);
                mutate.mutate(Status.DONE);
              }}
              _hover={{ filter: "brightness(0.95)" }}
            >
              Done
            </Badge>
          </VStack>
        )}
      </Box>
    );
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
    var { isOpen, onClose, onOpen } = useDisclosure();

    return (
      <Button
        h={pxToRem(34)}
        px={pxToRem(12)}
        color="#278BFF"
        bg="#DDEDFF"
        fontFamily="heading"
        onClick={onOpen}
      >
        Add Todo
        <CreateTodoModal isOpen={isOpen} onClose={onClose} />
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

        <Todos taskId={task._id} todos={task.todos} />
      </VStack>
    </VStack>
  );
}

function Todos({ taskId, todos }) {
  return (
    <VStack w="full">
      {todos.map((todo) => (
        <Todo key={todo._id} taskId={taskId} todo={todo} />
      ))}
    </VStack>
  );
}

function Todo({ taskId, todo }) {
  var { accessToken } = useUser();
  var doneMutation = useMutation({
    mutationFn: () => {
      return updateTodoStatus(todo._id, taskId, !todo.done, accessToken);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["task", taskId] });
      var previousData = queryClient.getQueryData(["task", taskId]);
      console.log(previousData);
      var updatedTask = {
        ...previousData,
        task: {
          ...previousData.task,
          todos: previousData.task.todos.map((t) => {
            if (t._id == todo._id) {
              return { ...todo, done: !todo.done };
            }
            return t;
          }),
        },
      };

      queryClient.setQueryData(["task", taskId], () => {
        return { ...updatedTask };
      });

      return { previousData, taskId };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["todo", context.taskId], context?.previousData);
    },
    onSettled: (_newData, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables?.taskId] });
    },
  });

  var removeMutation = useMutation({
    mutationFn: () => deleteTodo(todo._id, taskId, accessToken),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["task", taskId] });
      var previousData = queryClient.getQueryData(["task", taskId]);
      var updatedTask = {
        ...previousData,
        task: {
          ...previousData.task,
          todos: previousData.task.todos.filter((t) => t._id != todo._id),
        },
      };

      queryClient.setQueryData(["task", taskId], () => {
        return { ...updatedTask };
      });

      customToast(
        "https://media.giphy.com/media/5nsiFjdgylfK3csZ5T/giphy-downsized.gif",
        "Todo removed",
        "success"
      );

      return { previousData, taskId };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["task", context.taskId], context?.previousData);
    },
    onSettled: (_newData, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables?.taskId] });
    },
  });

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
      <IconButton
        h={pxToRem(26)}
        w={pxToRem(26)}
        p={pxToRem(4)}
        rounded="md"
        variant="ghost"
        display="flex"
        justifyContent="center"
        alignItems="center"
        onClick={() => doneMutation.mutate()}
        disabled={doneMutation.isLoading}
      >
        <DoneIcon done={todo.done} />
      </IconButton>

      <Text flexGrow={1} color={chakraTheme.color.text2} fontWeight="semibold">
        {todo.title}
      </Text>

      <IconButton
        variant="unstyled"
        visibility="hidden"
        onClick={() => removeMutation.mutate()}
        disabled={removeMutation.isLoading}
        _groupHover={{ visibility: "visible" }}
      >
        <DeleteIcon />
      </IconButton>
    </HStack>
  );
}

function DoneIcon({ done }) {
  return (
    <Icon display="block" w={pxToRem(20)} h={pxToRem(20)} cursor="pointer">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 13L5.52642 15.8211C6.35374 16.483 7.55365 16.3848 8.2624 15.5973L16 7M8 13L11.5264 15.8211C12.3537 16.483 13.5536 16.3848 14.2624 15.5973L22 7"
          stroke={done ? "#3EAE6B" : "#B9B9B9"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Icon>
  );
}

import { Box, HStack, Icon, IconButton, Text, VStack } from "@chakra-ui/react";
import Loader from "../shared/loader";
import { useTasks, useUser } from "../../lib/hooks";
import { chakraTheme, pxToRem } from "../../lib/chakra-ui";
import { useMutation } from "react-query";
import { deleteTask } from "../../services/task";
import { queryClient } from "../../lib/react-query";
import { customToast } from "../shared/toast";
import { useNavigate } from "react-router-dom";

export default function TasksList() {
  var { user, accessToken } = useUser();
  var { tasks, loading } = useTasks();

  if (loading) {
    return (
      <VStack>
        <Loader />
      </VStack>
    );
  }

  if (!user) {
    return (
      <VStack>
        <Text>Not logged in</Text>
      </VStack>
    );
  }

  function DeleteButton({ taskId }) {
    var mutation = useMutation({
      mutationFn: () => deleteTask(taskId, accessToken),
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["tasks"] });
        var previousData = queryClient.getQueryData(["tasks"]);
        var updatedTasks = tasks.filter((t) => t._id != taskId);
        queryClient.setQueryData(["tasks"], () => {
          return { tasks: updatedTasks, success: true };
        });

        customToast(
          "https://media.giphy.com/media/O3GqAYR9jFxLi/giphy.gif",
          "Task deleted",
          "success"
        );

        return { previousData };
      },
      onError: (_err, _variables, context) => {
        queryClient.setQueryData(["tasks"], context?.previousData);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    });

    return (
      <IconButton
        variant="unstyled"
        p={pxToRem(4)}
        display="flex"
        justifyContent="center"
        alignItems="center"
        disabled={mutation.isLoading}
        onClick={() => mutation.mutate()}
      >
        <DeleteIcon />
      </IconButton>
    );
  }

  var navigate = useNavigate();

  return (
    <VStack
      w="full"
      justifyContent="center"
      alignItems="center"
      px={pxToRem(32)}
    >
      {tasks?.map((task) => (
        <HStack
          key={task._id}
          h={pxToRem(56)}
          w={pxToRem(500)}
          px={pxToRem(16)}
          gap={pxToRem(12)}
          rounded="md"
          border="1px solid"
          borderColor={chakraTheme.color.border}
          bg={chakraTheme.color.bg1}
          shadow="sm"
          cursor="pointer"
          _hover={{ bg: chakraTheme.color.bg2 }}
          role="group"
          onClick={() => navigate(`/task/${task._id}`)}
        >
          <Text
            flexGrow={1}
            fontWeight="semibold"
            color={chakraTheme.color.text2}
          >
            {task.title}
          </Text>

          <Box visibility="hidden" _groupHover={{ visibility: "visible" }}>
            <DeleteButton taskId={task._id} />
          </Box>
        </HStack>
      ))}
    </VStack>
  );
}

export function DeleteIcon() {
  return (
    <Icon
      display="block"
      className="icon"
      w={pxToRem(20)}
      h={pxToRem(20)}
      cursor="pointer"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
          stroke="#8B8B8B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.08301 4.14166L7.26634 3.04999C7.39967 2.25832 7.49967 1.66666 8.90801 1.66666H11.0913C12.4997 1.66666 12.608 2.29166 12.733 3.05832L12.9163 4.14166"
          stroke="#8B8B8B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.7087 7.61667L15.167 16.0083C15.0753 17.3167 15.0003 18.3333 12.6753 18.3333H7.32533C5.00033 18.3333 4.92533 17.3167 4.83366 16.0083L4.29199 7.61667"
          stroke="#8B8B8B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.6084 13.75H11.3834"
          stroke="#8B8B8B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.91699 10.4167H12.0837"
          stroke="#8B8B8B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Icon>
  );
}

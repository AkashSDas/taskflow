import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { chakraTheme, pxToRem } from "../../lib/chakra-ui";
import AuthModal from "../modal/auth";
import { authModalFormAtom } from "../../lib/atom";
import { useUser } from "../../lib/hooks";
import { useMutation } from "react-query";
import { logout } from "../../services/auth";
import { queryClient } from "../../lib/react-query";
import { customToast } from "../shared/toast";
import CreateTaskModal from "../modal/create-task";
import { Link as ReactRouterLink } from "react-router-dom";
import SearchModal from "../modal/search";

export default function Navbar() {
  var { user } = useUser();
  var { isOpen, onClose, onOpen } = useDisclosure();
  var {
    isOpen: isAddTaskOpen,
    onClose: onAddTaskClose,
    onOpen: onAddTaskOpen,
  } = useDisclosure();

  function AddTaskButton() {
    var [_form, setForm] = useAtom(authModalFormAtom);

    if (user) {
      return (
        <Button onClick={onAddTaskOpen} variant="primarySolid">
          <HStack>
            <AddIcon />
            <Text>Add Task</Text>
            <CreateTaskModal isOpen={isAddTaskOpen} onClose={onAddTaskClose} />
          </HStack>
        </Button>
      );
    }

    return (
      <Button
        onClick={() => {
          onOpen();
          setForm("signup");
        }}
        variant="primarySolid"
      >
        <HStack>
          <AddIcon />
          <Text>Add Task</Text>
          <AuthModal
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setForm(null);
            }}
          />
        </HStack>
      </Button>
    );
  }

  function LoginButton() {
    var [_form, setForm] = useAtom(authModalFormAtom);

    return (
      <Button
        onClick={() => {
          onOpen();
          setForm("login");
        }}
        variant="secondarySolid"
      >
        <Text>Login</Text>

        <AuthModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setForm(null);
          }}
        />
      </Button>
    );
  }

  function SearchButton() {
    var { isOpen, onClose, onOpen } = useDisclosure();
    var { user } = useUser();
    var [, setForm] = useAtom(authModalFormAtom);

    return (
      <Box>
        <IconButton
          onClick={() => {
            if (user) onOpen();
            else {
              customToast(
                "https://media.giphy.com/media/3o7TKsQ8DmMoyk5UEk/giphy.gif",
                "Please login to search"
              );
            }
          }}
          variant="ghost"
        >
          <SearchIcon />
        </IconButton>

        {user && <SearchModal isOpen={isOpen} onClose={onClose} />}
      </Box>
    );
  }

  // TODO: check the value of previous access token
  function LogoutButton() {
    var mutation = useMutation({
      mutationFn: logout,
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["new-access-token"] });
        var previousData = queryClient.getQueryData(["new-access-token"]);

        queryClient.setQueryData(["new-access-token"], () => ({
          accessToken: null,
          success: true,
          user: null,
          error: null,
        }));

        return { previousData };
      },
      onError: (_error, _variables, context) => {
        queryClient.setQueryData(["new-access-token"], context?.previousData);
      },
      onSettled: () => {
        customToast(
          "https://media.giphy.com/media/m9eG1qVjvN56H0MXt8/giphy-downsized.gif",
          "Logout successful",
          "success"
        );

        queryClient.invalidateQueries({ queryKey: ["new-access-token"] });
      },
    });

    return (
      <Button onClick={() => mutation.mutate()} variant="secondarySolid">
        <Text>Logout</Text>
      </Button>
    );
  }

  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      gap={pxToRem(16)}
      h={pxToRem(48)}
      px={{ base: pxToRem(16), md: pxToRem(32) }}
      borderBottom="1px solid"
      borderColor={chakraTheme.color.border}
    >
      <ReactRouterLink to="/">
        <Text
          fontFamily="heading"
          fontSize="xl"
          className="brand-text-gradient"
        >
          TaskFlow
        </Text>
      </ReactRouterLink>

      <HStack gap={pxToRem(24)} justifyContent="flex-end" alignItems="center">
        {user && (
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color={chakraTheme.color.text2}
          >
            {user.email}
          </Text>
        )}

        <SearchButton />

        {!user && <LoginButton />}
        {user && <LogoutButton />}
        <AddTaskButton />
      </HStack>
    </HStack>
  );
}

function SearchIcon() {
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
          d="M11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20Z"
          stroke="#4D4D4D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.9304 20.6898C19.4604 22.2898 20.6704 22.4498 21.6004 21.0498C22.4504 19.7698 21.8904 18.7198 20.3504 18.7198C19.2104 18.7098 18.5704 19.5998 18.9304 20.6898Z"
          stroke="#4D4D4D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Icon>
  );
}

function AddIcon() {
  return (
    <Icon display="block" w={pxToRem(24)} h={pxToRem(24)} cursor="pointer">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 12H18"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 18V6"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Icon>
  );
}

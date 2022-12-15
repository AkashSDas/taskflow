import { Button, HStack, Icon, Text, useDisclosure } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { chakraTheme, pxToRem } from "../../lib/chakra-ui";
import AuthModal from "../modal/auth";
import { authModalFormAtom } from "../../lib/atom";
import { useUser } from "../../lib/hooks";
import { useMutation } from "react-query";
import { logout } from "../../services/auth";
import { queryClient } from "../../lib/react-query";
import { customToast } from "../shared/toast";

export default function Navbar() {
  var { user } = useUser();
  var { isOpen, onClose, onOpen } = useDisclosure();

  function AddTaskButton() {
    var [_form, setForm] = useAtom(authModalFormAtom);

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

  function LogoutButton() {
    var mutation = useMutation({
      mutationFn: logout,
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["new-access-token"] });
        var previousAccessToken = queryClient.getQueryData([
          "new-access-token",
        ]);

        queryClient.setQueryData(["new-access-token"], null);

        return { previousAccessToken };
      },
      onError: (_error, _variables, context) => {
        queryClient.setQueryData(
          ["new-access-token"],
          context?.previousAccessToken
        );
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
      <Text fontFamily="heading" fontSize="xl" className="brand-text-gradient">
        TaskFlow
      </Text>

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

        {!user && <LoginButton />}
        {user && <LogoutButton />}
        <AddTaskButton />
      </HStack>
    </HStack>
  );
}

function AddIcon() {
  return (
    <Icon
      display="block"
      className="icon"
      w={pxToRem(24)}
      h={pxToRem(24)}
      cursor="pointer"
    >
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

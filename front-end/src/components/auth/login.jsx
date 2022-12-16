import {
  VStack,
  FormErrorMessage,
  FormControl,
  Text,
  FormLabel,
  Input,
  Button,
  Box,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../lib/validation";
import { pxToRem, chakraTheme } from "../../lib/chakra-ui";
import { useAtom } from "jotai";
import { authModalFormAtom } from "../../lib/atom";
import { useMutation } from "react-query";
import { login } from "../../services/auth";
import { queryClient } from "../../lib/react-query";
import { customToast } from "../shared/toast";

export default function LoginForm({ onClose }) {
  var [_form, setForm] = useAtom(authModalFormAtom);
  var { reset, register, handleSubmit, formState } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(loginSchema),
  });

  var mutation = useMutation({
    mutationFn: (data) => login(data),
    onSuccess: async (response) => {
      if (response.success) {
        await queryClient.invalidateQueries(["new-access-token"]);
        reset();
        onClose();
        customToast(
          "https://media.giphy.com/media/CM67cI6BSH9ks/giphy-downsized.gif",
          "Login successful",
          "success"
        );
      } else {
        let errorMsg = response?.message ?? "Something went wrong";
        if (Array.isArray(response.error)) {
          errorMsg = response.error[0].message;
        }

        customToast(
          "https://media.giphy.com/media/YrNSnsXGZHXO/giphy.gif",
          errorMsg,
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

  return (
    <VStack
      as="form"
      gap={pxToRem(32)}
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
    >
      {/* Email input */}
      <FormControl isInvalid={formState.errors.email ? true : false}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          type="email"
          {...register("email")}
          autoFocus
          borderColor={
            formState.errors.email
              ? "red.500"
              : formState.touchedFields.email
              ? "green.500"
              : "#EBE8E8"
          }
        />
        <FormErrorMessage>{formState.errors.email?.message}</FormErrorMessage>
      </FormControl>

      {/* Password input */}
      <FormControl isInvalid={formState.errors.password ? true : false}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          {...register("password")}
          fontFamily="heading"
          borderColor={
            formState.errors.password
              ? "red.500"
              : formState.touchedFields.password
              ? "green.500"
              : "#EBE8E8"
          }
        />

        <FormErrorMessage>
          {formState.errors.password?.message}
        </FormErrorMessage>
      </FormControl>

      {/* Submit button */}
      <Button
        variant="primarySolid"
        type="submit"
        disabled={formState.isSubmitting}
        px={pxToRem(32)}
      >
        {formState.isSubmitting ? "Loading..." : "Login"}
      </Button>

      <Box>
        <Text
          display="inline"
          fontWeight="semibold"
          fontSize="sm"
          color={chakraTheme.color.text2}
        >
          Don't have an account ?{" "}
        </Text>
        <Text
          display="inline"
          cursor="pointer"
          fontWeight="semibold"
          fontSize="sm"
          color={chakraTheme.color.primary}
          onClick={() => {
            reset();
            setForm("signup");
          }}
        >
          Signup
        </Text>
      </Box>
    </VStack>
  );
}

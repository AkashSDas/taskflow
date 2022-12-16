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
import { signupSchema } from "../../lib/validation";
import { pxToRem, chakraTheme } from "../../lib/chakra-ui";
import { useAtom } from "jotai";
import { authModalFormAtom } from "../../lib/atom";
import { useMutation } from "react-query";
import { queryClient } from "../../lib/react-query";
import { signup } from "../../services/auth";
import { customToast } from "../shared/toast";
import { account } from "../../lib/appwrite";
import { ID } from "appwrite";

export default function AppWriteSignupForm({ onClose }) {
  var [_form, setForm] = useAtom(authModalFormAtom);
  var { reset, register, handleSubmit, formState } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(signupSchema),
  });

  var mutation = useMutation({
    mutationFn: (data) => signup(data),
    onSuccess: async (response) => {
      if (response.success) {
        reset();
        onClose();
        await queryClient.invalidateQueries(["new-access-token"]);
        customToast(
          "https://media.giphy.com/media/CM67cI6BSH9ks/giphy-downsized.gif",
          "Signup successful",
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

  async function appWriteSignup(data) {
    // Create account
    try {
      let userAccount = await account.create(
        ID.unique(),
        data.email,
        data.password
      );

      await mutation.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }

    // console.log(userAccount);

    // Signup data
    //   {
    //     "$id": "639c5cfe17d20b38f509",
    //     "$createdAt": "2022-12-16T11:56:46.231+00:00",
    //     "$updatedAt": "2022-12-16T11:56:46.231+00:00",
    //     "name": "",
    //     "registration": "2022-12-16T11:56:46.231+00:00",
    //     "status": true,
    //     "passwordUpdate": "2022-12-16T11:56:46.231+00:00",
    //     "email": "fun@gmail.com",
    //     "phone": "",
    //     "emailVerification": false,
    //     "phoneVerification": false,
    //     "prefs": {}
    // }

    // Login
    // var userLogin = await account.createEmailSession(data.email, data.password);
    // console.log(userLogin);

    // Login data data
    //   {
    //     "$id": "639c5e4e21780cedb5cb",
    //     "$createdAt": "2022-12-16T12:02:22.149+00:00",
    //     "userId": "639c5cfe17d20b38f509",
    //     "expire": "2023-12-16 12:02:22.137",
    //     "provider": "email",
    //     "providerUid": "fun@gmail.com",
    //     "providerAccessToken": "",
    //     "providerAccessTokenExpiry": "",
    //     "providerRefreshToken": "",
    // }
  }

  return (
    <VStack
      as="form"
      gap={pxToRem(32)}
      onSubmit={handleSubmit((data) => appWriteSignup(data))}
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
        {formState.isSubmitting ? "Loading..." : "Signup"}
      </Button>

      <Box>
        <Text
          display="inline"
          fontWeight="semibold"
          fontSize="sm"
          color={chakraTheme.color.text2}
        >
          Already have an account?{" "}
        </Text>

        <Text
          display="inline"
          cursor="pointer"
          fontWeight="semibold"
          fontSize="sm"
          color={chakraTheme.color.primary}
          onClick={() => {
            reset();
            setForm("login");
          }}
        >
          Login
        </Text>
      </Box>
    </VStack>
  );
}

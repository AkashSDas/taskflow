import {
  VStack,
  FormErrorMessage,
  FormControl,
  Text,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../lib/validation";
import { pxToRem, chakraTheme } from "../../lib/chakra-ui";

export default function SignupForm() {
  var { reset, register, handleSubmit, formState } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(signupSchema),
  });

  return (
    <VStack
      as="form"
      gap={pxToRem(32)}
      onSubmit={handleSubmit((data) => console.log(data))}
    >
      {/* Email input */}
      <FormControl isInvalid={formState.errors.email ? true : false}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          type="email"
          {...register("email")}
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

      <Text fontWeight="semibold" fontSize="sm" color={chakraTheme.color.text2}>
        Already have an account?{" "}
        <Text
          display="inline"
          cursor="pointer"
          color={chakraTheme.color.primary}
          onClick={() => {
            reset();
          }}
        >
          Login
        </Text>
      </Text>
    </VStack>
  );
}

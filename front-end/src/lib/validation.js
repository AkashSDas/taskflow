import { object, string } from "yup";

export var signupSchema = object({
  email: string().email("Invalid").required("Required"),
  password: string().required("Required"),
}).required("Required");

export var loginSchema = object({
  email: string().email("Invalid").required("Required"),
  password: string().required("Required"),
}).required("Required");

export var createTaskSchema = object({
  title: string()
    .required("Required")
    .min(3, "Too Short!")
    .max(64, "Too Long!"),
}).required("Required");

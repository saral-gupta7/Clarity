"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAdminSchema } from "@/lib/schema";

type FormFields = {
  email: string;
  password: string;
  name: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(registerAdminSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
  };
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form
        action=""
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder="email"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must contain atleast 4 characters.",
            },
          })}
          type="password"
          placeholder="password"
        />

        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;

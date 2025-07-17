"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAdminSchema } from "@/lib/schema";

import { useRouter } from "next/navigation";

import axios from "axios";

type FormFields = {
  email: string;
  password: string;
  name: string;
};

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(registerAdminSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await axios.post("/api/registerAdmin", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setTimeout(() => {
        router.push("/create");
      }, 2000);

      console.log("Admin Registered successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (message === "Account with this email already exists") {
          setError("email", { type: "server", message });
        } else {
          console.error("Unhandled server error:", message);
        }
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <div className="h-screen w-full flex-center flex-col gap-4">
      <h1>Join Now</h1>
      <form
        action=""
        className="flex flex-col gap-3 border-1 border-light/10 p-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label>Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          type="text"
          placeholder="Name"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <label>Email</label>
        <input {...register("email")} type="email" placeholder="Email" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <label>Password</label>
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button type="submit" className="text-dark">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;

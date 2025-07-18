"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAdminSchema } from "@/lib/schema";

import Link from "next/link";
import { useRouter } from "next/navigation";

import axios from "axios";
import { motion } from "motion/react";
import { useEffect } from "react";

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

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("/api/session");
        if (res.data.authenticated && res.data.admin?.role === "admin") {
          router.push(`/admin/${res.data.admin.id}/dashboard`);
        }
      } catch {}
    };
    fetchSession();
  }, [router]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await axios.post("/api/registerAdmin", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setTimeout(() => {
        router.push("/login");
      }, 1000);

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
    <motion.div
      className="h-screen w-full"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <motion.div
          className="w-full hidden md:flex flex-col justify-between py-20 pl-20 pt-15"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href={"/"}>
            <h1 className="font-instrument text-3xl font-bold">Clarity</h1>
          </Link>
          <h1 className="capitalize flex flex-col gap-3 md:text-4xl lg:text-5xl font-black font-lato">
            <span>Yours Ideas.</span>
            <span>Their Insights.</span>
            <span>One Form Away</span>
          </h1>
        </motion.div>
        <motion.div
          className="flex-center h-screen flex-col px-10"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="capitalize flex-center sm:hidden flex-wrap text-center gap-3 text-xl font-bold font-lato">
            <span>Yours Ideas.</span>
            <span>Their Insights.</span>
            <span>One Form Away.</span>
          </h1>
          <motion.form
            action=""
            className="flex flex-col gap-5 p-10 max-w-100 w-full"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-xl ">Join Now</h1>
              <p className="text-sm text-neutral-500">
                Create your admin account to start building forms
              </p>
            </div>
            <label htmlFor="name" className="-mb-2">
              Name
            </label>
            <input
              id="name"
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Name"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}

            <label htmlFor="email" className="-mb-2">
              Email
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}

            <label htmlFor="password" className="-mb-2">
              Password
            </label>
            <input
              id="password"
              {...register("password")}
              type="password"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}

            <button type="submit">Submit</button>
            <p className="text-sm opacity-75">
              Already have an account?{" "}
              <Link href={"/login"} className="underline">
                Sign In
              </Link>
            </p>
          </motion.form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;

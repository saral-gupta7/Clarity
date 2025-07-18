"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect } from "react";

type LoginFormFields = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormFields>({});

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

  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    try {
      const res = await axios.post("/api/loginAdmin", {
        ...data,
      });

      setTimeout(
        () => (window.location.href = `/admin/${res.data.adminId}/dashboard`),
        700
      );
      // setTimeout(() => {
      //   router.replace(`/admin/${res.data.adminId}/dashboard`);
      // }, 1000);

      console.log("Sign in successfull");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (message === "Incorrect password. Please try again.") {
          setError("password", { type: "server", message });
        } else if (message === "Admin not found.") {
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
    <motion.section
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
              <h1 className="text-xl ">Sign In</h1>
              <p className="text-sm text-neutral-500">
                Receive feedbacks that count
              </p>
            </div>
            <label htmlFor="email" className="-mb-2">
              Email
            </label>
            <input
              id="email"
              {...register("email", { required: "Email is required" })}
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
              {...register("password", {
                required: "Password is required",
              })}
              type="password"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}

            <button type="submit">Submit</button>
            <p className="text-sm opacity-75">
              Already have an account?{" "}
              <Link href={"/register"} className="underline">
                Register
              </Link>
            </p>
          </motion.form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Login;

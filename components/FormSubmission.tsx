"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

type Answer = {
  questionId: string;
  value: string;
};

type Questions = {
  id: string;
  label: string;
  type: string;
  options?: string[];
};

const FormSubmission = ({ form }: { form: any }) => {
  const router = useRouter();
  const { questions, publicUrl, title, description } = form;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, string>>();

  const processedQuestions = questions.map((q: Questions) => ({
    ...q,
    options: q.options ? JSON.parse(q.options) : null,
  }));

  const onSubmit: SubmitHandler<Record<string, string>> = async (data) => {
    const name = data.name;

    if (!name) {
      console.error("Name is missing");
      return;
    }

    const answers: Answer[] = processedQuestions.map((q) => ({
      questionId: q.id,
      value: data[q.id] || "",
    }));

    try {
      await axios.post(`/api/forms/${publicUrl}/submit`, {
        answers,
        name, // Send name separately from answers
      });

      router.push(`/forms/${publicUrl}/success`);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section className="h-screen w-full flex-center flex-col px-10">
      <div className="w-full max-w-5xl flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold capitalize">{title}</h1>
          <h2 className="text-xl text-[#656667] capitalize">{description}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label>Your Name</label>
            <input
              {...register("name", {
                required: "Name is required.",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters.",
                },
              })}
              type="text"
              placeholder="Enter your full name"
              className="border px-3 py-2"
            />
            {errors.name && (
              <p className="text-red-400 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Dynamic Questions */}
          {processedQuestions.map(({ id, label, type, options }) => (
            <div key={id} className="flex flex-col gap-2">
              <label className="capitalize">{label}</label>
              {type === "text" ? (
                <>
                  <input
                    {...register(id, { required: "This field is required." })}
                    type="text"
                    className="border px-3 py-2"
                  />
                  {errors[id] && (
                    <p className="text-red-400 text-sm">
                      {errors[id]?.message}
                    </p>
                  )}
                </>
              ) : (
                options?.map((option) => (
                  <label key={option} className="block">
                    <input
                      {...register(id, {
                        required: "Please select an option.",
                      })}
                      type="radio"
                      value={option}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))
              )}
              {errors[id] && type === "multiple_choice" && (
                <p className="text-red-400 text-sm">{errors[id]?.message}</p>
              )}
            </div>
          ))}

          <button type="submit" className="flex-center px-4 py-2 w-fit">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default FormSubmission;

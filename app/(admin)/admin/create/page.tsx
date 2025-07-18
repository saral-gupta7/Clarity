"use client";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Control,
  UseFormRegister,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { formSchema } from "@/lib/schema";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export type CreateFormFields = z.infer<typeof formSchema>;

type MultipleChoiceOptionsProps = {
  control: Control<CreateFormFields>;
  questionIndex: number;
  register: UseFormRegister<CreateFormFields>;
};
const CreateForm = () => {
  const [adminId, setAdminId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("/api/session");
        if (res.data.authenticated && res.data.admin?.role === "admin") {
          setAdminId(res.data.admin.id);
        } else {
          console.log("session not found!");
        }
      } catch (error) {
        console.error("Session fetch error", error);
        router.push("/login");
      }
    };

    fetchSession();
  }, [router]);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateFormFields>({
    defaultValues: { questions: [] },
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const watchedQuestions = watch("questions");

  const onSubmit: SubmitHandler<CreateFormFields> = async (data) => {
    if (!adminId) {
      console.error("Admin ID missing, cannot submit form.");
      return;
    }
    const processedData = {
      ...data,
      questions: data.questions.map((q) => ({
        ...q,
        options: q.options?.map((opt) => opt.value).filter(Boolean),
      })),
      adminId,
    };

    try {
      const res = await axios.post("/api/createForm", processedData);

      if (res.data?.form?.publicUrl) {
        router.push(`/admin/${adminId}/dashboard`);
      } else {
        console.error("publicUrl missing in response");
      }
      console.log("Form created successfully:", res.data);
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  return (
    <motion.section
      className="min-h-screen w-full flex justify-center px-10 py-40 "
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="p-10 sm:p-20 border-1 w-full max-w-4xl border-light/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.form
          className="flex flex-col gap-3 max-w-3xl"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <label htmlFor="description">Title</label>
          <input
            {...register("title")}
            type="text"
            placeholder="What's the title of your form?"
          />

          {errors.title && (
            <p className="text-red-400">{errors.title.message}</p>
          )}
          <label htmlFor="description">Description (Optional)</label>
          <input
            {...register("description")}
            type="text"
            placeholder="Add a short description for better clarity"
          />

          {errors.description && (
            <p className="text-red-400">{errors.description.message}</p>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="py-5 flex flex-col gap-5">
              <div className="flex gap-5 w-full">
                <select
                  {...register(`questions.${index}.type` as const)}
                  className="flex-1"
                >
                  <option value="text">Text</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>

                <button
                  type="button"
                  className="text-dark w-fit bg-red-300"
                  onClick={() => remove(index)}
                >
                  Remove
                </button>
              </div>

              <input
                {...register(`questions.${index}.label` as const)}
                placeholder="Enter your question"
              />

              {errors.questions?.[index]?.label && (
                <p className="text-red-400">
                  {errors.questions[index]?.label?.message}
                </p>
              )}

              {watchedQuestions?.[index]?.type === "multiple_choice" && (
                <MultipleChoiceOptions
                  control={control}
                  questionIndex={index}
                  register={register}
                />
              )}
              {watchedQuestions?.[index]?.type === "multiple_choice" &&
                watchedQuestions?.[index]?.options &&
                watchedQuestions[index].options.length < 2 && (
                  <p className="text-red-400">
                    Please add at least 2 options for this multiple choice
                    question.
                  </p>
                )}

              {errors.questions?.[index]?.options && (
                <p className="text-red-400">
                  {errors.questions[index]?.options?.message}
                </p>
              )}
            </div>
          ))}

          {fields.length < 7 && (
            <button
              type="button"
              className="text-dark w-fit"
              onClick={() => append({ type: "text", label: "", options: [] })}
            >
              Add Question
            </button>
          )}

          <button
            type="submit"
            className={`px-4 py-2 text-dark text-sm ${
              fields.length === 0 ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={fields.length === 0}
          >
            Submit
          </button>
        </motion.form>
      </motion.div>
    </motion.section>
  );
};

const MultipleChoiceOptions = ({
  control,
  questionIndex,
  register,
}: MultipleChoiceOptionsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  return (
    <div className="flex flex-col gap-5">
      {fields.map((field, optIndex) => (
        <div key={field.id} className="flex gap-2 items-center">
          <input
            {...register(
              `questions.${questionIndex}.options.${optIndex}.value` as const
            )}
            placeholder="Option"
            className="border-light/10 px-4 outline-none max-w-80 w-full mb-2"
          />
          <button
            type="button"
            className="text-dark bg-red-300"
            onClick={() => remove(optIndex)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-dark w-fit"
        onClick={() => append({ value: "" })}
      >
        Add Option
      </button>
    </div>
  );
};

export default CreateForm;

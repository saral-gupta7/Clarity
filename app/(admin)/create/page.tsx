"use client";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";

type Option = {
  value: string;
};

type Question = {
  type: string;
  label: string;
  options?: Option[];
};

type CreateFormFields = {
  title: string;
  description: string;
  questions: Question[];
};

const CreateForm = () => {
  const router = useRouter();
  const { register, handleSubmit, control, watch } = useForm<CreateFormFields>({
    defaultValues: { questions: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const watchedQuestions = watch("questions");

  const onSubmit: SubmitHandler<CreateFormFields> = async (data) => {
    const processedData = {
      ...data,
      questions: data.questions.map((q) => ({
        ...q,
        options: q.options?.map((opt) => opt.value).filter(Boolean),
      })),
      adminId: "f1b1f0bb-e647-4668-bcf9-277811f38a32",
    };

    try {
      const res = await axios.post("/api/createForm", processedData);

      if (res.data?.form?.publicUrl) {
        router.push(`/forms/${res.data.form.publicUrl}`);
      } else {
        console.error("publicUrl missing in response");
      }
      console.log("Form created successfully:", res.data);
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  return (
    <section className="min-h-screen w-full flex justify-center px-10 py-40 ">
      <div className="p-10 sm:p-20 border-1 w-full max-w-4xl border-light/10">
        <form
          className="flex flex-col gap-3 max-w-3xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="description">Title</label>
          <input
            {...register("title")}
            type="text"
            placeholder="What's the title of your form?"
            className="border-b-2 border-light outline-none border-0 "
          />
          <label htmlFor="description">Description</label>
          <input
            {...register("description")}
            type="text"
            className="border-b-2 border-light outline-none border-0 "
            placeholder="Add a short description for better clarity"
          />

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
                className="border-b-2 border-light outline-none border-0 flex-1"
              />

              {watchedQuestions?.[index]?.type === "multiple_choice" && (
                <MultipleChoiceOptions
                  control={control}
                  questionIndex={index}
                  register={register}
                />
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
            className="px-4 py-2 bg-black text-white text-sm"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

const MultipleChoiceOptions = ({ control, questionIndex, register }: any) => {
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

"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

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
  const { questions, publicUrl, title, description } = form;
  const { register, handleSubmit } = useForm<Record<string, string>>();

  const processedQuestions = questions.map((q) => ({
    ...q,
    options: q.options ? JSON.parse(q.options) : null,
  }));

  const onSubmit: SubmitHandler<Record<string, string>> = async (data) => {
    const answers: Answer[] = processedQuestions.map((q: Questions) => ({
      questionId: q.id,
      value: data[q.id],
    }));

    try {
      const res = await axios.post(`/api/forms/${publicUrl}/submit`, {
        answers,
      });
      console.log("Answers submitted Successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section className="h-screen w-full flex-center flex-col">
      <h1 className="text-2xl font-bold">{title}</h1>
      <h1 className="text-3xl">{description}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {processedQuestions.map(({ id, label, type, options }: Questions) => (
          <div key={id} className="flex flex-col gap-2">
            <label>{label}</label>
            {type === "text" ? (
              <input {...register(id)} type="text" className="border" />
            ) : (
              options &&
              options.map((option: string) => (
                <label key={option} className="block">
                  <input
                    {...register(id)}
                    type="radio"
                    value={option}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))
            )}
          </div>
        ))}
        <button
          type="submit"
          className="flex-center bg-black text-white px-4 py-2"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default FormSubmission;

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { motion } from "motion/react";

type FormWithResponses = {
  id: string;
  title: string;
  description: string;
  publicUrl: string;
  responses: {
    id: string;
    formId: string;
    name: string;
    submittedAt: string;
    answers: {
      id: string;
      responseId: string;
      questionId: string;
      value: string;
      question: {
        id: string;
        formId: string;
        type: string;
        label: string;
        options: string;
        order: number | null;
        createdAt: string;
        updatedAt: string;
      };
    }[];
  }[];
};
export default function ResponsesPage() {
  const { adminId, formId } = useParams();

  const [form, setForm] = useState<FormWithResponses | null>(null);

  useEffect(() => {
    async function fetchResponses() {
      try {
        const res = await axios.get(
          `/api/admin/${adminId}/forms/${formId}/responses`
        );
        setForm(res.data.form);
      } catch (error) {
        console.error("Error fetching form with responses", error);
      }
    }
    fetchResponses();
  }, [adminId, formId]);

  if (!form) {
    return (
      <motion.section
        className="p-10 flex-center h-screen w-full flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          Loading...
        </motion.p>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="flex-center w-full flex-col py-40 max-w-5xl mx-auto px-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.h1
          className="text-2xl font-bold mb-5 capitalize"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          {form.title}
        </motion.h1>
        <motion.p
          className="mb-5 text-gray-400 capitalize"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {form.description}
        </motion.p>
      </motion.div>
      <motion.div
        className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {form.responses.length > 0 ? (
          form.responses.map((response) => (
            <motion.div
              key={response.id}
              className="p-4 px-6 rounded-md mb-5 w-full max-w-5xl bg-[#0A0B14]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-semibold mb-3 capitalize">{response.name}</h2>

              {response.answers.map((answer) => (
                <div key={answer.id} className="mb-3 flex flex-col gap-4">
                  <p className="font-semibold">{answer.question.label}</p>
                  <p className="text-sm text-gray-300 bg-[#2C2B3E] p-2 rounded-sm">
                    {answer.value}
                  </p>
                </div>
              ))}

              <p className="text-xs text-gray-500 mt-2">
                Submitted: {new Date(response.submittedAt).toLocaleString()}
              </p>
            </motion.div>
          ))
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No responses yet.
          </motion.p>
        )}
      </motion.div>
    </motion.section>
  );
}

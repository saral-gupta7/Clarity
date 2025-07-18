"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function ResponsesPage() {
  const { adminId, formId } = useParams();

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    async function fetchResponses() {
      try {
        const res = await axios.get(
          `/api/admin/${adminId}/forms/${formId}/responses`
        );
        setForm(res.data.form); // note: res.data.form, not res.data.form.responses
      } catch (error) {
        console.error("Error fetching form with responses", error);
      }
    }
    fetchResponses();
  }, [adminId, formId]);

  if (!form) {
    return (
      <section className="p-10 flex-center h-screen w-full flex-col">
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="flex-center w-full flex-col py-40 max-w-5xl mx-auto px-10">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-5 capitalize">{form.title}</h1>
        <p className="mb-5 text-gray-400 capitalize">{form.description}</p>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {form.responses.length > 0 ? (
          form.responses.map((response, idx) => (
            <div
              key={response.id}
              className="p-4 px-6 rounded-md mb-5 w-full max-w-5xl bg-[#0A0B14]"
            >
              <h2 className="font-semibold mb-3 capitalize">
                {form?.responses?.[idx].name}
              </h2>

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
            </div>
          ))
        ) : (
          <p>No responses yet.</p>
        )}
      </div>
    </section>
  );
}

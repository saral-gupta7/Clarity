"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { motion } from "motion/react";

type Form = {
  id: string;
  title: string;
  description: string;
  publicUrl: string;
  responses?: {
    id: string;
    formId: string;
    name: string;
    submittedAt: string; // or Date if parsed

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
        order: number;
        createdAt: string;
        updatedAt: string;
      };
    }[];
  }[];
};
const DashboardClient = ({
  adminId,
  adminName,
}: {
  adminId: string;
  adminName: string;
}) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get(`/api/admin/${adminId}/forms`);
        setForms(res.data.forms);
      } catch (error) {
        console.error("Failed to fetch forms", error);
      }
    };

    fetchForms();
  }, [adminId]);

  return (
    <motion.section
      className="min-h-screen w-full py-40 px-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold capitalize">
            Welcome, {adminName}
          </h1>
          <Link href={"/admin/create"}>
            <motion.button
              className="flex-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">New</span>
              <PlusIcon size={16} />
            </motion.button>
          </Link>
        </motion.div>
        <motion.div
          className="mt-4 flex flex-col gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {forms.length > 0 ? (
            forms.map((form: Form) => (
              <motion.div
                key={form.id}
                className="px-7 py-5 rounded bg-[#10111A] w-full flex flex-wrap flex-col md:flex-row cursor-pointer hover:bg-[#1A1B24] transition-colors gap-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col flex-1">
                  <h2 className="capitalize">{form.title}</h2>
                  <p className="text-[#4F5055]">{form.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Link href={`/admin/${adminId}/forms/${form.id}/responses`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Responses
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/forms/${form.publicUrl}`
                      );
                      setCopiedId(form.id);
                      setTimeout(() => setCopiedId(null), 1500);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copiedId === form.id ? "Link Copied" : "Share Link"}
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              You haven&apos;t created any forms yet. Click New to get started.
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default DashboardClient;

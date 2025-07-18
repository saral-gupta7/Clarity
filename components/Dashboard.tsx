"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const DashboardClient = ({
  adminId,
  adminName,
}: {
  adminId: string;
  adminName: string;
}) => {
  const [forms, setForms] = useState<any[]>([]);

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
    <section className="min-h-screen w-full py-40 px-10">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome, {adminName}</h1>
          <Link href={"/admin/create"}>
            <button className="text-sm">New</button>
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {forms.length > 0 ? (
            forms.map((form) => (
              <div
                key={form.id}
                className="px-7 py-5 rounded bg-[#10111A] w-full flex flex-wrap flex-col md:flex-row cursor-pointer hover:bg-[#1A1B24] transition-colors gap-5"
              >
                <div className="flex flex-col flex-1">
                  <h2 className="capitalize">{form.title}</h2>
                  <p className="text-[#4F5055]">{form.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Link href={`/admin/${adminId}/forms/${form.id}/responses`}>
                    <button>Responses</button>
                  </Link>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/forms/${form.publicUrl}`
                      )
                    }
                  >
                    Share Link
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>
              You haven&apos;t created any forms yet. Click 'New' to get
              started.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardClient;

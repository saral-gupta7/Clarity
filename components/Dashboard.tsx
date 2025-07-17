"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const DashboardClient = ({ adminId }: { adminId: string }) => {
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
    <section className="min-h-screen w-full flex-center flex-col gap-5">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-4 flex flex-col gap-4">
        {forms.length > 0 ? (
          forms.map((form) => (
            <div key={form.id} className="p-4 border rounded">
              <h2>{form.title}</h2>
              <p>{form.description}</p>
            </div>
          ))
        ) : (
          <p>No forms found for this admin.</p>
        )}
      </div>
    </section>
  );
};

export default DashboardClient;

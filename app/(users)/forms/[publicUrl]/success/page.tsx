"use client";
import { useParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const params = useParams();
  const router = useRouter();

  const { publicUrl } = params;

  const handleSubmitAnother = () => {
    router.push(`/forms/${publicUrl}`);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold mb-4">
        Thank you for your response!
      </h1>
      <button onClick={handleSubmitAnother} className="px-4 py-2 rounded">
        Submit Another Response
      </button>
    </div>
  );
}

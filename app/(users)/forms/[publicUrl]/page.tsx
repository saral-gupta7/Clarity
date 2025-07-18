import FormSubmission from "@/components/FormSubmission";
import axios from "axios";

type PublicPageProps = {
  params: Promise<{ publicUrl: string }>;
};

const PublicForm = async ({ params }: PublicPageProps) => {
  try {
    const { publicUrl } = await params;
    const res = await axios.get(`http://localhost:3000/api/forms/${publicUrl}`);
    const { form } = res.data;

    return <FormSubmission form={form} />;
  } catch (error) {
    console.error("Error fetching form:", error);
    return <p>Form not found or API error.</p>;
  }
};

export default PublicForm;

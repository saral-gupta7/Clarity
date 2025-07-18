import DashboardClient from "@/components/Dashboard";
import prisma from "@/lib/prisma";

const AdminDashboard = async ({ params }: { params: { adminId: string } }) => {
  const { adminId } = params;

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, name: true },
  });

  if (!admin) {
    return <p>Admin not found.</p>;
  }

  return <DashboardClient adminId={admin.id} adminName={admin.name} />;
};

export default AdminDashboard;

import DashboardClient from "@/components/Dashboard";

const AdminDashboard = async ({ params }: { params: { adminId: string } }) => {
  const { adminId } = await params;
  return <DashboardClient adminId={adminId} />;
};

export default AdminDashboard;

"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/logoutAdmin");

      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;

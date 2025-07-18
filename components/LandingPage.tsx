"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { motion } from "motion/react";

import Link from "next/link";
const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("/api/session");
        if (res.data.authenticated && res.data.admin?.role === "admin") {
          router.push(`/admin/${res.data.admin.id}/dashboard`);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
          } else {
            console.error("Session fetch error:", error);
          }
        } else {
          console.error("Unknown session error:", error);
        }
      }
    };
    fetchSession();
  }, [router]);
  return (
    <motion.section
      className="relative min-h-screen w-full bg-[#0B0C10] text-[#E3E9FF] flex-center py-10 px-20 "
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex-center flex-col gap-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.h1
          className="font-instrument text-5xl font-bold text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          Cut Through the Noise — Gather Clear Answers with Clarity.
        </motion.h1>
        <Link href={"/login"}>
          <motion.button
            className="text-dark"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Get Started
          </motion.button>
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default LandingPage;

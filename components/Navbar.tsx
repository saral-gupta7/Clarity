"use client";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { LogOutIcon } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminId, setAdminId] = useState("");

  const handleLogout = async () => {
    await axios.post("/api/logoutAdmin");
    setTimeout(() => (window.location.href = "/"), 700);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("/api/session", { withCredentials: true });
        setIsLoggedIn(res.data.authenticated);
        setAdminId(res.data.admin.id);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  const items = [
    ...(isLoggedIn
      ? [
          {
            title: "Dashboard",
            key: "dashboard",
            url: `/admin/${adminId}/dashboard`,
          },
        ]
      : []),
    ...(isLoggedIn
      ? [{ title: "Create", key: "create", url: `/admin/create` }]
      : []),
  ];

  return (
    <article className="max-w-7xl mx-auto grid grid-cols-3 place-items-center px-10 py-10 bg-transparent fixed top-0 inset-x-0 z-50 backdrop-blur-xl">
      <div>
        <Link href={"/"}>
          <h1 className="font-instrument text-3xl font-bold">Clarity</h1>
        </Link>
      </div>

      <div>
        <ul className="flex gap-5">
          {items.map(({ title, key, url }) => (
            <Link
              href={url}
              key={key}
              className="bg-[#12131A] px-4 py-2 rounded-sm border-light/10 border-[0.5px] "
            >
              {title}
            </Link>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="border-[0.5px] border-light/10 bg-[#12131A] text-light"
          >
            <LogOutIcon size={18} className="text-red-300" />
          </button>
        ) : (
          <>
            <Link href={"/login"}>
              <button className="border-[0.5px] border-light/10 bg-[#12131A] text-light">
                Sign In
              </button>
            </Link>
            <Link href={"/register"}>
              <button>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </article>
  );
};

export default Navbar;

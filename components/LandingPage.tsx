import LogoutButton from "./Logout";

const LandingPage = () => {
  return (
    <section className="relative min-h-screen w-full bg-[#0B0C10] text-[#E3E9FF] flex-center py-10 px-20 ">
      <div className="flex-center flex-col gap-10">
        <h1 className="font-instrument text-5xl font-bold text-center">
          Cut Through the Noise — Gather Clear Answers with Clarity.
        </h1>
        <button className="text-dark">Get Started</button>
      </div>
    </section>
  );
};

export default LandingPage;

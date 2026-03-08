import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import TiltedScroll from "../loginpageanimation/page";
import { DrawCircleText } from "@/components/ui/text-style";

export default async function Register() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen w-screen px-2 relative bg-white overflow-x-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ffa6b6] to-[#d8b4fe] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 relative z-10 w-full">
        <div className="w-full flex-none max-w-6xl mx-auto">
          <DrawCircleText />
        </div>
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-[120px]">
          <TiltedScroll />
          <div className="w-full md:w-auto">
            <RegisterForm />
          </div>
        </div>
      </div>
    </main>
  );
}

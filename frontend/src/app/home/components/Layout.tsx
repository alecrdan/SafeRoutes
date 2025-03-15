import Navbar from "@/app/components/core/navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-auto">{children}</main>
      {/* <Footer /> */}
    </>
  );
}

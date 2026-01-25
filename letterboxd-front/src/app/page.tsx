//import Image from "next/image";
//import { Header } from "@/components/header/header";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-1/2">
      <main className="">
          <div className="flex gap-4">
            <AuthModal>
              <Button className="bg-letterboxd-header-btn hover:bg-letterboxd-header-btn-hover text-white font-bold uppercase tracking-widest transition-colors">
                Get started — it&apos;s free!
              </Button>
            </AuthModal>
          </div>
      </main>
    </div>
  );
}

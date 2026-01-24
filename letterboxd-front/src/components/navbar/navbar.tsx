import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "../ui/button";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="text-xl font-bold tracking-tighter text-white">
        LETTERBOXD CLONE
      </div>

      <div className="flex gap-4">
        <AuthModal />
      </div>
    </nav>
  );
}
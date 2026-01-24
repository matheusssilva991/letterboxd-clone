"use client";

import { useState, useCallback } from "react";
import { Controller } from "react-hook-form";
import { useLoginForm, useRegisterForm } from "@/hooks/auth-hook";
import { loginService, registerService } from "@/services/auth/auth-service";
import { LoginPayload, RegisterPayload } from "@/types/auth-type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { ShieldCheck, X, AlertTriangle } from "lucide-react";

export function AuthModal() {
  const [isLoading, setIsLoading] = useState(false);

  // Estados para simulação
  const [usernameError, setUsernameError] = useState(false);
  const [username, setUsername] = useState("");

  // --- React Hook Form para login ---
  const {
    register: loginField,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
    control: loginControl,
    reset: resetLoginForm,
  } = useLoginForm();

  // --- React Hook Form para registro ---
  const {
    register: registerField,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegistering },
    watch: watchRegister,
    control: registerControl,
    reset: resetRegisterForm,
  } = useRegisterForm();

  // Estado para controlar abertura do modal
  const [open, setOpen] = useState(false);
  // Estado para controlar a aba ativa (login/register)
  const [activeTab, setActiveTab] = useState("login");

  // Função para resetar os formulários ao fechar o modal
  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetLoginForm();
      resetRegisterForm();
    }
  }, [resetLoginForm, resetRegisterForm]);

  // Evita warning do React Compiler com o watch do React Hook Form
  const passwordValue = watchRegister("password");


  // Função para login real
  async function onLoginSubmit(data: LoginPayload) {
    setIsLoading(true);
    try {
      const result = await loginService({ email: data.email, password: data.password });
      toast.success("Login realizado com sucesso!");
      // Salva o token no localStorage (ajuste conforme o backend)
      if (result && result.token) {
        localStorage.setItem("token", result.token);
      }
      // Fecha o modal após login bem-sucedido
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  }

  // Função para cadastro real
  async function onRegisterSubmit(data: RegisterPayload) {
    setIsLoading(true);
    try {
      await registerService({ email: data.email, username: data.username, password: data.password });
      toast.success("Registro realizado com sucesso!");
      // Troca para a aba de login após cadastro
      setActiveTab("login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao registrar");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#00B84C] hover:bg-[#009C3A] text-white font-bold uppercase tracking-widest transition-colors">
          Get started — it&apos;s free!
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px] bg-letterboxd-modal border-none text-white p-8 shadow-2xl [&>button.absolute]:hidden">

        {/* Cabeçalho Customizado (Alinhado) */}
        <div className="flex items-center justify-between w-full mb-0">
          <DialogTitle className="text-lg font-normal uppercase tracking-widest text-white leading-none">
            Join Letterboxd
          </DialogTitle>

          {/* Botão de Fechar Customizado (DialogClose) */}
          <DialogClose asChild>
            <button
              aria-label="Close"
              className="text-[#99AABB] hover:text-white transition-colors p-0 m-0 leading-none flex items-center justify-center rounded-sm focus-visible:ring-2 focus-visible:ring-white/50 outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </DialogClose>
        </div>

        {/* Descrição colada no título */}
        <div className="mt-0">
          <DialogDescription className="text-letterboxd-label leading-tight">
            Track the movies you watch.
          </DialogDescription>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-0">
          <TabsList className="grid w-full grid-cols-2 bg-black/20 h-10 p-1 rounded-sm">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-[#CCDDEE] data-[state=active]:text-black text-gray-400 uppercase font-bold text-xs tracking-widest rounded-[2px] transition-all"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-[#CCDDEE] data-[state=active]:text-black text-gray-400 uppercase font-bold text-xs tracking-widest rounded-[2px] transition-all"
            >
              Create Account
            </TabsTrigger>
          </TabsList>

          {/* --- LOGIN TAB --- */}
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="login-email" className="text-[#E5EAF0] font-normal">Email</Label>
                <Input id="login-email" type="email" placeholder="name@example.com" {...loginField("email")}/>
                {loginErrors.email && (
                  <span className="text-letterboxd-orange text-xs font-bold mt-1">{loginErrors.email.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Label htmlFor="login-password" className="text-[#E5EAF0] font-normal">Password</Label>
                <Input id="login-password" type="password" {...loginField("password")}/>
                {loginErrors.password && (
                  <span className="text-letterboxd-orange text-xs font-bold mt-1">{loginErrors.password.message}</span>
                )}
              </div>

              {/* --- CAPTCHA --- */}
              <div className="mt-6 p-3 bg-white rounded flex items-center justify-between select-none shadow-md shadow-black/20">
                <div className="flex items-center space-x-3">
                  <Controller
                    name="captcha"
                    control={loginControl}
                    render={({ field }) => (
                      <Checkbox
                        id="login-captcha"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        className="h-6 w-6 rounded border-gray-300 data-[state=checked]:bg-[#00B84C] data-[state=checked]:text-white"
                      />
                    )}
                  />
                  <Label htmlFor="login-captcha" className="text-sm font-medium text-black cursor-pointer">
                    I am human
                  </Label>
                </div>
                <ShieldCheck className="h-6 w-6 text-gray-500" />
              </div>
              {loginErrors.captcha && (
                <span className="text-letterboxd-orange text-xs font-bold mt-1 block">{loginErrors.captcha.message}</span>
              )}

              <Button type="submit" className="bg-[#00B84C] hover:bg-[#009C3A] text-white mt-4 font-bold uppercase tracking-widest py-2 shadow-md shadow-black/20" disabled={isLoggingIn}>
                {isLoggingIn ? "Signing in..." : "SIGN IN"}
              </Button>
            </form>
          </TabsContent>

          {/* --- REGISTER TAB --- */}
          <TabsContent value="register">
            <form className="space-y-4 mt-4" onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-email" className="text-[#E5EAF0] font-normal">Email</Label>
                <Input id="new-email" type="email" {...registerField("email")} />
                {registerErrors.email && (
                  <span className="text-letterboxd-orange text-xs font-bold mt-1">{registerErrors.email.message}</span>
                )}
              </div>

              {/* USERNAME */}
              <div className="flex flex-col gap-2 mt-4">
                <Label htmlFor="new-user" className="text-[#E5EAF0] font-normal">Username</Label>
                <div className="flex flex-col w-full gap-1">
                  <Input
                    id="new-user"
                    className="w-full"
                    {...registerField("username")}
                  />
                  {/* Mensagem de erro só aparece se o usuário digitou algo */}
                  {watchRegister("username") && registerErrors.username && (
                    <div className="flex items-center text-letterboxd-orange font-bold text-xs animate-in fade-in slide-in-from-left-2 mt-1">
                      <X className="w-4 h-4 mr-1 stroke-[4]" />
                      <span>{registerErrors.username.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-2 mt-4">
                <Label htmlFor="new-pass" className="text-[#E5EAF0] font-normal">Password</Label>
                <div className="flex flex-col w-full gap-1">
                  <Input
                    id="new-pass"
                    type="password"
                    className="w-full"
                    {...registerField("password")}
                  />
                  {/* Mensagem de erro só aparece se o usuário digitou algo */}
                  {passwordValue && registerErrors.password && (
                    <div className="flex items-center text-letterboxd-orange text-xs font-bold mt-1">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      <span>{registerErrors.password.message}</span>
                    </div>
                  )}
                  {/* Mensagem de senha forte só aparece se digitou e não há erro */}
                  {passwordValue && !registerErrors.password && (
                    <div className="flex items-center text-green-500 text-xs font-bold mt-1">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      <span>Strong</span>
                    </div>
                  )}
                </div>
              </div>

              {/* --- CHECKBOXES --- */}
              <div className="space-y-3 mt-4">
                <div className="flex items-start space-x-3">
                  <Controller
                    name="ageTerms"
                    control={registerControl}
                    render={({ field }) => (
                      <Checkbox
                        id="age-terms"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1 border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-letterboxd-modal h-4 w-4 rounded-[2px] shadow-sm"
                      />
                    )}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="age-terms"
                      className="text-xs font-normal text-zinc-300 cursor-pointer"
                    >
                      I&apos;m at least 16 years old and accept the <a href="#" className="text-white hover:underline">Terms of Use</a>
                    </Label>
                  </div>
                </div>
                {registerErrors.ageTerms && (
                  <span className="text-letterboxd-orange text-xs font-bold mt-1 block">{registerErrors.ageTerms.message}</span>
                )}

                <div className="flex items-start space-x-3">
                  <Controller
                    name="privacy"
                    control={registerControl}
                    render={({ field }) => (
                      <Checkbox
                        id="privacy"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1 border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-letterboxd-modal h-4 w-4 rounded-[2px] shadow-sm"
                      />
                    )}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="privacy"
                      className="text-xs font-normal text-zinc-300 cursor-pointer"
                    >
                      I accept the <a href="#" className="text-white hover:underline">Privacy Policy</a>.
                    </Label>
                  </div>
                </div>
                {registerErrors.privacy && (
                  <span className="text-letterboxd-orange text-xs font-bold mt-1 block">{registerErrors.privacy.message}</span>
                )}
              </div>

              {/* --- CAPTCHA --- */}
              <div className="mt-4 p-3 bg-white rounded flex items-center justify-between select-none shadow-md shadow-black/20">
                <div className="flex items-center space-x-3">
                  <Controller
                    name="captcha"
                    control={registerControl}
                    render={({ field }) => (
                      <Checkbox
                        id="register-captcha"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        className="h-6 w-6 rounded border-gray-300 data-[state=checked]:bg-[#00B84C] data-[state=checked]:text-white"
                      />
                    )}
                  />
                  <Label htmlFor="register-captcha" className="text-sm font-medium text-black cursor-pointer">
                    I am human
                  </Label>
                </div>
                <ShieldCheck className="h-6 w-6 text-gray-500" />
              </div>
              {registerErrors.captcha && (
                <span className="text-letterboxd-orange text-xs font-bold mt-1 block">{registerErrors.captcha.message}</span>
              )}

              <Button type="submit" className="mt-4 bg-[#00B84C] hover:bg-[#009C3A] text-white font-bold tracking-widest uppercase py-2 shadow-md shadow-black/20 transition-all active:scale-[0.98]" disabled={isRegistering}>
                {isRegistering ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
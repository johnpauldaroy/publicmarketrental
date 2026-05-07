import { useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/auth-context";
import { getPortalHome } from "@/lib/routing";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const registerSchema = z.object({
  name: z.string().min(3, "Full name is required."),
  email: z.string().email("Enter a valid email address."),
  businessName: z.string().min(3, "Business name is required."),
  phone: z.string().min(7, "Phone number is required."),
  address: z.string().min(8, "Address is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@culasi.gov.ph",
      password: "culasi123",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const user = await signIn(values);
      toast.success(`Signed in as ${user.name}`);
      navigate(getPortalHome(user.role));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in.");
    }
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label="Email" error={form.formState.errors.email?.message}>
        <Input {...form.register("email")} id="email" />
      </Field>

      <Field label="Password" error={form.formState.errors.password?.message}>
        <div className="relative">
          <Input
            {...form.register("password")}
            className="pr-12"
            id="password"
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition hover:text-foreground"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      <Button className="w-full" disabled={form.formState.isSubmitting} type="submit">
        {form.formState.isSubmitting ? "Signing in..." : "Access dashboard"}
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const navigate = useNavigate();
  const { registerVendor } = useAuth();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      businessName: "",
      phone: "",
      address: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await registerVendor(values);

      if (result.requiresEmailConfirmation || !result.user) {
        toast.success("Vendor account created. Check your email to confirm the account, then sign in.");
        navigate("/login");
        return;
      }

      toast.success("Vendor account created.");
      navigate(getPortalHome(result.user.role));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create the account.");
    }
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full name" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input {...form.register("email")} />
        </Field>
        <Field label="Business name" error={form.formState.errors.businessName?.message}>
          <Input {...form.register("businessName")} />
        </Field>
        <Field label="Phone" error={form.formState.errors.phone?.message}>
          <Input {...form.register("phone")} />
        </Field>
      </div>

      <Field label="Address" error={form.formState.errors.address?.message}>
        <Textarea rows={3} {...form.register("address")} />
      </Field>

      <Field label="Password" error={form.formState.errors.password?.message}>
        <Input type="password" {...form.register("password")} />
      </Field>

      <Button className="w-full" disabled={form.formState.isSubmitting} type="submit">
        {form.formState.isSubmitting ? "Creating account..." : "Create vendor account"}
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const { requestPasswordReset } = useAuth();
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await requestPasswordReset(values.email);
      toast.success(`Password reset email sent to ${values.email}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to request password reset.");
    }
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label="Email" error={form.formState.errors.email?.message}>
        <Input {...form.register("email")} />
      </Field>

      <Button className="w-full" type="submit">
        Request password reset
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      <FormError message={error} />
    </div>
  );
}

function FormError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

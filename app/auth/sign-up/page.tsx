"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/app/schemas/auth"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import z from "zod"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react"
import { Loader2 } from "lucide-react"

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm({resolver: zodResolver(signUpSchema), defaultValues:{
    email: "",
    name: "",
    password: "",
  }});

  // authclient is there to interact with better auth to the client side
  function onSubmit(data: z.infer<typeof signUpSchema>) {
    startTransition(async () => {
    await authClient.signUp.email({
      email: data.email,
      name: data.name,
      password: data.password,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Account created successfully");
          router.push("/");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    });
  });
  }
  return (
    
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-4">
            <Controller name="name" control={form.control} render={({field, fieldState}) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input aria-invalid={fieldState.invalid} placeholder="Enter your full name" {...field}/>
                {fieldState.invalid && (<FieldError errors = {[fieldState.error]}/>)}
                </Field>
            )}/>
            <Controller name="email" control={form.control} render={({field, fieldState}) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input aria-invalid={fieldState.invalid} placeholder="Enter your email" type="email" {...field}/>
                {fieldState.invalid && (<FieldError errors = {[fieldState.error]}/>)}
                </Field>
            )}/>
            <Controller name="password" control={form.control} render={({field, fieldState}) => (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input aria-invalid={fieldState.invalid}   placeholder="Enter your password" type="password" {...field}/>
                {fieldState.invalid && (<FieldError errors = {[fieldState.error]}/>)}
                </Field>
            )}/>
            <Button disabled={isPending} >{isPending ? (<><Loader2 className="size-4 animate-spin"/>
                <span>Creating account...</span></>) : (<span>Sign Up</span>)}</Button>
          </FieldGroup>
          </form>
        </CardContent>
      </Card>
    
  )
}

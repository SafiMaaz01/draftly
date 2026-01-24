"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/app/schemas/auth"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const form = useForm({resolver: zodResolver(signUpSchema), defaultValues:{
    email: "",
    name: "",
    password: "",
  }});
  return (
    
      <Card >
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
          <FieldGroup>
            <Controller name="name" control={form.control} render={({field, fieldState}) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input placeholder="Enter your full name" {...field}/>
                {fieldState.invalid && (<FieldError errors = {[fieldState.error]}/>)}
                </Field>
            )}/>
          </FieldGroup>
          </form>
        </CardContent>
      </Card>
    
  )
}

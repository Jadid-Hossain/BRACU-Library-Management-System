"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/lib/admin/actions/user";
import { toast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const userSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  universityId: z.number().min(1),
  universityCard: z.string().min(1),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  role: z.enum(["USER", "ADMIN"]),
});
type UserForm = z.infer<typeof userSchema>;

interface Props {
  initialUser: {
    id: string;
    fullName: string;
    email: string;
    universityId: number;
    universityCard: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    role: "USER" | "ADMIN";
  };
}

export default function AdminUserEdit({ initialUser }: Props) {
  const router = useRouter();

  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: initialUser.fullName,
      email: initialUser.email,
      universityId: initialUser.universityId,
      universityCard: initialUser.universityCard,
      status: initialUser.status,
      role: initialUser.role,
    },
  });

  const onSubmit = async (values: UserForm) => {
    const res = await updateUser(initialUser.id, values);
    if (res.success) {
      toast({ title: "Updated", description: "User updated successfully." });
      router.push("/admin/users");
    } else {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button asChild className="mb-4">
        <Link href="/admin/users">← Back to users</Link>
      </Button>

      <section className="w-full max-w-2xl bg-white p-6 rounded-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* University ID */}
            <FormField
              control={form.control}
              name="universityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      required
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* University Card */}
            <FormField
              control={form.control}
              name="universityCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University Card</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="block w-full p-2 border rounded"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="block w-full p-2 border rounded"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full text-white">
              Save Changes
            </Button>
          </form>
        </Form>
      </section>
    </>
  );
}

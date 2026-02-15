
"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

const SignupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function signup(prevState: any, formData: FormData) {
    const validation = SignupSchema.safeParse(Object.fromEntries(formData));

    if (!validation.success) {
        return {
            errors: validation.error.flatten().fieldErrors,
        };
    }

    const { name, email, password } = validation.data;

    // Check if user exists
    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return {
            errors: {
                email: ["User with this email already exists"],
            },
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "owner", // Default role
        },
    });

    await createSession(user.id, user.role, user.name);
    redirect("/dashboard");
}

export async function login(prevState: any, formData: FormData) {
    const validation = LoginSchema.safeParse(Object.fromEntries(formData));

    if (!validation.success) {
        return {
            errors: validation.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validation.data;

    const user = await db.user.findUnique({
        where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return {
            errors: {
                email: ["Invalid email or password"],
            },
        };
    }

    await createSession(user.id, user.role, user.name);
    redirect("/dashboard");
}

export async function logout() {
    await deleteSession();
    redirect("/");
}

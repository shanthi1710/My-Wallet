"use server"
import { NextResponse } from "next/server"
import  Prisma1   from "@repo/db/client";

 

export const GET = async () => {
    await Prisma1.user.create({
        data: {
            email: "shanthinath",
            name: "shanthinath",
            number:"9607112969",
            password: "shanthinath"
        }
    })
    return NextResponse.json({
        message: "hi there"
    })
}
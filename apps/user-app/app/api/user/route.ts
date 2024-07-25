import { NextResponse } from "next/server";

import {PrismaClient} from "@repo/db/client"

const client = new PrismaClient();


export const GET = async () =>{
    await client.user.create({
        data: {
            email: "shanthi",
            name: "shanthi"
        }
    })
    return NextResponse.json({
        message:"hii there"
    })
}
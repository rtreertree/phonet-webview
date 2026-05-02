"use server";

import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ 
        version: '1.0.0',
        status: 'running',
        port: process.env.PORT || "port not specified using '3000'",
        setup_env: process.env.NODE_ENV === 'production' ? 'production setup' : 'development setup'
    }, { status: 200 });
}
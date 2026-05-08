"use client";

import dynamic from "next/dynamic";

export default dynamic(() => import("./collection-preloader"), { ssr: false });

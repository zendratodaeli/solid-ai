"use client"

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("2130bf4a-f43f-4dae-ad2a-2e76bffb93d7")
  }, []);

  return null;
};


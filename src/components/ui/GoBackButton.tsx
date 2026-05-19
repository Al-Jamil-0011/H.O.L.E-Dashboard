"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./Button";

export function GoBackButton() {
  return (
    <Button
      variant="outline"
      size="default"
      onClick={() => window.history.back()}
      className="px-4 py-3 text-xs cursor-pointer"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Previous Page
    </Button>
  );
}

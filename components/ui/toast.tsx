import React from "react";

interface ToastProps {
  title: string;
  description: string;
}

export function Toast({ title, description }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-secondary text-secondary-foreground p-4 rounded-md shadow-lg bg-gray-900">
      <h3 className="font-semibold ">{title}</h3>
    </div>
  );
}

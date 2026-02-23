"use client";

import { forwardRef } from "react";

type GlowInputProps = React.ComponentPropsWithoutRef<"input"> & {
  label?: string;
  as?: "input" | "textarea";
  rows?: number;
};

const inputBase =
  "w-full bg-transparent border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--star-white)] placeholder:text-white/30 outline-none transition-all duration-300 focus:border-[var(--glow-red)] focus:shadow-[0_0_20px_rgba(255,51,51,0.25)]";

export const GlowInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, GlowInputProps>(
  function GlowInput({ label, as: Tag = "input", className = "", ...props }, ref) {
    return (
      <label className="block">
        {label && (
          <span className="font-mono text-sm text-[var(--glow-red)]/80 mb-2 block">{label}</span>
        )}
        <Tag
          ref={ref as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
          className={`${inputBase} ${Tag === "textarea" ? "min-h-[120px] resize-y" : ""} ${className}`}
          {...(props as React.ComponentPropsWithoutRef<"input"> & React.ComponentPropsWithoutRef<"textarea">)}
        />
      </label>
    );
  }
);

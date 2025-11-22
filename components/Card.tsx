import { PropsWithChildren } from "react";

export default function Card({ children }: PropsWithChildren) {
  return <div className="rounded-2xl border bg-white p-5 shadow-sm">{children}</div>;
}

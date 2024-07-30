import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="border-black p-6 bg-white rounded-xl bg-[#ededed]">
      <h1 className="text-2xl font-bold border-b pb-2 flex justify-center">
        {title}
      </h1>
      <div>{children}</div>
    </div>
  );
}

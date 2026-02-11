"use client";

import { useEffect, useState } from "react";

type GhormanLiveMetaProps = {
  isLive: boolean;
};

function formatLiveTimestamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${year}-${month}-${day} ${hours12}:${minutes}:${seconds} ${suffix}`;
}

export default function GhormanLiveMeta({ isLive }: GhormanLiveMetaProps) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-600 dark:text-gray-50 mb-2">
      <div>{formatLiveTimestamp(now)}</div>
      <div className="inline-flex items-center gap-2">
        <span
          className={`inline-block w-2 h-2 ${
            isLive ? "bg-red-500" : "bg-gray-500"
          }`}
          aria-hidden="true"
        />
        <span>{isLive ? "Live" : "Offline"}</span>
      </div>
    </div>
  );
}

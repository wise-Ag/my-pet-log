import { HTMLAttributes, useEffect, useRef, useState } from "react";
import VC, { Options } from "vanilla-calendar-pro";
import "vanilla-calendar-pro/build/vanilla-calendar.min.css";
import "./style.css";

interface VanillaCalendarProps extends HTMLAttributes<HTMLDivElement> {
  config?: Options;
}

function VanillaCalendar({ config, ...attributes }: VanillaCalendarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [calendar, setCalendar] = useState<VC | null>(null);

  useEffect(() => {
    if (!calendar) return;
    calendar.init();
  }, [calendar]);

  useEffect(() => {
    if (!ref.current) return;
    const vcInstance = new VC(ref.current, config);
    setCalendar(vcInstance);
    setTimeout(() => vcInstance.init(), 0);
  }, [ref, config]);

  return <div {...attributes} ref={ref}></div>;
}

export default VanillaCalendar;

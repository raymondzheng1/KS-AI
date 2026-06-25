import Image from "next/image";
import Link from "next/link";

/** Header brand lockup: the Sunny star icon next to the KIDSMART wordmark
 *  (transparent PNGs, per the design handoff). */
export function BrandLockup({ href = "/" as string | null }) {
  const inner = (
    <span className="flex items-center gap-2.5">
      <Image
        src="/kidsmart_star.png"
        alt=""
        width={52}
        height={40}
        priority
        className="h-10 w-auto object-contain"
      />
      <Image
        src="/kidsmart_word.png"
        alt="KidSmart"
        width={130}
        height={19}
        className="h-[19px] w-auto object-contain"
      />
    </span>
  );
  return href ? (
    <Link href={href} aria-label="KidSmart home">
      {inner}
    </Link>
  ) : (
    inner
  );
}

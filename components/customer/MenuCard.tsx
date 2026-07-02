import Link from "next/link";
import Image from "next/image";

interface MenuCardProps {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  imageUrl: string | null;
  isAvailable: boolean;
}

export default function MenuCard({ id, name, description, basePrice, imageUrl, isAvailable }: MenuCardProps) {
  const card = (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition ${
        isAvailable ? "hover:border-zinc-400" : "opacity-60"
      }`}
    >
      <div className="relative aspect-square w-full bg-zinc-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">☕</div>
        )}
        {!isAvailable && (
          <span className="absolute right-2 top-2 rounded-full bg-zinc-900/80 px-2 py-1 text-xs font-medium text-white">
            품절
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="text-sm font-semibold text-zinc-900">{name}</h3>
        {description && <p className="line-clamp-2 text-xs text-zinc-500">{description}</p>}
        <p className="mt-auto pt-1 text-sm font-medium text-zinc-900">{basePrice.toLocaleString()}원</p>
      </div>
    </div>
  );

  if (!isAvailable) {
    return card;
  }

  return (
    <Link href={`/my/menu/detail.html?id=${id}`} className="block">
      {card}
    </Link>
  );
}

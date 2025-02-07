import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ShoppingCart() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-12 text-3xl font-normal">Your Shopping Cart</h1>

      {/* Cart Header */}
      <div className="hidden grid-cols-[2fr,1fr,1fr] gap-4 border-b pb-4 text-sm text-gray-500 md:grid">
        <div>Product</div>
        <div className="text-center">Quantity</div>
        <div className="text-right">Total</div>
      </div>

      {/* Cart Items */}
      <div className="divide-y">
        <CartItem
          imageSrc="/bye.png"
          altText="Graystone Vase"
          name="Graystone Vase"
          description="A timeless ceramic vase with a tri-color grey glaze."
          price={85}
          quantity={1}
        />
        <CartItem
          imageSrc="/hello.png"
          altText="Basic White Vase"
          name="Basic White Vase"
          description="Beautiful and simple, this is one for the classics."
          price={125}
          quantity={1}
        />
      </div>

      {/* Cart Summary */}
      <div className="mt-8 space-y-4 border-t pt-8">
        <div className="flex justify-end gap-4 text-lg">
          <span>Subtotal</span>
          <span>£210</span>
        </div>
        <p className="text-right text-sm text-gray-500">
          Taxes and shipping are calculated at checkout.
        </p>
        <div className="flex justify-end">
          <Link href="/">
            <Button className="rounded-none bg-[#2A254B] px-8 hover:bg-[#2A254B]/90">
              Go to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Cart Item Component
function CartItem({
  imageSrc,
  altText,
  name,
  description,
  price,
  quantity,
}: {
  imageSrc: string;
  altText: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[2fr,1fr,1fr]">
      <div className="flex gap-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <Image src={imageSrc} alt={altText} fill className="object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-normal">{name}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          <p className="mt-1 text-sm">£{price}</p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Input type="number" min="1" defaultValue={quantity} className="w-20 text-center" />
      </div>
      <div className="flex items-center justify-end text-lg">£{price}</div>
    </div>
  );
}

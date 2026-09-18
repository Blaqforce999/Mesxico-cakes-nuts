import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronRight, ShieldCheck, Truck, Clock, Heart, Award } from 'lucide-react';
import { getProductBySlug } from '@/lib/products';
import { ProductDetailForm } from '@/components/storefront/ProductDetailForm';
import { Badge } from '@/components/ui/Badge';
import { formatNaira } from '@/lib/utils';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Mesxico Cakes & Nuts',
    };
  }

  return {
    title: `${product.name} | Mesxico Cakes & Nuts`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.images[0] || '/logo.png',
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isCake = product.category === 'cakes';

  return (
    <div className="py-10 sm:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-body text-outline mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-outline-variant" />
          <Link
            href={isCake ? '/cakes' : '/nuts'}
            className="hover:text-primary transition-colors"
          >
            {isCake ? 'Cakes & Cupcakes' : 'Gourmet Nuts'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-outline-variant" />
          <span className="text-on-surface font-medium truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
          {/* Left Column: Image Presentation */}
          <div className="lg:col-span-6 space-y-4">
            <div
              style={{ backgroundColor: 'var(--color-surface-variant)' }}
              className="relative aspect-square w-full rounded-3xl border border-outline-variant/60 overflow-hidden shadow-sm flex items-center justify-center p-8"
            >
              <Image
                src={product.images[0] || '/products/cupcake_single.jpeg'}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4 drop-shadow-md transition-transform hover:scale-105 duration-300"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <Badge variant={isCake ? 'leadTime' : 'secondary'}>
                  <Clock className="w-3.5 h-3.5 mr-1 inline" />
                  {isCake ? '48h Minimum Notice' : 'Next-Day Delivery'}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Gallery (if multiple images) */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    style={{ backgroundColor: 'var(--color-surface-variant)' }}
                    className="relative w-20 h-20 rounded-2xl border border-outline-variant/60 overflow-hidden shrink-0 cursor-pointer hover:border-primary transition-colors flex items-center justify-center p-2"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} gallery image ${idx + 1}`}
                      fill
                      className="object-contain p-1 drop-shadow-sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Add to Cart */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-outline font-body mb-1">
                <span>{product.category === 'cakes' ? 'Celebration Bakery' : 'Gourmet Pantry'}</span>
                {product.package_size && (
                  <>
                    <span>•</span>
                    <span className="text-secondary font-medium">{product.package_size}</span>
                  </>
                )}
              </div>

              <h1 className="font-display font-bold text-[27px] sm:text-[33px] leading-[1.2] sm:leading-[1.111] text-on-surface">
                {product.name}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-on-surface-variant font-body leading-relaxed">
              {product.description}
            </p>

            {/* Customization Form Client Component */}
            <div className="pt-2 border-t border-outline-variant/60">
              <ProductDetailForm product={product} />
            </div>

            {/* Quality & Fulfillment Highlights */}
            <div className="pt-6 border-t border-outline-variant/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body text-on-surface-variant">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-surface border border-outline-variant/40">
                <Truck className="w-5 h-5 text-secondary shrink-0" />
                <span>Choose your preferred delivery date and morning/afternoon slot at checkout.</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-surface border border-outline-variant/40">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <span>Instant cashless verification via Flutterwave gateway.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

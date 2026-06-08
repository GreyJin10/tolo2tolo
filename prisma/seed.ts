import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// ─── Local product images (from tolotolo.fld) ─────────
const PRODUCT_IMAGES = [
  "/models/663549c36m04547a7bc48cce89931fd1item.JPG",
  "/models/0c4c2b25ctc8b56de277e0076c6c5d4bitem.JPG",
  "/models/6871c4873u719423c7ca0d7fa083737aitem.JPG",
  "/models/1a04ec3c79664f5f61a9ca11997285ceitem.JPG",
  "/models/2fc3142ca3fb6c48df6cc4be95480944item.JPG",
  "/models/7f245ee79444875906f77c4ba3efd5f6item.JPG",
  "/models/9dbe507cd0293950694bb0b70a2ed6d8item.JPG",
  "/models/f0d70a4cdb34d7d62c35e8b946e5a27ditem.JPG",
  "/models/ad4e69e03939e9c2312fd4e30b611ab8item.JPG",
  "/models/a020ecb8dcfb816ac5ba44361e7a4b6bitem.JPG",
  "/models/292859item.JPG",
  "/product-a.jpg",
  "/product-b.jpg",
  "/product-c.jpg",
  "/product-d.jpg",
  "/product-e.jpg",
  "/product-f.jpg",
  "/product-g.jpg",
  "/product-h.jpg",
];

let imageIndex = 0;
function nextImage(): string {
  const img = PRODUCT_IMAGES[imageIndex % PRODUCT_IMAGES.length];
  imageIndex++;
  return img;
}

const COLORS = [
  { color: "black", name: "Black" },
  { color: "white", name: "White" },
  { color: "gray", name: "Ash Gray" },
  { color: "navy", name: "Navy" },
  { color: "beige", name: "Beige" },
  { color: "burgundy", name: "Burgundy" },
  { color: "olive", name: "Olive" },
  { color: "brown", name: "Espresso" },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ─── Categories ──────────────────────────────────────
  const tops = await prisma.category.create({
    data: { name: "Tops", slug: "tops", description: "Shirts, tees, knits and more", imageUrl: "/models/0c4c2b25ctc8b56de277e0076c6c5d4bitem.JPG", sortOrder: 1 },
  });
  const bottoms = await prisma.category.create({
    data: { name: "Bottoms", slug: "bottoms", description: "Trousers, skirts and shorts", imageUrl: "/models/1a04ec3c79664f5f61a9ca11997285ceitem.JPG", sortOrder: 2 },
  });
  const dresses = await prisma.category.create({
    data: { name: "Dresses", slug: "dresses", description: "Day dresses, evening and everything between", imageUrl: "/models/图片_20260324155418_35727_2.jpg", sortOrder: 3 },
  });
  const outerwear = await prisma.category.create({
    data: { name: "Outerwear", slug: "outerwear", description: "Jackets, coats and layering pieces", imageUrl: "/models/ad4e69e03939e9c2312fd4e30b611ab8item.JPG", sortOrder: 4 },
  });
  const accessories = await prisma.category.create({
    data: { name: "Accessories", slug: "accessories", description: "Bags, belts and finishing touches", imageUrl: "/models/图片_20260324155417_35726_2.jpg", sortOrder: 5 },
  });

  console.log("✅ Categories created");

  // ─── Helper ──────────────────────────────────────────
  async function createProduct(data: {
    name: string;
    slug: string;
    description: string;
    details?: string;
    basePrice: number;
    compareAtPrice?: number;
    isFeatured?: boolean;
    categoryId: string;
    colors: Array<{ color: string; name: string }>;
    sizes?: string[];
  }) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        details: data.details || "",
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice || null,
        isFeatured: data.isFeatured || false,
        gender: "WOMEN",
        categoryId: data.categoryId,
      },
    });

    // 1-2 images per product
    const imageCount = 2;
    for (let i = 0; i < imageCount; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: nextImage(),
          alt: `${data.name} — ${i + 1}`,
          sortOrder: i,
        },
      });
    }

    // Variants: size × color
    const sizes = data.sizes || ["XS", "S", "M", "L"];
    for (const size of sizes) {
      for (const c of data.colors) {
        const sku = `${data.slug}-${size}-${c.color}`.toUpperCase();
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku,
            size,
            color: c.color,
            colorName: c.name,
            price: data.basePrice,
            stock: Math.floor(Math.random() * 40) + 5,
          },
        });
      }
    }

    return product;
  }

  // ─── TOPS ────────────────────────────────────────────
  await createProduct({
    name: "Classic Crewneck Knit",
    slug: "classic-crewneck-knit",
    description: "Fine combed cotton with a soft hand feel. Clean crew neckline, easy to dress up or down. A year-round layering staple.",
    details: "100% combed cotton · 280g/m² · Regular fit · Hand wash recommended",
    basePrice: 299,
    compareAtPrice: 459,
    isFeatured: true,
    categoryId: tops.id,
    colors: [
      { color: "cream", name: "Cream" },
      { color: "camel", name: "Camel" },
      { color: "charcoal", name: "Charcoal" },
      { color: "dusty-pink", name: "Dusty Pink" },
    ],
  });

  await createProduct({
    name: "Silk Cami Top",
    slug: "silk-cami-top",
    description: "Silk-like fluid drape with adjustable slim straps. Wear alone in summer or layer under a blazer — the hardest-working piece in your wardrobe.",
    details: "Satin-finish polyester · Slim fit · Adjustable straps · Hand wash",
    basePrice: 189,
    compareAtPrice: 289,
    categoryId: tops.id,
    colors: [
      { color: "black", name: "Black" },
      { color: "white", name: "White" },
      { color: "champagne", name: "Champagne" },
      { color: "burgundy", name: "Burgundy" },
    ],
  });

  await createProduct({
    name: "Linen-Cotton Shirt",
    slug: "linen-cotton-shirt",
    description: "Natural cotton-linen blend, breathable and crisp. Relaxed silhouette with rolled sleeves — effortless from desk to dinner.",
    details: "70% cotton · 30% linen · Oversized fit · Hand wash",
    basePrice: 329,
    categoryId: tops.id,
    colors: [
      { color: "white", name: "White" },
      { color: "light-blue", name: "Powder Blue" },
      { color: "striped", name: "Stripe" },
    ],
  });

  await createProduct({
    name: "Cashmere-Blend Sweater",
    slug: "cashmere-blend-sweater",
    description: "Touch of cashmere for cloud-soft warmth. Ribbed cuffs and hem hold their shape. The kind of knit you reach for every morning.",
    details: "Wool 70% · Cashmere 10% · Polyester 20% · Dry clean",
    basePrice: 799,
    compareAtPrice: 1099,
    isFeatured: true,
    categoryId: tops.id,
    colors: [
      { color: "camel", name: "Camel" },
      { color: "black", name: "Black" },
      { color: "gray", name: "Gray" },
    ],
  });

  await createProduct({
    name: "Essential Turtleneck",
    slug: "essential-turtleneck",
    description: "Lightweight modal jersey with a slim half-turtle neck. The perfect layering foundation — sleek, seamless, second-skin comfort.",
    details: "Modal 95% · Elastane 5% · Slim fit · Machine wash",
    basePrice: 149,
    compareAtPrice: 219,
    categoryId: tops.id,
    colors: [
      { color: "black", name: "Black" },
      { color: "white", name: "White" },
      { color: "brown", name: "Espresso" },
      { color: "olive", name: "Olive" },
    ],
  });

  // ─── BOTTOMS ─────────────────────────────────────────
  await createProduct({
    name: "Wide-Leg Trouser",
    slug: "wide-leg-trouser",
    description: "High-rise cut that lengthens the leg. Fluid drape moves with you — sharp enough for the office, relaxed enough for the weekend.",
    details: "Polyester · Elastane blend · High rise · Full length · Dry clean",
    basePrice: 359,
    compareAtPrice: 529,
    isFeatured: true,
    categoryId: bottoms.id,
    colors: [
      { color: "black", name: "Black" },
      { color: "beige", name: "Beige" },
      { color: "navy", name: "Navy" },
    ],
  });

  await createProduct({
    name: "A-Line Mini Skirt",
    slug: "a-line-mini-skirt",
    description: "Classic A-line cut that flatters the hip and thigh. Hidden side zip for a clean finish. Pairs with everything from chunky knits to silk camis.",
    details: "Cotton-polyester blend · Mini length · High waist · Machine wash",
    basePrice: 259,
    categoryId: bottoms.id,
    colors: [
      { color: "black", name: "Black" },
      { color: "khaki", name: "Khaki" },
      { color: "burgundy", name: "Burgundy" },
    ],
  });

  await createProduct({
    name: "Straight Crop Pant",
    slug: "straight-crop-pant",
    description: "Clean straight-leg cut with a cropped ankle — instantly lengthens the silhouette. Elasticated back waist for all-day comfort.",
    details: "Polyester · Elastane · Straight leg · Cropped · Machine wash",
    basePrice: 319,
    categoryId: bottoms.id,
    colors: [
      { color: "black", name: "Black" },
      { color: "navy", name: "Navy" },
      { color: "beige", name: "Beige" },
      { color: "olive", name: "Olive" },
    ],
  });

  await createProduct({
    name: "Slim Stretch Jean",
    slug: "slim-stretch-jean",
    description: "Denim with just enough give — hugs without restricting. Classic 5-pocket design with a lived-in medium wash.",
    details: "Cotton 98% · Elastane 2% · Slim straight · Medium wash · Machine wash inside out",
    basePrice: 399,
    compareAtPrice: 599,
    isFeatured: true,
    categoryId: bottoms.id,
    colors: [
      { color: "dark-blue", name: "Dark Wash" },
      { color: "light-blue", name: "Light Wash" },
      { color: "black", name: "Black" },
    ],
  });

  await createProduct({
    name: "Pleated Culotte",
    slug: "pleated-culotte",
    description: "Sharp knife pleats from the waist, falling to a wide cropped hem. Looks like a skirt, wears like a trouser — the best of both.",
    details: "Polyester · High rise · Wide leg · Cropped · Hand wash",
    basePrice: 389,
    compareAtPrice: 569,
    categoryId: bottoms.id,
    colors: [
      { color: "black", name: "Black" },
      { color: "beige", name: "Beige" },
      { color: "navy", name: "Navy" },
    ],
  });

  // ─── DRESSES ─────────────────────────────────────────
  await createProduct({
    name: "Floral Midi Dress",
    slug: "floral-midi-dress",
    description: "Romantic floral print on airy chiffon. V-neck frames the collarbone, waist-defining cut creates an elegant hourglass shape.",
    details: "Chiffon · Lined · Midi length · Hand wash",
    basePrice: 399,
    compareAtPrice: 599,
    isFeatured: true,
    categoryId: dresses.id,
    colors: [
      { color: "floral-blue", name: "Blue Floral" },
      { color: "floral-pink", name: "Pink Floral" },
      { color: "floral-yellow", name: "Yellow Floral" },
    ],
  });

  await createProduct({
    name: "Tea Dress",
    slug: "tea-dress",
    description: "Vintage-inspired square neck with a button-front placket. Nipped waist and A-line skirt — effortless French-girl ease.",
    details: "Rayon · Midi length · Square neck · Hand wash",
    basePrice: 349,
    compareAtPrice: 529,
    isFeatured: true,
    categoryId: dresses.id,
    colors: [
      { color: "floral-green", name: "Green Floral" },
      { color: "polka-navy", name: "Navy Dot" },
      { color: "red", name: "Brick Red" },
    ],
  });

  await createProduct({
    name: "Slip Dress",
    slug: "slip-dress",
    description: "Bias-cut charmeuse that skims the body. Adjustable spaghetti straps. Throw on a blazer for dinner, wear alone for the after-party.",
    details: "Satin polyester · Bias cut · Midi length · Hand wash",
    basePrice: 359,
    compareAtPrice: 519,
    categoryId: dresses.id,
    colors: [
      { color: "black", name: "Black" },
      { color: "champagne", name: "Champagne" },
      { color: "burgundy", name: "Burgundy" },
    ],
  });

  await createProduct({
    name: "Ribbed Knit Dress",
    slug: "ribbed-knit-dress",
    description: "Fine rib knit that hugs in all the right places. Mid-weight with just the right amount of stretch. Day-to-night with a change of shoe.",
    details: "Viscose · Nylon blend · Slim fit · Midi length · Hand wash",
    basePrice: 429,
    compareAtPrice: 629,
    categoryId: dresses.id,
    colors: [
      { color: "black", name: "Black" },
      { color: "cream", name: "Cream" },
      { color: "camel", name: "Camel" },
    ],
  });

  // ─── OUTERWEAR ───────────────────────────────────────
  await createProduct({
    name: "Wool-Blend Overcoat",
    slug: "wool-blend-overcoat",
    description: "Rich wool-rich felt with a fluid drape. Classic notch lapel, double-breasted close. The coat that finishes every cold-weather look.",
    details: "Wool 70% · Cashmere 10% · Polyester 20% · Mid-length · Dry clean",
    basePrice: 1299,
    compareAtPrice: 1899,
    isFeatured: true,
    categoryId: outerwear.id,
    colors: [
      { color: "camel", name: "Camel" },
      { color: "black", name: "Black" },
      { color: "gray", name: "Gray" },
    ],
  });

  await createProduct({
    name: "Relaxed Blazer",
    slug: "relaxed-blazer",
    description: "Unstructured tailoring with a softly padded shoulder. Single button, flap pockets. Sharp without trying — the new power piece.",
    details: "Polyester · Rayon blend · Relaxed fit · Single button · Dry clean",
    basePrice: 649,
    compareAtPrice: 899,
    isFeatured: true,
    categoryId: outerwear.id,
    colors: [
      { color: "black", name: "Black" },
      { color: "beige", name: "Beige" },
      { color: "navy", name: "Navy" },
    ],
  });

  await createProduct({
    name: "Cropped Trench",
    slug: "cropped-trench",
    description: "Classic trench details — storm flaps, epaulettes, buckle belt — re-proportioned to a cropped length. Lightweight, packable, always polished.",
    details: "Cotton gabardine · Cropped fit · Removable belt · Machine wash",
    basePrice: 599,
    compareAtPrice: 849,
    categoryId: outerwear.id,
    colors: [
      { color: "khaki", name: "Khaki" },
      { color: "black", name: "Black" },
    ],
  });

  await createProduct({
    name: "Quilted Liner Jacket",
    slug: "quilted-liner-jacket",
    description: "Lightweight diamond-quilt shell with snap-front closure. Wear as a standalone jacket in spring or layer under the overcoat when it drops below zero.",
    details: "Nylon · Diamond quilt · Snap front · Machine wash",
    basePrice: 449,
    compareAtPrice: 649,
    categoryId: outerwear.id,
    colors: [
      { color: "black", name: "Black" },
      { color: "olive", name: "Olive" },
      { color: "navy", name: "Navy" },
    ],
  });

  // ─── ACCESSORIES ─────────────────────────────────────
  await createProduct({
    name: "Canvas Tote Bag",
    slug: "canvas-tote-bag",
    description: "Heavyweight 16oz canvas with a clean, logo-free finish. Fits a laptop, gym kit, and a weekend's worth of groceries. The only bag you need.",
    details: "16oz canvas · 40×35×12cm · Adjustable strap",
    basePrice: 189,
    categoryId: accessories.id,
    colors: [
      { color: "black", name: "Black" },
      { color: "natural", name: "Natural" },
      { color: "olive", name: "Olive" },
    ],
    sizes: ["ONE SIZE"],
  });

  await createProduct({
    name: "Leather Slim Belt",
    slug: "leather-slim-belt",
    description: "Genuine leather with a matte black buckle. The 2cm width slips through every belt loop — an invisible finishing touch that pulls the look together.",
    details: "Genuine leather · 2cm width · Matte black hardware",
    basePrice: 149,
    categoryId: accessories.id,
    colors: [
      { color: "black", name: "Black" },
      { color: "brown", name: "Espresso" },
    ],
    sizes: ["S", "M", "L"],
  });

  console.log("✅ Products with variants and images created");
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

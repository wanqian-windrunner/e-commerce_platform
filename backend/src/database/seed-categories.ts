import { eq } from "drizzle-orm"
import { db, pool } from "./db.js"
import { categories } from "./schema/categories.js"

// slug 必须与 seed-products 里 sampleProductsData 的键一致
const SEED_CATEGORIES = [
    {
        name: "Electronics",
        slug: "electronics",
        description: "Headphones, wearables, cameras and computer peripherals."
    },
    {
        name: "Fashion",
        slug: "fashion",
        description: "Clothing, footwear, bags and accessories."
    },
    {
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Cookware, small appliances and home essentials."
    }
]

const seedCategories = async (): Promise<void> => {
    try {
        let created = 0

        for (const category of SEED_CATEGORIES) {
            const [existing] = await db
                .select({ id: categories.id })
                .from(categories)
                .where(eq(categories.slug, category.slug))
                .limit(1)

            if (existing) {
                console.log(`Category "${category.slug}" already exists, skipping.`)
                continue
            }

            await db.insert(categories).values(category)
            created++
            console.log(`Created category "${category.slug}".`)
        }

        console.log(`Seeding complete. ${created} categor${created === 1 ? "y" : "ies"} created.`)
    } catch (error) {
        console.error("Failed to seed categories:", error)
        process.exitCode = 1
    } finally {
        await pool.end()
    }
}

void seedCategories()

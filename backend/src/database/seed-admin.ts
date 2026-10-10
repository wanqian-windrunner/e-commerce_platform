import { eq } from "drizzle-orm"
import { db, pool } from "./db.js"
import { users } from "./schema/users.js"
import { hashPassword } from "../utils/password.js"

const ADMIN_NAME = process.env.ADMIN_NAME
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required")
    process.exit(1)
}

const seedAdmin = async (): Promise<void> => {
    try {
        const [existingAdmin] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, ADMIN_EMAIL))
            .limit(1)

        if (existingAdmin) {
            console.log(`User with email ${ADMIN_EMAIL} already exists.`)
            return
        }

        const passwordHash = await hashPassword(ADMIN_PASSWORD)

        const [admin] = await db
            .insert(users)
            .values({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                passwordHash,
                role: "admin",
                isActive: true
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role
            })

        console.log("Admin user created successfully:")
        console.log(admin)
    } catch (error) {
        console.error("Failed to create admin user:", error)
        process.exitCode = 1
    } finally {
        await pool.end()
    }
}

void seedAdmin()

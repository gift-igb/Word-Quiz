"use client"
import styles from "@/app/(styles)/Login.module.css";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginBtn() {
  const { data: session } = useSession()
  if (!session) {
    return (
      <div>
        <Link href={"/login"} className={styles.loginBtn}>
        Sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <button className={styles.loginBtn} onClick={() => signOut()}>Sign out</button>
    </div>
  )
}

"use client"
import  styles  from "@/app/(styles)/Login.module.css"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { useState } from "react"

function Page() {
  const [clicked, setClicked] = useState<boolean>(false)

  const handleClick = () =>{
    setClicked(!clicked)
  }

  return (
    <div className={ styles.upperContainer }>
      <div className={ styles.container }>
        <div className={ `${styles.element} ${clicked&&styles.clicked}` } onClick={()=>{
          handleClick()
          signIn("google")}}>
          <Image src={"/google-icon-1.png"} alt="Google Icon" width={32} height={32} ></Image>
          <p>Sign in with Google</p>
        </div>
        <div className={ `${styles.element} ${clicked&&styles.clicked}` } onClick={ ()=>{
           handleClick()
           signIn("github")}}>
          <Image src={"/github.svg"} alt="Github Icon" width={32} height={32}></Image>
          <p>Sign in with Github</p>
        </div>

      </div>
    </div>
  )
}

export default Page
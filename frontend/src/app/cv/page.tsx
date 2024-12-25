"use client";
import Link from 'next/link'
import { berkeleymono } from '../fonts' // Update this import path as needed

export default function Page() {
  

  return (
    <main className="min-h-screen flex-grid items-center justify-center bg-bgLight dark:bg-bgDark p-6 md:px-56 px-6 pt-24 ">
      <div className={berkeleymono.className}>
      <div className="text-sm text-gray-600 opacity-50 dark:text-gray-50">
          <Link href="/" className="hover:underline ">
                back
              </Link>
          </div>
          <div className=" text-gray-600 dark:text-gray-50 pb-10">
            Drew Goldstein
          </div>
          <div className="font-bold text-gray-600 dark:text-gray-50">
            <h1>Experience</h1>
          </div>
          <div>
            <div className="text-md text-gray-600 dark:text-gray-50">
                Eate Digital Inc. <span className="text-gray-600 opacity-25 dark:text-gray-50 dark:opacity-25">(2023-present)</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-50 pb-2">
            Ambassador/Consultant 
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-2">
            Eate Digital is a technology company that is focused on creating a more efficient and effective way for restaurant operators to manage their businesses and the guests that interact with those businesses. We are currently working on a project that will revolutionize the way that restaurants operate and interact with their guests. 
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
                Links: <Link className="text-international-orange-engineering dark:text-international-orange" href="https://eatedigital.com">eate</Link> 
            </div>
          </div>
          <div>
            <div className="text-md text-gray-600 dark:text-gray-50">
                Aremac <span className="text-gray-600 opacity-25 dark:text-gray-50 dark:opacity-25">(2024-present)</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-50 pb-2">
                Founder 
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-2">
            Founded Aremac Technologies Inc. in 2024, a company that specializes in the development of software and hardware for the future of the world. We are currently working on a project that will revolutionize the way we interact with the world around us.
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
                Links: <Link className="text-international-orange-engineering dark:text-international-orange" href="https://aremac.tech">aremac</Link> 
            </div>
          </div>
          <div className="font-bold text-gray-600 dark:text-gray-50">
            <h1>Projects</h1>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-50">
                Limen <span className="text-gray-600 opacity-25 dark:text-gray-50 dark:opacity-25">(2023)</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-50 pb-2">
                TSA Software Development Application • 2nd in Nation 
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-2">
            We built an app which allows users to forget about the Doorway effect, or the idea of when we move from one room to another, the doorway in the name represents the boundary between one context (such as a living room) and another (a kitchen) where a user might forget what they were thinking in passing between doorways. The app allows the use of new technologies such as Apple’s ARKit, RealityKit, TableTopKit, and more and revolutionary devices such as the Apple Vision Pro. 
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
                Links: <Link className="text-international-orange-engineering dark:text-international-orange" href="https://drive.google.com/file/d/1W-CmW81LHxmseBvmfbhjOWlnwxIy8RoB/view?usp=drivesdk&usp=embed_facebook">limen nationals presentation</Link> <Link className="text-international-orange-engineering dark:text-international-orange" href="https://docs.google.com/presentation/d/1sflnhTELdE5wfKYzo15BtAaelRwBBJwfmpk6ybdebI4/edit?usp=embed_facebook"> | limen states presentation </Link> <Link className="text-international-orange-engineering dark:text-international-orange" href="https://spatialwaypoints.com/">| spatialwaypoints.com</Link>
            </div>
          </div>
          <div className="font-bold text-gray-600 dark:text-gray-50">
            <h1>Skills</h1>
          </div>
          <div className="font-bold text-gray-600 dark:text-gray-50">
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
        Software: Swift, Java, Python, JavaScript, TypeScript, C++, Objective-C, VB.NET, Node.js, React
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
        Tools & Technologies: Xcode, ARKit, RealityKit, SwiftUI, UIKit, Raspberry Pi, Microcontrollers (Arduino), 
        Autodesk Fusion 360, AutoCAD, Unreal Engine, Unity, Adobe Creative Suite, Figma, Sketch
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
        Architectures & Methodologies: MVC, MVVM, OOP
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
        Additional: iOS Development, Back-End Web Development, Machine Learning, Mobile App Development, 
        Project Management, Team Leadership
        </div>
          <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
            Languages: English (fluent), Spanish (working proficiency)
          </div>
          <div className="font-bold text-gray-600 dark:text-gray-50">
            <h1>Contact</h1>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
            <Link className="hover:underline" href="mailto:cv@degstn.com">cv@degstn.com</Link>
          </div>
          
          
          </div>

          
    </main>
  )
}
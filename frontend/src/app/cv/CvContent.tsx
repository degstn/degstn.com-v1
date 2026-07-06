import Link from 'next/link'

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0 opacity-40" aria-hidden="true">–</span>
      <span>{children}</span>
    </div>
  )
}

export default function CvContent() {
  return (
    <div>
      <div className="text-gray-600 dark:text-gray-50">
        Drew Goldstein
      </div>
      <div className="text-sm text-gray-600 opacity-50 dark:text-gray-50 pb-10">
        IBE + MSE @ Lehigh
      </div>

      <div className="font-bold text-gray-600 dark:text-gray-50">
        <h1>Experience</h1>
      </div>
      <div>
        <div className="text-md text-gray-600 dark:text-gray-50">
          Aremac <span className="text-gray-600 opacity-50 dark:text-gray-50">(mar 2024 – present)</span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-50 pb-2">
          Founder &amp; CEO • Boca Raton, FL
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-2 space-y-1">
          <Bullet>Built a research-driven design and iteration firm creating products of the future and consulting startups through the engineering design process.</Bullet>
          <Bullet>Consultant, developer, and engineer for multiple startups with successful seed rounds at pitch competitions, including the University of Delaware&apos;s Diamond Challenge World Summit.</Bullet>
          <Bullet>Built the framework for a successful fashion brand&apos;s website to test a streamlined, modern web experience for the brand.</Bullet>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
          Links: <Link className="text-international-orange-engineering dark:text-international-orange" href="https://aremac.tech">aremac</Link>
        </div>
      </div>
      <div>
        <div className="text-md text-gray-600 dark:text-gray-50">
          Genius Home Advisors <span className="text-gray-600 opacity-50 dark:text-gray-50">(jun 2024 – present)</span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-50 pb-2">
          Member of Technical Staff • Boca Raton, FL (hybrid)
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-2">
          Helping clients modernize their homes around smart-home technology and security — scoping and planning upgrades, coordinating installs, educating homeowners on best practices, and maintaining vendor partnerships to stay current with platforms and standards.
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
          Links: <Link className="text-international-orange-engineering dark:text-international-orange" href="https://geniushomeadvisors.com">geniushomeadvisors</Link>
        </div>
      </div>
      <div>
        <div className="text-md text-gray-600 dark:text-gray-50">
          Technology Student Association <span className="text-gray-600 opacity-50 dark:text-gray-50">(aug 2022 – jun 2026)</span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-50 pb-2">
          Chapter President • Pine Crest School
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-5 space-y-1">
          <Bullet>Led and mentored a chapter of 135 students with consecutive placements at the state and national level.</Bullet>
          <Bullet>Presided over 80 middle and high school state and national competitions against 350k+ students across a wide range of STEM concepts.</Bullet>
          <Bullet>TSA is the largest academic STEM competition, spanning 49 states and five countries.</Bullet>
        </div>
      </div>
      <div>
        <div className="text-md text-gray-600 dark:text-gray-50">
          PointeOS <span className="text-gray-600 opacity-50 dark:text-gray-50">(jul 2024 – aug 2025)</span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-50 pb-2">
          Ambassador • Boca Raton, FL
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-2 space-y-1">
          <Bullet>Promoted Eate&apos;s point-of-sale software to local shops, streamlining their sales management and kitchen operations.</Bullet>
          <Bullet>Educated clients on a &quot;bring your own device&quot; approach, reducing reliance on costly dedicated hardware.</Bullet>
          <Bullet>Onboarded shop owners to Eate&apos;s services, improving operational efficiency and customer satisfaction.</Bullet>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
          Links: <Link className="text-international-orange-engineering dark:text-international-orange" href="https://eatedigital.com">eate</Link>
        </div>
      </div>

      <div className="font-bold text-gray-600 dark:text-gray-50">
        <h1>Education</h1>
      </div>
      <div>
        <div className="text-md text-gray-600 dark:text-gray-50">
          Lehigh University <span className="text-gray-600 opacity-50 dark:text-gray-50">(2026 – 2031)</span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-50 pb-5">
          IBE (Integrated Business &amp; Engineering) • Materials Science &amp; Engineering; Physics
        </div>
      </div>
      <div>
        <div className="text-md text-gray-600 dark:text-gray-50 pb-5">
          Pine Crest School <span className="text-gray-600 opacity-50 dark:text-gray-50">(2013 – 2026)</span>
        </div>
      </div>

      <div className="font-bold text-gray-600 dark:text-gray-50">
        <h1>Notable Projects</h1>
      </div>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-50">
          Limen <span className="text-gray-600 opacity-50 dark:text-gray-50">(2023)</span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-50 pb-2">
          TSA Software Development • 2nd in Nation
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-2">
          An Apple Vision Pro app built around the Doorway effect — the phenomenon where moving between rooms makes you forget what you were thinking — helping people with ADHD/ADD and memory discontinuity anchor their thoughts spatially. Built with Apple&apos;s ARKit, RealityKit, and TableTopKit.
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
          Links: <Link className="text-international-orange-engineering dark:text-international-orange" href="https://drive.google.com/file/d/1W-CmW81LHxmseBvmfbhjOWlnwxIy8RoB/view?usp=drivesdk&usp=embed_facebook">limen nationals presentation</Link> <Link className="text-international-orange-engineering dark:text-international-orange" href="https://docs.google.com/presentation/d/1sflnhTELdE5wfKYzo15BtAaelRwBBJwfmpk6ybdebI4/edit?usp=embed_facebook"> | limen states presentation </Link> <Link className="text-international-orange-engineering dark:text-international-orange" href="https://spatialwaypoints.com/">| spatialwaypoints.com</Link>
        </div>
      </div>

      <div className="font-bold text-gray-600 dark:text-gray-50">
        <h1>Skills</h1>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
      Software: Swift, TypeScript, JavaScript, Python, Java, C++, Objective-C, Node.js, Next.js, React, Tailwind CSS
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
      Tools &amp; Technologies: Xcode, ARKit, RealityKit, SwiftUI, UIKit, Raspberry Pi, Microcontrollers (Arduino),
      Autodesk Fusion, AutoCAD, Unreal Engine, Unity, Adobe Creative Suite, Figma, Sketch, Amazon AWS, Vercel, Keyshot
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
      Architectures &amp; Methodologies: MVC, MVVM, OOP
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
      Additional: iOS Development, Computer-Aided Design (CAD), Back-End Web Development, Machine Learning,
      Project Management, Team Leadership
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
        Languages: English, Spanish
      </div>

      <div className="font-bold text-gray-600 dark:text-gray-50">
        <h1>Contact</h1>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
        <Link className="hover:underline" href="mailto:cv@degstn.com">cv@degstn.com</Link>
      </div>
    </div>
  )
}

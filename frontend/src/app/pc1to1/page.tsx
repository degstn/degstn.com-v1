import Spline from '@splinetool/react-spline/next';
import Link from 'next/link';

function Page() {
    // You'll need to define these variables or get them from props/API
    const lastUpdatedString = "3/8/2025, 15:41:22 EST";  // Replace with actual date
    const totalLocations = 0;  // Replace with actual count
    const totalPhotos = 0;     // Replace with actual count

    return (
        <main className="min-h-screen w-full bg-bgLight dark:bg-bgDark relative">
            <div
                className="absolute top-0 left-0 text-gray-50 dark:text-gray-600 backdrop-blur-[1px] p-4"
                style={{ zIndex: 9999, fontFamily: "Berkeley Mono, monospace" }}
            >
                <div className="text-xs mb-1">
                    <Link href="/" className="hover:underline">
                        back
                    </Link>
                </div>
                <div className="text-xs mb-0">/pc1to1</div>
                <div className="text-xs mb-0">
                    Last updated {lastUpdatedString} <br />
                    pcv1 v161.obj
                </div>
                <div className="text-xs mb-3">
                </div>
            </div>
            <div className="w-full h-screen">
                <Spline
                    scene="https://prod.spline.design/c2KkPenO7mr5Jk-Z/scene.splinecode"
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        </main>
    );
}

export default Page
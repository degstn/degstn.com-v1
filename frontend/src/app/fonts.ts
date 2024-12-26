import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({ subsets: ["latin"] });

 
export const berkeleymono = localFont({
    src: [
      {
        path: './BerkeleyMono-Regular.ttf',
        weight: 'normal',
        style: 'normal',
      },
      {
        path: './BerkeleyMono-Italic.ttf',
        weight: 'normal',
        style: 'italic',
      },
      {
        path: './BerkeleyMono-Bold.ttf',
        weight: 'bold',
        style: 'normal',
      },
      {
        path: './BerkeleyMono-BoldItalic.ttf',
        weight: 'bold',
        style: 'italic',
      },
    ],
  })

  export const tx02 = localFont({
    src: [
      {
        path: './TX-02-Variable.otf',
        weight: 'normal',
        style: 'normal',
      },
    ],
  })
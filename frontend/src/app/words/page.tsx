"use client";
import Link from 'next/link'
import Image from 'next/image'

export default function Words() {
  

  return (
    <main className="min-h-screen flex-grid items-center justify-center bg-bgLight dark:bg-bgDark p-6 md:px-56 px-6 pt-24 ">
      <div className="text-sm text-gray-600 opacity-50 dark:text-gray-50">
          <Link href="/" className="hover:underline ">
                back
              </Link>
          </div>
          <div className=" text-gray-600 dark:text-gray-50 pb-10">
            words
          </div>
          <div className="font-bold text-gray-600 dark:text-gray-50">
            <h1>new website</h1>
          </div>
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-50 pb-2">
            december 27, 2024 
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-2">
            i’ve just finished starting the next version of my portfolio. since i started working on this portfolio, i’ve been tinkering with everything from the background colors to the font which i’ve recently adorned with the site with which is berkeley mono and i’ll get to this later.
            </div>
            <Image
                src="/site v1.2.0.png"
                alt="site v1.2.0 screenshot on safari"
                width={1000}
                height={500}
            />
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
            above is a screenshot of what the website looks like at this point as i know, as the site has already dramatically changed from it’s humble beginning using apple garamond with jumbo text so your grandmother could read it, i’m sure i’ll write back on this design scolding myself as a grow as a developer and as my taste advances beyond this ulta-mono theme i have going on right now. you know i really can’t even think about a time where i don’t love this
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
            going into my inspiration from when I created v1 of this website now, i had the idea that i wanted a portfolio to showcase my work, but never knew how to go about it. i had a few ideas, but nothing that really stuck. I initially took inspiration from a designer at apple, Chan Karunamuni. his website, in many ways, is fundamentally the backbone of how i’ve laid out my website. it was a stepping stone into my own creative process as i wanted to evolve the idea further than just having the overall year + 1 singular project since i was an evolving person and so were and still are my projects. that leads me to the pantone color of the year. quite a shift but i promise it’ll make sense at some point (to me it does so i hope it does to you too). so pantone puts out a color of the year every year and in 2024 it was this cool peach-ish color. don’t know what gave me the idea, but from then on i was like––how about the current year has the pantone color of the year! this was a great idea until this year’s color is the same color of the stuff that comes out between your intergluteal cleft. that’s when i had to get innovative, but that’s also for later. ok track let’s not derail ourselves; that was the first deviation from Chan’s boilerplate for design as now i had a pop of color! wow it’s already more colorful than my room and my vscode theme. that was a proud moment for myself as anyone who would view my portfolio immediately looked at me and said why are you sad. so now we have innovation with this inspired design.
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-2">
            i’ve been following USGraphics, formally Berkeley Graphics for a while but never had the use case for its beloved TX-02 Berkeley Mono font that made me smile every time i saw it. that’s when one morning i was on the computer and i just impulsively bought it alongside 4 other packages that somehow made a font look like i was buying a new piece of hardware on the bill (no regrets though since i bought more like yesterday afternoon so lol). so since then, i’ve been rebuilding the look and feel of the site revolving around this retro-industrial font. it started with the background color, which i kinda already had the idea for or inspiration for: old mac/industrial machines had this off-white tint to it and i NEEDED to replicate it. so i did some digging and moved some slider moving until i got a color i liked. it started off using tailwind’s yellow-50 since it was like riiiiiiiight there and i really didn’t feel like choosing it myself as with my photography too, my color theory skills can be questionable at times. that’s when i pushed it to the repo and called it a day. that day couldn’t have ended sooner though as just 24 hours later i changed it again. this time, being at the startup, mainfra.me’s initial background color as it also was replicating the color of the plastic material old macs used. so i thought for 5 seconds, did inspect element, copied the hex, pasted it into my bg color in the tailwind config file as now i had negated the regular tailwind color scheme and started my own color set which i’ll get to right after this. my color theory discontinuity is in some ways the fault of night shift. i lowk thought it was more yellow and i think my eyes aged 54 years the moment 10PM hit as i thought of it as normal, so in the morning when i looked again, i saw that it was more white and i just forced myself to like it, and i can’t say the yellow was better now that i tried replicating the off-white-off-white the night shift did so win win. 
            </div>
            <Image
                src="/git.png"
                alt="git page screenshot"
                width={1000}
                height={500}
            />
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
            enough yapping now into da juicy stuff. so i’m a developer too not just a designer who gets to decide what specific hex will make me happy when i visit this thing, so i felt like i needed a dedicated version history page. when i get to photography and such later on, it’ll become more apparent to why i felt this. so using GitHub’s free API, all i have to do to retrieve the commit messages and all such info about commits is to make a request and boom i got da goods. so all i had to do now is design a cool ass page to show this progression of anger and emotion through this page (do NOT click load more on that page i get heated when vercelbot doesn’t build my page and returns a platter of errors that feeds that anger and passion into building the page specifically so it shows not that.)
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
            so as you can see above, the page is pretty simple, but i put a lot of effort into filling it out making sure it wasn’t lacking. like it started off with a page that said git at the top and just showed the commit messages and localized time when i committed them and that is just lame. and i am not lame. i am just a man who uses vscode as a document writing software without spell correction or a single thought of using one that does. what i love the most about this page is the fact that i (i also go by ChatGPT o1 pro) figured out that i could pull certain dynamic elements of my repo to fill in the data here as i wanted to have a comprehensive graph of what languages the website uses to look this beautiful as well as the last time prod was updated. what i plan to add is the github signature commit history graph squares but for this portfolio's repo so you can see how much time i put into this portfolio (i know the average person will probably never even look at the site for more than 5 minutes as the home page is a redirect central and the cv is just a 4 min read, the other minute being trying to find which site they’re looking for. but i care and this is a great place to test my knowledge of typescript and design as it is supposed to show who i am as a person through my eye of design and my execution of code). 
            </div>
            <Image
                src="/cv.png"
                alt="cool sick ass globe screenshot"
                width={1000}
                height={500}
            />
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-2 pt-10">
            moving on to the inspiration for the layout of the git page but more of a keystone of the cite as it starts up top is the curriculum vitae, better known as cv on my page below my name. it&apos;s practically my resume up to this point which i plan to update, but i needed to get that working as soon as possible as i can&apos;t just have cv at the top of the page if it doesn't lead anywhere. since it&apos;s not a traditional resume too, it has some more creative freedom when it comes to how i want to structure it. i chose to keep it minimal and make a cool template that i could re-use for the rest of the cv sections with pure typescript/tailwind which sped up the process to a point where i didn&apos;t really need to focus on making sure it worked, just on the content and the ease of readability for the end reader. 
            </div>
            <Image
                src="/globe.png"
                alt="cool sick ass globe screenshot"
                width={1000}
                height={500}
            />
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-5">
  now finally, had to save the best for last on my journey into the second minor version of my website, my photography globe! this past week, i had one strange idea after seeing the CEO of Science/prev founder of Neuralink max hodak’s website and seeing, hey he has a photography page. then i looked at it and it was boring. and it really somehow sparked some neuron that was dorment in my keppie to make a globe. since i was like 9, my grandpa would ask me, “if you were to be able to travel anywhere in the world, where would you go?” and every year since then, we’ve travelled somewhere new in the world, and this globe idea that came from the schmutzed up brain of mine perfectly encapsulated this feeling of global domination my grandpa and i set out to accomplish those many years ago. i’ve just realized that the header of the page is the wrong color fixing that...ok back. so this globe, whats so cool about it? so i found a cool ass website last year made by some cool fellow over at sora @ openai, will depue which used this globe generated by three.js and globe.gl. i bookmarked it and as soon as the keppila decided to nebula, i brought it out for one last hurrah! and here i had the time of my life reading through the documentation of globe.gl and completely ignoring it as i wanted to take the globe, get rid of it and make it myself. sounds like me =&gt; overcomplicate everything. so i used a geojson file to get the world’s shorelines as individual points, unpacked them, and then added another layer of detail with turf. this lets me splice all those points together into a consistent dotted path along the globe. and finally to top it off, a cool dot-matrix globe is cool but it’s literally just a replication of the more basic cobe webgl globe that is actually interactive and customizable. so now that i had a template, i had to add the points, which started off quite rocky as i was investigating everything from labels to 3d objects such as in the screenshot below of the very first version of the globe before i coolified it into its majestic state it will always remain in now.
</div>
            <Image
                src="/globev0.png"
                alt="cool sick ass globe before it was cool screenshot"
                width={500}
                height={500}
            />
            <div className="text-sm text-gray-600 dark:text-gray-50 pb-2">
            so once i had learned that every single way i tested wouldn’t work and found out that since this thing lives in a canvas in html, you can’t inspect element it to reverse engineer it, i found that all i had to do is use the html objects globe.gl provides for me and boom it worked within 2 hours of figuring out normal css since tailwind couldn’t do something this complex and dynamic.
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-50 pb-2">
            so happy how this turned out and i can’t wait to continue improving and iterating upon this portfolio!
            </div>
          </div>
          
          
          

          
    </main>
  )
}
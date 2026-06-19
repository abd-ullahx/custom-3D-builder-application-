import { Hero } from '../features/home/Hero'
import { VideoShowcase } from '../features/home/VideoShowcase'
import { Stats } from '../features/home/Stats'
import { Features } from '../features/home/Features'
import { Categories } from '../features/home/Categories'
import CallToAction from '../features/home/CallToAction'

export const Home = ({ showcaseVideos, homeCategories }) => (
  <>
    <Hero />
    <VideoShowcase showcaseVideos={showcaseVideos} />
    <Stats />
    <Features />
    <Categories homeCategories={homeCategories} />

    {/* Call to Action */}
    <CallToAction />
  </>
)

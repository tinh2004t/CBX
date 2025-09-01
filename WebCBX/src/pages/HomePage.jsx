import Banner from '../components/Banner/Banner';
import InteractiveMap from '../components/Maps/InteractiveMap';
import TourSection from '../components/TourSection/TourSection';
import VideoSection from '../components/VideoSection/VideoSection';
import NewsSection from '../components/NewsSection/NewsSection';
import TestimonialCarousel from '../components/TestimonialSection/TestimonialSection';

export default function HomePage() {
  return (
    <>
      <Banner />
      <InteractiveMap />
      <TourSection />
      <VideoSection />
      <NewsSection />
      <TestimonialCarousel />
    </>
  );
}

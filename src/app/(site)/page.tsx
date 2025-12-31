import React from 'react';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import UniversitiesSection from '../components/UniversitiesSection';
import CitiesSection from '../components/CitiesSection';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsSection from '../components/NewsSection';
import CTASection from '../components/CTASection';

const Home = () => {
    return (
        <div>
            <HeroSection />
            <StatsSection />
            <UniversitiesSection />
            <CitiesSection />
            <ServicesSection />
            <TestimonialsSection />
            <NewsSection />
            <CTASection />
        </div>
    );
};

export default Home;
"use client";

import { Brain, Activity, Clock, Laptop, Shield, Users, ChefHat, MessageSquare, ShoppingCart, Users2, Apple, FlaskRound, AlertCircle, Award, Building2, Stethoscope, Phone, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { JSX, ReactNode, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
 
interface BeneficiaryCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
  delay?: number;
}

const BeneficiaryCard = ({ icon, title, description, delay = 0 }: BeneficiaryCardProps) => {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={delay}
      className="bg-white border border-gray-200 p-6 rounded-lg shadow-md flex flex-col items-start space-y-4 transition-all duration-300 hover:shadow-lg hover:scale-105"
    >
      <div className="p-3 bg-gray-100 text-gray-700 rounded-full shadow-sm">{icon}</div>
      <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};


interface StepCardProps {
  number: string;
  title: string;
  description: string;
  delay?: number;
}

const StepCard = ({ number, title, description, delay = 0 }: StepCardProps) => {
  return (
    <div
      data-aos="flip-left"
      data-aos-delay={delay}
      className="bg-white border border-gray-200 p-6 rounded-lg shadow-md flex flex-col items-start space-y-4 transition-all duration-300 hover:shadow-lg hover:scale-105"
    >
      <div className="text-xl font-bold text-gray-900">{number}.</div>
      <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}


const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <div
      data-aos="zoom-in"
      data-aos-delay={delay}
      className="bg-white border border-gray-200 p-6 rounded-lg shadow-md flex flex-col items-start space-y-4 transition-all duration-300 hover:shadow-lg hover:scale-105"
    >
      <div className="p-3 bg-gray-100 text-gray-700 rounded-full shadow-sm">{icon}</div>
      <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};


const Page = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E5F5] to-[#F9FAE0]">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">FriskaNutriAi</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#" className="text-gray-700 hover:text-orange-500 transition-colors">Home</Link>
              <Link href="#why" className="text-gray-700 hover:text-orange-500 transition-colors">Why?</Link>
              <Link href="#how" className="text-gray-700 hover:text-orange-500 transition-colors">How?</Link>
              <Link href="#who" className="text-gray-700 hover:text-orange-500 transition-colors">Who?</Link>
              <Link href="#partner" className="text-gray-700 hover:text-orange-500 transition-colors">Partner</Link>
            </div>
            <div className="flex items-center space-x-4">
             <Link href="/auth/login">
              <Button variant="ghost" className="hover:text-orange-500  transition-colors">Try NutriAi</Button>
              </Link>
              <Button className="bg-gradient-to-r from-orange-400 to-purple-500 text-white shadow-md hover:shadow-lg transition-all">Contact Us</Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div data-aos="fade-down">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
              Welcome to Friska NutriAi
            </h1>
          </div>
          <div data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
              Empowering Health Through Intelligent Nutrition
            </h2>
          </div>
          <div data-aos="fade-up" data-aos-delay="200">
            <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-12">
              Friska NutriAi is a cutting-edge platform that revolutionizes nutrition and wellness through artificial intelligence. Our mission is to provide personalized, data-driven dietary guidance to enhance well-being, prevent chronic diseases, and optimize health outcomes.
            </p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="300">
            <Button className="bg-gradient-to-r from-orange-400 to-purple-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
              Start Your Journey Today
            </Button>
          </div>
        </div>
      </section>

      <section id="why" className="py-16 bg-gradient-to-br from-[#F9FAE0] to-[#F0E5F5]">
        <div className="max-w-7xl mx-auto px-4">
          <div data-aos="fade-down">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">Why Choose Friska NutriAi?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Personalized Nutrition Plans"
              description="Our AI-driven approach tailors meal plans to your unique health profile, preferences, and dietary needs."
              delay={100}
            />
            <FeatureCard
              icon={<Activity className="h-6 w-6" />}
              title="Chronic Disease Management"
              description="We support individuals managing diabetes, hypertension, high cholesterol, and other conditions with customized nutritional strategies."
              delay={200}
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Real-Time Insights"
              description="Get actionable recommendations based on real-time data and health analytics."
              delay={300}
            />
            <FeatureCard
              icon={<Laptop className="h-6 w-6" />}
              title="Seamless Integration"
              description="Our platform syncs with wearable devices and electronic health records for a comprehensive health overview."
              delay={400}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Expert Guidance"
              description="Backed by nutritionists and healthcare professionals, Friska NutriAi ensures evidence-based recommendations."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-16 bg-gradient-to-br from-[#F0E5F5] to-[#F9FAE0]">
        <div className="max-w-7xl mx-auto px-4">
          <div data-aos="fade-down">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Assess Your Health"
              description="Answer a few questions about your medical history, lifestyle, and dietary habits."
              delay={100}
            />
            <StepCard
              number="2"
              title="Receive Your Plan"
              description="Our AI generates a customized nutrition plan tailored to your goals."
              delay={200}
            />
            <StepCard
              number="3"
              title="Track & Optimize"
              description="Monitor your progress and receive ongoing adjustments for optimal results."
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Who Can Benefit Section */}
      <section id="who" className="py-16 bg-gradient-to-br from-[#F9FAE0] to-[#F0E5F5]">
        <div className="max-w-7xl mx-auto px-4">
          <div data-aos="fade-down">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">Who Can Benefit?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BeneficiaryCard
              icon={<Users2 className="h-6 w-6" />}
              title="Weight Management"
              description="Individuals seeking effective and sustainable weight management solutions."
              delay={100}
            />
            <BeneficiaryCard
              icon={<Activity className="h-6 w-6" />}
              title="Chronic Conditions"
              description="People with chronic conditions requiring specialized dietary adjustments."
              delay={200}
            />
            <BeneficiaryCard
              icon={<Shield className="h-6 w-6" />}
              title="Health-Conscious"
              description="Health-conscious individuals looking for optimal nutrition guidance."
              delay={300}
            />
            <BeneficiaryCard
              icon={<Stethoscope className="h-6 w-6" />}
              title="Healthcare Providers"
              description="Healthcare providers aiming to offer personalized nutritional support."
              delay={400}
            />
            <BeneficiaryCard
              icon={<Award className="h-6 w-6" />}
              title="Athletes"
              description="Athletes and fitness enthusiasts looking to optimize performance."
              delay={500}
            />
            <BeneficiaryCard
              icon={<Clock className="h-6 w-6" />}
              title="Busy Professionals"
              description="Busy professionals needing convenient meal planning solutions."
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-16 bg-gradient-to-br from-[#F0E5F5] to-[#F9FAE0]">
        <div className="max-w-7xl mx-auto px-4">
          <div data-aos="fade-down">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">Additional Features</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<ChefHat className="h-6 w-6" />}
              title="Meal Planning & Recipes"
              description="Access a diverse range of healthy, AI-curated recipes suited to your preferences."
              delay={100}
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Nutritional Coaching"
              description="Connect with certified nutritionists for expert advice and support."
              delay={200}
            />
            <FeatureCard
              icon={<ShoppingCart className="h-6 w-6" />}
              title="Smart Grocery Lists"
              description="Generate shopping lists based on your meal plan for easy shopping."
              delay={300}
            />
            <FeatureCard
              icon={<Users2 className="h-6 w-6" />}
              title="Community Support"
              description="Join a community sharing tips, success stories, and motivation."
              delay={400}
            />
            <FeatureCard
              icon={<Apple className="h-6 w-6" />}
              title="AI-Driven Recommendations"
              description="Discover new food options based on your preferences and goals."
              delay={500}
            />
            <FeatureCard
              icon={<FlaskRound className="h-6 w-6" />}
              title="Micronutrient Tracking"
              description="Monitor your intake of essential vitamins and minerals."
              delay={600}
            />
            <FeatureCard
              icon={<AlertCircle className="h-6 w-6" />}
              title="Allergy Customization"
              description="Get recommendations that respect your dietary restrictions."
              delay={700}
            />
            <FeatureCard
              icon={<Home className="h-6 w-6" />}
              title="Family Meal Planning"
              description="Simplify meal prep with plans that cater to your household."
              delay={800}
            />
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-gradient-to-br from-[#F9FAE0] to-[#F0E5F5]">
        <div className="max-w-7xl mx-auto px-4">
          <div data-aos="fade-down">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">Success Stories</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="Friska NutriAi has transformed my approach to eating. The AI recommendations helped me manage my diabetes effectively."
              author="John D."
              delay={100}
            />
            <TestimonialCard
              quote="The personalized meal plans are a game-changer! I feel more energetic and healthier than ever before."
              author="Sarah L."
              delay={200}
            />
            <TestimonialCard
              quote="As a professional athlete, I need precise nutrition. Friska NutriAi has helped me fine-tune my diet for peak performance."
              author="Michael R."
              delay={300}
            />
            <TestimonialCard
              quote="I love how easy it is to plan healthy meals for my whole family. No more stress about what to cook!"
              author="Emily T."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Scientific Excellence Section */}
      <section className="py-16 bg-gradient-to-br from-[#F0E5F5] to-[#F9FAE0]">
        <div className="max-w-7xl mx-auto px-4">
          <div data-aos="fade-down">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">Our Commitment to Scientific Excellence</h2>
          </div>
          <div data-aos="fade-up" data-aos-delay="100">
            <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto">
              Friska NutriAi is built on the latest advancements in nutritional science, AI, and health analytics. Our team collaborates with leading dietitians, physicians, and data scientists to ensure that every recommendation is backed by credible research. We continuously update our platform with new findings and user insights to enhance our precision and effectiveness.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Partnerships Section */}
      <section id="partner" className="py-16 bg-gradient-to-br from-[#F9FAE0] to-[#F0E5F5]">
        <div className="max-w-7xl mx-auto px-4">
          <div data-aos="fade-down">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">Corporate Wellness & Healthcare Partnerships</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <PartnershipCard
              icon={<Building2 className="h-6 w-6" />}
              title="Corporate Wellness Programs"
              description="Improve employee health and productivity with customized nutrition plans."
              delay={100}
            />
            <PartnershipCard
              icon={<Laptop className="h-6 w-6" />}
              title="Healthcare Integration"
              description="Seamless EHR compatibility for better patient outcomes."
              delay={200}
            />
            <PartnershipCard
              icon={<Phone className="h-6 w-6" />}
              title="Telehealth Support"
              description="Virtual consultations with nutrition experts."
              delay={300}
            />
            <PartnershipCard
              icon={<Shield className="h-6 w-6" />}
              title="Insurance & Benefits"
              description="Work with insurers and organizations to offer health perks."
              delay={400}
            />
          </div>
          <div className="text-center mt-12" data-aos="zoom-in" data-aos-delay="500">
            <p className="text-lg mb-4 text-gray-700">Interested in partnering with Friska NutriAi?</p>
            <Button size="lg" className="bg-gradient-to-r from-orange-400 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all">
              Contact: nutriai@friska.ai
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gradient-to-t from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-orange-400" />
                <span className="ml-2 text-lg font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">FriskaNutriAi</span>
              </div>
              <p className="text-sm text-gray-400">Empowering Health Through Intelligent Nutrition</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="#why" className="text-gray-400 hover:text-white transition-colors">Why Choose Us</Link></li>
                <li><Link href="#how" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="#who" className="text-gray-400 hover:text-white transition-colors">Who Benefits</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Research</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Recipes</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: nutriai@friska.ai</li>
                <li className="text-gray-400">Phone: (123) 456-7890</li>
                <li className="flex space-x-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">© 2025 Friska NutriAi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const TestimonialCard = ({ quote, author, delay = 0 }: { quote: string; author: string; delay?: number }) => {
  return (
    <div 
      data-aos="fade-up" 
      data-aos-delay={delay}
      className="p-8 rounded-lg bg-white border border-gray-200 hover:shadow-lg transition-transform transform hover:scale-105"
    >
      <p className="text-lg italic mb-4 text-gray-700">&ldquo;{quote}&rdquo;</p>
      <p className="font-semibold text-right text-gray-900">- {author}</p>
    </div>
  );
};

export default Page;

const PartnershipCard = ({
  icon,
  title,
  description,
  delay = 0
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) => {
  return (
    <div 
      data-aos="fade-up" 
      data-aos-delay={delay}
      className="p-6 rounded-lg bg-white border border-gray-200 hover:shadow-xl transition-transform transform hover:scale-105"
    >
      <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-orange-100 to-purple-100 flex items-center justify-center text-orange-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}


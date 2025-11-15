/**
 * Lazy-loaded route components for code splitting
 */
import { lazy } from 'react';

// Core pages - load immediately
export { default as Index } from '@/pages/Index';

// Service pages - lazy load
export const Services = lazy(() => import('@/pages/Services'));
export const Knitwear = lazy(() => import('@/pages/Knitwear'));
export const CutAndSew = lazy(() => import('@/pages/CutAndSew'));
export const UniformsTeamwear = lazy(() => import('@/pages/UniformsTeamwear'));

// Info pages - lazy load
export const About = lazy(() => import('@/pages/About'));
export const OurStory = lazy(() => import('@/pages/OurStory'));
export const Sustainability = lazy(() => import('@/pages/Sustainability'));
export const Contact = lazy(() => import('@/pages/Contact'));

// Feature pages - lazy load
export const Portfolio = lazy(() => import('@/pages/Portfolio'));
export const ProductCatalog = lazy(() => import('@/pages/ProductCatalog'));
export const Blog = lazy(() => import('@/pages/Blog'));
export const BlogPost = lazy(() => import('@/pages/BlogPost'));
export const FAQPage = lazy(() => import('@/pages/FAQPage'));
export const QuoteGenerator = lazy(() => import('@/pages/QuoteGenerator'));
export const Brochure = lazy(() => import('@/pages/Brochure'));
export const DesignStudio = lazy(() => import('@/pages/DesignStudio'));
export const SuccessStories = lazy(() => import('@/pages/SuccessStories'));
export const HowItWorks = lazy(() => import('@/pages/HowItWorks'));

// Auth & Dashboard - lazy load
export const Auth = lazy(() => import('@/pages/Auth'));
export const Dashboard = lazy(() => import('@/pages/Dashboard'));
export const Orders = lazy(() => import('@/pages/Orders'));
export const OrderDetails = lazy(() => import('@/pages/OrderDetails'));
export const AdminAnalytics = lazy(() => import('@/pages/AdminAnalytics'));
export const AdminBlog = lazy(() => import('@/pages/AdminBlog'));
export const AdminBlogEditor = lazy(() => import('@/pages/AdminBlogEditor'));

// 404
export const NotFound = lazy(() => import('@/pages/NotFound'));

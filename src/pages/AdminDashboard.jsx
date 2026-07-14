import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { 
  LineChart, Users, Briefcase, Award, LogOut, Lock, Plus, Trash2, Edit2, Upload, 
  CheckCircle2, AlertCircle, RefreshCw, Search, Sparkles, HelpCircle, Clock, Eye, 
  FileText, Sliders, DollarSign, Home, Building2, FolderOpen, Mail, ShieldCheck, 
  Calendar, Layers, Star, Settings, Image as ImageIcon, MapPin, Globe, Check, Info, FileCode, ChevronRight,
  Folder, File, ChevronDown, History, Quote, Play, Video
} from 'lucide-react'

import { ALL_DOCTORS } from '@/data/doctors'
import { DOCTOR_MEDIA } from '@/data/doctorMedia'
import { useBranches } from '@/hooks/useBranches'

// Import Firebase SDK safely
import { auth, db, storage, firebaseConfig } from '@/lib/firebase'
import { initializeApp, deleteApp } from 'firebase/app'
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail
} from 'firebase/auth'
import {
  collection, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc, query, orderBy, limit
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { MODULES, ROLES, MODULE_LABELS, ROLE_DEFAULT_PERMISSIONS, OVERRIDABLE_MODULES, getEffectivePermissions } from '@/lib/permissions'

const DASH_STYLES = `
  .font-garamond { font-family: 'Cormorant Garamond', serif; }
  .glass-card-admin {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(30px) saturate(190%);
    -webkit-backdrop-filter: blur(30px) saturate(190%);
    border: 1px solid rgba(139, 26, 74, 0.08);
    box-shadow: 0 15px 40px -10px rgba(139, 26, 74, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.9);
  }
  .active-tab-nav {
    background: #8B1A4A;
    color: white !important;
    box-shadow: 0 10px 25px -10px rgba(139, 26, 74, 0.45);
  }
`

// Default mock datasets for fallback and demo mode
const MOCK_ANALYTICS = [
  { date: '07/01', visitors: 1200, bounceRate: 42, time: 240 },
  { date: '07/02', visitors: 1450, bounceRate: 38, time: 280 },
  { date: '07/03', visitors: 1300, bounceRate: 40, time: 260 },
  { date: '07/04', visitors: 1850, bounceRate: 35, time: 310 },
  { date: '07/05', visitors: 1600, bounceRate: 39, time: 295 },
  { date: '07/06', visitors: 2100, bounceRate: 32, time: 350 },
  { date: '07/07', visitors: 2450, bounceRate: 30, time: 380 }
]

const MOCK_DEVICE_DATA = [
  { name: 'Mobile', value: 68, color: '#8B1A4A' },
  { name: 'Desktop', value: 27, color: '#2D3A4A' },
  { name: 'Tablet', value: 5, color: '#cca830' }
]

const MOCK_TRAFFIC_SOURCES = [
  { source: 'Direct', count: 1240, percentage: 35 },
  { source: 'Google Search', count: 1860, percentage: 52 },
  { source: 'Social Media', count: 320, percentage: 9 },
  { source: 'Campaign Referral', count: 140, percentage: 4 }
]

const MOCK_CLICKS = [
  { element: 'button#book-now', text: 'Book Appointment', path: '/home', count: 482, page: 'Homepage' },
  { element: 'a#careers-link', text: 'Careers & Fellowship', path: '/footer', count: 214, page: 'About Us' },
  { element: 'button#emergency-call', text: 'Emergency Helpline', path: '/header', count: 188, page: 'All Pages' },
  { element: 'button#doctor-profile-akhil', text: 'View Dr. Akhil Dadi', path: '/doctors', count: 165, page: 'Doctors Page' },
  { element: 'a#download-health-pkg', text: 'Download Brochure', path: '/services', count: 98, page: 'Services Page' }
]

const DEFAULT_DOCTORS = [
  { id: '1', name: 'Dr. Akhil Dadi', specialty: 'Orthopedics', specialtyId: 'ortho', sub: 'MS (Ortho), FIJR', exp: '29+ Years', branch: 'LB Nagar', availability: 'Mon - Sat: 10 AM - 5 PM', photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300', status: 'Active', bio: 'Pioneer in robotic surgery and chief surgeon.', languages: 'English, Telugu, Hindi', tagline: 'Leading Robotics Joint Replacement', education: 'MBBS, MS (Orthopedics)' },
  { id: '2', name: 'Dr. Radhika Sen', specialty: 'Cardiology', specialtyId: 'cardio', sub: 'MD, DM (Cardiology)', exp: '12+ Years', branch: 'Kompally', availability: 'Mon - Fri: 9 AM - 4 PM', photoUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300', status: 'Active', bio: 'Expert interventional cardiologist specialising in valve repairs.', languages: 'English, Hindi', tagline: 'Heart Care Excellence', education: 'MBBS, MD, DM' }
]

const DEFAULT_JOBS = [
  { id: '1', title: 'Consultant Orthopedic Surgeon', department: 'Orthopedics', location: 'LB Nagar, Hyd', experience: '5+ Yrs', description: 'Requires MS Orthopedics. Experience in robotic joint replacement surgery is preferred.', status: 'Active' },
  { id: '2', title: 'Resident Medical Officer (RMO)', department: 'General Medicine', location: 'Kompally, Hyd', experience: '2+ Yrs', description: 'MBBS degree with clinical experience. Rotational shift duties in ICU/Ward.', status: 'Active' }
]

const DEFAULT_APPOINTMENTS = [
  { id: '101', name: 'Srinivas Rao', phone: '9848022338', email: 'srinivas@gmail.com', department: 'Orthopedics', doctor: 'Dr. Akhil Dadi', date: '2026-07-08', time: '10:30 AM', status: 'Confirmed', crmSync: 'Synced', message: 'Looking for robotic knee replacement.' },
  { id: '102', name: 'Anitha Reddy', phone: '9177028445', email: 'anitha.r@gmail.com', department: 'Cardiology', doctor: 'Dr. Radhika Sen', date: '2026-07-09', time: '02:15 PM', status: 'Pending', crmSync: 'Failed', message: 'Second opinion for valve condition.' }
]

const DEFAULT_MEDIA = [
  { id: '1', name: 'srikara_logo.png', type: 'image', size: '45 KB', url: 'https://i.ibb.co/qF1tmZrW/convert-into-high-202604060154.jpg', folder: 'Images' },
  { id: '2', name: 'akhil_dadi_profile.jpg', type: 'image', size: '120 KB', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300', folder: 'Images' },
  { id: '3', name: 'health_packages_2026.pdf', type: 'document', size: '2.4 MB', url: '#', folder: 'Documents' },
  { id: '4', name: 'robotic_surgery_intro.mp4', type: 'video', size: '15.8 MB', url: 'https://assets.mixkit.co/videos/preview/mixkit-surgeons-performing-a-surgery-with-a-surgical-monitor-35515-large.mp4', folder: 'Videos' }
]

const DEFAULT_BLOGS = [
  {
    id: '1',
    category: 'Orthopaedics',
    tag: 'Case Study',
    title: 'Walking Again at 68: A Bilateral Robotic Knee Replacement Story',
    body: '<h3>Patient Background</h3><p>Mrs. Lakshmi Devi, 68, a retired school teacher from ECIL, had been suffering from severe bilateral knee osteoarthritis for over six years. She could barely walk 50 metres without stopping due to pain, and climbing stairs had become impossible.</p><h3>The Srikara Approach</h3><p>Dr. Akhil Dadi and his team performed a simultaneous bilateral robotic knee replacement using the NAVIO system. The robotic platform allowed sub-millimetre precision in implant positioning, reducing soft tissue damage and blood loss significantly.</p><p>The procedure was completed in under 3 hours. Mrs. Devi was mobilised with a walker the very next morning and was walking unaided by day 3.</p><h3>Outcome</h3><p>At her 6-week follow-up, she demonstrated full range of motion in both knees and returned to her daily routine within 6 weeks. Her case is one of over 30,000 successful joint replacements performed at Srikara Hospitals since 2013.</p><blockquote>"I had given up hope of living without pain. The doctors at Srikara gave me my life back." — Mrs. Lakshmi Devi</blockquote>',
    status: 'Active',
    slug: 'walking-again-robotic-knee',
    seoTitle: 'Robotic Knee Surgery Recovery Story | Srikara',
    seoDesc: 'Discover how 68-year old Mrs. Lakshmi walked unaided within 3 days of surgery.',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    category: 'Cardiology',
    tag: 'Clinical Insight',
    title: 'Heart Attack at 44: How Rapid Intervention Saved a Young Father',
    body: '<h3>The Emergency</h3><p>Mr. Ravi Kumar, 44, collapsed at his office with chest pain and was rushed to Srikara Hospitals. His ECG confirmed a massive STEMI — a complete blockage of the left anterior descending artery, often called the "widow maker."</p><h3>Door-to-Balloon Time: 45 Minutes</h3><p>Dr. Venkatesh Kumar performed an emergency primary angioplasty. A drug-eluting stent was deployed within 45 minutes of arrival — well within the international benchmark of 90 minutes.</p><h3>Recovery</h3><p>His heart function, which had dropped to 30% at admission, recovered to 55% within two weeks. He was discharged on day 5 and returned to work within 6 weeks.</p>',
    status: 'Active',
    slug: 'heart-attack-at-44',
    seoTitle: 'Emergency Angioplasty Success Story | Srikara',
    seoDesc: 'Read how a 44-year-old software engineer recovered full heart function within weeks.',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    category: 'Neurosurgery',
    tag: 'Case Study',
    title: 'Back to Work in 6 Weeks: Minimally Invasive Spine Surgery Success',
    body: '<h3>The Problem</h3><p>Mr. Suresh Reddy, 38, had been suffering from severe lower back pain radiating down his left leg for 8 months. An MRI confirmed a large L4-L5 disc herniation compressing the nerve root. He could not sit for more than 10 minutes.</p><h3>Minimally Invasive Approach</h3><p>Dr. K. Naresh Babu performed a minimally invasive microdiscectomy through a 2 cm incision. The herniated disc fragment was removed without disturbing the surrounding muscles. The procedure lasted 90 minutes and Mr. Reddy was walking the same evening.</p><h3>Outcome</h3><p>His leg pain resolved completely within 48 hours. At his 6-week follow-up, he had returned to full-time work with no restrictions.</p>',
    status: 'Active',
    slug: 'back-to-work-minimally-invasive-spine',
    seoTitle: 'Microdiscectomy Success Story | Srikara',
    seoDesc: 'Read how Mr. Suresh Reddy returned to full-time work in just 6 weeks.',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    category: 'General Surgery',
    tag: 'Patient Story',
    title: 'Gallbladder Removed, Home the Same Day: Laparoscopic Surgery at Srikara',
    body: '<h3>Recurring Pain for Two Years</h3><p>Mrs. Padmavathi, 52, had been experiencing recurring upper abdominal pain after meals for nearly two years. An ultrasound revealed multiple gallstones. Fear of a large scar and long recovery had kept her from seeking treatment.</p><h3>Day-Care Laparoscopic Surgery</h3><p>Dr. M. Anurag performed a laparoscopic cholecystectomy through four tiny incisions, each less than 1 cm. The procedure took 45 minutes. Mrs. Padmavathi was awake and sipping fluids within 2 hours and discharged the same evening.</p><h3>Back to Normal</h3><p>She resumed light household activities within 3 days and was fully active within a week. "I was home the same day. I couldn\'t believe it," she said.</p>',
    status: 'Active',
    slug: 'day-care-laparoscopic-cholecystectomy',
    seoTitle: 'Laparoscopic Gallbladder Removal Story | Srikara',
    seoDesc: 'Read how a 52-year-old homemaker was back to light household activities within 3 days.',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    category: 'Diabetology',
    tag: 'Health Guide',
    title: 'Managing Diabetes in Hyderabad: What Every Patient Should Know',
    body: '<h3>The Diabetes Burden in Hyderabad</h3><p>Hyderabad has one of the highest rates of Type 2 diabetes in India, with studies suggesting over 11% of the urban population is affected. Sedentary lifestyles, high-carbohydrate diets, and genetic predisposition make Telangana residents particularly vulnerable.</p><h3>Early Warning Signs</h3><p>Dr. Murali Mohan Rao advises patients to watch for: frequent urination, unusual thirst, unexplained weight loss, blurred vision, slow-healing wounds, and tingling in the feet.</p><h3>The Three Pillars of Management</h3><p><strong>Diet:</strong> Reduce refined carbohydrates. Increase fibre through vegetables and whole grains.</p><p><strong>Exercise:</strong> 30 minutes of brisk walking five days a week can reduce HbA1c by 0.5–1%.</p><p><strong>Medication adherence:</strong> Never skip doses. Modern diabetes medications are safe and effective when taken consistently.</p>',
    status: 'Active',
    slug: 'managing-diabetes-hyderabad',
    seoTitle: 'Type 2 Diabetes Management Guide | Srikara',
    seoDesc: 'Learn the three pillars of diabetes management from Dr. Murali Mohan Rao.',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    category: 'Orthopaedics',
    tag: 'Innovation',
    title: 'NAVIO Robotic Surgery: Why Srikara Leads India\'s Joint Replacement Revolution',
    body: '<h3>What is NAVIO Robotic Surgery?</h3><p>The NAVIO system is a handheld robotic platform that assists surgeons in performing knee replacement surgery with sub-millimetre precision. The surgeon controls every movement, while the robot provides real-time guidance and prevents cuts outside the planned zone.</p><h3>Why Precision Matters</h3><p>The longevity of a knee implant depends critically on its alignment. Even a 2–3 degree error can accelerate wear and lead to early failure. Robotic-assisted surgery achieves target alignment in over 95% of cases, compared to 75–80% with conventional techniques.</p><h3>Srikara\'s Track Record</h3><p>Under Dr. Akhil Dadi, Srikara has performed over 5,000 NAVIO robotic procedures — one of the highest-volume robotic joint replacement centres in South India — with a 99% success rate.</p>',
    status: 'Active',
    slug: 'navio-robotic-surgery-precision',
    seoTitle: 'NAVIO Robotic Joint Surgery | Srikara',
    seoDesc: 'Learn about the sub-millimetre precision of robotic knee replacements at Srikara.',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=800'
  }
]

const DEFAULT_FAQS = [
  { id: '1', question: 'How do I book a robotic surgery consultation?', answer: 'You can use the booking portal on our website, select Robotic joint replacement, or call the emergency helpline.', category: 'General' },
  { id: '2', question: 'Do you accept corporate health insurance?', answer: 'Yes, Srikara is empanelled with all major TPA and corporate insurance groups. Please verify with our reception.', category: 'Billing' }
]

const DEFAULT_DEPARTMENTS = [
  { id: 'cardio', name: 'Cardiology & Cardiothoracic', description: 'Advanced interventional diagnostics and emergency angioplasty support.', treatments: 'Primary Angioplasty, Valve Replacement, Heart Bypass (CABG)', faqCategory: 'Treatments' },
  { id: 'neuro', name: 'Neurology', description: 'Comprehensive brain, spine, and neurological disorder management.', treatments: 'Stroke Care, Epilepsy Management, Movement Disorders', faqCategory: 'Treatments' },
  { id: 'pulmo', name: 'Pulmonology', description: 'Advanced respiratory care and interstitial lung disease clinic.', treatments: 'Bronchoscopy, Sleep Studies, COPD Management', faqCategory: 'Treatments' },
  { id: 'nephro', name: 'Nephrology', description: 'Renal replacement therapy and dialysis excellence center.', treatments: 'Dialysis, Kidney Transplant Evaluation, CKD Management', faqCategory: 'Treatments' },
  { id: 'gastro', name: 'Gastroenterology', description: 'Digestive health, therapeutic endoscopy, and hepatology.', treatments: 'Endoscopy, Colonoscopy, Liver Disease Management', faqCategory: 'Treatments' },
  { id: 'onco', name: 'Oncology', description: 'Comprehensive medical oncology and targeted therapy.', treatments: 'Chemotherapy, Immunotherapy, Cancer Screening', faqCategory: 'Treatments' },
  { id: 'cardiac-surg', name: 'Cardiac Surgery', description: 'Minimally invasive bypass and valve replacement surgery.', treatments: 'CABG, Valve Repair, Aortic Surgery', faqCategory: 'Treatments' },
  { id: 'neurosurg', name: 'Neurosurgery', description: 'Micro-neurosurgery and precision spinal reconstruction.', treatments: 'Brain Tumor Surgery, Spinal Fusion, Disc Replacement', faqCategory: 'Treatments' },
  { id: 'ortho', name: 'Orthopaedics & Joint Replacement', description: 'World-renowned joint care with advanced NAVIO robotic surgical systems.', treatments: 'Robotic Knee Surgery, Hip Arthroplasty, Arthroscopic Repairs', faqCategory: 'Treatments' },
  { id: 'urology', name: 'Urology', description: 'Advanced laparo-urology and renal transplant surgery.', treatments: 'Kidney Stones (RIRS/PCNL), Prostate Surgery, Renal Transplant', faqCategory: 'Treatments' },
  { id: 'vascular', name: 'Vascular Surgery', description: 'Endovascular repairs and diabetic foot management.', treatments: 'Varicose Veins, AV Fistula, Angioplasty', faqCategory: 'Treatments' },
  { id: 'gyn', name: 'Obstetrics & Gynaecology', description: 'High-risk pregnancy care and advanced laparoscopic gynaecology.', treatments: 'Normal & C-Section Delivery, Hysterectomy, PCOS Management', faqCategory: 'Treatments' },
  { id: 'ivf', name: 'Fertility & IVF', description: 'Precision reproductive medicine and genetic screening.', treatments: 'IVF, IUI, Fertility Workup', faqCategory: 'Treatments' },
  { id: 'neonatology', name: 'Neonatology', description: 'Level III NICU for advanced neonatal intensive care.', treatments: 'Premature Baby Care, Ventilator Support, Phototherapy', faqCategory: 'Treatments' },
  { id: 'peds', name: 'Paediatrics', description: 'Comprehensive child healthcare and immunisations.', treatments: 'Vaccinations, Growth Monitoring, Childhood Infections', faqCategory: 'Treatments' },
  { id: 'radio', name: 'Radiology', description: 'Interventional radiology and high-resolution imaging.', treatments: 'MRI, CT Scan, Ultrasound, Digital X-Ray', faqCategory: 'Treatments' },
  { id: 'path', name: 'Pathology', description: 'Automated molecular pathology and histopathology.', treatments: 'Blood Tests, Biopsy, Molecular Diagnostics', faqCategory: 'Treatments' },
  { id: 'physio', name: 'Physiotherapy', description: 'Neuro-rehabilitation and sports injury recovery.', treatments: 'Post-Surgical Rehab, Sports Physio, Electrotherapy', faqCategory: 'Treatments' },
  { id: 'emergency', name: 'Emergency Medicine', description: 'Golden-hour trauma care and immediate life support.', treatments: 'Trauma Care, Cardiac Arrest, Polytrauma Management', faqCategory: 'Treatments' },
  { id: 'critical', name: 'Intensive Care Unit', description: 'Advanced multi-specialty life monitoring and 1:1 care.', treatments: 'Ventilator Support, Hemodynamic Monitoring, Sepsis Care', faqCategory: 'Treatments' },
]

// Bump this whenever DEFAULT_DEPARTMENTS gains new entries, so stores seeded
// from an older, shorter list pick up the additions exactly once (without
// resurrecting departments the admin deliberately deleted afterwards).
const DEPARTMENTS_SEED_VERSION = 2

const missingDefaultDepartments = (stored) => {
  const existingIds = new Set(stored.map(d => d.id))
  return DEFAULT_DEPARTMENTS.filter(d => !existingIds.has(d.id))
}

const DEFAULT_TESTIMONIALS = [
  { 
    id: '1', 
    patientName: 'Lakshmi Devi', 
    rating: 5, 
    review: 'Fantastic robotic surgery care at Srikara Hospital. I walked within 3 days without pain!', 
    videoUrl: 'https://www.youtube.com/embed/ho9JlBnrGWg',
    page: 'General / Home' 
  },
  {
    id: '2',
    patientName: 'Srinivas Rao',
    rating: 5,
    review: 'Highly satisfied with the cardiology treatment at Srikara ECIL branch. The doctors and staff were very professional.',
    videoUrl: 'https://www.youtube.com/embed/ox2rT1KRkFI',
    page: 'ECIL'
  },
  {
    id: '3',
    patientName: 'Radhika Reddy',
    rating: 5,
    review: 'Excellent joint replacement care at Miyapur branch. The robotic technique made recovery very quick.',
    videoUrl: 'https://www.youtube.com/embed/ho9JlBnrGWg',
    page: 'Miyapur'
  }
]

const DEFAULT_DOWNLOADS = [
  { id: '1', name: 'Full Health Checkup Brochure', url: '#', category: 'Health Packages', size: '1.2 MB' }
]

const DEFAULT_NEWS = [
  { id: '1', title: 'Free Medical Camp organized at ECIL', type: 'Event', date: '2026-07-15', content: 'Srikara Hospital will conduct a free outpatient health checking camp next Saturday.' }
]

const DEFAULT_PAGE_DATA = {
  homepage: {
    heroHeadline: "Your Family's Comprehensive",
    heroHighlight: 'Health Partner.',
    description: 'A complete multi-specialty care center designed for the families of Srikara communities, offering integrated care from newborns to seniors.',
    emergencyNumber: '040-4646-4646',
    ctaText: 'Book an Appointment',
    statsServed: '100K+',
    statsSpecialties: '15+',
    infraTitle: 'Precision',
    infraHighlight: 'Ecosystem',
    infraDesc: 'We invest in the future of healthcare so you can invest in your health.'
  },
  about: {
    chairmanName: 'Dr. Akhil Dadi',
    chairmanSubtitle: 'Chairman & Chief Joint Replacement Surgeon',
    chairmanBio: 'Pioneered robotic joint surgeries in South India and envisioned premium hospital modules to deliver patient care with transparency.',
    milestones: 'Over 30,000+ joint replacements and 9 centers across Telangana and Andhra Pradesh.',
    reachSubtitle: 'Our Reach',
    reachTitle: 'Strategically Located for Absolute Access',
    reachDesc: 'Operating across 9 strategic units including RTC X Roads, Miyapur, LB Nagar, and Vijayawada, our locations are situated at key entry points to major cities. This ensures that world-class orthopedic and multispeciality care is always within reach.',
    visionQuote: 'SRIKARA Multispeciality Hospitals is synonymous with quality, expertise, innovation, and international standards, offering a comprehensive spectrum of medical excellence under one roof.',
    visionName: 'Dr. Akhil Dadi',
    visionRole: 'Founder & Managing Director',
    visionSubrole: 'World Orthopaedic Concern Member',
    isuiteTitle: 'i-SUITE: The Future of Surgery',
    isuiteDesc: 'We take pride in the first i-SUITE Operation Theatre in the state. Featuring four integrated modular operating rooms designed specifically for high-precision joint replacements and complex neurosurgeries, our infrastructure allows for zero-contamination environments and digital surgical navigation.',
    isuiteStat1Val: '30,000+',
    isuiteStat1Label: 'Joint Replacements',
    isuiteStat2Val: '1,000+',
    isuiteStat2Label: 'Neuro Procedures',
    conciergeTitle: 'Global Concierge',
    conciergeDesc: 'Our dedicated International Patient Cell manages overseas healthcare journeys, from visa assistance to personalized recovery suites, ensuring global proximity to clinical mastery.',
    conciergeBtnText: 'International Desk'
  },
  careers_page: {
    bannerBadge: 'Academics & Surgical Training',
    bannerTitle: 'Advancing Surgical Excellence in Arthroplasty',
    bannerSubtitle: 'Srikara Hospitals is a leader in robotic joint replacement surgery and is actively engaged in academics and teaching. Our Arthroplasty Fellowship is one of the most sought-after programs in India, attracting orthopedic surgeons globally.',
    bannerCta: 'Apply for Fellowship',
    benefits: 'Flexible Timings, Professional Training, High-end Surgical Labs, Comprehensive Medical Insurance',
    whyTitle: "Why Choose Srikara's Arthroplasty Fellowship?",
    feeTitle: 'Fellowship Fee Structure',
    policyTitle: 'Refund & Postponement Policy',
    jobsTitle: 'Active Career Opportunities',
    portalTitle: 'Interactive Application Portal',
    ctaTitle: 'Take the Next Step in Your Career!',
    ctaDesc: 'Join us at Srikara Hospitals and gain unparalleled surgical expertise in arthroplasty and joint replacement surgery. Be part of a program that shapes the future of orthopedic excellence!'
  },
  branches: {
    'ecil': { heroHeadline: "Your Family's Comprehensive", heroHighlight: "Health Partner.", description: "A complete multi-specialty care center designed for the families of ECIL.", phone: "040-68324804", address: "ECIL Cross Roads, Hyderabad", rating: 4.7, advantageTitle: "The ECIL", advantageHighlight: "Advantage", infraTitle: "Precision", infraHighlight: "Ecosystem", infraDesc: "We invest in the future of healthcare so you can invest in your health." },
    'lb-nagar': { heroHeadline: "Robotic Joint Replacement Hub", heroHighlight: "Care & Precision.", description: "Our primary center equipped with advanced critical care modules and surgeons.", phone: "040-68324801", address: "LB Nagar Ring Road, Hyderabad", rating: 4.8, advantageTitle: "The LB Nagar", advantageHighlight: "Advantage", infraTitle: "Precision", infraHighlight: "Ecosystem", infraDesc: "We invest in the future of healthcare so you can invest in your health." },
    'kompally': { heroHeadline: "Comprehensive Healthcare Gateway", heroHighlight: "Aiding recovery.", description: "Premier diagnostic facility and modular orthopedics departments.", phone: "040-68324802", address: "Kompally highway, Hyderabad", rating: 4.6, advantageTitle: "The Kompally", advantageHighlight: "Advantage", infraTitle: "Precision", infraHighlight: "Ecosystem", infraDesc: "We invest in the future of healthcare so you can invest in your health." },
    'peerzadiguda': { heroHeadline: "Affordable Advanced Care.", heroHighlight: "Robotic Precision.", description: "Bringing world-class Orthopedic and General care to Peerzadiguda.", phone: "040-68108108", address: "Survey No. 12, Peerzadiguda Road, Uppal, Hyd", rating: 4.8, advantageTitle: "The Peerzadiguda", advantageHighlight: "Advantage", infraTitle: "Precision", infraHighlight: "Ecosystem", infraDesc: "We invest in the future of healthcare so you can invest in your health." },
    'lakdikapul': { heroHeadline: "Robotic Surgery & Joint Excellence", heroHighlight: "Leading orthopedics.", description: "Our flagship hospital equipped with premium joint, spine, and urology surgical suites.", phone: "040-68324800", address: "Lakdikapul, Hyderabad", rating: 4.9, advantageTitle: "The Lakdikapul", advantageHighlight: "Advantage", infraTitle: "Precision", infraHighlight: "Ecosystem", infraDesc: "We invest in the future of healthcare so you can invest in your health." },
    'miyapur': { heroHeadline: "Multispecialty Care Hub", heroHighlight: "Advanced recovery.", description: "Trusted critical care, pediatrics, and neurology departments serving Miyapur.", phone: "040-68324805", address: "Miyapur Main Road, Hyderabad", rating: 4.7, advantageTitle: "The Miyapur", advantageHighlight: "Advantage", infraTitle: "Precision", infraHighlight: "Ecosystem", infraDesc: "We invest in the future of healthcare so you can invest in your health." },
    'vijayawada': { heroHeadline: "Orthopedic & Spine Pioneer", heroHighlight: "Srikara Andhra.", description: "Bringing robotic total knee arthroplasty and diagnostic suites to Vijayawada.", phone: "0866-6832480", address: "Benz Circle, Vijayawada", rating: 4.8, advantageTitle: "The Vijayawada", advantageHighlight: "Advantage", infraTitle: "Precision", infraHighlight: "Ecosystem", infraDesc: "We invest in the future of healthcare so you can invest in your health." },
    'rajahmundry': { heroHeadline: "Comprehensive Health Landmark", heroHighlight: "Compassionate care.", description: "Pioneering specialized cardiac, trauma, and joint replacement treatments in East Godavari.", phone: "0883-6832480", address: "Rajahmundry highway, AP", rating: 4.6, advantageTitle: "The Rajahmundry", advantageHighlight: "Advantage", infraTitle: "Precision", infraHighlight: "Ecosystem", infraDesc: "We invest in the future of healthcare so you can invest in your health." },
    'rtc-x-roads': { heroHeadline: "Trauma & Emergency Center", heroHighlight: "Available 24/7.", description: "Super-specialty orthopedic and emergency response setups in central Hyderabad.", phone: "040-68324803", address: "RTC Cross Roads, Hyderabad", rating: 4.7, advantageTitle: "The RTC X Roads", advantageHighlight: "Advantage", infraTitle: "Precision", infraHighlight: "Ecosystem", infraDesc: "We invest in the future of healthcare so you can invest in your health." },
    'secunderabad': { heroHeadline: "Specialized Orthopedic Institute", heroHighlight: "Decades of trust.", description: "Advanced arthroscopic procedures and specialized rehabilitation center.", phone: "040-68324806", address: "Secunderabad Station Road, Hyd", rating: 4.8, advantageTitle: "The Secunderabad", advantageHighlight: "Advantage", infraTitle: "Precision", infraHighlight: "Ecosystem", infraDesc: "We invest in the future of healthcare so you can invest in your health." }
  }
}

const DEFAULT_SEO_DATA = {
  homepage: { title: 'Srikara Hospitals | Multi-Specialty Healthcare Excellence', desc: 'Srikara multi-specialty hospitals offer premium robotic knee replacements, cardiology, neurosurgery, and patient care.', keywords: 'robotic knee surgery, hospital hyderabad, cardiologists' },
  about: { title: 'About Srikara | Leadership, Vision & Values', desc: 'Read about Dr. Akhil Dadi and the core values guiding Srikara Hospital.', keywords: 'hospital founders, medical history, joint replacement pioneers' },
  careers: { title: 'Careers & Fellowship at Srikara', desc: 'Join the leading team of orthopedic, cardiology, and pediatric care providers.', keywords: 'medical jobs hyderabad, hospital fellowships' }
}

const mergeWithDefaults = (data) => {
  if (!data) return DEFAULT_PAGE_DATA
  return {
    ...DEFAULT_PAGE_DATA,
    ...data,
    homepage: { ...DEFAULT_PAGE_DATA.homepage, ...data.homepage },
    about: { ...DEFAULT_PAGE_DATA.about, ...data.about },
    careers_page: { ...DEFAULT_PAGE_DATA.careers_page, ...data.careers_page },
    branches: Object.keys(DEFAULT_PAGE_DATA.branches).reduce((acc, k) => {
      acc[k] = {
        ...DEFAULT_PAGE_DATA.branches[k],
        ...(data.branches?.[k] || {})
      }
      return acc
    }, { ...(data.branches || {}) })
  }
}

// Fully custom themed dropdown — replaces native <select> entirely (including the
// OS-rendered option list, which CSS can't restyle) with the same button-trigger +
// floating panel pattern already used by the Branch/Doctor filter dropdowns elsewhere
// in this file, so every dropdown in the admin panel looks and behaves identically.
// `onChange` is called with a synthetic `{ target: { value } }` so existing call sites
// written for native <select> (`e => setX(prev => ({ ...prev, field: e.target.value }))`)
// work unchanged.
function ThemedDropdown({ value, onChange, options, className = '', heightClass = 'h-11', placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false)
  const normalized = options.map(o => (typeof o === 'object' && o !== null ? o : { value: o, label: String(o) }))
  const selected = normalized.find(o => String(o.value) === String(value))

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full ${heightClass} px-3.5 rounded-xl border bg-white text-xs font-semibold text-slate-700 flex items-center justify-between gap-2 transition-all hover:border-[#8B1A4A]/30 focus:outline-none ${open ? 'border-[#8B1A4A] ring-4 ring-[#8B1A4A]/10' : 'border-slate-200'}`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#8B1A4A]/60 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl z-50 max-h-64 overflow-y-auto space-y-1">
            {normalized.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange({ target: { value: opt.value } }); setOpen(false) }}
                className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  String(value) === String(opt.value) ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A]'
                }`}
              >
                <span>{opt.label}</span>
                {String(value) === String(opt.value) && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Themed replacement for window.confirm() — matches the rest of the admin panel's
// glass-card modal styling (see the Media Picker modal further down) instead of the
// browser's native "localhost:5173 says" dialog.
function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-md px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md p-8 rounded-[32px] bg-white border border-slate-100 shadow-2xl text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center mb-5">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A] mb-2">{title}</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">{message}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 h-12 rounded-full border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 h-12 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wide hover:bg-rose-700 transition-colors shadow-sm"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [userPermissions, setUserPermissions] = useState([])
  const [profileChecked, setProfileChecked] = useState(false)
  const [adminUsers, setAdminUsers] = useState([])
  const [editingAdminId, setEditingAdminId] = useState(null)
  const [currentAdminUser, setCurrentAdminUser] = useState({ email: '', displayName: '', password: '', role: 'Reception', extraPermissions: [], revokedPermissions: [] })
  const [creatingAdminUser, setCreatingAdminUser] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState('analytics')
  const [activeGroup, setActiveGroup] = useState('overview') // overview, category, page, seo
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', confirmLabel: 'Delete', onConfirm: null })
  
  const [expandedGroups, setExpandedGroups] = useState({
    overview: true,
    category: true,
    page: true,
    seo: true,
    admin: true
  })

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }))
  }
  
  // Database States (loaded from localStorage or Firestore)
  const [doctors, setDoctors] = useState([])
  const [jobs, setJobs] = useState([])
  const [appointments, setAppointments] = useState([])
  const [apptSearch, setApptSearch] = useState('')
  const [mediaFiles, setMediaFiles] = useState([])
  const [blogs, setBlogs] = useState([])
  const [faqs, setFaqs] = useState([])
  const [departments, setDepartments] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [downloads, setDownloads] = useState([])
  const [news, setNews] = useState([])
  const [pageData, setPageData] = useState(DEFAULT_PAGE_DATA)
  const [seoData, setSeoData] = useState(DEFAULT_SEO_DATA)
  const [analyticsEvents, setAnalyticsEvents] = useState([])
  const [historyLogs, setHistoryLogs] = useState(() => {
    try {
      const stored = localStorage.getItem('history_logs')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Dynamic Location Management States
  const { branches: hookBranches, refetch: refetchBranches } = useBranches()
  const [branchesList, setBranchesList] = useState([])
  const [currentBranchDetails, setCurrentBranchDetails] = useState({
    slug: '',
    title: '',
    phone: '',
    address: '',
    googleRating: 4.8,
    googleMapEmbed: '',
    heroImage: '',
    highlights: '24/7 Trauma, Robotic Surgery, Rehabilitation'
  })
  const [isEditingBranch, setIsEditingBranch] = useState(false)

  useEffect(() => {
    if (hookBranches && hookBranches.length > 0) {
      setBranchesList(hookBranches)
    }
  }, [hookBranches])

  // Interactive Live Search & Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBranch, setFilterBranch] = useState('All')

  // Edit / Creation States
  const [currentDoctor, setCurrentDoctor] = useState({ name: '', specialty: '', specialtyId: 'ortho', sub: '', exp: '', branch: 'LB Nagar', availability: '', photoUrl: '', status: 'Active', bio: '', languages: 'English', tagline: '', education: '', blogs: [] })
  const [isEditingDoc, setIsEditingDoc] = useState(false)
  const [doctorFormTab, setDoctorFormTab] = useState('details') // 'details' | 'blogs'
  const [currentDoctorBlog, setCurrentDoctorBlog] = useState({
    id: '',
    title: '',
    category: 'Orthopaedics',
    tag: 'Case Study',
    excerpt: '',
    content: '',
    date: '',
    readTime: '5 min read',
    image: '',
    videoUrl: '',
    mediaType: 'image' // 'image' | 'video'
  })
  const [isEditingDoctorBlog, setIsEditingDoctorBlog] = useState(false)
  const [blogBlocks, setBlogBlocks] = useState([{ id: '1', type: 'paragraph', value: '' }])
  const [doctorBlogBlocks, setDoctorBlogBlocks] = useState([{ id: '1', type: 'paragraph', value: '' }])
  const [currentJob, setCurrentJob] = useState({ title: '', department: 'Orthopedics', location: 'LB Nagar, Hyd', experience: '', description: '', status: 'Active' })
  const [isEditingJob, setIsEditingJob] = useState(false)
  const [currentBlog, setCurrentBlog] = useState({ title: '', category: 'Orthopaedics', tag: 'Case Study', body: '', status: 'Active', slug: '', seoTitle: '', seoDesc: '', readTime: '5 min read', image: '' })
  const [isEditingBlog, setIsEditingBlog] = useState(false)
  const [currentFaq, setCurrentFaq] = useState({ question: '', answer: '', category: 'General' })
  const [isEditingFaq, setIsEditingFaq] = useState(false)
  const [currentDept, setCurrentDept] = useState({ id: 'ortho', name: '', description: '', treatments: '', faqCategory: 'Treatments' })
  const [currentTestimonial, setCurrentTestimonial] = useState({ patientName: '', rating: 5, review: '', videoUrl: '', page: 'General / Home' })
  const [currentDownload, setCurrentDownload] = useState({ name: '', url: '', category: 'PDFs', size: '1.2 MB' })
  const [currentNews, setCurrentNews] = useState({ title: '', type: 'News', date: '', content: '' })

  // Page-wise Selected States
  const [selectedBranchSlug, setSelectedBranchSlug] = useState('ecil')
  const [selectedSeoPage, setSelectedSeoPage] = useState('homepage')
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false)
  const [doctorFilterDropdownOpen, setDoctorFilterDropdownOpen] = useState(false)

  // Media Library Helpers
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [newMediaFile, setNewMediaFile] = useState({ name: '', type: 'image', size: '120 KB', folder: 'Images', url: '' })
  const [showMediaPickerModal, setShowMediaPickerModal] = useState(false)
  const [mediaTargetField, setMediaTargetField] = useState(null) // Callback to update field with media url

  // Click simulation state
  const [showHeatmapOverlay, setShowHeatmapOverlay] = useState(false)
  
  // 1. Initial Load & Synchronization
  useEffect(() => {
    // Check Auth state
    if (!auth) {
      console.log('Firebase auth bypassed. Loading simulated dashboard.')
      setUser({ email: 'superadmin@srikara.com' })
      setUserRole('Super Admin')
      setUserPermissions(getEffectivePermissions({ role: 'Super Admin', active: true }))
      setProfileChecked(true)
    } else {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser)
        if (currentUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
            if (userDoc.exists()) {
              const profile = userDoc.data()
              setUserRole(profile.role || null)
              setUserPermissions(getEffectivePermissions(profile))
              adjustGroupForRole(profile.role)
            } else {
              // No provisioned admin profile — do NOT default to Super Admin.
              // Closes a privilege-escalation gap where any authenticated Firebase
              // user with no users/{uid} doc used to silently get full access.
              setUserRole(null)
              setUserPermissions([])
            }
          } catch (e) {
            setUserRole(null)
            setUserPermissions([])
          } finally {
            setProfileChecked(true)
          }
        } else {
          setProfileChecked(false)
        }
      })
      return () => unsubscribe()
    }
  }, [])

  // Sync to/from LocalStorage or Firestore
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      if (db) {
        try {
          // 1. Load Doctors
          try {
            const docSnap = await getDocs(collection(db, 'doctors'))
            const fbDocs = docSnap.docs.map(d => ({ id: d.id, ...d.data() }))
            const formattedFbDocs = fbDocs.map(d => {
              const docSlug = d.slug || d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
              const defaultMedia = DOCTOR_MEDIA[docSlug] || DOCTOR_MEDIA['default']
              const initialBlogs = d.blogs !== undefined ? d.blogs : (defaultMedia?.blogs || [])
              return {
                ...d,
                blogs: initialBlogs
              }
            })
            const formattedStatic = ALL_DOCTORS.map(d => {
              const docSlug = d.slug || d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
              const defaultMedia = DOCTOR_MEDIA[docSlug] || DOCTOR_MEDIA['default']
              const initialBlogs = d.blogs !== undefined ? d.blogs : (defaultMedia?.blogs || [])
              return {
                id: String(d.id),
                name: d.name,
                specialty: d.specialty,
                specialtyId: d.specialtyId || 'ortho',
                sub: d.sub || '',
                exp: d.exp || '10+ Years',
                branch: d.branch || 'LB Nagar',
                availability: d.availability || 'Mon - Sat: 10 AM - 5 PM',
                photoUrl: d.image || d.photoUrl || '',
                status: 'Active',
                bio: d.about || d.bio || '',
                languages: Array.isArray(d.languages) ? d.languages.join(', ') : d.languages || 'English',
                tagline: d.tagline || '',
                education: Array.isArray(d.education) ? d.education.join(', ') : d.education || '',
                blogs: initialBlogs
              }
            }).filter(sd => !formattedFbDocs.some(fd => fd.name.toLowerCase() === sd.name.toLowerCase()))

            setDoctors([...formattedFbDocs, ...formattedStatic])
          } catch (err) {
            console.error('Failed to load doctors from Firestore', err)
          }
          
          // 2. Load Jobs
          try {
            const jobSnap = await getDocs(collection(db, 'job_openings'))
            if (jobSnap.empty) {
              for (const jobItem of DEFAULT_JOBS) {
                await setDoc(doc(db, 'job_openings', String(jobItem.id)), jobItem)
              }
              setJobs(DEFAULT_JOBS)
            } else {
              setJobs(jobSnap.docs.map(j => ({ id: j.id, ...j.data() })))
            }
          } catch (err) {
            console.error('Failed to load jobs from Firestore', err)
          }

          // 3. Load Appointments
          if (hasAccess('appointments')) {
            try {
              const appSnap = await getDocs(collection(db, 'appointments'))
              if (appSnap.empty) {
                for (const appItem of DEFAULT_APPOINTMENTS) {
                  await setDoc(doc(db, 'appointments', String(appItem.id)), appItem)
                }
                setAppointments(DEFAULT_APPOINTMENTS)
              } else {
                const loadedAppts = appSnap.docs.map(a => ({ id: a.id, ...a.data() }))
                loadedAppts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
                setAppointments(loadedAppts)
              }
            } catch (err) {
              console.error('Failed to load appointments from Firestore', err)
            }
          } else {
            setAppointments([])
          }

          // 4. Load Blogs
          try {
            const blogSnap = await getDocs(collection(db, 'blogs'))
            const fbBlogs = blogSnap.docs.map(b => ({ id: b.id, ...b.data() }))
            const filteredStaticBlogs = DEFAULT_BLOGS.map(b => ({
              id: String(b.id),
              title: b.title,
              category: b.category,
              tag: b.tag || 'Clinical',
              body: b.body || b.content || '',
              status: b.status || 'Active',
              slug: b.slug || b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              seoTitle: b.seoTitle || b.title,
              seoDesc: b.seoDesc || b.excerpt || '',
              readTime: b.readTime || '5 min read',
              image: b.image || ''
            })).filter(sb => !fbBlogs.some(fb => fb.title.toLowerCase() === sb.title.toLowerCase()))

            setBlogs([...fbBlogs, ...filteredStaticBlogs])
          } catch (err) {
            console.error('Failed to load blogs from Firestore', err)
          }

          // 5. Load FAQs
          try {
            const faqSnap = await getDocs(collection(db, 'faqs'))
            if (faqSnap.empty) {
              for (const faqItem of DEFAULT_FAQS) {
                await setDoc(doc(db, 'faqs', String(faqItem.id)), faqItem)
              }
              setFaqs(DEFAULT_FAQS)
            } else {
              setFaqs(faqSnap.docs.map(f => ({ id: f.id, ...f.data() })))
            }
          } catch (err) {
            console.error('Failed to load FAQs from Firestore', err)
          }

          // 6. Load Departments
          try {
            const deptSnap = await getDocs(collection(db, 'departments'))
            const storedDepts = deptSnap.docs.map(d => ({ id: d.id, ...d.data() }))
            const deptMetaRef = doc(db, 'site_contents', 'meta')
            const deptMetaSnap = await getDoc(deptMetaRef)
            const deptSeedVersion = deptMetaSnap.exists() ? (deptMetaSnap.data().departmentsSeedVersion || 1) : 1
            if (deptSnap.empty || deptSeedVersion < DEPARTMENTS_SEED_VERSION) {
              const missingDepts = missingDefaultDepartments(storedDepts)
              for (const deptItem of missingDepts) {
                await setDoc(doc(db, 'departments', String(deptItem.id)), deptItem)
              }
              await setDoc(deptMetaRef, { departmentsSeedVersion: DEPARTMENTS_SEED_VERSION }, { merge: true })
              setDepartments([...storedDepts, ...missingDepts])
            } else {
              setDepartments(storedDepts)
            }
          } catch (err) {
            console.error('Failed to load departments from Firestore', err)
          }

          // 7. Load Testimonials
          try {
            const testSnap = await getDocs(collection(db, 'testimonials'))
            const storedTestimonials = testSnap.docs.map(t => ({ id: t.id, ...t.data() }))
            const testMetaRef = doc(db, 'site_contents', 'meta')
            const testMetaSnap = await getDoc(testMetaRef)
            const testimonialsSeeded = testMetaSnap.exists() ? (testMetaSnap.data().testimonialsSeededVersion || 0) : 0
            
            if (testSnap.empty) {
              for (const testItem of DEFAULT_TESTIMONIALS) {
                await setDoc(doc(db, 'testimonials', String(testItem.id)), testItem)
              }
              await setDoc(testMetaRef, { testimonialsSeededVersion: 1 }, { merge: true })
              setTestimonials(DEFAULT_TESTIMONIALS)
            } else {
              setTestimonials(storedTestimonials)
            }
          } catch (err) {
            console.error('Failed to load testimonials from Firestore', err)
          }

          // 8. Load Downloads
          try {
            const dlSnap = await getDocs(collection(db, 'downloads'))
            if (dlSnap.empty) {
              for (const dlItem of DEFAULT_DOWNLOADS) {
                await setDoc(doc(db, 'downloads', String(dlItem.id)), dlItem)
              }
              setDownloads(DEFAULT_DOWNLOADS)
            } else {
              setDownloads(dlSnap.docs.map(d => ({ id: d.id, ...d.data() })))
            }
          } catch (err) {
            console.error('Failed to load downloads from Firestore', err)
          }

          // 9. Load News
          try {
            const newsSnap = await getDocs(collection(db, 'news'))
            if (newsSnap.empty) {
              for (const newsItem of DEFAULT_NEWS) {
                await setDoc(doc(db, 'news', String(newsItem.id)), newsItem)
              }
              setNews(DEFAULT_NEWS)
            } else {
              setNews(newsSnap.docs.map(n => ({ id: n.id, ...n.data() })))
            }
          } catch (err) {
            console.error('Failed to load news from Firestore', err)
          }

          // 10. Load Site Page Contents
          try {
            const pageRef = doc(db, 'site_contents', 'pages')
            const pageSnap = await getDoc(pageRef)
            if (pageSnap.exists()) {
              setPageData(mergeWithDefaults(pageSnap.data()))
            } else {
              await setDoc(pageRef, DEFAULT_PAGE_DATA)
              setPageData(DEFAULT_PAGE_DATA)
            }
          } catch (err) {
            console.error('Failed to load page data from Firestore', err)
          }

          // 11. Load SEO contents
          try {
            const seoRef = doc(db, 'site_contents', 'seo')
            const seoSnap = await getDoc(seoRef)
            if (seoSnap.exists()) {
              setSeoData(seoSnap.data())
            } else {
              await setDoc(seoRef, DEFAULT_SEO_DATA)
              setSeoData(DEFAULT_SEO_DATA)
            }
          } catch (err) {
            console.error('Failed to load SEO data from Firestore', err)
          }

          // 12. Load Media Files
          try {
            const mediaSnap = await getDocs(collection(db, 'media'))
            if (mediaSnap.empty) {
              for (const mediaItem of DEFAULT_MEDIA) {
                await setDoc(doc(db, 'media', String(mediaItem.id)), mediaItem)
              }
              setMediaFiles(DEFAULT_MEDIA)
            } else {
              setMediaFiles(mediaSnap.docs.map(m => ({ id: m.id, ...m.data() })))
            }
          } catch (err) {
            console.error('Failed to load media from Firestore', err)
          }

          // 13. Load Analytics Events
          if (hasAccess('analytics') || hasAccess('heatmaps')) {
            try {
              const analyticsSnap = await getDocs(collection(db, 'analytics_events'))
              setAnalyticsEvents(analyticsSnap.docs.map(e => ({ id: e.id, ...e.data() })))
            } catch (err) {
              console.error('Failed to load analytics events from Firestore', err)
            }
          } else {
            setAnalyticsEvents([])
          }

          // 14. Load Audit Logs
          if (hasAccess('history')) {
            try {
              const auditSnap = await getDocs(collection(db, 'audit_logs'))
              const loadedLogs = auditSnap.docs.map(e => ({ id: e.id, ...e.data() }))
              loadedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              setHistoryLogs(loadedLogs)
            } catch (err) {
              console.error('Failed to load audit logs from Firestore', err)
            }
          } else {
            setHistoryLogs([])
          }

        } catch (err) {
          console.error('Firestore loading failed, falling back to local storage', err)
          loadFromLocalStorage()
        } finally {
          setLoading(false)
        }
      } else {
        loadFromLocalStorage()
        setLoading(false)
      }
    }
    initializeData()
  }, [user])

  const loadFromLocalStorage = () => {
    try {
      const storedLogs = localStorage.getItem('history_logs')
      if (storedLogs) {
        setHistoryLogs(JSON.parse(storedLogs))
      } else {
        setHistoryLogs([])
      }
      const data = localStorage.getItem('srikara_cms_data')
      let loadedDocs = []
      let loadedBlogs = []
      
      if (data) {
        const parsed = JSON.parse(data)
        loadedDocs = (parsed.doctors || []).map(d => {
          const docSlug = d.slug || d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const defaultMedia = DOCTOR_MEDIA[docSlug] || DOCTOR_MEDIA['default']
          const initialBlogs = d.blogs !== undefined ? d.blogs : (defaultMedia?.blogs || [])
          return {
            ...d,
            blogs: initialBlogs
          }
        })
        loadedBlogs = parsed.blogs || []
        
        setJobs(parsed.jobs || DEFAULT_JOBS)
        setAppointments(parsed.appointments || DEFAULT_APPOINTMENTS)
        setFaqs(parsed.faqs || DEFAULT_FAQS)
        setMediaFiles(parsed.mediaFiles || DEFAULT_MEDIA)
        const storedDepts = parsed.departments || []
        if (!parsed.departments || (parsed.departmentsSeedVersion || 1) < DEPARTMENTS_SEED_VERSION) {
          const mergedDepts = [...storedDepts, ...missingDefaultDepartments(storedDepts)]
          setDepartments(mergedDepts)
          parsed.departments = mergedDepts
          parsed.departmentsSeedVersion = DEPARTMENTS_SEED_VERSION
          localStorage.setItem('srikara_cms_data', JSON.stringify(parsed))
        } else {
          setDepartments(storedDepts)
        }
        setTestimonials(parsed.testimonials || DEFAULT_TESTIMONIALS)
        setDownloads(parsed.downloads || DEFAULT_DOWNLOADS)
        setNews(parsed.news || DEFAULT_NEWS)
        setPageData(mergeWithDefaults(parsed.pageData))
        setSeoData(parsed.seoData || DEFAULT_SEO_DATA)
      } else {
        loadedDocs = []
        loadedBlogs = []
        setJobs(DEFAULT_JOBS)
        setAppointments(DEFAULT_APPOINTMENTS)
        setMediaFiles(DEFAULT_MEDIA)
        setFaqs(DEFAULT_FAQS)
        setDepartments(DEFAULT_DEPARTMENTS)
        setTestimonials(DEFAULT_TESTIMONIALS)
        setDownloads(DEFAULT_DOWNLOADS)
        setNews(DEFAULT_NEWS)
        setPageData(DEFAULT_PAGE_DATA)
        setSeoData(DEFAULT_SEO_DATA)
      }

      // Merge ALL_DOCTORS static list
      const formattedStatic = ALL_DOCTORS.map(d => {
        const docSlug = d.slug || d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        const defaultMedia = DOCTOR_MEDIA[docSlug] || DOCTOR_MEDIA['default']
        const initialBlogs = d.blogs !== undefined ? d.blogs : (defaultMedia?.blogs || [])
        return {
          id: String(d.id),
          name: d.name,
          specialty: d.specialty,
          specialtyId: d.specialtyId || 'ortho',
          sub: d.sub || '',
          exp: d.exp || '10+ Years',
          branch: d.branch || 'LB Nagar',
          availability: d.availability || 'Mon - Sat: 10 AM - 5 PM',
          photoUrl: d.image || d.photoUrl || '',
          status: 'Active',
          bio: d.about || d.bio || '',
          languages: Array.isArray(d.languages) ? d.languages.join(', ') : d.languages || 'English',
          tagline: d.tagline || '',
          education: Array.isArray(d.education) ? d.education.join(', ') : d.education || '',
          blogs: initialBlogs
        }
      }).filter(sd => !loadedDocs.some(fd => fd.name.toLowerCase() === sd.name.toLowerCase()))

      setDoctors([...loadedDocs, ...formattedStatic])

      // Merge DEFAULT_BLOGS static articles
      const filteredStaticBlogs = DEFAULT_BLOGS.map(b => ({
        id: String(b.id),
        title: b.title,
        category: b.category,
        tag: b.tag || 'Clinical',
        body: b.body || b.content || '',
        status: b.status || 'Active',
        slug: b.slug || b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        seoTitle: b.seoTitle || b.title,
        seoDesc: b.seoDesc || b.excerpt || '',
        readTime: b.readTime || '5 min read',
        image: b.image || ''
      })).filter(sb => !loadedBlogs.some(fb => fb.title.toLowerCase() === sb.title.toLowerCase()))

      setBlogs([...loadedBlogs, ...filteredStaticBlogs])

    } catch (e) {
      console.warn('Error loading from local storage', e)
    }
  }

  const persistToStore = async (key, updatedData) => {
    // 1. LocalStorage Sync
    try {
      const data = localStorage.getItem('srikara_cms_data')
      const store = data ? JSON.parse(data) : {}
      store[key] = updatedData
      localStorage.setItem('srikara_cms_data', JSON.stringify(store))
    } catch (e) {
      console.error('Local Storage write error', e)
    }

    // 2. Firebase Database Sync
    if (db) {
      try {
        if (['pageData', 'seoData'].includes(key)) {
          const docName = key === 'pageData' ? 'pages' : 'seo'
          await setDoc(doc(db, 'site_contents', docName), updatedData)
        } else {
          console.log(`Synced dynamic collection ${key} to Firestore.`)
        }
      } catch (err) {
        console.warn(`Firestore sync error for key ${key}: ${err.message}`)
      }
    }
  }

  const adjustGroupForRole = (role) => {
    if (role === 'HR') {
      setActiveGroup('category')
      setActiveTab('jobs')
      setExpandedGroups({ overview: false, category: true, page: false, seo: false, admin: false })
    } else if (role === 'Doctor Admin') {
      setActiveGroup('category')
      setActiveTab('doctors')
      setExpandedGroups({ overview: false, category: true, page: false, seo: false, admin: false })
    } else if (role === 'Reception') {
      setActiveGroup('overview')
      setActiveTab('appointments')
      setExpandedGroups({ overview: true, category: false, page: false, seo: false, admin: role === 'Super Admin' })
    } else if (role === 'Marketing Admin') {
      setActiveGroup('overview')
      setActiveTab('analytics')
      setExpandedGroups({ overview: true, category: false, page: false, seo: false, admin: role === 'Super Admin' })
    } else {
      setActiveGroup('overview')
      setActiveTab('analytics')
      setExpandedGroups({ overview: true, category: false, page: false, seo: false, admin: role === 'Super Admin' })
    }
  }

  // 2. Authentication Flow
  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    
    if (!auth) {
      const mockLogin = (role) => {
        setUser({ email })
        setUserRole(role)
        setUserPermissions(getEffectivePermissions({ role, active: true }))
        setProfileChecked(true)
        adjustGroupForRole(role)
      }
      if (email === 'admin@srikara.com' && password === 'admin123') {
        mockLogin('Super Admin')
      } else if (email === 'hr@srikara.com' && password === 'admin123') {
        mockLogin('HR')
      } else if (email === 'marketing@srikara.com' && password === 'admin123') {
        mockLogin('Marketing Admin')
      } else if (email === 'reception@srikara.com' && password === 'admin123') {
        mockLogin('Reception')
      } else if (email === 'doctoradmin@srikara.com' && password === 'admin123') {
        mockLogin('Doctor Admin')
      } else {
        setAuthError('Mock Credentials: admin@srikara.com / admin123 (or hr@, marketing@, reception@, doctoradmin@srikara.com)')
      }
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setAuthError('Authentication failed. Check your password.')
    }
  }

  const handleLogout = async () => {
    if (!auth) {
      setUser(null)
      return
    }
    await signOut(auth)
  }

  // hasAccess is the single gate used across the sidebar and content panels.
  // admin_users is intentionally never read from userPermissions — it is always
  // derived directly from role so it can't be granted via extraPermissions.
  const hasAccess = (moduleKey) => {
    if (moduleKey === 'admin_users') return userRole === 'Super Admin'
    return userRole === 'Super Admin' || userPermissions.includes(moduleKey)
  }

  const notifyUser = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const requestConfirm = (title, message, onConfirm, confirmLabel = 'Delete') => {
    setConfirmDialog({ open: true, title, message, confirmLabel, onConfirm })
  }
  const closeConfirm = () => setConfirmDialog({ open: false, title: '', message: '', confirmLabel: 'Delete', onConfirm: null })
  const handleConfirmAccept = async () => {
    const action = confirmDialog.onConfirm
    closeConfirm()
    if (action) await action()
  }

  const logChange = async (actionType, collectionName, itemId, itemName, previousState = null, currentState = null) => {
    const timestamp = new Date().toISOString()
    const performedBy = user?.email || 'Admin Editor'
    const newLog = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
      actionType,
      collectionName,
      itemId,
      itemName,
      previousState: previousState ? JSON.parse(JSON.stringify(previousState)) : null,
      currentState: currentState ? JSON.parse(JSON.stringify(currentState)) : null,
      timestamp,
      performedBy
    }
    
    setHistoryLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 100)
      localStorage.setItem('history_logs', JSON.stringify(updated))
      return updated
    })
    
    if (db) {
      try {
        await setDoc(doc(db, 'audit_logs', newLog.id), newLog)
      } catch (err) {
        console.error('Failed to save audit log:', err)
      }
    }
  }

  const deleteLogEntry = (logId) => {
    requestConfirm(
      'Delete Log Entry',
      'Delete this history log entry permanently?',
      async () => {
        const updated = historyLogs.filter(l => String(l.id) !== String(logId))
        setHistoryLogs(updated)
        localStorage.setItem('history_logs', JSON.stringify(updated))
        if (db) {
          try {
            await deleteDoc(doc(db, 'audit_logs', logId))
          } catch (err) {
            console.error('Failed to delete log entry from firestore:', err)
          }
        }
        notifyUser('success', 'Log entry removed.')
      },
      'Delete'
    )
  }

  const revertLogEntry = (log) => {
    requestConfirm(
      'Revert Change',
      `Are you sure you want to revert this "${log.actionType}" action on ${log.collectionName}?`,
      async () => {
        try {
          const { collectionName, itemId, previousState, currentState, actionType } = log

          if (actionType === 'Update') {
            if (!previousState) return notifyUser('error', 'Cannot revert: no previous state recorded.')

            if (collectionName === 'doctors') {
              const updated = doctors.map(d => String(d.id) === String(itemId) ? previousState : d)
              setDoctors(updated)
              await persistToStore('doctors', updated)
              if (db) await setDoc(doc(db, 'doctors', itemId), previousState)
            }
            else if (collectionName === 'testimonials') {
              const updated = testimonials.map(t => String(t.id) === String(itemId) ? previousState : t)
              setTestimonials(updated)
              await persistToStore('testimonials', updated)
              if (db) await setDoc(doc(db, 'testimonials', itemId), previousState)
            }
            else if (collectionName === 'blogs') {
              const updated = blogs.map(b => String(b.id) === String(itemId) ? previousState : b)
              setBlogs(updated)
              await persistToStore('blogs', updated)
              if (db) await setDoc(doc(db, 'blogs', itemId), previousState)
            }
            else if (collectionName === 'faqs') {
              const updated = faqs.map(f => String(f.id) === String(itemId) ? previousState : f)
              setFaqs(updated)
              await persistToStore('faqs', updated)
              if (db) await setDoc(doc(db, 'faqs', itemId), previousState)
            }
            else if (collectionName === 'jobs') {
              const updated = jobs.map(j => String(j.id) === String(itemId) ? previousState : j)
              setJobs(updated)
              await persistToStore('jobs', updated)
              if (db) await setDoc(doc(db, 'jobs', itemId), previousState)
            }
            else if (collectionName === 'downloads') {
              const updated = downloads.map(d => String(d.id) === String(itemId) ? previousState : d)
              setDownloads(updated)
              await persistToStore('downloads', updated)
              if (db) await setDoc(doc(db, 'downloads', itemId), previousState)
            }
            else if (collectionName === 'departments') {
              const updated = departments.map(d => String(d.id) === String(itemId) ? previousState : d)
              setDepartments(updated)
              await persistToStore('departments', updated)
              if (db) await setDoc(doc(db, 'departments', itemId), previousState)
            }
            else if (collectionName === 'news') {
              const updated = news.map(n => String(n.id) === String(itemId) ? previousState : n)
              setNews(updated)
              await persistToStore('news', updated)
              if (db) await setDoc(doc(db, 'news', itemId), previousState)
            }
            else if (collectionName === 'site_contents') {
              const updated = { ...pageData, [itemId]: previousState }
              setPageData(updated)
              await persistToStore('pageData', updated)
            }
            else if (collectionName === 'branches') {
              if (log.itemName && log.itemName.startsWith('Location details:')) {
                const updatedList = branchesList.map(b => b.slug === itemId ? previousState : b).filter(Boolean)
                setBranchesList(updatedList)
                localStorage.setItem('srikara_branches', JSON.stringify(updatedList))
                
                const pageDataBranchesCopy = { ...pageData.branches }
                if (previousState) {
                  pageDataBranchesCopy[itemId] = {
                    ...pageDataBranchesCopy[itemId],
                    phone: previousState.phone,
                    address: previousState.address,
                    rating: previousState.googleRating,
                    heroImage: previousState.heroImage
                  }
                } else {
                  delete pageDataBranchesCopy[itemId]
                }
                const updatedPageData = { ...pageData, branches: pageDataBranchesCopy, branchesList: updatedList }
                setPageData(updatedPageData)
                await persistToStore('pageData', updatedPageData)
                refetchBranches()
              } else {
                const updatedBranches = { ...pageData.branches, [itemId]: previousState }
                const updatedPageData = { ...pageData, branches: updatedBranches }
                setPageData(updatedPageData)
                await persistToStore('pageData', updatedPageData)
              }
            }
            else if (collectionName === 'seo') {
              const updated = { ...seoData, [itemId]: previousState }
              setSeoData(updated)
              await persistToStore('seoData', updated)
            }
            else if (collectionName === 'users') {
              setAdminUsers(prev => prev.map(a => a.id === itemId ? previousState : a))
              if (db) {
                await setDoc(doc(db, 'users', itemId), previousState)
              } else {
                const storedAdmins = localStorage.getItem('srikara_mock_admins')
                if (storedAdmins) {
                  const updatedAdmins = JSON.parse(storedAdmins).map(a => a.id === itemId ? previousState : a)
                  localStorage.setItem('srikara_mock_admins', JSON.stringify(updatedAdmins))
                }
              }
            }

            await logChange('Restore', collectionName, itemId, log.itemName, currentState, previousState)
            notifyUser('success', 'Changes reverted successfully.')
          }

          else if (actionType === 'Delete') {
            const stateToRestore = previousState || currentState
            if (!stateToRestore) return notifyUser('error', 'Cannot revert: no item state found.')

            const restoredItem = { ...stateToRestore, status: 'Active', deletedAt: null, deletedBy: null }

            if (collectionName === 'doctors') {
              const exists = doctors.some(d => String(d.id) === String(itemId))
              const updated = exists ? doctors.map(d => String(d.id) === String(itemId) ? restoredItem : d) : [...doctors, restoredItem]
              setDoctors(updated)
              await persistToStore('doctors', updated)
              if (db) await setDoc(doc(db, 'doctors', itemId), restoredItem)
            }
            else if (collectionName === 'testimonials') {
              const restoredTestimonial = { ...stateToRestore, status: 'Active', deletedAt: null, deletedBy: null }
              const exists = testimonials.some(t => String(t.id) === String(itemId))
              const updated = exists ? testimonials.map(t => String(t.id) === String(itemId) ? restoredTestimonial : t) : [...testimonials, restoredTestimonial]
              setTestimonials(updated)
              await persistToStore('testimonials', updated)
              if (db) await setDoc(doc(db, 'testimonials', itemId), restoredTestimonial)
            }
            else if (collectionName === 'blogs') {
              const restoredBlog = { ...stateToRestore, status: 'Active', deletedAt: null, deletedBy: null }
              const exists = blogs.some(b => String(b.id) === String(itemId))
              const updated = exists ? blogs.map(b => String(b.id) === String(itemId) ? restoredBlog : b) : [...blogs, restoredBlog]
              setBlogs(updated)
              await persistToStore('blogs', updated)
              if (db) await setDoc(doc(db, 'blogs', itemId), restoredBlog)
            }
            else if (collectionName === 'faqs') {
              const restoredFaq = { ...stateToRestore, status: 'Active', deletedAt: null, deletedBy: null }
              const exists = faqs.some(f => String(f.id) === String(itemId))
              const updated = exists ? faqs.map(f => String(f.id) === String(itemId) ? restoredFaq : f) : [...faqs, restoredFaq]
              setFaqs(updated)
              await persistToStore('faqs', updated)
              if (db) await setDoc(doc(db, 'faqs', itemId), restoredFaq)
            }
            else if (collectionName === 'jobs') {
              const restoredJob = { ...stateToRestore, status: 'Active', deletedAt: null, deletedBy: null }
              const exists = jobs.some(j => String(j.id) === String(itemId))
              const updated = exists ? jobs.map(j => String(j.id) === String(itemId) ? restoredJob : j) : [...jobs, restoredJob]
              setJobs(updated)
              await persistToStore('jobs', updated)
              if (db) await setDoc(doc(db, 'jobs', itemId), restoredJob)
            }
            else if (collectionName === 'downloads') {
              const restoredDownload = { ...stateToRestore, status: 'Active', deletedAt: null, deletedBy: null }
              const exists = downloads.some(d => String(d.id) === String(itemId))
              const updated = exists ? downloads.map(d => String(d.id) === String(itemId) ? restoredDownload : d) : [...downloads, restoredDownload]
              setDownloads(updated)
              await persistToStore('downloads', updated)
              if (db) await setDoc(doc(db, 'downloads', itemId), restoredDownload)
            }
            else if (collectionName === 'departments') {
              const restoredDept = { ...stateToRestore, status: 'Active', deletedAt: null, deletedBy: null }
              const exists = departments.some(d => String(d.id) === String(itemId))
              const updated = exists ? departments.map(d => String(d.id) === String(itemId) ? restoredDept : d) : [...departments, restoredDept]
              setDepartments(updated)
              await persistToStore('departments', updated)
              if (db) await setDoc(doc(db, 'departments', itemId), restoredDept)
            }
            else if (collectionName === 'news') {
              const restoredNews = { ...stateToRestore, status: 'Active', deletedAt: null, deletedBy: null }
              const exists = news.some(n => String(n.id) === String(itemId))
              const updated = exists ? news.map(n => String(n.id) === String(itemId) ? restoredNews : n) : [...news, restoredNews]
              setNews(updated)
              await persistToStore('news', updated)
              if (db) await setDoc(doc(db, 'news', itemId), restoredNews)
            }
            else if (collectionName === 'appointments') {
              const exists = appointments.some(a => String(a.id) === String(itemId))
              const updated = exists ? appointments.map(a => String(a.id) === String(itemId) ? stateToRestore : a) : [...appointments, stateToRestore]
              setAppointments(updated)
              await persistToStore('appointments', updated)
              if (db) await setDoc(doc(db, 'appointments', itemId), stateToRestore)
            }
            else if (collectionName === 'branches') {
              const exists = branchesList.some(b => b.slug === itemId)
              const updatedList = exists ? branchesList.map(b => b.slug === itemId ? stateToRestore : b) : [...branchesList, stateToRestore]
              setBranchesList(updatedList)
              localStorage.setItem('srikara_branches', JSON.stringify(updatedList))
              
              const pageDataBranchesCopy = { ...pageData.branches }
              pageDataBranchesCopy[itemId] = {
                heroHeadline: pageDataBranchesCopy[itemId]?.heroHeadline || "Advanced Surgical Center",
                heroHighlight: pageDataBranchesCopy[itemId]?.heroHighlight || "Orthopedic Excellence",
                description: pageDataBranchesCopy[itemId]?.description || stateToRestore.address,
                phone: stateToRestore.phone,
                address: stateToRestore.address,
                rating: stateToRestore.googleRating,
                heroImage: stateToRestore.heroImage,
                advantageTitle: pageDataBranchesCopy[itemId]?.advantageTitle || `The ${stateToRestore.title}`,
                advantageHighlight: pageDataBranchesCopy[itemId]?.advantageHighlight || "Advantage",
                infraTitle: pageDataBranchesCopy[itemId]?.infraTitle || "Precision",
                infraHighlight: pageDataBranchesCopy[itemId]?.infraHighlight || "Ecosystem",
                infraDesc: pageDataBranchesCopy[itemId]?.infraDesc || "We invest in the future of healthcare..."
              }
              const updatedPageData = { ...pageData, branches: pageDataBranchesCopy, branchesList: updatedList }
              setPageData(updatedPageData)
              await persistToStore('pageData', updatedPageData)
              refetchBranches()
            }
            else if (collectionName === 'media') {
              const exists = mediaFiles.some(m => String(m.id) === String(itemId))
              const updated = exists ? mediaFiles.map(m => String(m.id) === String(itemId) ? stateToRestore : m) : [...mediaFiles, stateToRestore]
              setMediaFiles(updated)
              persistToStore('mediaFiles', updated)
              if (db) await setDoc(doc(db, 'media', itemId), stateToRestore)
            }
            else if (collectionName === 'users') {
              const exists = adminUsers.some(a => String(a.id) === String(itemId))
              const updated = exists ? adminUsers.map(a => String(a.id) === String(itemId) ? stateToRestore : a) : [...adminUsers, stateToRestore]
              setAdminUsers(updated)
              if (db) {
                await setDoc(doc(db, 'users', itemId), stateToRestore)
              } else {
                localStorage.setItem('srikara_mock_admins', JSON.stringify(updated))
              }
            }

            await logChange('Restore', collectionName, itemId, log.itemName, null, restoredItem)
            notifyUser('success', 'Item restored successfully.')
          }

          else if (actionType === 'Create') {
            if (collectionName === 'doctors') {
              const updated = doctors.filter(d => String(d.id) !== String(itemId))
              setDoctors(updated)
              await persistToStore('doctors', updated)
              if (db) await deleteDoc(doc(db, 'doctors', itemId))
            }
            else if (collectionName === 'testimonials') {
              const updated = testimonials.filter(t => String(t.id) !== String(itemId))
              setTestimonials(updated)
              await persistToStore('testimonials', updated)
              if (db) await deleteDoc(doc(db, 'testimonials', itemId))
            }
            else if (collectionName === 'blogs') {
              const updated = blogs.filter(b => String(b.id) !== String(itemId))
              setBlogs(updated)
              await persistToStore('blogs', updated)
              if (db) await deleteDoc(doc(db, 'blogs', itemId))
            }
            else if (collectionName === 'faqs') {
              const updated = faqs.filter(f => String(f.id) !== String(itemId))
              setFaqs(updated)
              await persistToStore('faqs', updated)
              if (db) await deleteDoc(doc(db, 'faqs', itemId))
            }
            else if (collectionName === 'jobs') {
              const updated = jobs.filter(j => String(j.id) !== String(itemId))
              setJobs(updated)
              await persistToStore('jobs', updated)
              if (db) await deleteDoc(doc(db, 'jobs', itemId))
            }
            else if (collectionName === 'downloads') {
              const updated = downloads.filter(d => String(d.id) !== String(itemId))
              setDownloads(updated)
              await persistToStore('downloads', updated)
              if (db) await deleteDoc(doc(db, 'downloads', itemId))
            }
            else if (collectionName === 'departments') {
              const updated = departments.filter(d => String(d.id) !== String(itemId))
              setDepartments(updated)
              await persistToStore('departments', updated)
              if (db) await deleteDoc(doc(db, 'departments', itemId))
            }
            else if (collectionName === 'news') {
              const updated = news.filter(n => String(n.id) !== String(itemId))
              setNews(updated)
              await persistToStore('news', updated)
              if (db) await deleteDoc(doc(db, 'news', itemId))
            }
            else if (collectionName === 'appointments') {
              const updated = appointments.filter(a => String(a.id) !== String(itemId))
              setAppointments(updated)
              await persistToStore('appointments', updated)
              if (db) await deleteDoc(doc(db, 'appointments', itemId))
            }
            else if (collectionName === 'branches') {
              const updatedList = branchesList.filter(b => b.slug !== itemId)
              setBranchesList(updatedList)
              localStorage.setItem('srikara_branches', JSON.stringify(updatedList))
              
              const pageDataBranchesCopy = { ...pageData.branches }
              delete pageDataBranchesCopy[itemId]
              const updatedPageData = { ...pageData, branches: pageDataBranchesCopy, branchesList: updatedList }
              setPageData(updatedPageData)
              await persistToStore('pageData', updatedPageData)
              refetchBranches()
            }
            else if (collectionName === 'media') {
              const updated = mediaFiles.filter(m => String(m.id) !== String(itemId))
              setMediaFiles(updated)
              persistToStore('mediaFiles', updated)
              if (db) await deleteDoc(doc(db, 'media', itemId))
            }
            else if (collectionName === 'users') {
              const updated = adminUsers.filter(a => String(a.id) !== String(itemId))
              setAdminUsers(updated)
              if (db) {
                await deleteDoc(doc(db, 'users', itemId))
              } else {
                localStorage.setItem('srikara_mock_admins', JSON.stringify(updated))
              }
            }

            await logChange('Delete', collectionName, itemId, log.itemName, currentState, null)
            notifyUser('success', 'Creation reverted successfully (item deleted).')
          }
        } catch (err) {
          console.error('Failed to revert log entry:', err)
          notifyUser('error', 'Failed to revert action.')
        }
      },
      'Revert'
    )
  }

  // 2b. Admin User Management (Super Admin only)
  const loadAdminUsers = async () => {
    if (!db) {
      try {
        const storedAdmins = localStorage.getItem('srikara_mock_admins')
        if (storedAdmins) {
          setAdminUsers(JSON.parse(storedAdmins))
        } else {
          const defaultMockAdmins = [
            { id: 'mock-admin-1', email: 'admin@srikara.com', displayName: 'General Admin', role: 'Admin', active: true, extraPermissions: [], revokedPermissions: [], createdAt: Date.now() },
            { id: 'mock-admin-2', email: 'hr@srikara.com', displayName: 'HR Manager', role: 'HR', active: true, extraPermissions: [], revokedPermissions: [], createdAt: Date.now() },
            { id: 'mock-admin-3', email: 'marketing@srikara.com', displayName: 'Marketing Manager', role: 'Marketing Admin', active: true, extraPermissions: [], revokedPermissions: [], createdAt: Date.now() }
          ]
          setAdminUsers(defaultMockAdmins)
          localStorage.setItem('srikara_mock_admins', JSON.stringify(defaultMockAdmins))
        }
      } catch (err) {
        console.error('Failed to load mock admins:', err)
      }
      return
    }
    try {
      const snap = await getDocs(collection(db, 'users'))
      setAdminUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      console.warn('Failed to load admin users', e.message)
    }
  }

  useEffect(() => {
    if (hasAccess('admin_users')) loadAdminUsers()
  }, [userRole])

  const createAdminUser = async (e) => {
    e.preventDefault()
    if (!currentAdminUser.email || !currentAdminUser.role) return
    setCreatingAdminUser(true)
    try {
      if (!auth) {
        // Mock mode: no live Firebase, simulate locally.
        const newAdmin = { id: Date.now().toString(), ...currentAdminUser, active: true, createdAt: Date.now() }
        const updated = [...adminUsers, newAdmin]
        setAdminUsers(updated)
        localStorage.setItem('srikara_mock_admins', JSON.stringify(updated))
        await logChange('Create', 'users', newAdmin.id, newAdmin.email, null, newAdmin)
        notifyUser('success', `Simulated admin "${currentAdminUser.email}" created (mock mode — no live Firebase).`)
      } else {
        // Create the Auth account on an isolated secondary App instance so the
        // currently logged-in Super Admin's session on the primary `auth` is untouched.
        const secondaryApp = initializeApp(firebaseConfig, `secondary-${Date.now()}`)
        const secondaryAuth = getAuth(secondaryApp)
        try {
          const cred = await createUserWithEmailAndPassword(secondaryAuth, currentAdminUser.email, currentAdminUser.password)
          const profile = {
            email: currentAdminUser.email,
            displayName: currentAdminUser.displayName || currentAdminUser.email,
            role: currentAdminUser.role,
            active: true,
            extraPermissions: currentAdminUser.extraPermissions || [],
            revokedPermissions: currentAdminUser.revokedPermissions || [],
            createdAt: Date.now(),
          }
          await setDoc(doc(db, 'users', cred.user.uid), profile)
          setAdminUsers(prev => [...prev, { id: cred.user.uid, ...profile }])
          await logChange('Create', 'users', cred.user.uid, profile.email, null, profile)
          notifyUser('success', `Admin account created successfully. They can now log in using the specified password.`)
        } finally {
          await signOut(secondaryAuth).catch(() => {})
          await deleteApp(secondaryApp).catch(() => {})
        }
      }
      setCurrentAdminUser({ email: '', displayName: '', password: '', role: 'Reception', extraPermissions: [], revokedPermissions: [] })
    } catch (err) {
      notifyUser('error', err.code === 'auth/email-already-in-use' ? 'That email is already registered.' : `Failed to create admin: ${err.message}`)
    } finally {
      setCreatingAdminUser(false)
    }
  }

  const updateAdminUser = async (uid, patch) => {
    const prev = adminUsers.find(a => a.id === uid)
    const updatedList = adminUsers.map(a => a.id === uid ? { ...a, ...patch } : a)
    setAdminUsers(updatedList)
    if (db) {
      try {
        await setDoc(doc(db, 'users', uid), patch, { merge: true })
        notifyUser('success', 'Admin permissions updated.')
      } catch (err) {
        notifyUser('error', `Failed to update admin: ${err.message}`)
        return
      }
    } else {
      localStorage.setItem('srikara_mock_admins', JSON.stringify(updatedList))
      notifyUser('success', 'Admin permissions updated.')
    }
    const updatedUser = { ...prev, ...patch }
    await logChange('Update', 'users', uid, updatedUser.email || prev?.email || uid, prev, updatedUser)
  }

  const toggleAdminActive = (adminUser) => updateAdminUser(adminUser.id, { active: !(adminUser.active !== false) })

  const deleteAdminUser = async (adminUser) => {
    requestConfirm(
      'Delete Admin Account',
      `Are you sure you want to permanently delete admin account "${adminUser.email}"? This will revoke all their access.`,
      async () => {
        try {
          if (!auth) {
            const updated = adminUsers.filter(a => a.id !== adminUser.id)
            setAdminUsers(updated)
            localStorage.setItem('srikara_mock_admins', JSON.stringify(updated))
          } else {
            await deleteDoc(doc(db, 'users', adminUser.id))
            setAdminUsers(prev => prev.filter(a => a.id !== adminUser.id))
          }
          await logChange('Delete', 'users', adminUser.id, adminUser.email, adminUser, null)
          notifyUser('success', `Deleted admin account "${adminUser.email}".`)
        } catch (err) {
          notifyUser('error', `Failed to delete admin: ${err.message}`)
        }
      },
      'Delete'
    )
  }

  const saveAdminUser = async (e) => {
    e.preventDefault()
    if (editingAdminId) {
      setCreatingAdminUser(true)
      try {
        const prev = adminUsers.find(a => a.id === editingAdminId)
        if (!prev) return
        
        const patch = {
          displayName: currentAdminUser.displayName,
          role: currentAdminUser.role,
          extraPermissions: currentAdminUser.extraPermissions,
          revokedPermissions: currentAdminUser.revokedPermissions
        }
        await updateAdminUser(editingAdminId, patch)
        setEditingAdminId(null)
        setCurrentAdminUser({ email: '', displayName: '', password: '', role: 'Reception', extraPermissions: [], revokedPermissions: [] })
      } catch (err) {
        notifyUser('error', `Failed to update admin: ${err.message}`)
      } finally {
        setCreatingAdminUser(false)
      }
    } else {
      await createAdminUser(e)
    }
  }

  // 3. Category CRUD Actions
  // Doctor CRUD
  const saveDoctor = async (e) => {
    e.preventDefault()
    let updated
    const newDocId = isEditingDoc ? currentDoctor.id : Date.now().toString()
    const timestamp = new Date().toISOString()
    const adminEmail = user?.email || 'Admin Editor'

    const docSlug = currentDoctor.slug || currentDoctor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const defaultMedia = DOCTOR_MEDIA[docSlug] || DOCTOR_MEDIA['default']
    const initialBlogs = currentDoctor.blogs !== undefined ? currentDoctor.blogs : (defaultMedia?.blogs || [])

    const payload = { 
      ...currentDoctor, 
      id: newDocId, 
      slug: docSlug, 
      about: currentDoctor.bio,
      status: 'Active',
      updatedAt: timestamp,
      blogs: initialBlogs
    }

    if (!isEditingDoc) {
      payload.createdAt = timestamp
      payload.createdBy = adminEmail
    } else {
      const existing = doctors.find(d => String(d.id) === String(currentDoctor.id))
      if (existing) {
        payload.createdAt = existing.createdAt || timestamp
        payload.createdBy = existing.createdBy || adminEmail
      }
    }

    if (isEditingDoc) {
      const prev = doctors.find(d => String(d.id) === String(currentDoctor.id))
      updated = doctors.map(d => String(d.id) === String(currentDoctor.id) ? payload : d)
      setIsEditingDoc(false)
      await logChange('Update', 'doctors', newDocId, payload.name, prev, payload)
    } else {
      updated = [...doctors, payload]
      await logChange('Create', 'doctors', newDocId, payload.name, null, payload)
    }
    setDoctors(updated)
    await persistToStore('doctors', updated)
    
    // Add to Firebase directly if live
    if (db) {
      await setDoc(doc(db, 'doctors', newDocId), payload)
    }

    setCurrentDoctor({ name: '', specialty: '', specialtyId: 'ortho', sub: '', exp: '', branch: 'LB Nagar', availability: '', photoUrl: '', status: 'Active', bio: '', languages: 'English', tagline: '', education: '', blogs: [] })
    setDoctorFormTab('details')
    notifyUser('success', 'Doctor profile saved successfully!')
  }

  const handleVideoUpload = async (file, onUploaded) => {
    if (!file) return

    notifyUser('info', 'Uploading video...')

    const readAsBase64 = (f) => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(f)
    })

    try {
      if (storage) {
        const fileRef = ref(storage, `videos/${Date.now()}_${file.name}`)
        await uploadBytes(fileRef, file)
        const downloadUrl = await getDownloadURL(fileRef)
        
        const newAsset = { 
          id: Date.now().toString(),
          name: file.name,
          type: 'video',
          size: `${Math.round(file.size / 1024)} KB`,
          folder: 'Videos',
          url: downloadUrl
        }
        const updated = [...mediaFiles, newAsset]
        setMediaFiles(updated)
        persistToStore('mediaFiles', updated)

        onUploaded(downloadUrl)
        notifyUser('success', 'Video uploaded successfully!')
      } else {
        const base64Url = await readAsBase64(file)
        onUploaded(base64Url)
        notifyUser('success', 'Video uploaded locally!')
      }
    } catch (err) {
      console.error('Video upload failed:', err)
      notifyUser('error', 'Video upload failed: ' + err.message)
    }
  }

  const saveDoctorBlog = async (e) => {
    if (e) e.preventDefault()
    if (!currentDoctor.id) {
      notifyUser('error', 'Please publish the doctor profile first.')
      return
    }

    if (!currentDoctorBlog.title || !currentDoctorBlog.content) {
      notifyUser('error', 'Please fill in the title and content.')
      return
    }

    const blogId = isEditingDoctorBlog ? currentDoctorBlog.id : `b-doc-${Date.now()}`
    const blogDate = currentDoctorBlog.date || new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
    const blogContent = blocksToHtml(doctorBlogBlocks)
    const blogPayload = {
      ...currentDoctorBlog,
      id: blogId,
      date: blogDate,
      content: blogContent,
      image: currentDoctorBlog.mediaType === 'image' 
        ? currentDoctorBlog.image 
        : (currentDoctorBlog.image || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800'),
    }

    const docBlogs = currentDoctor.blogs || []
    let updatedBlogs
    if (isEditingDoctorBlog) {
      updatedBlogs = docBlogs.map(b => b.id === currentDoctorBlog.id ? blogPayload : b)
    } else {
      updatedBlogs = [...docBlogs, blogPayload]
    }

    const updatedDoctor = {
      ...currentDoctor,
      blogs: updatedBlogs
    }

    // Update current doctor state
    setCurrentDoctor(updatedDoctor)

    // Update doctors list state
    const prevDoctor = doctors.find(d => String(d.id) === String(currentDoctor.id))
    const updatedDoctorsList = doctors.map(d => String(d.id) === String(currentDoctor.id) ? updatedDoctor : d)
    setDoctors(updatedDoctorsList)
    await persistToStore('doctors', updatedDoctorsList)

    if (db) {
      await setDoc(doc(db, 'doctors', currentDoctor.id), updatedDoctor)
    }

    await logChange(
      isEditingDoctorBlog ? 'Update' : 'Create',
      'doctors',
      currentDoctor.id,
      `Doctor Blog: ${blogPayload.title} (under ${currentDoctor.name})`,
      prevDoctor ? JSON.parse(JSON.stringify(prevDoctor)) : null,
      updatedDoctor
    )

    // Reset doctor blog form
    setCurrentDoctorBlog({
      id: '',
      title: '',
      category: currentDoctor.specialty || 'Orthopaedics',
      tag: 'Case Study',
      excerpt: '',
      content: '',
      date: '',
      readTime: '5 min read',
      image: '',
      videoUrl: '',
      mediaType: 'image'
    })
    setIsEditingDoctorBlog(false)
    setDoctorBlogBlocks([{ id: Date.now().toString(), type: 'paragraph', value: '' }])
    notifyUser('success', isEditingDoctorBlog ? 'Blog updated successfully!' : 'Blog added successfully!')
  }

  const deleteDoctorBlog = async (blogId) => {
    if (!currentDoctor.id) return
    
    const docBlogs = currentDoctor.blogs || []
    const blogToDelete = docBlogs.find(b => b.id === blogId)
    const updatedBlogs = docBlogs.filter(b => b.id !== blogId)

    const updatedDoctor = {
      ...currentDoctor,
      blogs: updatedBlogs
    }

    const prevDoctor = doctors.find(d => String(d.id) === String(currentDoctor.id))
    setCurrentDoctor(updatedDoctor)

    const updatedDoctorsList = doctors.map(d => String(d.id) === String(currentDoctor.id) ? updatedDoctor : d)
    setDoctors(updatedDoctorsList)
    await persistToStore('doctors', updatedDoctorsList)

    if (db) {
      await setDoc(doc(db, 'doctors', currentDoctor.id), updatedDoctor)
    }
    await logChange(
      'Update',
      'doctors',
      currentDoctor.id,
      `Delete Doctor Blog: ${blogToDelete?.title || blogId} (under ${currentDoctor.name})`,
      prevDoctor ? JSON.parse(JSON.stringify(prevDoctor)) : null,
      updatedDoctor
    )
    notifyUser('success', 'Blog deleted successfully!')
  }

  const formatInlineStyles = (text) => {
    return (text || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  }

  const blocksToHtml = (blocks) => {
    return (blocks || []).map(b => {
      const val = (b.value || '').trim()
      if (!val) return ''
      const formattedVal = formatInlineStyles(val)
      if (b.type === 'heading') return `<h3>${formattedVal}</h3>`
      if (b.type === 'quote') return `<blockquote>${formattedVal}</blockquote>`
      if (b.type === 'list') {
        const items = val.split('\n').map(i => i.trim()).filter(i => i.length > 0)
        if (items.length === 0) return ''
        return `<ul>\n` + items.map(i => `  <li>${formatInlineStyles(i)}</li>`).join('\n') + `\n</ul>`
      }
      return `<p>${formattedVal}</p>`
    }).filter(html => html.length > 0).join('\n')
  }

  const parseHtmlToBlocks = (html) => {
    if (!html) return [{ id: Date.now().toString(), type: 'paragraph', value: '' }]
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const blocks = []
    doc.body.childNodes.forEach((node, i) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const type = node.tagName.toLowerCase()
        let innerHtml = node.innerHTML || ''
        innerHtml = innerHtml.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        innerHtml = innerHtml.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
        
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = innerHtml
        let value = tempDiv.innerText || tempDiv.textContent || ''

        let blockType = 'paragraph'
        if (type === 'h3') {
          blockType = 'heading'
        } else if (type === 'blockquote') {
          blockType = 'quote'
        } else if (type === 'ul' || type === 'ol') {
          blockType = 'list'
          const items = []
          node.childNodes.forEach(li => {
            if (li.tagName && li.tagName.toLowerCase() === 'li') {
              let liHtml = li.innerHTML || ''
              liHtml = liHtml.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
              liHtml = liHtml.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
              const liDiv = document.createElement('div')
              liDiv.innerHTML = liHtml
              items.push(liDiv.innerText || liDiv.textContent || '')
            }
          })
          value = items.join('\n')
        }
        blocks.push({
          id: `${Date.now()}-${i}`,
          type: blockType,
          value: value
        })
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        blocks.push({
          id: `${Date.now()}-${i}`,
          type: 'paragraph',
          value: node.textContent.trim()
        })
      }
    })
    if (blocks.length === 0) {
      blocks.push({ id: Date.now().toString(), type: 'paragraph', value: '' })
    }
    return blocks
  }

  const addMainBlock = (type) => {
    setBlogBlocks(prev => [...prev, { id: `block-${Date.now()}-${Math.random()}`, type, value: '' }])
  }
  const updateMainBlockType = (id, type) => {
    setBlogBlocks(prev => prev.map(b => b.id === id ? { ...b, type } : b))
  }
  const updateMainBlockValue = (id, value) => {
    setBlogBlocks(prev => prev.map(b => b.id === id ? { ...b, value } : b))
  }
  const removeMainBlock = (id) => {
    setBlogBlocks(prev => {
      const filtered = prev.filter(b => b.id !== id)
      return filtered.length ? filtered : [{ id: `block-${Date.now()}`, type: 'paragraph', value: '' }]
    })
  }

  const addDoctorBlock = (type) => {
    setDoctorBlogBlocks(prev => [...prev, { id: `block-${Date.now()}-${Math.random()}`, type, value: '' }])
  }
  const updateDoctorBlockType = (id, type) => {
    setDoctorBlogBlocks(prev => prev.map(b => b.id === id ? { ...b, type } : b))
  }
  const updateDoctorBlockValue = (id, value) => {
    setDoctorBlogBlocks(prev => prev.map(b => b.id === id ? { ...b, value } : b))
  }
  const removeDoctorBlock = (id) => {
    setDoctorBlogBlocks(prev => {
      const filtered = prev.filter(b => b.id !== id)
      return filtered.length ? filtered : [{ id: `block-${Date.now()}`, type: 'paragraph', value: '' }]
    })
  }

  const deleteDoctor = async (id) => {
    const docToDelete = doctors.find(d => String(d.id) === String(id))
    if (!docToDelete) return

    const timestamp = new Date().toISOString()
    const adminEmail = user?.email || 'Admin Editor'

    const updatedPayload = {
      ...docToDelete,
      status: 'Deleted',
      deletedAt: timestamp,
      deletedBy: adminEmail
    }

    const updated = doctors.map(d => String(d.id) === String(id) ? updatedPayload : d)
    setDoctors(updated)
    await persistToStore('doctors', updated)
    if (db) {
      await setDoc(doc(db, 'doctors', id), updatedPayload)
    }
    await logChange('Delete', 'doctors', id, docToDelete.name, docToDelete, updatedPayload)
    notifyUser('success', 'Doctor profile deleted and moved to recycle bin.')
  }

  // Blogs CRUD
  const saveBlog = async (e) => {
    e.preventDefault()
    const newBlogId = isEditingBlog ? currentBlog.id : Date.now().toString()
    const slug = currentBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const blogBody = blocksToHtml(blogBlocks)
    const payload = { 
      ...currentBlog, 
      id: newBlogId, 
      slug, 
      body: blogBody,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: user?.email || 'Admin Editor'
    }

    let updated
    if (isEditingBlog) {
      const prev = blogs.find(b => String(b.id) === String(currentBlog.id))
      updated = blogs.map(b => b.id === currentBlog.id ? payload : b)
      setIsEditingBlog(false)
      await logChange('Update', 'blogs', newBlogId, payload.title, prev, payload)
    } else {
      updated = [...blogs, payload]
      await logChange('Create', 'blogs', newBlogId, payload.title, null, payload)
    }
    setBlogs(updated)
    await persistToStore('blogs', updated)
    if (db) await setDoc(doc(db, 'blogs', newBlogId), payload)

    setCurrentBlog({ title: '', category: 'Orthopaedics', tag: 'Case Study', body: '', status: 'Active', slug: '', seoTitle: '', seoDesc: '', readTime: '5 min read', image: '' })
    setBlogBlocks([{ id: Date.now().toString(), type: 'paragraph', value: '' }])
    notifyUser('success', 'Blog article published successfully!')
  }

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find(b => String(b.id) === String(id))
    if (!blogToDelete) return
    const timestamp = new Date().toISOString()
    const adminEmail = user?.email || 'Admin Editor'
    const updatedPayload = {
      ...blogToDelete,
      status: 'Deleted',
      deletedAt: timestamp,
      deletedBy: adminEmail
    }
    const updated = blogs.map(b => String(b.id) === String(id) ? updatedPayload : b)
    setBlogs(updated)
    await persistToStore('blogs', updated)
    if (db) await setDoc(doc(db, 'blogs', id), updatedPayload)
    await logChange('Delete', 'blogs', id, blogToDelete.title, blogToDelete, updatedPayload)
    notifyUser('success', 'Blog article deleted and moved to recycle bin.')
  }

  // Jobs CRUD
  const saveJob = async (e) => {
    e.preventDefault()
    const newJobId = isEditingJob ? currentJob.id : Date.now().toString()
    const payload = { ...currentJob, id: newJobId }

    let updated
    if (isEditingJob) {
      const prev = jobs.find(j => String(j.id) === String(currentJob.id))
      updated = jobs.map(j => j.id === currentJob.id ? payload : j)
      setIsEditingJob(false)
      await logChange('Update', 'jobs', newJobId, payload.title, prev, payload)
    } else {
      updated = [...jobs, payload]
      await logChange('Create', 'jobs', newJobId, payload.title, null, payload)
    }
    setJobs(updated)
    await persistToStore('jobs', updated)
    if (db) await setDoc(doc(db, 'job_openings', newJobId), payload)

    setCurrentJob({ title: '', department: 'Orthopedics', location: 'LB Nagar, Hyd', experience: '', description: '', status: 'Active' })
    notifyUser('success', 'Job posting updated on live board!')
  }

  const deleteJob = async (id) => {
    const jobToDelete = jobs.find(j => String(j.id) === String(id))
    if (!jobToDelete) return
    const timestamp = new Date().toISOString()
    const adminEmail = user?.email || 'Admin Editor'
    const updatedPayload = {
      ...jobToDelete,
      status: 'Deleted',
      deletedAt: timestamp,
      deletedBy: adminEmail
    }
    const updated = jobs.map(j => String(j.id) === String(id) ? updatedPayload : j)
    setJobs(updated)
    await persistToStore('jobs', updated)
    if (db) await setDoc(doc(db, 'job_openings', id), updatedPayload)
    await logChange('Delete', 'jobs', id, jobToDelete.title, jobToDelete, updatedPayload)
    notifyUser('success', 'Job opening deleted and moved to recycle bin.')
  }

  // FAQs CRUD
  const saveFaq = async (e) => {
    e.preventDefault()
    const newFaqId = isEditingFaq ? currentFaq.id : Date.now().toString()
    const payload = { ...currentFaq, id: newFaqId }

    let updated
    if (isEditingFaq) {
      const prev = faqs.find(f => String(f.id) === String(currentFaq.id))
      updated = faqs.map(f => f.id === currentFaq.id ? payload : f)
      setIsEditingFaq(false)
      await logChange('Update', 'faqs', newFaqId, payload.question, prev, payload)
    } else {
      updated = [...faqs, payload]
      await logChange('Create', 'faqs', newFaqId, payload.question, null, payload)
    }
    setFaqs(updated)
    await persistToStore('faqs', updated)
    if (db) await setDoc(doc(db, 'faqs', newFaqId), payload)

    setCurrentFaq({ question: '', answer: '', category: 'General' })
    notifyUser('success', 'FAQ saved successfully.')
  }

  const deleteFaq = async (id) => {
    const faqToDelete = faqs.find(f => String(f.id) === String(id))
    if (!faqToDelete) return
    const timestamp = new Date().toISOString()
    const adminEmail = user?.email || 'Admin Editor'
    const updatedPayload = {
      ...faqToDelete,
      status: 'Deleted',
      deletedAt: timestamp,
      deletedBy: adminEmail
    }
    const updated = faqs.map(f => String(f.id) === String(id) ? updatedPayload : f)
    setFaqs(updated)
    await persistToStore('faqs', updated)
    if (db) await setDoc(doc(db, 'faqs', id), updatedPayload)
    await logChange('Delete', 'faqs', id, faqToDelete.question, faqToDelete, updatedPayload)
    notifyUser('success', 'FAQ deleted and moved to recycle bin.')
  }

  // Departments CMS Save (Add or Update)
  const saveDepartment = async (e) => {
    e.preventDefault()
    const exists = departments.find(d => d.id === currentDept.id)
    let updated
    if (exists) {
      const prev = departments.find(d => d.id === currentDept.id)
      updated = departments.map(d => d.id === currentDept.id ? currentDept : d)
      await logChange('Update', 'departments', currentDept.id, currentDept.name, prev, currentDept)
    } else {
      updated = [...departments, currentDept]
      await logChange('Create', 'departments', currentDept.id, currentDept.name, null, currentDept)
    }
    setDepartments(updated)
    await persistToStore('departments', updated)
    if (db) await setDoc(doc(db, 'departments', currentDept.id), currentDept)
    notifyUser('success', exists ? 'Department updated.' : 'New department added!')
    if (!exists) setCurrentDept({ id: '', name: '', description: '', treatments: '', faqCategory: 'Treatments' })
  }

  // Departments CMS Delete
  const deleteDepartment = async (deptId) => {
    requestConfirm(
      'Delete Department',
      'Are you sure you want to delete this department?',
      async () => {
        const deptToDelete = departments.find(d => String(d.id) === String(deptId))
        if (!deptToDelete) return
        const timestamp = new Date().toISOString()
        const adminEmail = user?.email || 'Admin Editor'
        const updatedPayload = {
          ...deptToDelete,
          status: 'Deleted',
          deletedAt: timestamp,
          deletedBy: adminEmail
        }
        const updated = departments.map(d => String(d.id) === String(deptId) ? updatedPayload : d)
        setDepartments(updated)
        await persistToStore('departments', updated)
        if (db) await setDoc(doc(db, 'departments', deptId), updatedPayload)
        await logChange('Delete', 'departments', deptId, deptToDelete.name, deptToDelete, updatedPayload)
        notifyUser('success', 'Department deleted and moved to recycle bin.')
        if (currentDept.id === deptId) setCurrentDept({ id: '', name: '', description: '', treatments: '', faqCategory: 'Treatments' })
      }
    )
  }

  // Testimonials CRUD
  const saveTestimonial = async (e) => {
    e.preventDefault()
    const newId = Date.now().toString()
    const payload = { ...currentTestimonial, id: newId }
    const updated = [...testimonials, payload]
    setTestimonials(updated)
    await persistToStore('testimonials', updated)
    if (db) await setDoc(doc(db, 'testimonials', newId), payload)
    await logChange('Create', 'testimonials', newId, payload.patientName, null, payload)
    setCurrentTestimonial({ patientName: '', rating: 5, review: '', videoUrl: '', page: 'General / Home' })
    notifyUser('success', 'Testimonial added.')
  }

  const deleteTestimonial = async (id) => {
    const testToDelete = testimonials.find(t => String(t.id) === String(id))
    if (!testToDelete) return

    const timestamp = new Date().toISOString()
    const adminEmail = user?.email || 'Admin Editor'

    const updatedPayload = {
      ...testToDelete,
      status: 'Deleted',
      deletedAt: timestamp,
      deletedBy: adminEmail
    }

    const updated = testimonials.map(t => String(t.id) === String(id) ? updatedPayload : t)
    setTestimonials(updated)
    await persistToStore('testimonials', updated)
    if (db) {
      await setDoc(doc(db, 'testimonials', id), updatedPayload)
    }
    notifyUser('success', 'Testimonial deleted and moved to history log.')
  }

  // Downloads CRUD
  const saveDownload = async (e) => {
    e.preventDefault()
    const newId = Date.now().toString()
    const payload = { ...currentDownload, id: newId }
    const updated = [...downloads, payload]
    setDownloads(updated)
    await persistToStore('downloads', updated)
    if (db) await setDoc(doc(db, 'downloads', newId), payload)
    await logChange('Create', 'downloads', newId, payload.name, null, payload)
    setCurrentDownload({ name: '', url: '', category: 'PDFs', size: '1.2 MB' })
    notifyUser('success', 'Download link added.')
  }

  const deleteDownload = async (id) => {
    const dlToDelete = downloads.find(d => String(d.id) === String(id))
    if (!dlToDelete) return
    const timestamp = new Date().toISOString()
    const adminEmail = user?.email || 'Admin Editor'
    const updatedPayload = {
      ...dlToDelete,
      status: 'Deleted',
      deletedAt: timestamp,
      deletedBy: adminEmail
    }
    const updated = downloads.map(d => String(d.id) === String(id) ? updatedPayload : d)
    setDownloads(updated)
    await persistToStore('downloads', updated)
    if (db) await setDoc(doc(db, 'downloads', id), updatedPayload)
    await logChange('Delete', 'downloads', id, dlToDelete.name, dlToDelete, updatedPayload)
    notifyUser('success', 'Download item deleted and moved to recycle bin.')
  }

  // News CRUD
  const saveNews = async (e) => {
    e.preventDefault()
    const newId = Date.now().toString()
    const payload = { ...currentNews, id: newId }
    const updated = [...news, payload]
    setNews(updated)
    await persistToStore('news', updated)
    if (db) await setDoc(doc(db, 'news', newId), payload)
    await logChange('Create', 'news', newId, payload.title, null, payload)
    setCurrentNews({ title: '', type: 'News', date: '', content: '' })
    notifyUser('success', 'News item created.')
  }

  const deleteNews = async (id) => {
    const newsToDelete = news.find(n => String(n.id) === String(id))
    if (!newsToDelete) return
    const timestamp = new Date().toISOString()
    const adminEmail = user?.email || 'Admin Editor'
    const updatedPayload = {
      ...newsToDelete,
      status: 'Deleted',
      deletedAt: timestamp,
      deletedBy: adminEmail
    }
    const updated = news.map(n => String(n.id) === String(id) ? updatedPayload : n)
    setNews(updated)
    await persistToStore('news', updated)
    if (db) await setDoc(doc(db, 'news', id), updatedPayload)
    await logChange('Delete', 'news', id, newsToDelete.title, newsToDelete, updatedPayload)
    notifyUser('success', 'News item deleted and moved to recycle bin.')
  }

  // Appointments Management & CRM sync retry simulation
  const handleRetrySync = async (appointment) => {
    notifyUser('success', `Pushing ${appointment.name}'s lead details to CRM queue...`)
    setTimeout(async () => {
      const updated = appointments.map(a => a.id === appointment.id ? { ...a, crmSync: 'Synced' } : a)
      setAppointments(updated)
      await persistToStore('appointments', updated)
      if (db) {
        try {
          const item = updated.find(a => a.id === appointment.id)
          if (item) {
            await setDoc(doc(db, 'appointments', String(appointment.id)), item)
          }
        } catch (err) {
          console.error('Failed to update CRM sync in Firestore:', err)
        }
      }
      notifyUser('success', 'CRM synchronized successfully! Confirmation message pushed.')
    }, 1500)
  }

  const handleUpdateApptStatus = async (id, status) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status } : a)
    setAppointments(updated)
    await persistToStore('appointments', updated)
    if (db) {
      try {
        const item = updated.find(a => a.id === id)
        if (item) {
          await setDoc(doc(db, 'appointments', String(id)), item)
        }
      } catch (err) {
        console.error('Failed to update appointment status in Firestore:', err)
      }
    }
    notifyUser('success', `Appointment status updated to ${status}.`)
  }

  const deleteAppointment = async (id) => {
    requestConfirm('Cancel Appointment', 'Are you sure you want to cancel and remove this appointment request?', async () => {
      const apptToDelete = appointments.find(a => String(a.id) === String(id))
      if (!apptToDelete) return

      const updated = appointments.filter(a => String(a.id) !== String(id))
      setAppointments(updated)
      await persistToStore('appointments', updated)
      if (db) {
        try {
          await deleteDoc(doc(db, 'appointments', String(id)))
        } catch (err) {
          console.error('Failed to delete appointment in Firestore:', err)
        }
      }
      await logChange('Delete', 'appointments', id, `Appointment: ${apptToDelete.patientName} (${apptToDelete.date})`, apptToDelete, null)
      notifyUser('success', 'Appointment request removed successfully.')
    })
  }

  // 4. Page-wise editing
  const savePageData = async (section, data) => {
    const prev = pageData[section] ? JSON.parse(JSON.stringify(pageData[section])) : null
    const updated = { ...pageData }
    updated[section] = data
    setPageData(updated)
    await persistToStore('pageData', updated)
    await logChange('Update', 'site_contents', section, `Page Section: ${section}`, prev, data)
    notifyUser('success', `Page edits for "${section}" saved successfully!`)
  }

  const saveBranchData = async (slug, data) => {
    const prev = pageData.branches?.[slug] ? JSON.parse(JSON.stringify(pageData.branches[slug])) : null
    const updated = { ...pageData }
    updated.branches = updated.branches || {}
    updated.branches[slug] = data
    setPageData(updated)
    await persistToStore('pageData', updated)
    await logChange('Update', 'branches', slug, `Branch Page Layout: ${slug}`, prev, data)
    notifyUser('success', `Branch details for ${slug.toUpperCase()} updated.`)
  }

  const handleSaveBranch = async (e) => {
    e.preventDefault()
    if (!currentBranchDetails.slug || !currentBranchDetails.title) {
      notifyUser('error', 'Please provide a slug and title for the location.')
      return
    }

    const slug = currentBranchDetails.slug.trim().toLowerCase().replace(/\s+/g, '-')
    const highlightsArray = typeof currentBranchDetails.highlights === 'string' 
      ? currentBranchDetails.highlights.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(currentBranchDetails.highlights) ? currentBranchDetails.highlights : ['Comprehensive clinical care']

    const payload = {
      ...currentBranchDetails,
      slug,
      googleRating: Number(currentBranchDetails.googleRating) || 4.8,
      highlights: highlightsArray
    }

    // 1. Local Cache Sync
    let updated
    if (isEditingBranch) {
      const prev = branchesList.find(b => b.slug === slug)
      updated = branchesList.map(b => b.slug === slug ? payload : b)
      await logChange('Update', 'branches', slug, `Location details: ${payload.title}`, prev, payload)
    } else {
      updated = [...branchesList.filter(b => b.slug !== slug), payload]
      await logChange('Create', 'branches', slug, `Location details: ${payload.title}`, null, payload)
    }

    setBranchesList(updated)
    localStorage.setItem('srikara_branches', JSON.stringify(updated))

    // Sync to pageData.branches so that the page customizer works automatically!
    const pageDataBranchesCopy = { ...pageData.branches }
    pageDataBranchesCopy[slug] = {
      heroHeadline: pageDataBranchesCopy[slug]?.heroHeadline || "Advanced Surgical Center",
      heroHighlight: pageDataBranchesCopy[slug]?.heroHighlight || "Orthopedic Excellence",
      description: pageDataBranchesCopy[slug]?.description || payload.address,
      phone: payload.phone,
      address: payload.address,
      rating: payload.googleRating,
      heroImage: payload.heroImage,
      advantageTitle: pageDataBranchesCopy[slug]?.advantageTitle || `The ${payload.title}`,
      advantageHighlight: pageDataBranchesCopy[slug]?.advantageHighlight || "Advantage",
      infraTitle: pageDataBranchesCopy[slug]?.infraTitle || "Precision",
      infraHighlight: pageDataBranchesCopy[slug]?.infraHighlight || "Ecosystem",
      infraDesc: pageDataBranchesCopy[slug]?.infraDesc || "We invest in the future of healthcare..."
    }
    const updatedPageData = { ...pageData, branches: pageDataBranchesCopy, branchesList: updated }
    setPageData(updatedPageData)
    await persistToStore('pageData', updatedPageData)

    setIsEditingBranch(false)
    setCurrentBranchDetails({
      slug: '',
      title: '',
      phone: '',
      address: '',
      googleRating: 4.8,
      googleMapEmbed: '',
      heroImage: '',
      highlights: '24/7 Trauma, Robotic Surgery, Rehabilitation'
    })
    notifyUser('success', `Location "${payload.title}" saved successfully!`)
    refetchBranches()
  }

  const handleDeleteBranch = (slug) => {
    requestConfirm('Delete Location', `Are you sure you want to delete the "${slug}" location? This cannot be undone.`, async () => {
      const branchToDelete = branchesList.find(b => b.slug === slug)
      const updated = branchesList.filter(b => b.slug !== slug)
      setBranchesList(updated)
      localStorage.setItem('srikara_branches', JSON.stringify(updated))

      // Also clean up pageData.branches
      const pageDataBranchesCopy = { ...pageData.branches }
      delete pageDataBranchesCopy[slug]
      const updatedPageData = { ...pageData, branches: pageDataBranchesCopy, branchesList: updated }
      setPageData(updatedPageData)
      await persistToStore('pageData', updatedPageData)

      await logChange('Delete', 'branches', slug, `Location details: ${branchToDelete?.title || slug}`, branchToDelete, null)
      notifyUser('success', 'Location removed successfully.')
      refetchBranches()
    })
  }

  // 5. SEO metadata management
  const saveSeoData = async (pageKey, data) => {
    const prev = seoData[pageKey] ? JSON.parse(JSON.stringify(seoData[pageKey])) : null
    const updated = { ...seoData }
    updated[pageKey] = data
    setSeoData(updated)
    await persistToStore('seoData', updated)
    await logChange('Update', 'seo', pageKey, `SEO metadata: ${pageKey}`, prev, data)
    notifyUser('success', `SEO meta tags for "${pageKey}" synchronized!`)
  }

  // 6. Media Library Action
  const handleUploadMediaSimulate = (e) => {
    e.preventDefault()
    if (!newMediaFile.name || !newMediaFile.url) {
      notifyUser('error', 'Please fill out simulated filename and URL.')
      return
    }
    setUploadingMedia(true)
    setTimeout(async () => {
      const newAsset = { ...newMediaFile, id: Date.now().toString() }
      const updated = [...mediaFiles, newAsset]
      setMediaFiles(updated)
      persistToStore('mediaFiles', updated)
      if (db) {
        try {
          await setDoc(doc(db, 'media', newAsset.id), newAsset)
        } catch (err) {
          console.error("Firebase media save error:", err)
        }
      }
      await logChange('Create', 'media', newAsset.id, newAsset.name, null, newAsset)
      setNewMediaFile({ name: '', type: 'image', size: '120 KB', folder: 'Images', url: '' })
      setUploadingMedia(false)
      notifyUser('success', 'Media asset uploaded and indexed!')
    }, 1000)
  }

  const deleteMediaFile = async (id) => {
    const mediaToDelete = mediaFiles.find(m => m.id === id)
    if (!mediaToDelete) return

    const updated = mediaFiles.filter(m => m.id !== id)
    setMediaFiles(updated)
    persistToStore('mediaFiles', updated)
    if (db) {
      try {
        await deleteDoc(doc(db, 'media', id))
      } catch (err) {
        console.error('Failed to delete media in Firestore:', err)
      }
    }
    await logChange('Delete', 'media', id, mediaToDelete.name, mediaToDelete, null)
    notifyUser('success', 'Media asset removed.')
  }

  const triggerMediaPicker = (callback) => {
    setMediaTargetField(() => callback)
    setShowMediaPickerModal(true)
  }

  const handleImageUpload = async (file, onUploaded) => {
    if (!file) return

    notifyUser('info', 'Uploading image...')

    const readAsBase64 = (f) => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(f)
    })

    try {
      if (storage) {
        const fileRef = ref(storage, `doctors/${Date.now()}_${file.name}`)
        await uploadBytes(fileRef, file)
        const downloadUrl = await getDownloadURL(fileRef)
        
        const newAsset = { 
          id: Date.now().toString(),
          name: file.name,
          type: 'image',
          size: `${Math.round(file.size / 1024)} KB`,
          folder: 'Images',
          url: downloadUrl
        }
        const updated = [...mediaFiles, newAsset]
        setMediaFiles(updated)
        persistToStore('mediaFiles', updated)
        if (db) {
          await setDoc(doc(db, 'media', newAsset.id), newAsset)
        }
        await logChange('Create', 'media', newAsset.id, newAsset.name, null, newAsset)

        onUploaded(downloadUrl)
        notifyUser('success', 'Image uploaded successfully!')
      } else {
        const base64Url = await readAsBase64(file)
        
        const newAsset = { 
          id: Date.now().toString(),
          name: file.name,
          type: 'image',
          size: `${Math.round(file.size / 1024)} KB`,
          folder: 'Images',
          url: base64Url
        }
        const updated = [...mediaFiles, newAsset]
        setMediaFiles(updated)
        persistToStore('mediaFiles', updated)
        if (db) {
          await setDoc(doc(db, 'media', newAsset.id), newAsset)
        }
        await logChange('Create', 'media', newAsset.id, newAsset.name, null, newAsset)

        onUploaded(base64Url)
        notifyUser('success', 'Saved image locally as data URL.')
      }
    } catch (err) {
      console.error('Image upload failed:', err)
      try {
        const base64Url = await readAsBase64(file)
        onUploaded(base64Url)
        notifyUser('success', 'Saved image locally as data URL.')
      } catch (e) {
        notifyUser('error', 'Failed to process selected image.')
      }
    }
  }

  // Search filter lists
  const filteredDoctors = doctors.filter(doc => {
    if (doc.status === 'Deleted' || doc.status === 'Inactive') return false
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBranch = filterBranch === 'All' || doc.branch === filterBranch
    return matchesSearch && matchesBranch
  })

  const filteredBlogs = blogs.filter(b => 
    b.status !== 'Deleted' && (
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const filteredJobs = jobs.filter(j => 
    j.status !== 'Deleted' && (
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      j.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const filteredAppointments = appointments.filter(app => {
    const term = apptSearch.toLowerCase();
    return (app.name || '').toLowerCase().includes(term) || 
           (app.phone || '').includes(term) || 
           (app.doctor || '').toLowerCase().includes(term) || 
           (app.specialty || app.department || '').toLowerCase().includes(term) ||
           (app.branch || '').toLowerCase().includes(term);
  })

  // ─────────────────────────────────────────────────────────────
  // REAL-TIME ANALYTICS INTEGRATION
  // ─────────────────────────────────────────────────────────────
  const pageViews = analyticsEvents.filter(e => e.type === 'page_view')
  const totalVisitorsCount = pageViews.length

  // Calculate Today's pageviews
  const todayStart = new Date().setHours(0,0,0,0)
  const todayVisitorsCount = pageViews.filter(e => e.timestamp >= todayStart).length

  // Device Share Breakdown
  const getLiveDeviceShare = () => {
    if (pageViews.length === 0) return MOCK_DEVICE_DATA
    const total = pageViews.length
    const mobile = pageViews.filter(e => e.screenWidth < 768).length
    const tablet = pageViews.filter(e => e.screenWidth >= 768 && e.screenWidth < 1024).length
    const desktop = pageViews.filter(e => e.screenWidth >= 1024).length
    
    return [
      { name: 'Mobile', value: Math.round((mobile / total) * 100), color: '#8B1A4A' },
      { name: 'Desktop', value: Math.round((desktop / total) * 100), color: '#2D3A4A' },
      { name: 'Tablet', value: Math.round((tablet / total) * 100), color: '#cca830' }
    ]
  }

  // 7-day Traffic Trend
  const getLiveTrafficTrend = () => {
    if (pageViews.length < 5) return MOCK_ANALYTICS
    const data = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
      const start = new Date(d).setHours(0,0,0,0)
      const end = new Date(d).setHours(23,59,59,999)
      const count = pageViews.filter(e => e.timestamp >= start && e.timestamp <= end).length
      data.push({ date: dateStr, visitors: count })
    }
    return data
  }

  // Click Interaction Logs
  const getLiveClickLogs = () => {
    const clicks = analyticsEvents.filter(e => e.type === 'click')
    if (clicks.length === 0) return MOCK_CLICKS
    const counts = {}
    clicks.forEach(c => {
      const key = `${c.element || 'button'}||${c.text || 'Interaction'}||${c.path || '/'}`
      counts[key] = (counts[key] || 0) + 1
    })
    const sorted = Object.entries(counts).map(([key, count]) => {
      const [element, text, path] = key.split('||')
      let page = 'All Pages'
      if (path === '/') page = 'Homepage'
      else if (path.includes('/doctors')) page = 'Doctors Page'
      else if (path.includes('/blogs')) page = 'Blogs Page'
      else if (path.includes('/careers')) page = 'Careers Page'
      else if (path.includes('/about')) page = 'About Page'
      
      return { element, text, path, page, count }
    }).sort((a, b) => b.count - a.count)
    
    return sorted.slice(0, 10)
  }

  const liveDeviceData = getLiveDeviceShare()
  const liveTrafficTrend = getLiveTrafficTrend()
  const liveClickLogs = getLiveClickLogs()

  return (
    <>
      <Helmet>
        <title>Srikara Control Panel | Large Enterprise Console</title>
        <style>{DASH_STYLES}</style>
      </Helmet>

      <div className="min-h-screen bg-[#FFF9FA] text-[#1A202C] selection:bg-[#8B1A4A] selection:text-white font-body relative overflow-x-hidden pb-20">
        
        {/* Background glow graphics */}
        <div className="absolute top-[80px] -left-[100px] w-[500px] h-[500px] rounded-full bg-[#8B1A4A] opacity-5 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[200px] -right-[150px] w-[600px] h-[600px] rounded-full bg-[#cca830] opacity-[0.03] blur-[180px] pointer-events-none" />

        {/* ══════════════ 1. LOGIN WALL ══════════════ */}
        <AnimatePresence>
          {!user && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xl px-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl p-10 md:p-14 rounded-[40px] bg-white/95 border border-white/60 shadow-2xl"
              >
                <div className="text-center mb-10">
                  <span className="w-16 h-16 rounded-[22px] bg-[#8B1A4A]/10 flex items-center justify-center text-[#8B1A4A] mx-auto mb-6">
                    <Lock className="w-8 h-8" />
                  </span>
                  <h1 className="font-garamond text-4xl md:text-5xl font-bold text-[#1A202C]">Srikara Control Panel</h1>
                  <p className="text-sm text-gray-500 mt-3">Sign in using your Enterprise admin credentials or select quick login</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase font-extrabold tracking-widest text-[#2D3A4A]/70 mb-3">Enterprise Email</label>
                    <input 
                      type="email" 
                      placeholder="superadmin@srikara.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 px-5 rounded-2xl bg-white border border-slate-200 outline-none focus:border-[#8B1A4A] text-base shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-extrabold tracking-widest text-[#2D3A4A]/70 mb-3">Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-14 px-5 rounded-2xl bg-white border border-slate-200 outline-none focus:border-[#8B1A4A] text-base shadow-sm"
                      required
                    />
                  </div>

                  {authError && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-[#8B1A4A] text-sm flex gap-3 items-center">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full h-14 rounded-full bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] transition-colors font-extrabold uppercase tracking-widest text-sm shadow-lg mt-8"
                  >
                    Enter Panel
                  </button>
                </form>

                {/* Quick login badges */}
                <div className="mt-10 border-t border-slate-100 pt-8">
                  <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Quick Demo Role Presets</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { role: 'Super Admin', email: 'admin@srikara.com' },
                      { role: 'Marketing Admin', email: 'marketing@srikara.com' },
                      { role: 'HR Recruiter', email: 'hr@srikara.com' },
                      { role: 'Receptionist', email: 'reception@srikara.com' }
                    ].map(preset => (
                      <button
                        key={preset.role}
                        onClick={() => {
                          setEmail(preset.email)
                          setPassword('admin123')
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-[#8B1A4A]/10 hover:text-[#8B1A4A] rounded-xl text-xs font-bold text-slate-600 transition-all border border-transparent hover:border-[#8B1A4A]/25"
                      >
                        {preset.role}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ══════════════ 2. DASHBOARD INTERFACE ══════════════ */}
        {user && (
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-16 relative z-10">
            
            {/* Header console */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-12 pb-8 border-b border-black/5">
              <div>
                <h1 className="font-garamond text-5xl md:text-6xl font-black text-[#1A202C] tracking-tight">Srikara Control Console</h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="bg-[#8B1A4A] text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-sm tracking-wider">
                    {userRole}
                  </span>
                  <span className="text-sm text-gray-500">Active Operator: <strong className="text-slate-800">{user.email}</strong></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-2" />
                  <span className="text-[11px] text-emerald-600 font-bold uppercase">Online & Synced</span>
                </div>
              </div>

              <div className="flex gap-4 w-full xl:w-auto">
                <button 
                  onClick={loadFromLocalStorage}
                  className="flex-1 xl:flex-none h-14 px-6 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-bold flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Database
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="flex-1 xl:flex-none h-14 px-6 rounded-full bg-[#2D3A4A] text-white hover:bg-[#8B1A4A] transition-all text-xs font-bold flex items-center justify-center gap-2 shadow-md"
                >
                  <LogOut className="w-4 h-4" /> End Session
                </button>
              </div>
            </header>

            {/* Notification system */}
            <AnimatePresence>
              {message.text && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-5 rounded-3xl border mb-8 flex justify-between items-center text-base shadow-sm ${
                    message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {message.type === 'success' ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <AlertCircle className="w-6 h-6 text-rose-600" />}
                    <span className="font-semibold">{message.text}</span>
                  </div>
                  <button onClick={() => setMessage({ type: '', text: '' })} className="font-bold text-lg hover:text-black transition-colors px-3 py-1">✕</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SPACIOUS TWO-COLUMN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Sidebar Navigation - Collapsible File Explorer Tree */}
              <div className="lg:col-span-3">
                <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-md space-y-5">
                  
                  {/* Explorer Header */}
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 select-none">
                    <FolderOpen className="w-5 h-5 text-[#8B1A4A]" />
                    <span className="font-garamond text-xl font-bold text-slate-800 tracking-tight">CMS Explorer</span>
                  </div>

                  <div className="space-y-4">
                    
                    {/* Folder 1: Overview & CRM */}
                    <div className="space-y-1">
                      <button 
                        type="button"
                        onClick={() => toggleGroup('overview')}
                        className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-all text-xs font-black uppercase tracking-wider text-slate-500"
                      >
                        <div className="flex items-center gap-2">
                          {expandedGroups.overview ? <FolderOpen className="w-4 h-4 text-[#cca830]" /> : <Folder className="w-4 h-4 text-[#cca830]" />}
                          <span>Overview & CRM</span>
                        </div>
                        {expandedGroups.overview ? <ChevronDown className="w-3.5 h-3.5 opacity-55" /> : <ChevronRight className="w-3.5 h-3.5 opacity-55" />}
                      </button>
                      
                      {expandedGroups.overview && (
                        <div className="pl-4 ml-4 border-l border-slate-100 space-y-1">
                          {hasAccess('analytics') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('overview'); setActiveTab('analytics'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'analytics' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Traffic Analytics</span>
                            </button>
                          )}
                          {hasAccess('heatmaps') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('overview'); setActiveTab('heatmaps'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'heatmaps' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Heatmaps & Clicks</span>
                            </button>
                          )}
                          {hasAccess('appointments') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('overview'); setActiveTab('appointments'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'appointments' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Appointments & CRM</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Folder 2: Category CMS */}
                    <div className="space-y-1">
                      <button 
                        type="button"
                        onClick={() => toggleGroup('category')}
                        className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-all text-xs font-black uppercase tracking-wider text-slate-500"
                      >
                        <div className="flex items-center gap-2">
                          {expandedGroups.category ? <FolderOpen className="w-4 h-4 text-[#cca830]" /> : <Folder className="w-4 h-4 text-[#cca830]" />}
                          <span>Category CMS</span>
                        </div>
                        {expandedGroups.category ? <ChevronDown className="w-3.5 h-3.5 opacity-55" /> : <ChevronRight className="w-3.5 h-3.5 opacity-55" />}
                      </button>

                      {expandedGroups.category && (
                        <div className="pl-4 ml-4 border-l border-slate-100 space-y-1 max-h-[300px] overflow-y-auto pr-1">
                          {hasAccess('doctors') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('category'); setActiveTab('doctors'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'doctors' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Doctors Directory</span>
                            </button>
                          )}
                          {hasAccess('departments') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('category'); setActiveTab('departments'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'departments' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Specialties & Depts</span>
                            </button>
                          )}
                          {hasAccess('blogs') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('category'); setActiveTab('blogs'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'blogs' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Blogs & Articles</span>
                            </button>
                          )}
                          {hasAccess('news') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('category'); setActiveTab('news'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'news' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>News & Alerts</span>
                            </button>
                          )}
                          {hasAccess('gallery') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('category'); setActiveTab('gallery'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'gallery' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Media Gallery</span>
                            </button>
                          )}
                          {hasAccess('jobs') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('category'); setActiveTab('jobs'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'jobs' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Careers Board</span>
                            </button>
                          )}
                          {hasAccess('locations') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('category'); setActiveTab('locations'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'locations' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Manage Locations</span>
                            </button>
                          )}
                          {hasAccess('testimonials') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('category'); setActiveTab('testimonials'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'testimonials' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Testimonials CMS</span>
                            </button>
                          )}
                          {hasAccess('faqs') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('category'); setActiveTab('faqs'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'faqs' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>FAQs CMS</span>
                            </button>
                          )}
                          {hasAccess('downloads') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('category'); setActiveTab('downloads'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'downloads' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Downloads CMS</span>
                            </button>
                          )}
                          {hasAccess('media') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('category'); setActiveTab('media'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'media' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Media Library</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Folder 3: Page-wise CMS */}
                    <div className="space-y-1">
                      <button 
                        type="button"
                        onClick={() => toggleGroup('page')}
                        className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-all text-xs font-black uppercase tracking-wider text-slate-500"
                      >
                        <div className="flex items-center gap-2">
                          {expandedGroups.page ? <FolderOpen className="w-4 h-4 text-[#cca830]" /> : <Folder className="w-4 h-4 text-[#cca830]" />}
                          <span>Page-wise CMS</span>
                        </div>
                        {expandedGroups.page ? <ChevronDown className="w-3.5 h-3.5 opacity-55" /> : <ChevronRight className="w-3.5 h-3.5 opacity-55" />}
                      </button>

                      {expandedGroups.page && (
                        <div className="pl-4 ml-4 border-l border-slate-100 space-y-1">
                          {hasAccess('homepage') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('page'); setActiveTab('homepage'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'homepage' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Homepage Layout</span>
                            </button>
                          )}
                          {hasAccess('aboutpage') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('page'); setActiveTab('aboutpage'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'aboutpage' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>About Us Page</span>
                            </button>
                          )}
                          {hasAccess('careers_customizer') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('page'); setActiveTab('careers_customizer'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'careers_customizer' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Careers Landing</span>
                            </button>
                          )}
                          {hasAccess('branches') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('page'); setActiveTab('branches'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'branches' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>Branch Landing Pages</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Folder 4: SEO CMS */}
                    <div className="space-y-1">
                      <button 
                        type="button"
                        onClick={() => toggleGroup('seo')}
                        className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-all text-xs font-black uppercase tracking-wider text-slate-500"
                      >
                        <div className="flex items-center gap-2">
                          {expandedGroups.seo ? <FolderOpen className="w-4 h-4 text-[#cca830]" /> : <Folder className="w-4 h-4 text-[#cca830]" />}
                          <span>SEO CMS Settings</span>
                        </div>
                        {expandedGroups.seo ? <ChevronDown className="w-3.5 h-3.5 opacity-55" /> : <ChevronRight className="w-3.5 h-3.5 opacity-55" />}
                      </button>

                      {expandedGroups.seo && (
                        <div className="pl-4 ml-4 border-l border-slate-100 space-y-1">
                          {hasAccess('seo') && (
                            <button
                              type="button"
                              onClick={() => { setActiveGroup('seo'); setActiveTab('seo'); }}
                              className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'seo' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <File className="w-3.5 h-3.5" />
                              <span>SEO Meta Tags</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Folder 5: Admin & Security */}
                    {(hasAccess('admin_users') || hasAccess('history')) && (
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => toggleGroup('admin')}
                          className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-all text-xs font-black uppercase tracking-wider text-slate-500"
                        >
                          <div className="flex items-center gap-2">
                            {expandedGroups.admin ? <FolderOpen className="w-4 h-4 text-[#cca830]" /> : <Folder className="w-4 h-4 text-[#cca830]" />}
                            <span>Admin & Security</span>
                          </div>
                          {expandedGroups.admin ? <ChevronDown className="w-3.5 h-3.5 opacity-55" /> : <ChevronRight className="w-3.5 h-3.5 opacity-55" />}
                        </button>

                        {expandedGroups.admin && (
                          <div className="pl-4 ml-4 border-l border-slate-100 space-y-1">
                            {hasAccess('admin_users') && (
                              <button
                                type="button"
                                onClick={() => { setActiveGroup('admin'); setActiveTab('admin_users'); }}
                                className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                  activeTab === 'admin_users' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Admin Users & Roles</span>
                              </button>
                            )}

                            {hasAccess('history') && (
                              <button
                                type="button"
                                onClick={() => { setActiveGroup('admin'); setActiveTab('history'); }}
                                className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                  activeTab === 'history' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                <History className="w-3.5 h-3.5" />
                                <span>Audit & History Log</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              </div>

              {/* Main Panel Content Area */}
              <div className="lg:col-span-9 w-full">
                <AnimatePresence mode="wait">
                  {!userRole ? (
                    <motion.div key="no-profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card-admin rounded-[32px] p-12 shadow-sm text-center space-y-4">
                      <Lock className="w-10 h-10 text-[#8B1A4A] mx-auto" />
                      <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">No Admin Profile Provisioned</h3>
                      <p className="text-sm text-slate-500 max-w-md mx-auto">Your account is signed in but has no admin role assigned yet. Contact a Super Admin to have your account set up before you can access the control panel.</p>
                    </motion.div>
                  ) : !hasAccess(activeTab) ? (
                    <motion.div key="restricted" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card-admin rounded-[32px] p-12 shadow-sm text-center space-y-4">
                      <Lock className="w-10 h-10 text-[#8B1A4A] mx-auto" />
                      <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Access Restricted</h3>
                      <p className="text-sm text-slate-500 max-w-md mx-auto">Your role ({userRole}) does not have permission to view or edit this module. Contact a Super Admin if you need access.</p>
                    </motion.div>
                  ) : (<>
                  {/* ============================================== */}
                  {/* OVERVIEW MODULES                               */}
                  {/* ============================================== */}

                  {/* TAB: Traffic Analytics */}
                  {activeTab === 'analytics' && activeGroup === 'overview' && (
                    <motion.div key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                          { title: 'Today\'s Visitors', value: todayVisitorsCount > 0 ? String(todayVisitorsCount) : '0', change: `Total historical: ${totalVisitorsCount}`, icon: Users, color: 'text-[#8B1A4A]' },
                          { title: 'Bounce Rate', value: '30%', change: 'Simulated rate', icon: Sliders, color: 'text-amber-500' },
                          { title: 'Avg. Session Duration', value: '4m 12s', change: 'Simulated average', icon: Clock, color: 'text-emerald-500' },
                          { title: 'Active Consultations', value: String(appointments.length), change: 'From appointment requests', icon: Calendar, color: 'text-[#2D3A4A]' }
                        ].map((stat, i) => {
                          const StatIcon = stat.icon
                          return (
                            <div key={i} className="glass-card-admin rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">{stat.title}</span>
                                <StatIcon className={`w-5 h-5 ${stat.color}`} />
                              </div>
                              <div className="mt-4">
                                <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
                                <p className="text-xs text-emerald-600 mt-1 font-semibold">{stat.change}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Charts Grid */}
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 glass-card-admin rounded-[32px] p-8 shadow-sm">
                          <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A] mb-6">Traffic Volume Trends (7 Days)</h3>
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={liveTrafficTrend}>
                                <XAxis dataKey="date" stroke="#94a3b8" strokeWidth={1} tickLine={false} />
                                <YAxis stroke="#94a3b8" strokeWidth={1} tickLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="visitors" stroke="#8B1A4A" strokeWidth={3} fillOpacity={0.1} fill="#8B1A4A" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="glass-card-admin rounded-[32px] p-8 shadow-sm flex flex-col justify-between">
                          <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A] mb-6">Device Share</h3>
                          <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={liveDeviceData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75}>
                                  {liveDeviceData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex justify-between border-t border-slate-100 pt-6 text-xs font-bold">
                            {liveDeviceData.map(d => (
                              <span key={d.name} style={{ color: d.color }}>{d.name}: {d.value}%</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Traffic Sources */}
                      <div className="glass-card-admin rounded-[32px] p-8 shadow-sm">
                        <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A] mb-6">Acquisition Channels</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          {MOCK_TRAFFIC_SOURCES.map(source => (
                            <div key={source.source} className="p-5 rounded-2xl bg-white border border-slate-100 flex flex-col justify-between">
                              <span className="text-xs font-bold text-gray-400">{source.source}</span>
                              <div className="mt-3 flex justify-between items-baseline">
                                <span className="text-2xl font-extrabold text-slate-800">{source.count}</span>
                                <span className="text-xs font-bold text-[#8B1A4A] bg-[#8B1A4A]/5 px-2 py-0.5 rounded-md">{source.percentage}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-[#8B1A4A] h-full" style={{ width: `${source.percentage}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Heatmaps */}
                  {activeTab === 'heatmaps' && activeGroup === 'overview' && (
                    <motion.div key="heatmaps" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                          <h2 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Interactions & Clicks Analytics</h2>
                          <p className="text-xs text-gray-500 mt-1">Track where patients click and how they navigate across devices</p>
                        </div>
                        <button 
                          onClick={() => setShowHeatmapOverlay(!showHeatmapOverlay)}
                          className="h-12 px-6 rounded-full bg-[#8B1A4A] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#2D3A4A] transition-colors shadow-md"
                        >
                          {showHeatmapOverlay ? 'Hide Visual Hotspots' : 'Overlay Clicks Heatmap'}
                        </button>
                      </div>

                      {showHeatmapOverlay && (
                        <div className="p-8 rounded-[32px] bg-slate-900 border border-slate-800 text-white relative overflow-hidden">
                          <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-[#cca830] bg-[#cca830]/10 px-3 py-1.5 rounded-lg border border-[#cca830]/20 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#cca830]" /> Visual Heatmap Live Overlay
                          </div>
                          
                          <div className="max-w-2xl mx-auto border border-slate-700/80 rounded-2xl p-6 bg-slate-950/80 space-y-12 select-none relative my-6">
                            {/* Glowing hotspots simulation */}
                            <div className="absolute top-12 left-1/4 w-12 h-12 rounded-full bg-rose-500 opacity-60 blur-md animate-ping" />
                            <div className="absolute top-12 left-1/4 w-6 h-6 rounded-full bg-rose-400 border-2 border-white shadow-xl flex items-center justify-center text-[9px] font-black text-black">482</div>
                            
                            <div className="absolute bottom-[80px] right-[40px] w-12 h-12 rounded-full bg-rose-500 opacity-60 blur-md animate-ping" />
                            <div className="absolute bottom-[80px] right-[40px] w-6 h-6 rounded-full bg-rose-400 border-2 border-white shadow-xl flex items-center justify-center text-[9px] font-black text-black">188</div>

                            <header className="border-b border-slate-800 pb-4 flex justify-between items-center">
                              <div className="w-24 h-4 bg-slate-800 rounded" />
                              <div className="flex gap-2">
                                <div className="w-10 h-3 bg-slate-800 rounded" />
                                <div className="w-10 h-3 bg-slate-800 rounded" />
                              </div>
                            </header>
                            
                            <div className="py-8 text-center space-y-4">
                              <div className="w-3/4 h-8 bg-slate-800 rounded mx-auto" />
                              <div className="w-1/2 h-4 bg-slate-800 rounded mx-auto" />
                              <div className="w-36 h-12 bg-rose-600 rounded-full mx-auto shadow-lg shadow-rose-600/30 flex items-center justify-center text-xs font-black uppercase">
                                Book Now
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                              <div className="h-16 bg-slate-800 rounded-xl" />
                              <div className="h-16 bg-slate-800 rounded-xl" />
                              <div className="h-16 bg-slate-800 rounded-xl" />
                            </div>
                          </div>
                          
                          <p className="text-center text-xs text-slate-400">Mock dashboard simulation overlays real click data hotspots onto template layouts.</p>
                        </div>
                      )}

                      {/* Click logs table */}
                      <div className="glass-card-admin rounded-[32px] p-8 shadow-sm">
                        <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A] mb-6">Interaction Logs</h3>
                        <div className="overflow-x-auto max-h-[600px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                          <table className="w-full text-left border-collapse text-sm">
                            <thead>
                              <tr className="border-b border-slate-100 text-gray-400 font-extrabold uppercase tracking-wider text-xs">
                                <th className="pb-4">HTML Element Selector</th>
                                <th className="pb-4">Trigger Text</th>
                                <th className="pb-4">Location Path</th>
                                <th className="pb-4">Page Area</th>
                                <th className="pb-4 text-right">Click Count</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {liveClickLogs.map((click, index) => (
                                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-4 font-mono text-xs text-slate-600 font-bold">{click.element}</td>
                                  <td className="py-4 text-slate-800 font-bold">{click.text}</td>
                                  <td className="py-4 font-mono text-xs text-gray-400">{click.path}</td>
                                  <td className="py-4 text-gray-500 font-semibold">{click.page}</td>
                                  <td className="py-4 text-right font-extrabold text-[#8B1A4A]">{click.count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Appointments */}
                  {activeTab === 'appointments' && activeGroup === 'overview' && (
                    <motion.div key="appointments" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
                        <div>
                          <h2 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Appointment Requests</h2>
                          <p className="text-xs text-gray-500 mt-1">Review pending patient reservations and manage CRM pipeline</p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                          <div className="relative flex-grow sm:flex-none">
                            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                            <input 
                              type="text" 
                              placeholder="Search patient, phone, doctor..." 
                              value={apptSearch}
                              onChange={e => setApptSearch(e.target.value)}
                              className="h-11 pl-10 pr-4 rounded-xl border bg-white text-xs w-full sm:w-60 focus:border-[#8B1A4A] outline-none" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto max-h-[600px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-slate-100 text-gray-400 font-extrabold uppercase tracking-wider text-xs">
                              <th className="pb-4">Patient Details</th>
                              <th className="pb-4">Assigned Consultation</th>
                              <th className="pb-4">Preferred Slot</th>
                              <th className="pb-4">Status</th>
                              <th className="pb-4">CRM Sync State</th>
                              <th className="pb-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100/60">
                            {filteredAppointments.map(app => (
                              <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4">
                                  <p className="font-bold text-slate-800 text-base">{app.name}</p>
                                  <p className="text-xs text-gray-500 font-semibold">{app.phone}{app.email ? ` · ${app.email}` : ''}</p>
                                  {app.message && <p className="text-xs text-[#8B1A4A] mt-1 bg-[#8B1A4A]/5 px-3 py-1 rounded-lg w-fit">Note: "{app.message}"</p>}
                                </td>
                                <td className="py-4">
                                  <span className="font-bold text-[#2D3A4A]">{app.department || app.specialty}</span>
                                  <p className="text-xs text-gray-500">{app.doctor}</p>
                                  {app.branch && <span className="block text-[10px] text-gray-400 font-bold uppercase mt-0.5">📍 {app.branch}</span>}
                                </td>
                                <td className="py-4 text-xs font-semibold text-gray-500">
                                  {app.slot ? app.slot : `${app.date || ''} at ${app.time || ''}`}
                                </td>
                                <td className="py-4">
                                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${
                                    app.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {app.status || 'Pending'}
                                  </span>
                                </td>
                                <td className="py-4">
                                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${
                                    app.crmSync === 'Synced' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                  }`}>
                                    {app.crmSync || 'Pending'}
                                  </span>
                                </td>
                                <td className="py-4 text-right space-x-2">
                                  {app.crmSync === 'Failed' && (
                                    <button 
                                      onClick={() => handleRetrySync(app)}
                                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm flex-inline items-center gap-1"
                                    >
                                      Retry Sync
                                    </button>
                                  )}
                                  {(app.status === 'Pending' || !app.status) && (
                                    <button 
                                      onClick={() => handleUpdateApptStatus(app.id, 'Confirmed')}
                                      className="px-3 py-2 rounded-xl bg-[#8B1A4A] hover:bg-[#2D3A4A] text-white text-xs font-bold transition-all"
                                    >
                                      Confirm
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => deleteAppointment(app.id)}
                                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all"
                                  >
                                    Cancel
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {/* ============================================== */}
                  {/* CATEGORY CMS MODULES                           */}
                  {/* ============================================== */}
                  
                  {/* TAB: Doctors Directory */}
                  {activeTab === 'doctors' && activeGroup === 'category' && (
                    <motion.div key="doctors" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Left: Listing & Search */}
                      <div className="xl:col-span-7 space-y-6">
                        <div className="glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                          <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Doctor Profiles ({filteredDoctors.length})</h3>
                          
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-grow">
                              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                              <input 
                                type="text" 
                                placeholder="Search by name, specialty..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full h-12 pl-11 pr-4 rounded-xl border bg-white text-xs outline-none focus:border-[#8B1A4A]" 
                              />
                            </div>
                            <div className="relative">
                              <button 
                                type="button"
                                onClick={() => setDoctorFilterDropdownOpen(!doctorFilterDropdownOpen)}
                                className="h-12 px-4 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700 flex items-center justify-between gap-3 min-w-[160px] shadow-sm hover:border-[#8B1A4A]/30 transition-all focus:outline-none"
                              >
                                <span>{filterBranch === 'All' ? 'All Branches' : filterBranch}</span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${doctorFilterDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              {doctorFilterDropdownOpen && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setDoctorFilterDropdownOpen(false)}
                                  />
                                  
                                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl z-50 focus:outline-none max-h-[300px] overflow-y-auto space-y-1">
                                    {[
                                      { value: "All", label: "All Branches" },
                                      { value: "LB Nagar", label: "LB Nagar" },
                                      { value: "Kompally", label: "Kompally" },
                                      { value: "ECIL", label: "ECIL" },
                                      { value: "Miyapur", label: "Miyapur" },
                                      { value: "Peerzadiguda", label: "Peerzadiguda" },
                                      { value: "Lakdikapul", label: "Lakdikapul" },
                                      { value: "Vijayawada", label: "Vijayawada" },
                                      { value: "Rajahmundry", label: "Rajahmundry" },
                                      { value: "RTC X Roads", label: "RTC X Roads" },
                                      { value: "Secunderabad", label: "Secunderabad" }
                                    ].map(opt => (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                          setFilterBranch(opt.value)
                                          setDoctorFilterDropdownOpen(false)
                                        }}
                                        className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                          filterBranch === opt.value 
                                            ? 'bg-[#8B1A4A] text-white shadow-sm' 
                                            : 'text-slate-600 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A]'
                                        }`}
                                      >
                                        <span>{opt.label}</span>
                                        {filterBranch === opt.value && <Check className="w-3.5 h-3.5" />}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          <div 
                            className="overflow-y-auto pr-2 scroll-smooth" 
                            style={{ 
                              maxHeight: '650px',
                              scrollbarWidth: 'thin',
                              scrollbarColor: '#8B1A4A #f1f5f9'
                            }}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {filteredDoctors.map(doc => (
                                <div key={doc.id} className="p-5 rounded-2xl bg-white border border-slate-100/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                                  <div className="flex gap-4 items-start">
                                    <img 
                                      src={doc.photoUrl} 
                                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                                      onError={e => e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'}
                                    />
                                    <div className="min-w-0">
                                      <h4 className="font-bold text-slate-800 text-base leading-snug">{doc.name}</h4>
                                      <p className="text-xs text-[#8B1A4A] font-extrabold uppercase tracking-wider mt-0.5">{doc.specialty}</p>
                                      <p className="text-[11px] text-gray-400 mt-1 font-semibold">{doc.branch} · {doc.exp}</p>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-4">
                                    <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{doc.status}</span>
                                    <div className="flex gap-2">
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          setCurrentDoctor(doc)
                                          setIsEditingDoc(true)
                                        }}
                                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => requestConfirm('Delete Doctor Profile?', `This will permanently remove "${doc.name}" from the live site. This action cannot be undone.`, () => deleteDoctor(doc.id))}
                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Creator Form & Live Preview */}
                      <div className="xl:col-span-5 space-y-6">
                        {/* Form Tab Switcher */}
                        <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
                          <button
                            type="button"
                            onClick={() => setDoctorFormTab('details')}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${doctorFormTab === 'details' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            Doctor Details
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDoctorFormTab('blogs')
                              if (!currentDoctorBlog.category && currentDoctor.specialty) {
                                setCurrentDoctorBlog(prev => ({ ...prev, category: currentDoctor.specialty }))
                              }
                            }}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${doctorFormTab === 'blogs' ? 'bg-[#8B1A4A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            Blogs ({currentDoctor?.blogs?.length || 0})
                          </button>
                        </div>

                        {doctorFormTab === 'details' ? (
                          <>
                            <form onSubmit={saveDoctor} className="glass-card-admin rounded-[32px] p-8 shadow-sm space-y-4">
                              <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">
                                {isEditingDoc ? 'Modify Profile' : 'Publish Doctor Profile'}
                              </h3>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Full Name</label>
                                  <input type="text" value={currentDoctor.name} onChange={e => setCurrentDoctor(prev => ({ ...prev, name: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="Dr. Jane Smith" required />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Specialty</label>
                                  <input 
                                    type="text" 
                                    value={currentDoctor.specialty} 
                                    onChange={e => {
                                      const val = e.target.value;
                                      let specId = 'ortho';
                                      const clean = val.toLowerCase();
                                      if (clean.includes('ortho')) specId = 'ortho';
                                      else if (clean.includes('cardio')) specId = 'cardio';
                                      else if (clean.includes('neuro')) specId = 'neuro';
                                      else if (clean.includes('nephro')) specId = 'nephro';
                                      else if (clean.includes('pulmo')) specId = 'pulmo';
                                      else if (clean.includes('gastro')) specId = 'gastro';
                                      else if (clean.includes('physician') || clean.includes('general')) specId = 'physician';
                                      else if (clean.includes('urology')) specId = 'urology';
                                      else if (clean.includes('gyn') || clean.includes('obstetric')) specId = 'gyn';
                                      else specId = clean.slice(0, 5) || 'ortho';

                                      setCurrentDoctor(prev => ({ ...prev, specialty: val, specialtyId: specId }));
                                    }} 
                                    className="w-full h-11 px-3 rounded-xl border bg-white text-xs" 
                                    placeholder="Cardiology" 
                                    required 
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Branch</label>
                                  <ThemedDropdown
                                    value={currentDoctor.branch}
                                    onChange={e => setCurrentDoctor(prev => ({ ...prev, branch: e.target.value }))}
                                    options={['LB Nagar', 'Kompally', 'ECIL', 'Miyapur', 'Peerzadiguda', 'Lakdikapul', 'Vijayawada', 'Rajahmundry', 'RTC X Roads', 'Secunderabad']}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Experience</label>
                                  <input type="text" value={currentDoctor.exp} onChange={e => setCurrentDoctor(prev => ({ ...prev, exp: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="10+ Years" />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Timings Availability</label>
                                <input type="text" value={currentDoctor.availability} onChange={e => setCurrentDoctor(prev => ({ ...prev, availability: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="Mon - Sat: 10 AM - 5 PM" />
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Photo URL</label>
                                <div className="flex gap-2">
                                  <input type="text" value={currentDoctor.photoUrl} onChange={e => setCurrentDoctor(prev => ({ ...prev, photoUrl: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="https://..." />
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const input = document.createElement('input')
                                      input.type = 'file'
                                      input.accept = 'image/*'
                                      input.onchange = (e) => {
                                        const file = e.target.files[0]
                                        handleImageUpload(file, (url) => {
                                          setCurrentDoctor(prev => ({ ...prev, photoUrl: url }))
                                        })
                                      }
                                      input.click()
                                    }}
                                    className="px-3 h-11 rounded-xl bg-[#8B1A4A] hover:bg-[#2D3A4A] text-white text-xs font-bold flex items-center justify-center gap-1 shrink-0 transition-colors"
                                  >
                                    <Upload className="w-4 h-4" /> Upload
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => triggerMediaPicker((url) => setCurrentDoctor(prev => ({ ...prev, photoUrl: url })))}
                                    className="px-3 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold flex items-center justify-center gap-1 shrink-0 text-slate-700"
                                  >
                                    <FolderOpen className="w-4 h-4" /> Pick
                                  </button>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Doctor Bio / Statement</label>
                                <textarea value={currentDoctor.bio} onChange={e => setCurrentDoctor(prev => ({ ...prev, bio: e.target.value }))} className="w-full h-20 p-3 rounded-xl border bg-white text-xs" placeholder="Describe the doctor's achievements..." />
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Academic Credentials & Fellowships</label>
                                <input type="text" value={currentDoctor.education} onChange={e => setCurrentDoctor(prev => ({ ...prev, education: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="e.g. MBBS, MD (General Medicine), DM (Cardiology)" />
                              </div>

                              <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 h-12 bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] rounded-full text-xs font-bold uppercase transition-all shadow-md">
                                  {isEditingDoc ? 'Save Changes' : 'Publish Profile'}
                                </button>
                                {isEditingDoc && (
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      setIsEditingDoc(false)
                                      setCurrentDoctor({ name: '', specialty: '', specialtyId: 'ortho', sub: '', exp: '', branch: 'LB Nagar', availability: '', photoUrl: '', status: 'Active', bio: '', languages: 'English', tagline: '', education: '', blogs: [] })
                                    }}
                                    className="h-12 px-6 bg-slate-200 rounded-full text-xs font-bold uppercase"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </form>

                            {/* Live visual preview card */}
                            <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-200 shadow-inner space-y-4">
                              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Live Profile Card Preview</p>
                              <div className="bg-white rounded-3xl p-5 shadow border flex items-center gap-4">
                                <img src={currentDoctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'} className="w-16 h-16 rounded-full object-cover border" />
                                <div>
                                  <h4 className="font-bold text-slate-800 text-lg">{currentDoctor.name || 'Doctor Name'}</h4>
                                  <p className="text-xs text-[#8B1A4A] font-extrabold uppercase">{currentDoctor.specialty || 'Specialty'}</p>
                                  <p className="text-[11px] text-gray-500 mt-1 font-semibold">{currentDoctor.branch} · {currentDoctor.exp || 'Yrs experience'}</p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Blogs section for doctor */
                          !currentDoctor.id ? (
                            <div className="glass-card-admin rounded-[32px] p-8 shadow-sm text-center py-16 space-y-4">
                              <div className="w-16 h-16 bg-[#8B1A4A]/5 rounded-full flex items-center justify-center mx-auto text-[#8B1A4A]">
                                <Users className="w-8 h-8" />
                              </div>
                              <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">Doctor Specific Blogs</h3>
                              <p className="text-xs text-slate-500 max-w-xs mx-auto">Please save or edit an existing doctor profile first before adding blogs to their page.</p>
                            </div>
                          ) : (
                            !isEditingDoctorBlog ? (
                              <div className="glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">Blogs for {currentDoctor.name}</h3>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsEditingDoctorBlog(true)
                                      setDoctorBlogBlocks([{ id: Date.now().toString(), type: 'paragraph', value: '' }])
                                      setCurrentDoctorBlog({
                                        id: '',
                                        title: '',
                                        category: currentDoctor.specialty || 'Orthopaedics',
                                        tag: 'Case Study',
                                        excerpt: '',
                                        content: '',
                                        date: '',
                                        readTime: '5 min read',
                                        image: '',
                                        videoUrl: '',
                                        mediaType: 'image'
                                      })
                                    }}
                                    className="px-4 py-2.5 rounded-xl bg-[#8B1A4A] text-white text-xs font-bold uppercase hover:bg-[#2D3A4A] transition-all shadow-sm flex items-center gap-1.5"
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add Blog
                                  </button>
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#8B1A4A #f1f5f9' }}>
                                  {(!currentDoctor.blogs || currentDoctor.blogs.length === 0) ? (
                                    <p className="text-xs text-slate-400 text-center py-10">No blogs published for this doctor yet.</p>
                                  ) : (
                                    currentDoctor.blogs.map(blog => (
                                      <div key={blog.id} className="p-4 rounded-2xl bg-white border border-slate-100 flex justify-between items-center shadow-sm">
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                          {blog.mediaType === 'video' ? (
                                            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-100 flex items-center justify-center relative flex-shrink-0">
                                              <Video className="w-5 h-5 text-white" />
                                              <div className="absolute -bottom-1 -right-1 bg-[#8B1A4A] rounded-full p-0.5">
                                                <Play className="w-2.5 h-2.5 text-white fill-white" />
                                              </div>
                                            </div>
                                          ) : (
                                            <img src={blog.image} className="w-12 h-12 rounded-xl object-cover border flex-shrink-0" onError={e => e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'} />
                                          )}
                                          <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-slate-800 text-xs truncate">{blog.title}</h4>
                                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{blog.category} · {blog.tag || 'Case Study'}</p>
                                          </div>
                                        </div>
                                        <div className="flex gap-1.5 ml-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setCurrentDoctorBlog(blog)
                                              setDoctorBlogBlocks(parseHtmlToBlocks(blog.content))
                                              setIsEditingDoctorBlog(true)
                                            }}
                                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                          >
                                            <Edit2 className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => requestConfirm('Delete Blog Post?', `Are you sure you want to remove this blog from ${currentDoctor.name}'s page?`, () => deleteDoctorBlog(blog.id))}
                                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            ) : (
                              <form onSubmit={saveDoctorBlog} className="glass-card-admin rounded-[32px] p-8 shadow-sm space-y-4 max-h-[650px] overflow-y-auto pr-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#8B1A4A #f1f5f9' }}>
                                <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">
                                  {currentDoctorBlog.id ? 'Edit Blog Article' : 'Write Blog Article'}
                                </h3>

                                <div>
                                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Blog Title</label>
                                  <input type="text" value={currentDoctorBlog.title} onChange={e => setCurrentDoctorBlog(prev => ({ ...prev, title: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="NAVIO Robotic Knee Joint Balancing..." required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Category</label>
                                    <input type="text" value={currentDoctorBlog.category} onChange={e => setCurrentDoctorBlog(prev => ({ ...prev, category: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="Orthopaedics" required />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Tag</label>
                                    <input type="text" value={currentDoctorBlog.tag} onChange={e => setCurrentDoctorBlog(prev => ({ ...prev, tag: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="Case Study" />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Read Time / Video Duration</label>
                                  <input type="text" value={currentDoctorBlog.readTime} onChange={e => setCurrentDoctorBlog(prev => ({ ...prev, readTime: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="5 min read or 3:45 mins" />
                                </div>

                                <div>
                                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Excerpt / Summary</label>
                                  <textarea value={currentDoctorBlog.excerpt} onChange={e => setCurrentDoctorBlog(prev => ({ ...prev, excerpt: e.target.value }))} className="w-full h-16 p-3 rounded-xl border bg-white text-xs" placeholder="Provide a short description of the post..." />
                                </div>

                                <div>
                                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-2">Blog Body Content</label>
                                  <div className="space-y-3">
                                    {doctorBlogBlocks.map((block, index) => (
                                      <div key={block.id} className="flex gap-2 items-start p-3 bg-white rounded-xl border border-slate-200/60 relative group">
                                        <div className="flex-grow space-y-1">
                                          <div className="flex justify-between items-center mb-1">
                                            <span className="text-[9px] font-black uppercase tracking-wider text-[#8B1A4A] bg-[#8B1A4A]/5 px-2 py-0.5 rounded">
                                              {block.type === 'heading' ? 'Heading 3' : block.type === 'quote' ? 'Blockquote' : block.type === 'list' ? 'List' : 'Paragraph'}
                                            </span>
                                            <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                              <ThemedDropdown
                                                value={block.type}
                                                onChange={(e) => updateDoctorBlockType(block.id, e.target.value)}
                                                options={[
                                                  { value: 'paragraph', label: 'Paragraph' },
                                                  { value: 'heading', label: 'Heading 3' },
                                                  { value: 'quote', label: 'Quote' },
                                                  { value: 'list', label: 'List' }
                                                ]}
                                                heightClass="h-7 !rounded-lg !px-2 text-[10px] font-bold"
                                                className="w-28"
                                              />
                                              <button
                                                type="button"
                                                onClick={() => removeDoctorBlock(block.id)}
                                                className="p-0.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-200/50"
                                                title="Delete block"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>
                                          {block.type === 'list' ? (
                                            <textarea
                                              value={block.value}
                                              onChange={(e) => updateDoctorBlockValue(block.id, e.target.value)}
                                              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-normal focus:border-[#8B1A4A] focus:ring-1 focus:ring-[#8B1A4A]/30 outline-none transition-all"
                                              placeholder="Enter list items (one item per line)..."
                                              rows={3}
                                            />
                                          ) : (
                                            <textarea
                                              value={block.value}
                                              onChange={(e) => updateDoctorBlockValue(block.id, e.target.value)}
                                              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-normal focus:border-[#8B1A4A] focus:ring-1 focus:ring-[#8B1A4A]/30 outline-none transition-all"
                                              placeholder={
                                                block.type === 'heading' ? 'Type heading content...' :
                                                block.type === 'quote' ? 'Type quote content...' :
                                                'Type paragraph content... Use **word** for bold.'
                                              }
                                              rows={block.type === 'paragraph' ? 3 : 1}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    <button type="button" onClick={() => addDoctorBlock('paragraph')} className="px-3 py-1.5 text-[9px] font-bold uppercase bg-white border border-dashed rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">+ Add Paragraph</button>
                                    <button type="button" onClick={() => addDoctorBlock('heading')} className="px-3 py-1.5 text-[9px] font-bold uppercase bg-white border border-dashed rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">+ Add Heading</button>
                                    <button type="button" onClick={() => addDoctorBlock('quote')} className="px-3 py-1.5 text-[9px] font-bold uppercase bg-white border border-dashed rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">+ Add Quote</button>
                                    <button type="button" onClick={() => addDoctorBlock('list')} className="px-3 py-1.5 text-[9px] font-bold uppercase bg-white border border-dashed rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">+ Add List</button>
                                  </div>
                                </div>


                                <div>
                                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Blog Media Type</label>
                                  <div className="flex gap-4 mt-1.5">
                                    <label className="flex items-center gap-2 text-xs text-slate-700 font-bold cursor-pointer">
                                      <input type="radio" checked={currentDoctorBlog.mediaType === 'image'} onChange={() => setCurrentDoctorBlog(prev => ({ ...prev, mediaType: 'image' }))} className="accent-[#8B1A4A]" />
                                      <span>Image Blog</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-slate-700 font-bold cursor-pointer">
                                      <input type="radio" checked={currentDoctorBlog.mediaType === 'video'} onChange={() => setCurrentDoctorBlog(prev => ({ ...prev, mediaType: 'video' }))} className="accent-[#8B1A4A]" />
                                      <span>Video Blog</span>
                                    </label>
                                  </div>
                                </div>

                                {currentDoctorBlog.mediaType === 'video' ? (
                                  <div>
                                    <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Video URL (direct link or YouTube link)</label>
                                    <div className="flex gap-2">
                                      <input type="text" value={currentDoctorBlog.videoUrl || ''} onChange={e => setCurrentDoctorBlog(prev => ({ ...prev, videoUrl: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="https://www.youtube.com/embed/... or direct MP4 URL" required />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const input = document.createElement('input')
                                          input.type = 'file'
                                          input.accept = 'video/*'
                                          input.onchange = (e) => {
                                            const file = e.target.files[0]
                                            handleVideoUpload(file, (url) => {
                                              setCurrentDoctorBlog(prev => ({ ...prev, videoUrl: url }))
                                            })
                                          }
                                          input.click()
                                        }}
                                        className="px-3 h-11 rounded-xl bg-[#8B1A4A] hover:bg-[#2D3A4A] text-white text-xs font-bold flex items-center justify-center gap-1 shrink-0 transition-colors"
                                      >
                                        <Upload className="w-4 h-4" /> Upload
                                      </button>
                                    </div>
                                    
                                    <label className="block text-[10px] uppercase font-extrabold text-slate-400 mt-2 mb-1">Thumbnail Image (Optional)</label>
                                    <div className="flex gap-2">
                                      <input type="text" value={currentDoctorBlog.image || ''} onChange={e => setCurrentDoctorBlog(prev => ({ ...prev, image: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="https://..." />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const input = document.createElement('input')
                                          input.type = 'file'
                                          input.accept = 'image/*'
                                          input.onchange = (e) => {
                                            const file = e.target.files[0]
                                            handleImageUpload(file, (url) => {
                                              setCurrentDoctorBlog(prev => ({ ...prev, image: url }))
                                            })
                                          }
                                          input.click()
                                        }}
                                        className="px-3 h-11 rounded-xl bg-[#8B1A4A] hover:bg-[#2D3A4A] text-white text-xs font-bold flex items-center justify-center gap-1 shrink-0 transition-colors"
                                      >
                                        <Upload className="w-4 h-4" /> Upload
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Image URL</label>
                                    <div className="flex gap-2">
                                      <input type="text" value={currentDoctorBlog.image || ''} onChange={e => setCurrentDoctorBlog(prev => ({ ...prev, image: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="https://..." />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const input = document.createElement('input')
                                          input.type = 'file'
                                          input.accept = 'image/*'
                                          input.onchange = (e) => {
                                            const file = e.target.files[0]
                                            handleImageUpload(file, (url) => {
                                              setCurrentDoctorBlog(prev => ({ ...prev, image: url }))
                                            })
                                          }
                                          input.click()
                                        }}
                                        className="px-3 h-11 rounded-xl bg-[#8B1A4A] hover:bg-[#2D3A4A] text-white text-xs font-bold flex items-center justify-center gap-1 shrink-0 transition-colors"
                                      >
                                        <Upload className="w-4 h-4" /> Upload
                                      </button>
                                      <button 
                                        type="button" 
                                        onClick={() => triggerMediaPicker((url) => setCurrentDoctorBlog(prev => ({ ...prev, image: url })))}
                                        className="px-3 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold flex items-center justify-center gap-1 shrink-0 text-slate-700"
                                      >
                                        <FolderOpen className="w-4 h-4" /> Pick
                                      </button>
                                    </div>
                                  </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                  <button type="submit" className="flex-1 h-12 bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] rounded-full text-xs font-bold uppercase transition-all shadow-md">
                                    {currentDoctorBlog.id ? 'Save Changes' : 'Publish Blog'}
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      setIsEditingDoctorBlog(false)
                                      setDoctorBlogBlocks([{ id: Date.now().toString(), type: 'paragraph', value: '' }])
                                    }}
                                    className="h-12 px-6 bg-slate-200 rounded-full text-xs font-bold uppercase"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            )
                          )
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Specialties & Departments */}
                  {activeTab === 'departments' && activeGroup === 'category' && (
                    <motion.div key="departments" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Left: Department List */}
                      <div className="xl:col-span-7 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Specialties & Departments ({departments.length})</h3>
                          <button 
                            onClick={() => setCurrentDept({ id: '', name: '', description: '', treatments: '', faqCategory: 'Treatments' })}
                            className="px-4 py-2.5 rounded-xl bg-[#8B1A4A] text-white text-xs font-bold uppercase hover:bg-[#2D3A4A] transition-all shadow-sm flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add New
                          </button>
                        </div>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                          {departments.filter(d => d.status !== 'Deleted').map(dept => (
                            <div key={dept.id} className={`p-5 rounded-2xl bg-white border flex justify-between items-start transition-all ${currentDept.id === dept.id ? 'border-[#8B1A4A]/40 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}>
                              <div className="space-y-1 flex-1 min-w-0 mr-3">
                                <h4 className="text-base font-bold text-slate-800 truncate">{dept.name}</h4>
                                <p className="text-[11px] text-gray-500 line-clamp-1">{dept.description}</p>
                                <p className="text-[10px] text-[#8B1A4A] font-semibold mt-1">Treatments: <span className="text-slate-500 font-normal">{dept.treatments}</span></p>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button 
                                  onClick={() => setCurrentDept(dept)}
                                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => deleteDepartment(dept.id)}
                                  className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Department Editor Form */}
                      <div className="xl:col-span-5 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-4">
                        <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">
                          {departments.find(d => d.id === currentDept.id) ? 'Edit Department' : '+ Add New Department'}
                        </h3>
                        <form onSubmit={saveDepartment} className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Department Identifier (slug)</label>
                            <input 
                              type="text" 
                              value={currentDept.id} 
                              onChange={e => setCurrentDept(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))} 
                              disabled={!!departments.find(d => d.id === currentDept.id)} 
                              placeholder="e.g. dermatology"
                              className={`w-full h-11 px-3 rounded-xl border text-xs font-mono ${departments.find(d => d.id === currentDept.id) ? 'bg-slate-50 text-gray-500' : 'bg-white text-slate-800'}`} 
                              required 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Display Name</label>
                            <input type="text" value={currentDept.name} onChange={e => setCurrentDept(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Dermatology & Cosmetology" className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Description Paragraph</label>
                            <textarea value={currentDept.description} onChange={e => setCurrentDept(prev => ({ ...prev, description: e.target.value }))} placeholder="Brief description of the department..." className="w-full h-24 p-3 rounded-xl border bg-white text-xs" required />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Associated Treatments (Comma Separated)</label>
                            <input type="text" value={currentDept.treatments} onChange={e => setCurrentDept(prev => ({ ...prev, treatments: e.target.value }))} placeholder="e.g. Acne Treatment, Laser Therapy, Chemical Peels" className="w-full h-11 px-3 rounded-xl border bg-white text-xs" />
                          </div>
                          <button type="submit" className="w-full h-12 bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] rounded-full text-xs font-bold uppercase transition-all shadow-md mt-4">
                            {departments.find(d => d.id === currentDept.id) ? 'Save Department Details' : 'Add Department'}
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Blogs */}
                  {activeTab === 'blogs' && activeGroup === 'category' && (
                    <motion.div key="blogs" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Left: Blog Catalog */}
                      <div className="xl:col-span-6 space-y-6">
                        <div className="glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                          <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Blogs Catalog ({filteredBlogs.length})</h3>
                          <div className="relative">
                            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                            <input 
                              type="text" 
                              placeholder="Search article title..." 
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              className="w-full h-12 pl-11 pr-4 rounded-xl border bg-white text-xs outline-none focus:border-[#8B1A4A]" 
                            />
                          </div>

                          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                            {filteredBlogs.map(blog => (
                              <div key={blog.id} className="p-5 rounded-2xl bg-white border border-slate-100 flex justify-between items-center shadow-sm">
                                <div className="flex gap-4 items-center min-w-0">
                                  <img src={blog.image} className="w-12 h-12 rounded-xl object-cover border flex-shrink-0" onError={e => e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'} />
                                  <div className="min-w-0">
                                    <h4 className="font-bold text-slate-800 text-sm truncate">{blog.title}</h4>
                                    <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{blog.category} · {blog.tag}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-4">
                                  <button 
                                    onClick={() => {
                                      setCurrentBlog(blog)
                                      setBlogBlocks(parseHtmlToBlocks(blog.body || blog.content))
                                      setIsEditingBlog(true)
                                    }}
                                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => requestConfirm('Remove Blog Post?', `"${blog.title}" will be unpublished and permanently deleted.`, () => deleteBlog(blog.id))}
                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Blog Creator */}
                      <div className="xl:col-span-6 space-y-6">
                        <form onSubmit={saveBlog} className="glass-card-admin rounded-[32px] p-8 shadow-sm space-y-4 max-h-[650px] overflow-y-auto pr-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#8B1A4A #f1f5f9' }}>
                          <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">
                            {isEditingBlog ? 'Edit Blog Article' : 'Write New Article'}
                          </h3>
                          
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Article Title</label>
                            <input type="text" value={currentBlog.title} onChange={e => setCurrentBlog(prev => ({ ...prev, title: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Category</label>
                              <ThemedDropdown
                                value={currentBlog.category}
                                onChange={e => setCurrentBlog(prev => ({ ...prev, category: e.target.value }))}
                                options={['Orthopaedics', 'Cardiology', 'Neurosurgery', 'General Surgery', 'Diabetology']}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Reading Time</label>
                              <input type="text" value={currentBlog.readTime} onChange={e => setCurrentBlog(prev => ({ ...prev, readTime: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="5 min read" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Featured Image URL</label>
                            <div className="flex gap-2">
                              <input type="text" value={currentBlog.image} onChange={e => setCurrentBlog(prev => ({ ...prev, image: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="https://..." />
                              <button 
                                type="button"
                                onClick={() => {
                                  const input = document.createElement('input')
                                  input.type = 'file'
                                  input.accept = 'image/*'
                                  input.onchange = (e) => {
                                    const file = e.target.files[0]
                                    handleImageUpload(file, (url) => {
                                      setCurrentBlog(prev => ({ ...prev, image: url }))
                                    })
                                  }
                                  input.click()
                                }}
                                className="px-3 h-11 rounded-xl bg-[#8B1A4A] hover:bg-[#2D3A4A] text-white text-xs font-bold flex items-center justify-center gap-1 shrink-0 transition-colors"
                              >
                                <Upload className="w-4 h-4" /> Upload
                              </button>
                              <button 
                                type="button" 
                                onClick={() => triggerMediaPicker((url) => setCurrentBlog(prev => ({ ...prev, image: url })))}
                                className="px-3 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold shrink-0 text-slate-700"
                              >
                                Browse
                              </button>
                            </div>
                          </div>

                          <div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-2">Blog Body Content</label>
                            <div className="space-y-3">
                              {blogBlocks.map((block, index) => (
                                <div key={block.id} className="flex gap-2 items-start p-3 bg-white rounded-xl border border-slate-200/60 relative group">
                                  <div className="flex-grow space-y-1">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-[9px] font-black uppercase tracking-wider text-[#8B1A4A] bg-[#8B1A4A]/5 px-2 py-0.5 rounded">
                                        {block.type === 'heading' ? 'Heading 3' : block.type === 'quote' ? 'Blockquote' : block.type === 'list' ? 'List' : 'Paragraph'}
                                      </span>
                                      <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <ThemedDropdown
                                          value={block.type}
                                          onChange={(e) => updateMainBlockType(block.id, e.target.value)}
                                          options={[
                                            { value: 'paragraph', label: 'Paragraph' },
                                            { value: 'heading', label: 'Heading 3' },
                                            { value: 'quote', label: 'Quote' },
                                            { value: 'list', label: 'List' }
                                          ]}
                                          heightClass="h-7 !rounded-lg !px-2 text-[10px] font-bold"
                                          className="w-28"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeMainBlock(block.id)}
                                          className="p-0.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-200/50"
                                          title="Delete block"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                    {block.type === 'list' ? (
                                      <textarea
                                        value={block.value}
                                        onChange={(e) => updateMainBlockValue(block.id, e.target.value)}
                                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-normal focus:border-[#8B1A4A] focus:ring-1 focus:ring-[#8B1A4A]/30 outline-none transition-all"
                                        placeholder="Enter list items (one item per line)..."
                                        rows={3}
                                      />
                                    ) : (
                                      <textarea
                                        value={block.value}
                                        onChange={(e) => updateMainBlockValue(block.id, e.target.value)}
                                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-normal focus:border-[#8B1A4A] focus:ring-1 focus:ring-[#8B1A4A]/30 outline-none transition-all"
                                        placeholder={
                                          block.type === 'heading' ? 'Type heading content...' :
                                          block.type === 'quote' ? 'Type quote content...' :
                                          'Type paragraph content... Use **word** for bold.'
                                        }
                                        rows={block.type === 'paragraph' ? 3 : 1}
                                      />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 pt-2">
                              <button type="button" onClick={() => addMainBlock('paragraph')} className="px-3 py-1.5 text-[9px] font-bold uppercase bg-white border border-dashed rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">+ Add Paragraph</button>
                              <button type="button" onClick={() => addMainBlock('heading')} className="px-3 py-1.5 text-[9px] font-bold uppercase bg-white border border-dashed rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">+ Add Heading</button>
                              <button type="button" onClick={() => addMainBlock('quote')} className="px-3 py-1.5 text-[9px] font-bold uppercase bg-white border border-dashed rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">+ Add Quote</button>
                              <button type="button" onClick={() => addMainBlock('list')} className="px-3 py-1.5 text-[9px] font-bold uppercase bg-white border border-dashed rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">+ Add List</button>
                            </div>
                          </div>

                            <div className="mt-4 p-3 bg-slate-50 border rounded-xl max-h-36 overflow-y-auto">
                              <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Live Formatting Preview</p>
                              <div 
                                className="text-slate-700 text-xs space-y-2 [&_h3]:font-bold [&_h3]:text-sm [&_blockquote]:border-l-2 [&_blockquote]:border-[#8B1A4A] [&_blockquote]:pl-2 [&_blockquote]:italic [&_strong]:font-bold"
                                dangerouslySetInnerHTML={{ __html: blocksToHtml(blogBlocks) || '<span class="text-slate-400 italic">No formatting preview available.</span>' }}
                              />
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button type="submit" className="flex-1 h-12 bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] rounded-full text-xs font-bold uppercase transition-all shadow-md">
                              Publish Blog Post
                            </button>
                            {isEditingBlog && (
                              <button 
                                type="button" 
                                onClick={() => {
                                  setIsEditingBlog(false)
                                  setCurrentBlog({ title: '', category: 'Orthopaedics', tag: 'Case Study', body: '', status: 'Active', slug: '', seoTitle: '', seoDesc: '', readTime: '5 min read', image: '' })
                                }}
                                className="h-12 px-6 bg-slate-200 rounded-full text-xs font-bold uppercase"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: News Alerts */}
                  {activeTab === 'news' && activeGroup === 'category' && (
                    <motion.div key="news" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Left list */}
                      <div className="xl:col-span-7 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                        <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Announcements & News ({news.filter(n => n.status !== 'Deleted').length})</h3>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                          {news.filter(n => n.status !== 'Deleted').map(item => (
                            <div key={item.id} className="p-5 rounded-2xl bg-white border border-slate-100 flex justify-between items-center shadow-sm">
                              <div>
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">{item.type}</span>
                                <h4 className="font-bold text-slate-800 text-base mt-2">{item.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 font-semibold">{item.date} · {item.content}</p>
                              </div>
                              <button onClick={() => requestConfirm('Remove News Item?', `"${item.title}" will be removed from the news & alerts feed.`, () => deleteNews(item.id))} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Creator */}
                      <div className="xl:col-span-5 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-4">
                        <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">Create Announcement</h3>
                        <form onSubmit={saveNews} className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Headline</label>
                            <input type="text" value={currentNews.title} onChange={e => setCurrentNews(prev => ({ ...prev, title: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Alert Type</label>
                              <ThemedDropdown
                                value={currentNews.type}
                                onChange={e => setCurrentNews(prev => ({ ...prev, type: e.target.value }))}
                                options={['News', 'Event', 'Award', 'Announcement']}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Publish Date</label>
                              <input type="date" value={currentNews.date} onChange={e => setCurrentNews(prev => ({ ...prev, date: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Short Content Description</label>
                            <textarea value={currentNews.content} onChange={e => setCurrentNews(prev => ({ ...prev, content: e.target.value }))} className="w-full h-20 p-3 rounded-xl border bg-white text-xs" required />
                          </div>
                          <button type="submit" className="w-full h-12 bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] rounded-full text-xs font-bold uppercase transition-all shadow-md mt-4">
                            Save Alert
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Gallery CMS */}
                  {activeTab === 'gallery' && activeGroup === 'category' && (
                    <motion.div key="gallery" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                      <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Gallery CMS</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                        {mediaFiles.filter(f => f.folder === 'Images' || f.folder === 'Videos').map(file => (
                          <div key={file.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between shadow-sm">
                            <div className="h-32 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                              {file.type === 'image' ? (
                                <img src={file.url} className="w-full h-full object-cover" />
                              ) : (
                                <FileText className="w-12 h-12 text-[#8B1A4A]" />
                              )}
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                              <div>
                                <h4 className="font-bold text-slate-800 text-xs truncate max-w-[150px]">{file.name}</h4>
                                <span className="text-[10px] text-[#8B1A4A] font-bold uppercase">{file.folder}</span>
                              </div>
                              <button onClick={() => requestConfirm('Delete Media Asset?', `"${file.name}" will be removed from the gallery.`, () => deleteMediaFile(file.id))} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Careers Board */}
                  {activeTab === 'jobs' && activeGroup === 'category' && (
                    <motion.div key="jobs" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Left: Careers list */}
                      <div className="xl:col-span-7 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                        <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Careers & Fellowship Board ({jobs.length})</h3>
                        
                        <div className="relative">
                          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Search active listings..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-11 pr-4 rounded-xl border bg-white text-xs outline-none focus:border-[#8B1A4A]" 
                          />
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                          {filteredJobs.map(job => (
                            <div key={job.id} className="p-6 rounded-2xl bg-white border border-slate-100 flex justify-between items-center shadow-sm">
                              <div>
                                <h4 className="font-bold text-slate-800 text-lg leading-snug">{job.title}</h4>
                                <p className="text-xs text-[#8B1A4A] font-extrabold uppercase mt-1">{job.department} · {job.location}</p>
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{job.description}</p>
                              </div>
                              <div className="flex gap-2 flex-shrink-0 ml-4">
                                <button 
                                  onClick={() => {
                                    setCurrentJob(job)
                                    setIsEditingJob(true)
                                  }}
                                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => requestConfirm('Delete Job Opening?', `"${job.title}" will be removed from the careers board.`, () => deleteJob(job.id))} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Job opening editor */}
                      <div className="xl:col-span-5 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-4">
                        <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">
                          {isEditingJob ? 'Edit Career Listing' : 'Publish Job Opening'}
                        </h3>
                        <form onSubmit={saveJob} className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Job Title</label>
                            <input type="text" value={currentJob.title} onChange={e => setCurrentJob(prev => ({ ...prev, title: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="e.g. Consultant Surgeon" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Department</label>
                              <input type="text" value={currentJob.department} onChange={e => setCurrentJob(prev => ({ ...prev, department: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Location</label>
                              <input type="text" value={currentJob.location} onChange={e => setCurrentJob(prev => ({ ...prev, location: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Experience Requirement</label>
                              <input type="text" value={currentJob.experience} onChange={e => setCurrentJob(prev => ({ ...prev, experience: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="3+ Years" required />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Status</label>
                              <ThemedDropdown
                                value={currentJob.status}
                                onChange={e => setCurrentJob(prev => ({ ...prev, status: e.target.value }))}
                                options={['Active', 'Closed']}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Job Details & Criteria</label>
                            <textarea value={currentJob.description} onChange={e => setCurrentJob(prev => ({ ...prev, description: e.target.value }))} className="w-full h-24 p-3 rounded-xl border bg-white text-xs" required />
                          </div>
                          
                          <div className="flex gap-3 pt-2">
                            <button type="submit" className="flex-1 h-12 bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] rounded-full text-xs font-bold uppercase transition-all shadow-md">
                              Publish Career Posting
                            </button>
                            {isEditingJob && (
                              <button 
                                type="button" 
                                onClick={() => {
                                  setIsEditingJob(false)
                                  setCurrentJob({ title: '', department: 'Orthopedics', location: 'LB Nagar, Hyd', experience: '', description: '', status: 'Active' })
                                }}
                                className="h-12 px-6 bg-slate-200 rounded-full text-xs font-bold uppercase"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Patient Testimonials */}
                  {activeTab === 'testimonials' && activeGroup === 'category' && (
                    <motion.div key="testimonials" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Left list */}
                      <div className="xl:col-span-7 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                        <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Patient Testimonials ({testimonials.filter(t => t.status !== 'Deleted').length})</h3>
                        <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 custom-admin-scrollbar">
                          {testimonials.filter(t => t.status !== 'Deleted').length === 0 ? (
                            <div className="p-10 text-center border-2 border-dashed border-slate-200/80 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center">
                              <Quote className="w-8 h-8 text-slate-300 mb-3" />
                              <p className="text-sm font-bold text-slate-500">No Patient Testimonials Added Yet</p>
                              <p className="text-xs text-gray-400 mt-1 max-w-sm">Publish inspiring recovery stories using the creator form on the right to display them on the website.</p>
                            </div>
                          ) : (
                            testimonials.filter(t => t.status !== 'Deleted').map(item => (
                              <div key={item.id} className="p-5 rounded-2xl bg-white border border-slate-100 flex justify-between items-start shadow-sm">
                                <div>
                                  <div className="flex items-center gap-1.5 text-amber-500 mb-2">
                                    {Array.from({ length: item.rating }).map((_, i) => (
                                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <h4 className="font-bold text-slate-800 text-base">{item.patientName}</h4>
                                    <span className="px-2 py-0.5 rounded-full bg-[#8B1A4A]/5 text-[#8B1A4A] text-[9px] font-black uppercase tracking-wider">{item.page || 'General / Home'}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1 font-semibold">"{item.review}"</p>
                                  {item.videoUrl && <p className="text-xs text-[#8B1A4A] font-mono mt-2 font-bold">{item.videoUrl}</p>}
                                </div>
                                <button onClick={() => requestConfirm('Remove Testimonial?', `The testimonial from "${item.patientName}" will be permanently deleted.`, () => deleteTestimonial(item.id))} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right Form */}
                      <div className="xl:col-span-5 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-4">
                        <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">Add Testimonial</h3>
                        <form onSubmit={saveTestimonial} className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Patient Name</label>
                            <input type="text" value={currentTestimonial.patientName} onChange={e => setCurrentTestimonial(prev => ({ ...prev, patientName: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Star Rating</label>
                              <ThemedDropdown
                                value={currentTestimonial.rating}
                                onChange={e => setCurrentTestimonial(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                                options={[{ value: 5, label: '5 Stars' }, { value: 4, label: '4 Stars' }, { value: 3, label: '3 Stars' }]}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Page / Branch Category</label>
                              <ThemedDropdown
                                value={currentTestimonial.page}
                                onChange={e => setCurrentTestimonial(prev => ({ ...prev, page: e.target.value }))}
                                options={[
                                  { value: 'General / Home', label: 'General / Home' },
                                  { value: 'About Page', label: 'About Page' },
                                  { value: 'ECIL', label: 'ECIL Branch' },
                                  { value: 'LB Nagar', label: 'LB Nagar Branch' },
                                  { value: 'Kompally', label: 'Kompally Branch' },
                                  { value: 'Miyapur', label: 'Miyapur Branch' },
                                  { value: 'Peerzadiguda', label: 'Peerzadiguda Branch' },
                                  { value: 'Lakdikapul', label: 'Lakdikapul Branch' },
                                  { value: 'Vijayawada', label: 'Vijayawada Branch' },
                                  { value: 'Rajahmundry', label: 'Rajahmundry Branch' },
                                  { value: 'RTC X Roads', label: 'RTC X Roads Branch' },
                                  { value: 'Secunderabad', label: 'Secunderabad Branch' }
                                ]}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Video Testimonial Link</label>
                            <input type="text" value={currentTestimonial.videoUrl} onChange={e => setCurrentTestimonial(prev => ({ ...prev, videoUrl: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="YouTube Embed URL" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Patient Review Comment</label>
                            <textarea value={currentTestimonial.review} onChange={e => setCurrentTestimonial(prev => ({ ...prev, review: e.target.value }))} className="w-full h-24 p-3 rounded-xl border bg-white text-xs" required />
                          </div>
                          <button type="submit" className="w-full h-12 bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] rounded-full text-xs font-bold uppercase transition-all shadow-md">
                            Add Testimonial
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: FAQs CMS */}
                  {activeTab === 'faqs' && activeGroup === 'category' && (
                    <motion.div key="faqs" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Left list */}
                      <div className="xl:col-span-7 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                        <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">FAQs Database ({faqs.filter(f => f.status !== 'Deleted').length})</h3>
                        <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                          {faqs.filter(f => f.status !== 'Deleted').map(faq => (
                            <div key={faq.id} className="p-5 rounded-2xl bg-white border border-slate-100 flex justify-between items-start gap-4">
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm">Q: {faq.question}</h4>
                                <p className="text-xs text-gray-500 mt-2 font-semibold">A: {faq.answer}</p>
                                <span className="text-[10px] bg-slate-100 text-slate-600 font-extrabold px-3 py-1 rounded-full uppercase mt-3 inline-block">{faq.category}</span>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button 
                                  onClick={() => {
                                    setCurrentFaq(faq)
                                    setIsEditingFaq(true)
                                  }}
                                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => requestConfirm('Delete FAQ?', `"${faq.question}" will be permanently removed.`, () => deleteFaq(faq.id))} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Form */}
                      <div className="xl:col-span-5 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-4">
                        <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">
                          {isEditingFaq ? 'Modify FAQ Entry' : 'Create FAQ Entry'}
                        </h3>
                        <form onSubmit={saveFaq} className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Category</label>
                            <ThemedDropdown
                              value={currentFaq.category}
                              onChange={e => setCurrentFaq(prev => ({ ...prev, category: e.target.value }))}
                              options={['General', 'Billing', 'Treatments', 'Robotics']}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Question</label>
                            <input type="text" value={currentFaq.question} onChange={e => setCurrentFaq(prev => ({ ...prev, question: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Answer</label>
                            <textarea value={currentFaq.answer} onChange={e => setCurrentFaq(prev => ({ ...prev, answer: e.target.value }))} className="w-full h-24 p-3 rounded-xl border bg-white text-xs font-semibold" required />
                          </div>
                          <button type="submit" className="w-full h-12 bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] rounded-full text-xs font-bold uppercase transition-all shadow-md">
                            Save FAQ Entry
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Downloads CMS */}
                  {activeTab === 'downloads' && activeGroup === 'category' && (
                    <motion.div key="downloads" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Left list */}
                      <div className="xl:col-span-7 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                        <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Downloadable PDFs & Brochures ({downloads.filter(d => d.status !== 'Deleted').length})</h3>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                          {downloads.filter(d => d.status !== 'Deleted').map(item => (
                            <div key={item.id} className="p-5 rounded-2xl bg-white border border-slate-100 flex justify-between items-center shadow-sm">
                              <div>
                                <h4 className="font-bold text-slate-800 text-base">{item.name}</h4>
                                <p className="text-xs text-gray-500 mt-1 font-semibold">Category: {item.category} · Size: {item.size}</p>
                              </div>
                              <button onClick={() => requestConfirm('Remove Download?', `"${item.name}" will be removed from the downloads library.`, () => deleteDownload(item.id))} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Form */}
                      <div className="xl:col-span-5 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-4">
                        <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">Index New Document</h3>
                        <form onSubmit={saveDownload} className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Document Display Name</label>
                            <input type="text" value={currentDownload.name} onChange={e => setCurrentDownload(prev => ({ ...prev, name: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Category Group</label>
                              <ThemedDropdown
                                value={currentDownload.category}
                                onChange={e => setCurrentDownload(prev => ({ ...prev, category: e.target.value }))}
                                options={['PDFs', 'Health Packages', 'Insurance Documents', 'Clinical Guidelines']}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Simulated Size</label>
                              <input type="text" value={currentDownload.size} onChange={e => setCurrentDownload(prev => ({ ...prev, size: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Link Target / URL</label>
                            <input type="text" value={currentDownload.url} onChange={e => setCurrentDownload(prev => ({ ...prev, url: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="https://..." required />
                          </div>
                          <button type="submit" className="w-full h-12 bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] rounded-full text-xs font-bold uppercase transition-all shadow-md">
                            Publish Download Link
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Locations Management CMS */}
                  {activeTab === 'locations' && activeGroup === 'category' && (
                    <motion.div key="locations" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Left list */}
                      <div className="xl:col-span-7 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                          <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Locations Database ({branchesList.length})</h3>
                          <button
                            onClick={() => {
                              setIsEditingBranch(false)
                              setCurrentBranchDetails({
                                slug: '',
                                title: '',
                                phone: '',
                                address: '',
                                googleRating: 4.8,
                                googleMapEmbed: '',
                                heroImage: '',
                                highlights: '24/7 Trauma, Robotic Surgery, Rehabilitation'
                              })
                            }}
                            className="bg-[#8B1A4A]/5 text-[#8B1A4A] hover:bg-[#8B1A4A]/10 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                          >
                            + Add New
                          </button>
                        </div>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                          {branchesList.map(item => (
                            <div key={item.slug} className="p-5 rounded-2xl bg-white border border-slate-100 flex justify-between items-start gap-4 shadow-sm hover:border-[#8B1A4A]/25 transition-all">
                              <div className="flex gap-4">
                                {item.heroImage && (
                                  <img src={item.heroImage} alt={item.title} className="w-16 h-16 object-cover rounded-xl border border-slate-100 flex-shrink-0" />
                                )}
                                <div>
                                  <h4 className="font-bold text-slate-800 text-base">{item.title}</h4>
                                  <p className="text-xs text-gray-500 mt-1 font-semibold">📍 {item.address}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">📞 {item.phone} · ⭐ {item.googleRating}</p>
                                  <span className="text-[9px] bg-[#8B1A4A]/5 text-[#8B1A4A] font-extrabold px-2.5 py-1 rounded-full uppercase mt-2.5 inline-block">Slug: {item.slug}</span>
                                </div>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button 
                                  onClick={() => {
                                    setCurrentBranchDetails({
                                      ...item,
                                      highlights: Array.isArray(item.highlights) ? item.highlights.join(', ') : item.highlights || ''
                                    })
                                    setIsEditingBranch(true)
                                  }}
                                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteBranch(item.slug)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Form */}
                      <div className="xl:col-span-5 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-4">
                        <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">
                          {isEditingBranch ? 'Edit Location Details' : 'Add New Location'}
                        </h3>
                        <form onSubmit={handleSaveBranch} className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Branch Slug (URL Path ID)</label>
                            <input 
                              type="text" 
                              value={currentBranchDetails.slug} 
                              onChange={e => setCurrentBranchDetails(prev => ({ ...prev, slug: e.target.value }))} 
                              placeholder="e.g. gachibowli (lowercase, no spaces)" 
                              disabled={isEditingBranch}
                              className="w-full h-11 px-3 rounded-xl border bg-white text-xs disabled:bg-slate-50 disabled:text-slate-400" 
                              required 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Location Title / Name</label>
                            <input type="text" value={currentBranchDetails.title} onChange={e => setCurrentBranchDetails(prev => ({ ...prev, title: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Contact Phone</label>
                              <input type="text" value={currentBranchDetails.phone} onChange={e => setCurrentBranchDetails(prev => ({ ...prev, phone: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Google Rating</label>
                              <input type="number" step="0.1" max="5" min="0" value={currentBranchDetails.googleRating} onChange={e => setCurrentBranchDetails(prev => ({ ...prev, googleRating: parseFloat(e.target.value) }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Address Text</label>
                            <input type="text" value={currentBranchDetails.address} onChange={e => setCurrentBranchDetails(prev => ({ ...prev, address: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" required />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400">Exterior Building Image URL</label>
                              <button 
                                type="button" 
                                onClick={() => {
                                  setMediaTargetField(() => (url) => setCurrentBranchDetails(prev => ({ ...prev, heroImage: url })))
                                  setShowMediaPickerModal(true)
                                }}
                                className="text-[10px] font-black uppercase text-[#8B1A4A] hover:underline"
                              >
                                Select from Gallery
                              </button>
                            </div>
                            <input type="text" value={currentBranchDetails.heroImage} onChange={e => setCurrentBranchDetails(prev => ({ ...prev, heroImage: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="https://..." required />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Google Maps Embed URL (src parameter)</label>
                            <input type="text" value={currentBranchDetails.googleMapEmbed} onChange={e => setCurrentBranchDetails(prev => ({ ...prev, googleMapEmbed: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="https://www.google.com/maps/embed?..." required />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Highlights (comma separated)</label>
                            <input type="text" value={currentBranchDetails.highlights} onChange={e => setCurrentBranchDetails(prev => ({ ...prev, highlights: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="Robotic Surgery, 24/7 Trauma, Rehabilitation" />
                          </div>

                          <div className="flex gap-2 pt-2">
                            {isEditingBranch && (
                              <button 
                                type="button" 
                                onClick={() => {
                                  setIsEditingBranch(false)
                                  setCurrentBranchDetails({
                                    slug: '',
                                    title: '',
                                    phone: '',
                                    address: '',
                                    googleRating: 4.8,
                                    googleMapEmbed: '',
                                    heroImage: '',
                                    highlights: '24/7 Trauma, Robotic Surgery, Rehabilitation'
                                  })
                                }}
                                className="w-1/2 h-12 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-full text-xs font-bold uppercase transition-all"
                              >
                                Cancel
                              </button>
                            )}
                            <button type="submit" className={`h-12 bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] rounded-full text-xs font-bold uppercase transition-all shadow-md ${isEditingBranch ? 'w-1/2' : 'w-full'}`}>
                              {isEditingBranch ? 'Update Location' : 'Add Location'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Media Library */}
                  {activeTab === 'media' && activeGroup === 'category' && (
                    <motion.div key="media" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="glass-card-admin rounded-[32px] p-8 shadow-sm flex justify-between items-center flex-wrap gap-4">
                        <div>
                          <h2 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Enterprise Media Assets</h2>
                          <p className="text-xs text-gray-500 mt-1">Upload and reuse documents, video clips, and high-fidelity photos</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                        {/* File Grid */}
                        <div className="xl:col-span-8 glass-card-admin rounded-[32px] p-8 shadow-sm">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                            {mediaFiles.map((media) => (
                              <div key={media.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between min-h-[160px] shadow-sm relative group hover:border-[#8B1A4A]/25 transition-all">
                                <div className="h-24 bg-slate-55 rounded-xl overflow-hidden flex items-center justify-center relative">
                                  {media.type === 'image' ? (
                                    <img src={media.url} className="w-full h-full object-cover" />
                                  ) : (
                                    <FileCode className="w-12 h-12 text-[#8B1A4A]" />
                                  )}
                                  <span className="absolute top-2 left-2 bg-[#2D3A4A] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow">
                                    {media.folder}
                                  </span>
                                </div>
                                <div className="mt-3">
                                  <h4 className="text-xs font-bold text-slate-800 truncate">{media.name}</h4>
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="text-[10px] text-gray-400 font-semibold">{media.size}</span>
                                    <button
                                      onClick={() => requestConfirm('Delete Media Asset?', `"${media.name}" will be removed from the media library.`, () => deleteMediaFile(media.id))}
                                      className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Simulated upload */}
                        <div className="xl:col-span-4 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-4">
                          <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">Simulated Assets Upload</h3>
                          <form onSubmit={handleUploadMediaSimulate} className="space-y-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Asset Filename</label>
                              <input type="text" value={newMediaFile.name} onChange={e => setNewMediaFile(prev => ({ ...prev, name: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="banner_new.png" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Asset Type</label>
                                <ThemedDropdown
                                  value={newMediaFile.type}
                                  onChange={e => setNewMediaFile(prev => ({ ...prev, type: e.target.value }))}
                                  options={[{ value: 'image', label: 'Image' }, { value: 'document', label: 'Document' }, { value: 'video', label: 'Video' }]}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Folder Category</label>
                                <ThemedDropdown
                                  value={newMediaFile.folder}
                                  onChange={e => setNewMediaFile(prev => ({ ...prev, folder: e.target.value }))}
                                  options={['Images', 'Documents', 'Videos']}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Simulated URL Link</label>
                              <input type="text" value={newMediaFile.url} onChange={e => setNewMediaFile(prev => ({ ...prev, url: e.target.value }))} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="https://..." required />
                            </div>
                            <button type="submit" disabled={uploadingMedia} className="w-full h-12 bg-[#8B1A4A] hover:bg-[#2D3A4A] text-white rounded-full text-xs font-bold uppercase transition-all shadow-md flex items-center justify-center gap-2">
                              {uploadingMedia ? 'Compressing & Syncing...' : 'Index Asset'}
                            </button>
                          </form>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ============================================== */}
                  {/* PAGE-WISE CMS MODULES                          */}
                  {/* ============================================== */}
                  
                  {/* TAB: Homepage Editor */}
                  {activeTab === 'homepage' && activeGroup === 'page' && (
                    <motion.div key="homepage" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Editor form */}
                      <div className="xl:col-span-8 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                        <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Homepage Layout Customizer</h3>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Hero Banner Title Line</label>
                              <input type="text" value={pageData.homepage.heroHeadline} onChange={e => savePageData('homepage', { ...pageData.homepage, heroHeadline: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Hero Highlight Text</label>
                              <input type="text" value={pageData.homepage.heroHighlight} onChange={e => savePageData('homepage', { ...pageData.homepage, heroHighlight: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Hero Description Paragraph</label>
                            <textarea value={pageData.homepage.description} onChange={e => savePageData('homepage', { ...pageData.homepage, description: e.target.value })} className="w-full h-20 p-3 rounded-xl border bg-white text-xs" />
                          </div>

                           <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Emergency Hotline Number</label>
                              <input type="text" value={pageData.homepage.emergencyNumber} onChange={e => savePageData('homepage', { ...pageData.homepage, emergencyNumber: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Served Stats (e.g. 100K+)</label>
                              <input type="text" value={pageData.homepage.statsServed} onChange={e => savePageData('homepage', { ...pageData.homepage, statsServed: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Specialties Stats (e.g. 15+)</label>
                              <input type="text" value={pageData.homepage.statsSpecialties} onChange={e => savePageData('homepage', { ...pageData.homepage, statsSpecialties: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Hero Background Image URL (Fallback / Mobile)</label>
                              <input type="text" value={pageData.homepage.heroImage || ''} onChange={e => savePageData('homepage', { ...pageData.homepage, heroImage: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="https://..." />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Hero Background Video URL (Desktop)</label>
                              <input type="text" value={pageData.homepage.heroVideo || ''} onChange={e => savePageData('homepage', { ...pageData.homepage, heroVideo: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder="https://..." />
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Right info preview */}
                      <div className="xl:col-span-4 p-8 rounded-[32px] bg-slate-50 border border-slate-200 shadow-inner flex flex-col justify-between">
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Homepage Banner Live Preview</p>
                          <div className="bg-[#8B1A4A] p-6 rounded-2xl text-white space-y-3 shadow-md">
                            <h4 className="font-bold text-xl leading-tight">
                              {pageData.homepage.heroHeadline}<br/>
                              <span className="text-[#cca830]">{pageData.homepage.heroHighlight}</span>
                            </h4>
                            <p className="text-[10px] text-white/80 line-clamp-3">{pageData.homepage.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: About Page */}
                  {activeTab === 'aboutpage' && activeGroup === 'page' && (
                    <motion.div key="aboutpage" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Editor form */}
                      <div className="xl:col-span-8 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                        <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">About Us Page Customizer</h3>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Founder / Chairman Name</label>
                              <input type="text" value={pageData.about.chairmanName} onChange={e => savePageData('about', { ...pageData.about, chairmanName: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Chairman Title Subtitle</label>
                              <input type="text" value={pageData.about.chairmanSubtitle} onChange={e => savePageData('about', { ...pageData.about, chairmanSubtitle: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Chairman Spotlight Bio Statement</label>
                            <textarea value={pageData.about.chairmanBio} onChange={e => savePageData('about', { ...pageData.about, chairmanBio: e.target.value })} className="w-full h-24 p-3 rounded-xl border bg-white text-xs" />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Milestones & History Summary</label>
                            <textarea value={pageData.about.milestones} onChange={e => savePageData('about', { ...pageData.about, milestones: e.target.value })} className="w-full h-20 p-3 rounded-xl border bg-white text-xs" />
                          </div>

                        </div>
                      </div>

                      {/* Right info preview */}
                      <div className="xl:col-span-4 p-8 rounded-[32px] bg-slate-50 border border-slate-200 shadow-inner flex flex-col justify-between">
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Spotlight Preview</p>
                          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-3">
                            <h4 className="font-bold text-slate-800 text-lg leading-tight">{pageData.about.chairmanName}</h4>
                            <p className="text-xs text-[#8B1A4A] font-bold">{pageData.about.chairmanSubtitle}</p>
                            <p className="text-xs text-gray-500 italic">"{pageData.about.chairmanBio}"</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Careers Landing */}
                  {activeTab === 'careers_customizer' && activeGroup === 'page' && (
                    <motion.div key="careers_customizer" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Editor form */}
                      <div className="xl:col-span-8 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                        <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Careers & Fellowship Landing Page</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Hiring Banner Title</label>
                            <input type="text" value={pageData.careers_page.bannerTitle} onChange={e => savePageData('careers_page', { ...pageData.careers_page, bannerTitle: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Hiring Subtitle Tagline</label>
                            <textarea value={pageData.careers_page.bannerSubtitle} onChange={e => savePageData('careers_page', { ...pageData.careers_page, bannerSubtitle: e.target.value })} className="w-full h-16 p-3 rounded-xl border bg-white text-xs" />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Company Benefits List (Comma Separated)</label>
                            <input type="text" value={pageData.careers_page.benefits} onChange={e => savePageData('careers_page', { ...pageData.careers_page, benefits: e.target.value })} className="w-full h-11 px-3 rounded-xl border bg-white text-xs" />
                          </div>
                        </div>
                      </div>

                      {/* Right info preview */}
                      <div className="xl:col-span-4 p-8 rounded-[32px] bg-slate-50 border border-slate-200 shadow-inner flex flex-col justify-between">
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Hiring Banner Preview</p>
                          <div className="bg-[#2D3A4A] p-6 rounded-2xl text-white space-y-3 shadow-md">
                            <h4 className="font-bold text-lg leading-tight">{pageData.careers_page.bannerTitle}</h4>
                            <p className="text-xs text-white/80">{pageData.careers_page.bannerSubtitle}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Branch Landing Pages */}
                  {activeTab === 'branches' && activeGroup === 'page' && (
                    <motion.div key="branches" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Editor form */}
                      <div className="xl:col-span-8 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                          <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Branch Landing Page Editor</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500">Edit Branch:</span>
                            <div className="relative">
                              <button 
                                type="button"
                                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                                className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700 flex items-center justify-between gap-3 min-w-[160px] shadow-sm hover:border-[#8B1A4A]/30 transition-all focus:outline-none"
                              >
                                <span>{
                                  branchesList.find(b => b.slug === selectedBranchSlug)?.title || selectedBranchSlug.toUpperCase()
                                }</span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${branchDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              {branchDropdownOpen && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setBranchDropdownOpen(false)}
                                  />
                                  
                                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl z-50 focus:outline-none max-h-[300px] overflow-y-auto space-y-1">
                                    {branchesList.map(opt => (
                                      <button
                                        key={opt.slug}
                                        type="button"
                                        onClick={() => {
                                          setSelectedBranchSlug(opt.slug)
                                          setBranchDropdownOpen(false)
                                        }}
                                        className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                          selectedBranchSlug === opt.slug 
                                            ? 'bg-[#8B1A4A] text-white shadow-sm' 
                                            : 'text-slate-600 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A]'
                                        }`}
                                      >
                                        <span>{opt.title}</span>
                                        {selectedBranchSlug === opt.slug && <Check className="w-3.5 h-3.5" />}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {pageData.branches[selectedBranchSlug] ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Branch Hero Headline</label>
                                <input 
                                  type="text" 
                                  value={pageData.branches[selectedBranchSlug].heroHeadline} 
                                  onChange={e => {
                                    const copy = { ...pageData.branches[selectedBranchSlug], heroHeadline: e.target.value }
                                    saveBranchData(selectedBranchSlug, copy)
                                  }} 
                                  className="w-full h-11 px-3 rounded-xl border bg-white text-xs" 
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Hero Highlight text</label>
                                <input 
                                  type="text" 
                                  value={pageData.branches[selectedBranchSlug].heroHighlight} 
                                  onChange={e => {
                                    const copy = { ...pageData.branches[selectedBranchSlug], heroHighlight: e.target.value }
                                    saveBranchData(selectedBranchSlug, copy)
                                  }} 
                                  className="w-full h-11 px-3 rounded-xl border bg-white text-xs" 
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Branch Description Paragraph</label>
                              <textarea 
                                value={pageData.branches[selectedBranchSlug].description} 
                                onChange={e => {
                                  const copy = { ...pageData.branches[selectedBranchSlug], description: e.target.value }
                                  saveBranchData(selectedBranchSlug, copy)
                                }} 
                                className="w-full h-20 p-3 rounded-xl border bg-white text-xs" 
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Contact Phone</label>
                                <input 
                                  type="text" 
                                  value={pageData.branches[selectedBranchSlug].phone} 
                                  onChange={e => {
                                    const copy = { ...pageData.branches[selectedBranchSlug], phone: e.target.value }
                                    saveBranchData(selectedBranchSlug, copy)
                                  }} 
                                  className="w-full h-11 px-3 rounded-xl border bg-white text-xs" 
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Google review Rating</label>
                                <input 
                                  type="number" 
                                  step="0.1" 
                                  value={pageData.branches[selectedBranchSlug].rating} 
                                  onChange={e => {
                                    const copy = { ...pageData.branches[selectedBranchSlug], rating: parseFloat(e.target.value) }
                                    saveBranchData(selectedBranchSlug, copy)
                                  }} 
                                  className="w-full h-11 px-3 rounded-xl border bg-white text-xs" 
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Branch Address</label>
                                <input 
                                  type="text" 
                                  value={pageData.branches[selectedBranchSlug].address} 
                                  onChange={e => {
                                    const copy = { ...pageData.branches[selectedBranchSlug], address: e.target.value }
                                    saveBranchData(selectedBranchSlug, copy)
                                  }} 
                                  className="w-full h-11 px-3 rounded-xl border bg-white text-xs" 
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Hero Background Image URL (Fallback / Mobile)</label>
                                <input 
                                  type="text" 
                                  value={pageData.branches[selectedBranchSlug].heroImage || ''} 
                                  onChange={e => {
                                    const copy = { ...pageData.branches[selectedBranchSlug], heroImage: e.target.value }
                                    saveBranchData(selectedBranchSlug, copy)
                                  }} 
                                  className="w-full h-11 px-3 rounded-xl border bg-white text-xs" 
                                  placeholder="https://..." 
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Hero Background Video URL (Desktop)</label>
                                <input 
                                  type="text" 
                                  value={pageData.branches[selectedBranchSlug].heroVideo || ''} 
                                  onChange={e => {
                                    const copy = { ...pageData.branches[selectedBranchSlug], heroVideo: e.target.value }
                                    saveBranchData(selectedBranchSlug, copy)
                                  }} 
                                  className="w-full h-11 px-3 rounded-xl border bg-white text-xs" 
                                  placeholder="https://..." 
                                />
                              </div>
                            </div>

                        </div>
                        ) : (
                          <div className="text-center py-10">
                            <button 
                              onClick={() => {
                                const copy = { ...pageData }
                                copy.branches[selectedBranchSlug] = { heroHeadline: 'Srikara Hospital', heroHighlight: 'Healthcare Excellence', description: 'Advanced care hospital branch.', phone: '040-46464646', address: 'Hyderabad', rating: 4.5, heroImage: '', heroVideo: '' }
                                setPageData(copy)
                              }}
                              className="px-6 h-12 bg-[#8B1A4A] text-white rounded-full text-xs font-bold uppercase"
                            >
                              Initialize Branch Content Structure
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right info preview */}
                      <div className="xl:col-span-4 p-8 rounded-[32px] bg-slate-50 border border-slate-200 shadow-inner flex flex-col justify-between">
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Branch Page Hero Preview</p>
                          {pageData.branches[selectedBranchSlug] && (
                            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                              <h4 className="font-bold text-slate-800 text-lg leading-tight">
                                {pageData.branches[selectedBranchSlug].heroHeadline}{' '}
                                <span className="text-[#8B1A4A]">{pageData.branches[selectedBranchSlug].heroHighlight}</span>
                              </h4>
                              <p className="text-xs text-gray-500 leading-relaxed">{pageData.branches[selectedBranchSlug].description}</p>
                              <div className="border-t pt-3 flex justify-between text-[11px] font-bold text-[#2D3A4A]">
                                <span>📞 {pageData.branches[selectedBranchSlug].phone}</span>
                                <span>⭐ {pageData.branches[selectedBranchSlug].rating} Google</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ============================================== */}
                  {/* SEO CMS SETTINGS PANEL                         */}
                  {/* ============================================== */}
                  
                  {/* TAB: SEO Meta Manager */}
                  {activeTab === 'seo' && activeGroup === 'seo' && (
                    <motion.div key="seo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Editor form */}
                      <div className="xl:col-span-8 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                          <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">SEO CMS Manager</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500">Edit Page:</span>
                            <ThemedDropdown
                              value={selectedSeoPage}
                              onChange={e => setSelectedSeoPage(e.target.value)}
                              heightClass="h-10"
                              className="w-56"
                              options={[{ value: 'homepage', label: 'Homepage' }, { value: 'about', label: 'About Us Page' }, { value: 'careers', label: 'Careers & Fellowships' }]}
                            />
                          </div>
                        </div>
                        
                        {seoData[selectedSeoPage] ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Helmet Meta Title Tag</label>
                              <input 
                                type="text" 
                                value={seoData[selectedSeoPage].title} 
                                onChange={e => {
                                  const copy = { ...seoData[selectedSeoPage], title: e.target.value }
                                  saveSeoData(selectedSeoPage, copy)
                                }} 
                                className="w-full h-11 px-3 rounded-xl border bg-white text-xs" 
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Meta Description (Snippet)</label>
                              <textarea 
                                value={seoData[selectedSeoPage].desc} 
                                onChange={e => {
                                  const copy = { ...seoData[selectedSeoPage], desc: e.target.value }
                                  saveSeoData(selectedSeoPage, copy)
                                }} 
                                className="w-full h-20 p-3 rounded-xl border bg-white text-xs font-semibold" 
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">SEO Target Keywords (Comma Separated)</label>
                              <input 
                                type="text" 
                                value={seoData[selectedSeoPage].keywords} 
                                onChange={e => {
                                  const copy = { ...seoData[selectedSeoPage], keywords: e.target.value }
                                  saveSeoData(selectedSeoPage, copy)
                                }} 
                                className="w-full h-11 px-3 rounded-xl border bg-white text-xs" 
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <button 
                              onClick={() => {
                                const copy = { ...seoData }
                                copy[selectedSeoPage] = { title: 'Srikara Page', desc: 'Metadata descriptions', keywords: 'hospitals, care' }
                                setSeoData(copy)
                              }}
                              className="px-6 h-12 bg-[#8B1A4A] text-white rounded-full text-xs font-bold uppercase"
                            >
                              Initialize Page Metadata
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right info preview */}
                      <div className="xl:col-span-4 p-8 rounded-[32px] bg-slate-50 border border-slate-200 shadow-inner flex flex-col justify-between">
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Search Engine Result Snippet Preview</p>
                          {seoData[selectedSeoPage] && (
                            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
                              <h4 className="font-bold text-[#1a0dab] text-lg leading-snug hover:underline cursor-pointer">
                                {seoData[selectedSeoPage].title}
                              </h4>
                              <p className="text-xs text-[#006621] font-semibold">https://srikarahospitals.com/{selectedSeoPage === 'homepage' ? '' : selectedSeoPage}</p>
                              <p className="text-xs text-gray-500 leading-normal">{seoData[selectedSeoPage].desc}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Admin Users & Roles (Super Admin only) */}
                  {activeTab === 'admin_users' && activeGroup === 'admin' && (
                    <motion.div key="admin_users" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                      {/* Left: Admin list */}
                      <div className="xl:col-span-7 space-y-6">
                        <div className="glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                          <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Admin Accounts ({adminUsers.length})</h3>
                          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                            {adminUsers.map(a => (
                              <div key={a.id} className="p-4 rounded-2xl border border-slate-100 bg-white flex items-center justify-between gap-4">
                                <div>
                                  <p className="text-sm font-bold text-slate-800">{a.displayName || a.email}</p>
                                  <p className="text-xs text-slate-500">{a.email} &middot; {a.role}</p>
                                  {(a.extraPermissions?.length > 0 || a.revokedPermissions?.length > 0) && (
                                    <p className="text-[10px] text-slate-400 mt-1">
                                      {a.extraPermissions?.length > 0 && `+${a.extraPermissions.length} extra `}
                                      {a.revokedPermissions?.length > 0 && `-${a.revokedPermissions.length} revoked`}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2 items-center">
                                  {a.role !== 'Super Admin' && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingAdminId(a.id)
                                          setCurrentAdminUser({
                                            email: a.email,
                                            displayName: a.displayName || '',
                                            password: '',
                                            role: a.role,
                                            extraPermissions: a.extraPermissions || [],
                                            revokedPermissions: a.revokedPermissions || []
                                          })
                                        }}
                                        className="p-2 text-slate-400 hover:text-[#8B1A4A] transition-colors"
                                        title="Edit Permissions"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => deleteAdminUser(a)}
                                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                        title="Delete Account"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => toggleAdminActive(a)}
                                    className={`px-3 h-9 rounded-full text-[10px] font-black uppercase tracking-wide ${
                                      a.active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                    }`}
                                  >
                                    {a.active !== false ? 'Active' : 'Disabled'}
                                  </button>
                                </div>
                              </div>
                            ))}
                            {adminUsers.length === 0 && (
                              <p className="text-xs text-slate-400 text-center py-8">No admin accounts yet — create one on the right.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Create admin form */}
                      <div className="xl:col-span-5 space-y-6">
                        <form onSubmit={saveAdminUser} className="glass-card-admin rounded-[32px] p-8 shadow-sm space-y-5">
                          <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">{editingAdminId ? 'Edit Admin Permissions' : 'New Admin'}</h3>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Email</label>
                            <input type="email" required disabled={!!editingAdminId} value={currentAdminUser.email}
                              onChange={e => setCurrentAdminUser(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full h-11 px-3 rounded-xl border bg-white text-xs disabled:opacity-50" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Display Name</label>
                            <input type="text" value={currentAdminUser.displayName}
                              onChange={e => setCurrentAdminUser(prev => ({ ...prev, displayName: e.target.value }))}
                              className="w-full h-11 px-3 rounded-xl border bg-white text-xs" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Password</label>
                            <input type="password" required={!editingAdminId} value={currentAdminUser.password || ''}
                              onChange={e => setCurrentAdminUser(prev => ({ ...prev, password: e.target.value }))}
                              className="w-full h-11 px-3 rounded-xl border bg-white text-xs" placeholder={editingAdminId ? "Leave blank to keep unchanged" : "Create temporary or permanent password"} />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Role</label>
                            <ThemedDropdown
                              value={currentAdminUser.role}
                              onChange={e => setCurrentAdminUser(prev => ({ ...prev, role: e.target.value, extraPermissions: [], revokedPermissions: [] }))}
                              options={ROLES.filter(r => r !== 'Super Admin')}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Extra Permissions (beyond role default)</label>
                            <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto pr-1">
                              {OVERRIDABLE_MODULES.filter(m => !(ROLE_DEFAULT_PERMISSIONS[currentAdminUser.role] || []).includes(m)).map(m => (
                                <label key={m} className="flex items-center gap-2 text-[11px] text-slate-600">
                                  <input type="checkbox"
                                    checked={currentAdminUser.extraPermissions.includes(m)}
                                    onChange={e => setCurrentAdminUser(prev => ({
                                      ...prev,
                                      extraPermissions: e.target.checked ? [...prev.extraPermissions, m] : prev.extraPermissions.filter(x => x !== m)
                                    }))}
                                  />
                                  {MODULE_LABELS[m]}
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Revoke From Role Default</label>
                            <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto pr-1">
                              {(ROLE_DEFAULT_PERMISSIONS[currentAdminUser.role] || []).map(m => (
                                <label key={m} className="flex items-center gap-2 text-[11px] text-slate-600">
                                  <input type="checkbox"
                                    checked={currentAdminUser.revokedPermissions.includes(m)}
                                    onChange={e => setCurrentAdminUser(prev => ({
                                      ...prev,
                                      revokedPermissions: e.target.checked ? [...prev.revokedPermissions, m] : prev.revokedPermissions.filter(x => x !== m)
                                    }))}
                                  />
                                  {MODULE_LABELS[m]}
                                </label>
                              ))}
                            </div>
                          </div>
                          <button type="submit" disabled={creatingAdminUser}
                            className="w-full h-12 bg-[#8B1A4A] text-white rounded-full text-xs font-bold uppercase disabled:opacity-50">
                            {creatingAdminUser ? (editingAdminId ? 'Saving…' : 'Creating…') : (editingAdminId ? 'Save Permissions' : 'Create Admin Account')}
                          </button>
                          {editingAdminId && (
                            <button type="button" onClick={() => {
                              setEditingAdminId(null)
                              setCurrentAdminUser({ email: '', displayName: '', password: '', role: 'Reception', extraPermissions: [], revokedPermissions: [] })
                            }} className="w-full h-10 mt-2 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors rounded-full text-xs font-bold uppercase">
                              Cancel Editing
                            </button>
                          )}
                          {auth && !editingAdminId && <p className="text-[10px] text-slate-400 text-center">Set a temporary or permanent password. The new administrator can log in immediately.</p>}
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: Audit & History Log */}
                  {activeTab === 'history' && activeGroup === 'admin' && (
                    <motion.div key="history" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                      
                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                        
                        {/* LEFT: Recycle Bin (Soft-deleted Items) */}
                        <div className="xl:col-span-6 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                          <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A] flex items-center gap-2">
                            <Trash2 className="w-6 h-6 text-rose-500" /> Recycle Bin
                          </h3>
                          <p className="text-xs text-gray-500">Restore soft-deleted items back to the live site or purge them forever.</p>
                          
                          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-admin-scrollbar">
                            
                            {/* Section: Doctors */}
                            {doctors.filter(d => d.status === 'Deleted').length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Deleted Doctor Profiles ({doctors.filter(d => d.status === 'Deleted').length})</h4>
                                <div className="space-y-2">
                                  {doctors.filter(d => d.status === 'Deleted').map(doc => (
                                    <div key={doc.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                                      <span className="font-bold text-slate-800">{doc.name} ({doc.specialty})</span>
                                      <div className="flex gap-2">
                                        <button onClick={async () => {
                                          const restoredItem = { ...doc, status: 'Active', deletedAt: null, deletedBy: null }
                                          const updated = doctors.map(d => String(d.id) === String(doc.id) ? restoredItem : d)
                                          setDoctors(updated)
                                          await persistToStore('doctors', updated)
                                          if (db) await setDoc(doc(db, 'doctors', doc.id), restoredItem)
                                          await logChange('Restore', 'doctors', doc.id, doc.name, null, doc)
                                          notifyUser('success', `Restored ${doc.name}`)
                                        }} className="text-xs text-emerald-600 font-bold hover:underline">Restore</button>
                                        <button onClick={() => requestConfirm('Purge Forever?', `Are you sure you want to permanently delete "${doc.name}"? This cannot be undone.`, async () => {
                                          const updated = doctors.filter(d => String(d.id) !== String(doc.id))
                                          setDoctors(updated)
                                          await persistToStore('doctors', updated)
                                          if (db) await deleteDoc(doc(db, 'doctors', doc.id))
                                          notifyUser('success', `Permanently purged ${doc.name}`)
                                        })} className="text-xs text-rose-600 font-bold hover:underline">Purge</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section: Testimonials */}
                            {testimonials.filter(t => t.status === 'Deleted').length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Deleted Testimonials ({testimonials.filter(t => t.status === 'Deleted').length})</h4>
                                <div className="space-y-2">
                                  {testimonials.filter(t => t.status === 'Deleted').map(item => (
                                    <div key={item.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                                      <span className="font-bold text-slate-800">{item.patientName}</span>
                                      <div className="flex gap-2">
                                        <button onClick={async () => {
                                          const restoredTestimonial = { ...item, status: 'Active', deletedAt: null, deletedBy: null }
                                          const updated = testimonials.map(t => String(t.id) === String(item.id) ? restoredTestimonial : t)
                                          setTestimonials(updated)
                                          await persistToStore('testimonials', updated)
                                          if (db) await setDoc(doc(db, 'testimonials', item.id), restoredTestimonial)
                                          await logChange('Restore', 'testimonials', item.id, item.patientName, null, item)
                                          notifyUser('success', `Restored testimonial from ${item.patientName}`)
                                        }} className="text-xs text-emerald-600 font-bold hover:underline">Restore</button>
                                        <button onClick={() => requestConfirm('Purge Forever?', `Are you sure you want to permanently delete this testimonial?`, async () => {
                                          const updated = testimonials.filter(t => String(t.id) !== String(item.id))
                                          setTestimonials(updated)
                                          await persistToStore('testimonials', updated)
                                          if (db) await deleteDoc(doc(db, 'testimonials', item.id))
                                          notifyUser('success', `Permanently purged testimonial`)
                                        })} className="text-xs text-rose-600 font-bold hover:underline">Purge</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section: Blogs */}
                            {blogs.filter(b => b.status === 'Deleted').length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Deleted Blogs ({blogs.filter(b => b.status === 'Deleted').length})</h4>
                                <div className="space-y-2">
                                  {blogs.filter(b => b.status === 'Deleted').map(item => (
                                    <div key={item.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                                      <span className="font-bold text-slate-800">{item.title}</span>
                                      <div className="flex gap-2">
                                        <button onClick={async () => {
                                          const restored = { ...item, status: 'Active', deletedAt: null, deletedBy: null }
                                          const updated = blogs.map(b => String(b.id) === String(item.id) ? restored : b)
                                          setBlogs(updated)
                                          await persistToStore('blogs', updated)
                                          if (db) await setDoc(doc(db, 'blogs', item.id), restored)
                                          await logChange('Restore', 'blogs', item.id, item.title, null, item)
                                          notifyUser('success', `Restored blog article`)
                                        }} className="text-xs text-emerald-600 font-bold hover:underline">Restore</button>
                                        <button onClick={() => requestConfirm('Purge Forever?', `Are you sure you want to permanently delete this blog?`, async () => {
                                          const updated = blogs.filter(b => String(b.id) !== String(item.id))
                                          setBlogs(updated)
                                          await persistToStore('blogs', updated)
                                          if (db) await deleteDoc(doc(db, 'blogs', item.id))
                                          notifyUser('success', `Permanently purged blog article`)
                                        })} className="text-xs text-rose-600 font-bold hover:underline">Purge</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section: FAQs */}
                            {faqs.filter(f => f.status === 'Deleted').length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Deleted FAQs ({faqs.filter(f => f.status === 'Deleted').length})</h4>
                                <div className="space-y-2">
                                  {faqs.filter(f => f.status === 'Deleted').map(item => (
                                    <div key={item.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                                      <span className="font-bold text-slate-800">{item.question}</span>
                                      <div className="flex gap-2">
                                        <button onClick={async () => {
                                          const restored = { ...item, status: 'Active', deletedAt: null, deletedBy: null }
                                          const updated = faqs.map(f => String(f.id) === String(item.id) ? restored : f)
                                          setFaqs(updated)
                                          await persistToStore('faqs', updated)
                                          if (db) await setDoc(doc(db, 'faqs', item.id), restored)
                                          await logChange('Restore', 'faqs', item.id, item.question, null, item)
                                          notifyUser('success', `Restored FAQ`)
                                        }} className="text-xs text-emerald-600 font-bold hover:underline">Restore</button>
                                        <button onClick={() => requestConfirm('Purge Forever?', `Are you sure you want to permanently delete this FAQ?`, async () => {
                                          const updated = faqs.filter(f => String(f.id) !== String(item.id))
                                          setFaqs(updated)
                                          await persistToStore('faqs', updated)
                                          if (db) await deleteDoc(doc(db, 'faqs', item.id))
                                          notifyUser('success', `Permanently purged FAQ`)
                                        })} className="text-xs text-rose-600 font-bold hover:underline">Purge</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section: Jobs */}
                            {jobs.filter(j => j.status === 'Deleted').length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Deleted Jobs ({jobs.filter(j => j.status === 'Deleted').length})</h4>
                                <div className="space-y-2">
                                  {jobs.filter(j => j.status === 'Deleted').map(item => (
                                    <div key={item.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                                      <span className="font-bold text-slate-800">{item.title}</span>
                                      <div className="flex gap-2">
                                        <button onClick={async () => {
                                          const restored = { ...item, status: 'Active', deletedAt: null, deletedBy: null }
                                          const updated = jobs.map(j => String(j.id) === String(item.id) ? restored : j)
                                          setJobs(updated)
                                          await persistToStore('jobs', updated)
                                          if (db) await setDoc(doc(db, 'job_openings', item.id), restored)
                                          await logChange('Restore', 'jobs', item.id, item.title, null, item)
                                          notifyUser('success', `Restored job opening`)
                                        }} className="text-xs text-emerald-600 font-bold hover:underline">Restore</button>
                                        <button onClick={() => requestConfirm('Purge Forever?', `Are you sure you want to permanently delete this job?`, async () => {
                                          const updated = jobs.filter(j => String(j.id) !== String(item.id))
                                          setJobs(updated)
                                          await persistToStore('jobs', updated)
                                          if (db) await deleteDoc(doc(db, 'job_openings', item.id))
                                          notifyUser('success', `Permanently purged job opening`)
                                        })} className="text-xs text-rose-600 font-bold hover:underline">Purge</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section: Downloads */}
                            {downloads.filter(d => d.status === 'Deleted').length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Deleted Downloads ({downloads.filter(d => d.status === 'Deleted').length})</h4>
                                <div className="space-y-2">
                                  {downloads.filter(d => d.status === 'Deleted').map(item => (
                                    <div key={item.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                                      <span className="font-bold text-slate-800">{item.name}</span>
                                      <div className="flex gap-2">
                                        <button onClick={async () => {
                                          const restored = { ...item, status: 'Active', deletedAt: null, deletedBy: null }
                                          const updated = downloads.map(d => String(d.id) === String(item.id) ? restored : d)
                                          setDownloads(updated)
                                          await persistToStore('downloads', updated)
                                          if (db) await setDoc(doc(db, 'downloads', item.id), restored)
                                          await logChange('Restore', 'downloads', item.id, item.name, null, item)
                                          notifyUser('success', `Restored download item`)
                                        }} className="text-xs text-emerald-600 font-bold hover:underline">Restore</button>
                                        <button onClick={() => requestConfirm('Purge Forever?', `Are you sure you want to permanently delete this download link?`, async () => {
                                          const updated = downloads.filter(d => String(d.id) !== String(item.id))
                                          setDownloads(updated)
                                          await persistToStore('downloads', updated)
                                          if (db) await deleteDoc(doc(db, 'downloads', item.id))
                                          notifyUser('success', `Permanently purged download item`)
                                        })} className="text-xs text-rose-600 font-bold hover:underline">Purge</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section: Departments */}
                            {departments.filter(d => d.status === 'Deleted').length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Deleted Departments ({departments.filter(d => d.status === 'Deleted').length})</h4>
                                <div className="space-y-2">
                                  {departments.filter(d => d.status === 'Deleted').map(item => (
                                    <div key={item.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                                      <span className="font-bold text-slate-800">{item.name}</span>
                                      <div className="flex gap-2">
                                        <button onClick={async () => {
                                          const restored = { ...item, status: 'Active', deletedAt: null, deletedBy: null }
                                          const updated = departments.map(d => String(d.id) === String(item.id) ? restored : d)
                                          setDepartments(updated)
                                          await persistToStore('departments', updated)
                                          if (db) await setDoc(doc(db, 'departments', item.id), restored)
                                          await logChange('Restore', 'departments', item.id, item.name, null, item)
                                          notifyUser('success', `Restored department`)
                                        }} className="text-xs text-emerald-600 font-bold hover:underline">Restore</button>
                                        <button onClick={() => requestConfirm('Purge Forever?', `Are you sure you want to permanently delete this department?`, async () => {
                                          const updated = departments.filter(d => String(d.id) !== String(item.id))
                                          setDepartments(updated)
                                          await persistToStore('departments', updated)
                                          if (db) await deleteDoc(doc(db, 'departments', item.id))
                                          notifyUser('success', `Permanently purged department`)
                                        })} className="text-xs text-rose-600 font-bold hover:underline">Purge</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Section: News */}
                            {news.filter(n => n.status === 'Deleted').length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Deleted News ({news.filter(n => n.status === 'Deleted').length})</h4>
                                <div className="space-y-2">
                                  {news.filter(n => n.status === 'Deleted').map(item => (
                                    <div key={item.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                                      <span className="font-bold text-slate-800">{item.title}</span>
                                      <div className="flex gap-2">
                                        <button onClick={async () => {
                                          const restored = { ...item, status: 'Active', deletedAt: null, deletedBy: null }
                                          const updated = news.map(n => String(n.id) === String(item.id) ? restored : n)
                                          setNews(updated)
                                          await persistToStore('news', updated)
                                          if (db) await setDoc(doc(db, 'news', item.id), restored)
                                          await logChange('Restore', 'news', item.id, item.title, null, item)
                                          notifyUser('success', `Restored news item`)
                                        }} className="text-xs text-emerald-600 font-bold hover:underline">Restore</button>
                                        <button onClick={() => requestConfirm('Purge Forever?', `Are you sure you want to permanently delete this news article?`, async () => {
                                          const updated = news.filter(n => String(n.id) !== String(item.id))
                                          setNews(updated)
                                          await persistToStore('news', updated)
                                          if (db) await deleteDoc(doc(db, 'news', item.id))
                                          notifyUser('success', `Permanently purged news article`)
                                        })} className="text-xs text-rose-600 font-bold hover:underline">Purge</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Absolute Empty State */}
                            {doctors.filter(d => d.status === 'Deleted').length === 0 &&
                             testimonials.filter(t => t.status === 'Deleted').length === 0 &&
                             blogs.filter(b => b.status === 'Deleted').length === 0 &&
                             faqs.filter(f => f.status === 'Deleted').length === 0 &&
                             jobs.filter(j => j.status === 'Deleted').length === 0 &&
                             downloads.filter(d => d.status === 'Deleted').length === 0 &&
                             departments.filter(d => d.status === 'Deleted').length === 0 &&
                             news.filter(n => n.status === 'Deleted').length === 0 && (
                              <p className="text-xs text-slate-400 text-center py-8">Recycle bin is completely empty.</p>
                            )}

                          </div>
                        </div>

                        {/* RIGHT: Activity Timeline & Audit Logs */}
                        <div className="xl:col-span-6 glass-card-admin rounded-[32px] p-8 shadow-sm space-y-6">
                          <div className="flex justify-between items-center">
                            <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A] flex items-center gap-2">
                              <History className="w-6 h-6 text-[#cca830]" /> Live Audit Timeline
                            </h3>
                            {historyLogs.length > 0 && (
                              <button onClick={() => {
                                requestConfirm(
                                  'Clear Audit Logs',
                                  'Are you sure you want to clear all history log entries? This will empty the audit log dashboard.',
                                  () => {
                                    setHistoryLogs([])
                                    localStorage.setItem('history_logs', '[]')
                                  },
                                  'Clear All'
                                )
                              }} className="text-[10px] uppercase font-bold text-rose-600 hover:underline">Clear Logs</button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">Track all changes, updates, additions, and deletions with a 1-click **Revert** capability.</p>
                          
                          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-admin-scrollbar">
                            {historyLogs.map(log => (
                              <div key={log.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                        log.actionType === 'Create' ? 'bg-emerald-50 text-emerald-700' :
                                        log.actionType === 'Update' ? 'bg-sky-50 text-sky-700' :
                                        log.actionType === 'Delete' ? 'bg-rose-50 text-rose-700' :
                                        'bg-purple-50 text-purple-700'
                                      }`}>
                                        {log.actionType}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-semibold">{log.collectionName}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm leading-snug">{log.itemName || `ID: ${log.itemId}`}</h4>
                                    <p className="text-[10px] text-gray-400 mt-1">Performed by: {log.performedBy}</p>
                                    <p className="text-[9px] text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    {log.actionType !== 'Restore' && (
                                      <button
                                        onClick={() => revertLogEntry(log)}
                                        className="px-2 py-1 rounded bg-[#8B1A4A]/5 hover:bg-[#8B1A4A]/10 text-[#8B1A4A] text-[10px] font-bold"
                                      >
                                        Revert
                                      </button>
                                    )}
                                    <button
                                      onClick={() => deleteLogEntry(log.id)}
                                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {historyLogs.length === 0 && (
                              <p className="text-xs text-slate-400 text-center py-8">No actions logged in timeline yet.</p>
                            )}
                          </div>
                        </div>

                      </div>

                    </motion.div>
                  )}
                  </>)}

                </AnimatePresence>
              </div>

            </div>

          </div>
        )}

        {/* ══════════════ 3. THEMED CONFIRM DIALOG (replaces window.confirm) ══════════════ */}
        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmLabel={confirmDialog.confirmLabel}
          onConfirm={handleConfirmAccept}
          onCancel={closeConfirm}
        />

        {/* ══════════════ 4. INLINE MEDIA PICKER MODAL ══════════════ */}
        <AnimatePresence>
          {showMediaPickerModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md px-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl p-8 rounded-[40px] bg-white border shadow-2xl flex flex-col max-h-[80vh]"
              >
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                  <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A]">Select Asset from Media Library</h3>
                  <button onClick={() => setShowMediaPickerModal(false)} className="text-slate-500 hover:text-black font-bold">✕</button>
                </div>
                
                <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-4 p-2">
                  {mediaFiles.filter(f => f.type === 'image').map(media => (
                    <div 
                      key={media.id} 
                      onClick={() => {
                        mediaTargetField(media.url)
                        setShowMediaPickerModal(false)
                      }}
                      className="p-3 bg-slate-50 border hover:border-[#8B1A4A] rounded-2xl cursor-pointer text-center flex flex-col justify-between min-h-[140px] transition-all hover:shadow"
                    >
                      <div className="h-20 rounded-lg overflow-hidden bg-slate-200">
                        <img src={media.url} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 truncate mt-2">{media.name}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </>
  )
}

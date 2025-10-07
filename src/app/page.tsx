'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { EcoSphere } from '@/components/eco-sphere';
import { BlogSection } from '@/components/blog-section';
import { 
  Leaf, 
  Shield, 
  Recycle, 
  Users, 
  Heart, 
  CheckCircle, 
  Target,
  Globe,
  Award,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  MessageCircle
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-lime-50 relative overflow-hidden">
      <Navbar />
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-80 right-10 w-96 h-96 bg-forest-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-sage-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 0.05, rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" as any }}
          className="absolute top-32 right-16 w-32 h-32 border-2 border-lime-400"
          style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
        />
        <motion.div 
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 0.03, rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" as any }}
          className="absolute bottom-40 left-16 w-40 h-40 border border-forest-300 rounded-full"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.04, scale: 1.2 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-lime-200 to-forest-200 rounded-lg rotate-45"
        />
      </div>

      {/* Hero Section - Landing */}
      <section className="relative pt-24 md:pt-32 pb-20 px-4 min-h-[90vh] flex items-center">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Right Column - EcoSphere (shown first on mobile) */}
            <motion.div 
              variants={fadeInUp} 
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative order-2 lg:order-2 mt-8 md:mt-0 flex justify-center lg:justify-center items-center w-full"
            >
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] flex items-center justify-center mx-auto">
                <EcoSphere className="w-full h-full" />
                
                {/* Globe Label */}
                <motion.div 
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-mono text-forest-600/60 tracking-wider whitespace-nowrap"
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  ЭКОСФЕРА • ПРОФЕССИОНАЛЬНЫЕ РЕШЕНИЯ
                </motion.div>
              </div>
            </motion.div>

            {/* Left Column - Content (shown second on mobile) */}
            <motion.div 
              variants={fadeInUp}
              className="space-y-8 order-1 lg:order-1"
            >
              <motion.h1 
                variants={fadeInUp}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight"
              >
                <span className="bg-gradient-to-r from-forest-800 via-forest-600 to-lime-500 bg-clip-text text-transparent">
                  Оснащаем предприятия
                </span>
                <br />
                <span className="text-lime-500">химической продукцией</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl lg:text-2xl text-forest-700 leading-relaxed font-light max-w-lg"
              >
                Комплексные поставки профессиональной бытовой химии и расходных материалов для ресторанов, отелей и предприятий HoReCa
              </motion.p>

              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="/catalog"
                  className="bg-lime-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-lime-600 transform transition-all duration-200 shadow-lg flex items-center justify-center"
                >
                  Каталог продукции
                </a>
                <a
                  href="#contact-section"
                  className="bg-forest-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-forest-800 transition-all duration-200 flex items-center justify-center"
                  onClick={e => {
                    e.preventDefault();
                    const section = document.getElementById('contact-section');
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Связаться с нами
                </a>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center gap-6 text-forest-600/80 text-sm"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-lime-500" />
                  <span>Сертифицированная продукция</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-lime-500" />
                  <span>Персональные условия</span>
                </div>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Mission Card */}
            <motion.div 
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              className="group relative"
            >
              <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-forest-800">Наша миссия</h3>
                </div>
                <p className="text-forest-700 leading-relaxed text-lg">
                  Обеспечивать HoReCa бизнес высококачественной экологичной химией и расходными материалами, 
                  помогая создавать безопасную и устойчивую рабочую среду для персонала и гостей.
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div 
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              className="group relative"
            >
              <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-forest-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-forest-800">Наше видение</h3>
                </div>
                <p className="text-forest-700 leading-relaxed text-lg">
                  Стать №1 поставщиком экологичных решений для HoReCa в России, 
                  устанавливая новые стандарты качества и безопасности в индустрии гостеприимства.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-forest-800 mb-6">
                Наши ценности
              </h2>
              <p className="text-xl text-forest-600 max-w-3xl mx-auto">
                Принципы, которыми мы руководствуемся в нашей повседневной работе
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Безопасность",
                  description: "Сертифицированная химия, безопасная для персонала и гостей",
                  color: "bg-lime-500"
                },
                {
                  icon: Leaf,
                  title: "Экологичность",
                  description: "Биоразлагаемые формулы, минимальное воздействие на природу",
                  color: "bg-forest-600"
                },
                {
                  icon: Users,
                  title: "Сервис",
                  description: "Индивидуальный подход к каждому клиенту HoReCa",
                  color: "bg-lime-400"
                },
                {
                  icon: TrendingUp,
                  title: "Эффективность",
                  description: "Концентрированные формулы для максимальной экономии",
                  color: "bg-forest-700"
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="backdrop-blur-sm bg-white/40 border border-white/60 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full">
                    <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-forest-800 mb-3">{value.title}</h3>
                    <p className="text-forest-600 leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-forest-800 via-forest-700 to-forest-800 rounded-3xl blur-xl opacity-90"></div>
            <div className="relative backdrop-blur-xl bg-forest-800/95 border border-forest-600 rounded-3xl p-12 shadow-2xl">
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Почему выбирают нас
                </h2>
                <p className="text-xl text-lime-200 max-w-3xl mx-auto">
                  Ключевые принципы нашей работы с HoReCa бизнесом
                </p>
              </motion.div>

              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { title: "Качество", subtitle: "Только сертифицированные бренды", icon: Shield },
                  { title: "Гибкость", subtitle: "Индивидуальный подход к каждому клиенту", icon: Users },
                  { title: "Надежность", subtitle: "Стабильные поставки без срывов", icon: Award },
                  { title: "Поддержка", subtitle: "Консультации по выбору продукции", icon: Heart }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-lime-400 mb-2">{item.title}</div>
                    <div className="text-lime-100 font-medium text-sm leading-relaxed">{item.subtitle}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-forest-800 mb-6">
                Почему выбирают нас
              </h2>
              <p className="text-xl text-forest-600 max-w-3xl mx-auto">
                Преимущества работы с ЭкоСфера для HoReCa бизнеса
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  icon: CheckCircle,
                  title: "Профессиональный ассортимент",
                  description: "Полная линейка бытовой химии и расходников специально для индустрии гостеприимства",
                  features: ["Моющие средства для кухни", "Химия для уборки номеров", "Расходники для ресторанов"]
                },
                {
                  icon: Recycle,
                  title: "Экологичные решения",
                  description: "Биоразлагаемые формулы, безопасные для персонала и соответствующие экостандартам",
                  features: ["Сертификаты ECOLABEL", "Безопасность для кожи", "Минимум химических остатков"]
                },
                {
                  icon: Shield,
                  title: "Гибкие условия работы",
                  description: "Индивидуальный подход к сотрудничеству и профессиональная поддержка клиентов",
                  features: ["Гибкие условия поставки", "Консультации по продукции", "Техническая поддержка"]
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="backdrop-blur-sm bg-white/50 border border-white/70 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                    <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-forest-800 mb-4">{benefit.title}</h3>
                    <p className="text-forest-600 leading-relaxed mb-6">{benefit.description}</p>
                    <ul className="space-y-2">
                      {benefit.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-forest-700">
                          <CheckCircle className="w-4 h-4 text-lime-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-forest-800 mb-6">
                Свяжитесь с нами
              </h2>
              <p className="text-xl text-forest-600 max-w-3xl mx-auto">
                Готовы стать нашим партнером? Получите персональное предложение для вашего бизнеса
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeInUp} transition={{ duration: 0.6 }} className="space-y-8">
                {[
                  {
                    icon: Phone,
                    title: "Телефон",
                    value: "+7 981 280-85-85",
                    action: "tel:+79812808585",
                    description: "Звоните в любое время"
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    value: "info@ecosphere.su",
                    action: "mailto:info@ecosphere.su",
                    description: "Ответим в течение 24 часов"
                  },
                  {
                    icon: MapPin,
                    title: "Адрес",
                    value: "Санкт-Петербург",
                    subtitle: "Уманский переулок 73 к3",
                    action: "https://yandex.ru/maps/2/saint-petersburg/house/umanskiy_pereulok_73k3/Z0kYcgJhSkUAQFtjfXV3dH5jZQ==/?ll=30.451364%2C59.965098&z=18.96",
                    description: "Приходите к нам в офис"
                  }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <a
                      href={contact.action}
                      target={contact.title === "Адрес" ? "_blank" : undefined}
                      rel={contact.title === "Адрес" ? "noopener noreferrer" : undefined}
                      className="flex items-start space-x-4 p-6 backdrop-blur-sm bg-white/40 border border-white/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/50"
                    >
                      <div className="w-12 h-12 bg-lime-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <contact.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-forest-800 mb-1">{contact.title}</h3>
                        <p className="text-forest-700 font-medium">{contact.value}</p>
                        {contact.subtitle && (
                          <p className="text-forest-600 text-sm">{contact.subtitle}</p>
                        )}
                        <p className="text-forest-500 text-sm mt-1">{contact.description}</p>
                      </div>
                    </a>
                  </motion.div>
                ))}

                <motion.div variants={scaleIn} transition={{ duration: 0.5 }} className="flex gap-4 pt-4">
                  <a
                    href="https://wa.me/79812808585?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%9C%D0%B5%D0%BD%D1%8F%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-lime-500 hover:bg-lime-600 rounded-xl text-white font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                  <a
                    href="https://t.me/+79812808585"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-forest-700 hover:bg-forest-800 rounded-xl text-white font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Telegram
                  </a>
                </motion.div>
              </motion.div>

              <motion.div
                variants={scaleIn}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative lg:order-last"
              >
                <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-3xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <Heart className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-forest-800 mb-4">
                      Станьте нашим клиентом
                    </h3>
                    <p className="text-forest-600 leading-relaxed mb-8">
                      Получите персональные условия поставки экологичной химии и расходников для вашего 
                      ресторана, отеля или другого HoReCa предприятия.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-4 text-forest-700">
                        <CheckCircle className="w-5 h-5 text-lime-500" />
                        <span>Персональные цены</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-forest-700">
                        <CheckCircle className="w-5 h-5 text-lime-500" />
                        <span>Отсрочка платежа</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-forest-700">
                        <CheckCircle className="w-5 h-5 text-lime-500" />
                        <span>Профессиональная поддержка</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
}
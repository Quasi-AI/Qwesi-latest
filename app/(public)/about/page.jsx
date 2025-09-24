'use client'
import React from 'react'

export default function AboutPage() {
  const brandLogos = [
    { src: './brands/linkedin.png', alt: 'LinkedIn' },
    { src: './brands/amazon.png', alt: 'Amazon' },
    { src: './brands/microsoft.png', alt: 'Microsoft' },
    { src: './brands/apple.png', alt: 'Apple' },
    { src: './brands/meta.png', alt: 'Meta' },
    { src: './brands/netflix.webp', alt: 'Netflix' },
    { src: './brands/ibm.png', alt: 'IBM' },
    { src: './brands/google.png', alt: 'Google' },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Intro Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-full px-6 py-3 mb-6">
            <svg className="w-5 h-5 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h2a2 2 0 012 2v2H6a2 2 0 01-2-2V5zM2 13a2 2 0 012-2h6a2 2 0 012 2v2H6a2 2 0 01-2-2v0zM12 5a2 2 0 012-2h2a2 2 0 012 2v2h-6V5zM14 11h2a2 2 0 012 2v2h-6v-2a2 2 0 012-2z" />
            </svg>
            <span className="text-violet-700 font-medium">About Qwesi</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">Empowering Commerce, Careers, and Community</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Qwesi connects people to opportunity: shop locally, launch and grow stores, discover scholarships and jobs, and build meaningful professional networks — all in one platform.</p>
        </div>
      </section>

      {/* Company Logos Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-gray-50/50"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full px-6 py-3 mb-8">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span className="text-gray-600 font-medium">Network</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Connect With People From Top Companies
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Grow your network with professionals from industry-leading organizations.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-white p-8">
            <div className="flex animate-scroll-left">
              {/* First set of logos */}
              <div className="flex items-center space-x-16 flex-shrink-0 pr-16">
                {brandLogos.map((logo, idx) => (
                  <div key={`logo1-${idx}`} className="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                    <img src={logo.src} alt={logo.alt} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
              {/* Duplicate set for seamless loop */}
              <div className="flex items-center space-x-16 flex-shrink-0 pr-16">
                {brandLogos.map((logo, idx) => (
                  <div key={`logo2-${idx}`} className="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                    <img src={logo.src} alt={logo.alt} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll-left {
            width: calc(200% + 4rem);
            animation: scroll-left 30s linear infinite;
          }
        `}</style>
      </section>

      {/* Statistics / Team Section */}
      <section id="stats" className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-8">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-600 font-medium">Our Team</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">Meet The Team</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Meet the passionate minds behind Qwesi AI – a dedicated team of innovators, engineers, and educators committed to making powerful AI accessible to everyone, everywhere.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
              {/* Team Member 1 */}
              <div className="group relative">
                <div className="absolute inset-0  rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-white/70 backdrop-blur p-10 rounded-3xl border border-white/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                    <img src="./paul.png" alt="DR. Paul Amissah"
                      className="relative w-48 h-48 rounded-3xl mx-auto object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-all duration-300" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">DR. Paul Amissah</h3>
                  <p className="font-semibold text-lg">Chief Executive Officer</p>
                  <div className="flex justify-center">
                    <a href="https://www.linkedin.com/in/paul-amissah-91b98890/" target="_blank"
                      rel="noopener noreferrer" 
                      className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white hover:from-blue-400 hover:to-blue-500 transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-blue-500/25">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-white/70 backdrop-blur p-10 rounded-3xl border border-white/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
                    <img src="./rexton-1.jpeg" alt="Rexton Itsiah"
                      className="relative w-48 h-48 rounded-3xl mx-auto object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-all duration-300" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Rexton Itsiah</h3>
                  <p className="text-lg">Technical Co-Founder</p>
                  <div className="flex justify-center">
                    <a href="https://www.linkedin.com/in/rexton-itsiah-129945173/" target="_blank"
                      rel="noopener noreferrer" 
                      className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white hover:from-purple-400 hover:to-pink-500 transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-purple-500/25">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.46c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

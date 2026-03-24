import Link from "next/link";
import Image from "next/image";
import { ScrollRevealSection } from "@/components/ScrollRevealSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-inherit transition-colors duration-300">
      {/* Hero Section - Two Column */}
      <section className="flex items-center py-6 md:py-12 lg:py-20 px-4 md:px-6 lg:px-12 mt-4 md:mt-6 lg:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16 w-full max-w-6xl mx-auto">
          {/* Left Column - Hero Text */}
          <div className="flex flex-col justify-center">
            <h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-light tracking-tighter leading-none mb-2 md:mb-4 lg:mb-12 text-slate-900 dark:text-slate-50 scroll-slide-left"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              KP
            </h1>
            <p
              className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl tracking-widest text-slate-600 dark:text-slate-400 mb-3 md:mb-4 lg:mb-16 font-light scroll-slide-left"
              style={{ animationDelay: "0.1s" }}
            >
              Aspiring Software Engineer / Ethical Hacker
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-3 md:mb-4 lg:mb-16 max-w-xs md:max-w-sm font-light">
              For business inquiries, email me at{" "}
              <a
                href="mailto:02230287.cst@rub.edu.bt"
                className="font-medium hover:opacity-60 transition-opacity break-all"
              >
                02230287.cst@rub.edu.bt
              </a>
            </p>
          </div>

          {/* Right Column - About */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xs sm:text-xs md:text-sm lg:text-base tracking-widest font-light text-slate-900 dark:text-slate-50 mb-3 md:mb-4 lg:mb-6 uppercase">
              About Me
            </h2>
            <div className="w-12 md:w-16 h-px bg-gradient-to-r from-slate-400 to-transparent dark:from-slate-600 dark:to-transparent mb-4 md:mb-6 lg:mb-10"></div>
            <p
              className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-700 dark:text-slate-400 leading-relaxed font-light mb-4 md:mb-6 lg:mb-8 scroll-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              I'm a curious and driven aspiring software engineer, passionate
              about building secure and scalable applications. With a strong
              foundation in full-stack development, I'm exploring cybersecurity
              and ethical hacking to better understand system vulnerabilities
              and create safer digital solutions.
            </p>
            <p
              className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-700 dark:text-slate-400 leading-relaxed font-light scroll-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              My journey combines practical coding skills with a commitment to
              continuous learning. I believe in writing clean, maintainable code
              and staying updated with emerging security practices to build
              applications that are not just functional, but robust against
              threats.
            </p>
          </div>
        </div>
      </section>

      {/* Motivation Section */}
      <ScrollRevealSection>
        <section className="py-3 md:py-6 lg:py-32 px-4 md:px-6 lg:px-12 bg-inherit">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16 w-full max-w-6xl mx-auto">
            {/* Left Column - Text */}
            <div>
              <h2 className="text-xs md:text-sm lg:text-base tracking-widest font-light text-slate-900 dark:text-slate-50 mb-2 md:mb-3 lg:mb-6 uppercase">
                Motivation
              </h2>
              <div className="w-12 md:w-16 h-px bg-gradient-to-r from-slate-400 to-transparent dark:from-slate-600 dark:to-transparent mb-3 md:mb-4 lg:mb-10"></div>
              <div className="space-y-2 md:space-y-3 lg:space-y-8">
                <p className="text-sm md:text-base lg:text-lg text-slate-700 dark:text-slate-400 leading-relaxed font-light">
                  I believe in the power of design to create meaningful
                  connections between people and technology. Every project is an
                  opportunity to learn, innovate, and push the boundaries of
                  what's possible on the web.
                </p>
                <p className="text-sm md:text-base lg:text-lg text-slate-700 dark:text-slate-400 leading-relaxed font-light">
                  The intersection of design and development fascinates me. I'm
                  driven by the challenge of creating interfaces that are not
                  just beautiful, but intuitive and accessible to everyone.
                </p>
                <p className="text-sm md:text-base lg:text-lg text-slate-700 dark:text-slate-400 leading-relaxed font-light">
                  Continuous improvement is at the core of my philosophy. Every
                  project, every line of code, and every design decision is a
                  step forward in my professional journey.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="h-full min-h-32 md:min-h-48 lg:min-h-96 rounded-lg overflow-hidden shadow-sm">
              <Image
                src="/profile.png"
                alt="Portfolio Profile"
                width={1200}
                height={1200}
                priority
                quality={95}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      {/* Skills Section */}
      <ScrollRevealSection>
        <section className="py-3 md:py-6 lg:py-32 px-4 md:px-6 lg:px-12 bg-inherit">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-xs md:text-sm lg:text-base tracking-widest font-light text-slate-900 dark:text-slate-50 mb-2 md:mb-3 lg:mb-6 uppercase"
              style={{ animationDelay: "0s" }}
            >
              Skills
            </h2>
            <div className="w-full h-0.5 bg-gradient-to-r from-slate-400 via-slate-400 to-transparent dark:from-slate-600 dark:via-slate-600 dark:to-transparent mb-4 md:mb-6 lg:mb-16"></div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-12 mb-4 md:mb-6 lg:mb-8">
              {/* Frontend */}
              <div>
                <h3
                  className="text-sm md:text-base lg:text-lg tracking-widest font-light text-slate-900 dark:text-slate-50 mb-2 md:mb-3 lg:mb-8 uppercase"
                  style={{ animationDelay: "0s" }}
                >
                  Frontend
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "TypeScript",
                    "React",
                    "Next.js",
                    "Tailwind CSS",
                    "JavaScript",
                    "HTML/CSS",
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-1.5 rounded-full border border-slate-400 dark:border-slate-600 text-xs sm:text-sm md:text-base lg:text-lg font-light text-slate-700 dark:text-slate-400"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div>
                <h3 className="text-sm md:text-base lg:text-lg tracking-widest font-light text-slate-900 dark:text-slate-50 mb-4 md:mb-6 lg:mb-8 uppercase">
                  Backend
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["Node.js", "PostgreSQL", "Supabase", "APIs", "REST"].map(
                    (skill) => (
                      <div
                        key={skill}
                        className="px-3 py-1.5 rounded-full border border-slate-400 dark:border-slate-600 text-xs sm:text-sm md:text-base lg:text-lg font-light text-slate-700 dark:text-slate-400"
                      >
                        {skill}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h3 className="text-sm md:text-base lg:text-lg tracking-widest font-light text-slate-900 dark:text-slate-50 mb-4 md:mb-6 lg:mb-8 uppercase">
                  Tools
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["Git", "VS Code", "Figma", "Docker"].map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-1.5 rounded-full border border-slate-400 dark:border-slate-600 text-xs sm:text-sm md:text-base lg:text-lg font-light text-slate-700 dark:text-slate-400"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ethical Hacking */}
              <div>
                <h3 className="text-sm md:text-base lg:text-lg tracking-widest font-light text-slate-900 dark:text-slate-50 mb-4 md:mb-6 lg:mb-8 uppercase">
                  Ethical Hacking
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Nmap",
                    "Wireshark",
                    "Metasploit",
                    "Burp Suite",
                    "Kali Linux",
                    "Hydra",
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-1.5 rounded-full border border-slate-400 dark:border-slate-600 text-xs sm:text-sm md:text-base lg:text-lg font-light text-slate-700 dark:text-slate-400"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Tools */}
              <div>
                <h3 className="text-sm md:text-base lg:text-lg tracking-widest font-light text-slate-900 dark:text-slate-50 mb-4 md:mb-6 lg:mb-8 uppercase">
                  Security Tools
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "SQLMap",
                    "John the Ripper",
                    "hashcat",
                    "OpenVAS",
                    "Nessus",
                    "OWASP ZAP",
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-1.5 rounded-full border border-slate-400 dark:border-slate-600 text-xs sm:text-sm md:text-base lg:text-lg font-light text-slate-700 dark:text-slate-400"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Tools */}
              <div>
                <h3 className="text-sm md:text-base lg:text-lg tracking-widest font-light text-slate-900 dark:text-slate-50 mb-4 md:mb-6 lg:mb-8 uppercase">
                  Analysis Tools
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Tcpdump",
                    "Aircrack-ng",
                    "Snort",
                    "Wireshark",
                    "Frida",
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-1.5 rounded-full border border-slate-400 dark:border-slate-600 text-xs sm:text-sm md:text-base lg:text-lg font-light text-slate-700 dark:text-slate-400"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Link to Blog */}
            <div className="flex justify-end pt-4 md:pt-6 lg:pt-12 border-t-2 border-slate-300 dark:border-slate-700">
              <Link
                href="/blog"
                className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 tracking-widest hover:translate-x-1"
              >
                VIEW BLOG →
              </Link>
            </div>
          </div>
        </section>
      </ScrollRevealSection>
    </div>
  );
}

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, CheckCircle2, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              TNPSC Group-4 தேர்விற்கான <br />
              <span className="text-blue-600">முழுமையான ஆன்லைன் பயிற்சி தளம்</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600 mx-auto mb-10">
              தமிழ், பொது அறிவு, மற்றும் திறனறிவு பாடங்களில் உங்களை முழுமையாக தயார்படுத்திக்கொள்ள சிறந்த தளம்.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center gap-2">
                இப்போதே தொடங்குக <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/syllabus" className="bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-full font-bold text-lg hover:bg-slate-50 transition shadow-sm">
                பாடத்திட்டம்
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">ஏன் இந்த தளம்?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "தலைப்பு வாரியான பயிற்சி", desc: "பாடத்திட்டத்தின் ஒவ்வொரு தலைப்பிற்கும் பிரத்யேக கேள்விகள்." },
                { title: "மாதிரி தேர்வுகள்", desc: "உண்மையான தேர்வு அனுபவத்தை தரும் முழுமையான மாதிரி தேர்வுகள்." },
                { title: "முன்னேற்ற அறிக்கை", desc: "உங்கள் பலம் மற்றும் பலவீனங்களை கண்டறிந்து மேம்படுத்தவும்." }
              ].map((feature, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <CheckCircle2 className="h-10 w-10 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-10 w-10 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">ஆத்திச்சூடி கல்வி பயிற்சி மையம்</h2>
          <p className="mb-6">TNPSC Group-4 தேர்விற்கான ஆன்லைன் பயிற்சி தளம்</p>
          <div className="flex justify-center gap-6 mb-8">
            <Link href="/syllabus" className="hover:text-white transition">பாடத்திட்டம்</Link>
            <Link href="/privacy" className="hover:text-white transition">தனியுரிமைக் கொள்கை</Link>
            <Link href="/terms" className="hover:text-white transition">விதிமுறைகள்</Link>
            <Link href="/contact" className="hover:text-white transition">தொடர்பு</Link>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} ஆத்திச்சூடி கல்வி பயிற்சி மையம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
        </div>
      </footer>
    </>
  );
}

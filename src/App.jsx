import React, { useState, useRef, useEffect } from "react";
import { Droplet, Check, User, Phone, Mail, MessageSquare, ShieldCheck, Award, DollarSign, Sparkles, Tag, ArrowDown, ShowerHead, MapPin, Menu, X, ChevronRight, Droplets, FileCheck, ClipboardCheck, Calendar, ChevronDown } from "lucide-react";

const WEB3FORMS_KEY = "9468d723-f46e-4981-b1c1-4545209072f7";
const GOOGLE_MAPS_KEY = "AIzaSyDPfspCY5u7j_ApTM-K7qugyAXvSApIXEk";
const PHONE = "5164186348";
const PHONE_DISPLAY = "(516) 418-6348";
const OWNER = "Eitan Shahkoohi";
const OWNER_EMAIL = "eshakster@gmail.com";
const HEADSHOT = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...";

const SERVICES = [
  {
    id: "bf-domestic",
    name: "Domestic Backflow Test",
    short: "For your home's water line",
    icon: ShowerHead,
    img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
  },
  {
    id: "bf-sprinkler",
    name: "Sprinkler Backflow Test",
    short: "For your irrigation system",
    icon: Droplet,
    img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
  },
  {
    id: "sprinkler-open",
    name: "Sprinkler Preseason Check",
    short: "Spring startup for your system",
    icon: Sparkles,
    img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
  },
];

const NEIGHBORHOODS = [
  "Great Neck Village",
  "Great Neck Estates",
  "Great Neck Plaza",
  "Kings Point",
  "Saddle Rock",
  "Saddle Rock Estates",
  "Thomaston",
  "Russell Gardens",
  "Lake Success",
  "Manhasset Isle"
];

function price(n) {
  return n === 1 ? 60 : n === 2 ? 110 : n >= 3 ? 150 : 0;
}

function priceEach(n) {
  return n === 1 ? 60 : n === 2 ? 55 : 50;
}

function AddressInput({ value, onChange }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_KEY || typeof window === "undefined") return;
    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    const existing = document.querySelector("script[src*='maps.googleapis.com']");
    if (existing) return;

    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=" +
      GOOGLE_MAPS_KEY +
      "&libraries=places";
    script.async = true;
    script.onload = () => initAutocomplete();
    document.head.appendChild(script);
  }, []);

  function initAutocomplete() {
    if (!inputRef.current || autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"]
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (place?.formatted_address) onChange(place.formatted_address);
    });
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <MapPin className="w-4 h-4" />
      </div>

      <input
        ref={inputRef}
        type="text"
        placeholder="Start typing your address..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-3 py-3.5 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none text-sm transition bg-white"
        autoComplete="street-address"
        name="address"
      />
    </div>
  );
}

export default function App() {
  const [sel, setSel] = useState([]);
  const [f, setF] = useState({ name: "", addr: "", phone: "", email: "" });
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const bookRef = useRef(null);
  const svcRef = useRef(null);
  const priceRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-aos]").forEach((el) => {
      el.classList.add("aos-" + el.getAttribute("data-aos"));
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [done]);

  const tot = price(sel.length);

  function toggle(svc) {
    const has = sel.find((s) => s.id === svc.id);
    setSel(has ? sel.filter((s) => s.id !== svc.id) : [...sel, svc]);
  }

  function scrollTo(ref) {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  const allFilled =
    f.name && f.addr && f.phone && f.email && sel.length > 0;
  async function submit() {
  setFormError("");

  if (!f.name.trim()) {
    setFormError("Please enter your name.");
    return;
  }

  if (!f.addr.trim()) {
    setFormError("Please enter your address.");
    return;
  }

  if (!f.phone.trim() || f.phone.replace(/\D/g, "").length < 10) {
    setFormError("Please enter a valid phone number (at least 10 digits).");
    return;
  }

  if (!f.email.trim() || !f.email.includes("@") || !f.email.includes(".")) {
    setFormError("Please enter a valid email address.");
    return;
  }

  if (sel.length === 0) {
    setFormError("Please select at least one service.");
    return;
  }

  setBusy(true);
  const svcs = sel.map((s) => s.name).join(", ");

  if (WEB3FORMS_KEY !== "YOUR_KEY_HERE") {
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "New Booking from " + f.name,
          from_name: "Great Neck Backflow",
          replyto: OWNER_EMAIL,
          Name: f.name,
          Phone: f.phone,
          Email: f.email,
          Address: f.addr,
          Services: svcs,
          "Number of Services": sel.length,
          Total: "$" + tot,
          Payment: "Zelle / Venmo / Cash. At job site"
        })
      });
    } catch (e) {
      console.error(e);
    }
  }

  setDone({
    name: f.name,
    email: f.email,
    addr: f.addr,
    svcs,
    tot
  });

  setBusy(false);
}

function reset() {
  setDone(null);
  setSel([]);
  setF({ name: "", addr: "", phone: "", email: "" });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

if (done)
  return (
    <div
      className="min-h-screen bg-slate-900 flex items-center justify-center p-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-md w-full bg-white shadow-2xl border-t-4 border-blue-600 p-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">
          Booking Received!
        </h2>

        <p className="text-center text-slate-500 mb-5 text-sm">
          We have received your booking. We will text you shortly with details!
        </p>

        <div className="bg-slate-50 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Name</span>
            <span className="font-medium">{done.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Address</span>
            <span className="font-medium text-right max-w-[200px]">
              {done.addr}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-600">{done.svcs}</p>
          </div>

          <div className="flex justify-between font-bold text-slate-800 pt-2 border-t border-slate-200">
            <span>Total</span>
            <span>${done.tot}</span>
          </div>

          <p className="text-xs text-slate-500">
            Zelle · Venmo · Cash. Paid at job site
          </p>
        </div>
                </div>

        <button
          onClick={reset}
          className="w-full mt-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 transition"
        >
          Done
        </button>

        <p className="text-xs text-center text-slate-400 mt-4">
          Questions? Call or text {PHONE_DISPLAY}
        </p>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* NAVBAR */}
      <nav className="bg-slate-50 border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-blue-700 text-sm leading-tight">
                GREAT NECK
              </p>
              <p className="text-blue-600 text-xs font-semibold leading-tight">
                BACKFLOW & SPRINKLER
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollTo(aboutRef)}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              OUR STORY
            </button>
            <button
              onClick={() => scrollTo(svcRef)}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              SERVICES
            </button>
            <button
              onClick={() => scrollTo(priceRef)}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              PRICING
            </button>
            <button
              onClick={() => scrollTo(bookRef)}
              className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
            >
              BOOK NOW
            </button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
            <button
              onClick={() => scrollTo(aboutRef)}
              className="block w-full text-left text-slate-700 py-2 font-medium"
            >
              OUR STORY
            </button>
            <button
              onClick={() => scrollTo(svcRef)}
              className="block w-full text-left text-slate-700 py-2 font-medium"
            >
              SERVICES
            </button>
            <button
              onClick={() => scrollTo(priceRef)}
              className="block w-full text-left text-slate-700 py-2 font-medium"
            >
              PRICING
            </button>
            <button
              onClick={() => scrollTo(bookRef)}
              className="block w-full text-left bg-blue-600 text-white px-4 py-2 font-semibold"
            >
              BOOK NOW
            </button>
          </div>
        )}
      </nav>
            {/* HERO */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <p
              className="text-blue-400 text-sm font-semibold tracking-widest mb-4"
              data-aos="fade-right"
            >
              GREAT NECK BACKFLOW & SPRINKLER
            </p>

            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight mb-4 tracking-tight"
              data-aos="fade-right"
            >
              Annual Backflow Testing & Sprinkler Services
            </h1>

            <p className="text-slate-400 text-lg max-w-xl mb-8">
              Professional backflow prevention testing for homes across the Great
              Neck peninsula. Compliant with Great Neck North Water Authority
              requirements.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo(bookRef)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 transition"
              >
                <Calendar className="w-5 h-5" />
                Book Online
              </button>

              <div className="flex">
                <a
                  href={"tel:" + PHONE}
                  className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 hover:bg-white/10 transition"
                >
                  <Phone className="w-5 h-5" />
                  Call {PHONE_DISPLAY}
                </a>

                <a
                  href={
                    "sms:" +
                    PHONE +
                    "&body=Hi, I am interested in backflow testing / sprinkler services at my home in Great Neck. Can you let me know availability?"
                  }
                  className="inline-flex items-center gap-2 border border-white/30 border-l-0 text-white font-semibold px-5 py-3 hover:bg-white/10 transition"
                >
                  <MessageSquare className="w-5 h-5" />
                  Text Us
                </a>
              </div>
            </div>
          </div>

          <div className="flex-1 hidden md:block" data-aos="fade-left">
            <div className="relative">
              <img
                src={SERVICES[1].img}
                alt="Backflow testing"
                className="w-full h-72 object-cover shadow-2xl border-2 border-white/10"
              />

              <div className="absolute -bottom-4 -left-4 bg-blue-600 px-5 py-3 shadow-lg">
                <p className="text-white font-bold text-2xl">$60</p>
                <p className="text-blue-200 text-xs">Starting price</p>
              </div>

              <div className="absolute -top-3 -right-3 bg-white px-4 py-2 shadow-lg">
                <p className="text-slate-900 font-bold text-sm">10-15 min</p>
                <p className="text-slate-500 text-xs">Per test</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEIGHBORHOODS */}
      <div className="bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3"
            data-aos="fade-up"
          >
            Neighborhoods We Serve.
          </h2>

          <p className="text-slate-500 mb-8">
            We are local residents who know the specific requirements for every
            village and water district in the area.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {NEIGHBORHOODS.map((n) => (
              <div
                key={n}
                className="bg-white border border-slate-200 rounded-lg py-3 px-4 text-slate-700 font-medium text-sm shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-700 transition-all duration-200 cursor-default"
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
            {/* FAQ */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2
          className="text-3xl font-bold text-slate-900 mb-2 text-center"
          data-aos="fade-up"
        >
          Frequently Asked Questions
        </h2>

        <p className="text-slate-500 text-center mb-8">Click to expand</p>

        <div className="max-w-2xl mx-auto space-y-2">
          {[
            {
              q: "How often do I need to get my backflow tested?",
              a: "Nassau County and the Great Neck North Water Authority require annual testing of all backflow prevention devices. You will typically receive a notice in the mail when your test is due."
            },
            {
              q: "How long does a backflow test take?",
              a: "Each test takes about 10 to 15 minutes. If you bundle multiple services, we can usually complete everything in a single visit under 30 minutes."
            },
            {
              q: "Do you file the paperwork?",
              a: "Yes. After testing, we submit your results directly to your water authority electronically. You do not have to do anything."
            },
            {
              q: "What forms of payment do you accept?",
              a: "We accept Zelle, Venmo, and Cash. Payment is collected at the job site after the work is completed. No upfront payment required."
            },
            {
              q: "What areas do you serve?",
              a: "We serve the entire Great Neck peninsula including Great Neck Village, Kings Point, Saddle Rock, Thomaston, Kensington, Lake Success, Russell Gardens, and all surrounding neighborhoods."
            },
            {
              q: "What happens if my backflow device fails the test?",
              a: "If your device fails, we will let you know exactly what the issue is and can recommend a licensed plumber for repairs. Once repaired, we come back and retest at no additional charge."
            }
          ].map((item, i) => (
            <div key={i} className="border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition"
              >
                <span className="font-semibold text-slate-800 text-sm sm:text-base">
                  {item.q}
                </span>
                <ChevronDown
                  className={
                    "w-5 h-5 text-slate-500 transition-transform " +
                    (openFaq === i ? "rotate-180" : "")
                  }
                />
              </button>

              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
            {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  GREAT NECK BACKFLOW & SPRINKLER
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <a
                href={"tel:" + PHONE}
                className="text-white font-bold text-lg hover:text-blue-400 transition"
              >
                {PHONE_DISPLAY}
              </a>
              <p className="text-slate-400 text-sm">greatneckbackflow.com</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-slate-500 text-xs">
              {PHONE_DISPLAY} · Great Neck, NY
            </p>
            <p className="text-slate-500 text-xs">
              © 2025 Great Neck Backflow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Lbl({ n, t }) {
  return (
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
      <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] font-bold mr-1.5">
        {n}
      </span>
      {t}
      <span className="text-red-400 ml-1">*</span>
    </p>
  );
}

function Inp({ icon, ph, v, set, type = "text" }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <input
        type={type}
        placeholder={ph}
        value={v}
        onChange={(e) => set(e.target.value)}
        required
        className="w-full pl-10 pr-3 py-3.5 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none text-sm transition bg-white"
      />
    </div>
  );
}

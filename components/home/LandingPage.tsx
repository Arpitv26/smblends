"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AtSign, Mail, MapPin, Menu, Phone, X } from "lucide-react";

import logoImage from "@/images/2A64B001-CE84-4633-A4E4-E7BAC1535EB1.png";
import haircutOne from "@/images/IMG_4641.jpeg";
import haircutTwo from "@/images/IMG_4642.jpeg";
import haircutThree from "@/images/IMG_4643.jpeg";
import haircutFour from "@/images/IMG_4645.jpeg";
import haircutFive from "@/images/IMG_4646.jpeg";

type HaircutImage = {
  alt: string;
  src: StaticImageData;
};

const HAIRCUT_IMAGES: HaircutImage[] = [
  {
    alt: "Fresh fade haircut by SMBLENDS",
    src: haircutOne
  },
  {
    alt: "Clean haircut profile by SMBLENDS",
    src: haircutTwo
  },
  {
    alt: "Detailed haircut finish by SMBLENDS",
    src: haircutThree
  },
  {
    alt: "Sharp haircut blend by SMBLENDS",
    src: haircutFour
  },
  {
    alt: "Fresh client haircut by SMBLENDS",
    src: haircutFive
  }
];

const MENU_LINKS = [
  {
    href: "/book",
    label: "Book Now"
  },
  {
    href: "/policy",
    label: "Policy"
  }
] as const;

const ADMIN_LINK = {
  href: "/admin/login",
  label: "Admin Login"
} as const;

function ContactPanel({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center"
      role="dialog"
    >
      <button
        aria-label="Close contact details"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <section className="relative w-full bg-zinc-950 px-5 pb-7 pt-5 shadow-2xl shadow-black sm:max-w-md sm:rounded-[1.5rem] sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Contact
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Questions before booking?
            </h2>
          </div>
          <button
            aria-label="Close contact details"
            className="inline-flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-zinc-200 transition hover:bg-white/[0.1] hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-6 text-zinc-300">
          <a
            className="flex items-center gap-3 transition hover:text-white"
            href="tel:+17786817694"
          >
            <Phone className="size-4 text-zinc-500" aria-hidden="true" />
            +1 778-681-7694
          </a>
          <a
            className="flex items-center gap-3 transition hover:text-white"
            href="mailto:sanchitmehta51@gmail.com"
          >
            <Mail className="size-4 text-zinc-500" aria-hidden="true" />
            sanchitmehta51@gmail.com
          </a>
          <a
            className="flex items-center gap-3 transition hover:text-white"
            href="https://www.instagram.com/smblends._/"
            rel="noreferrer"
            target="_blank"
          >
            <AtSign className="size-4 text-zinc-500" aria-hidden="true" />
            @smblends._
          </a>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 size-4 text-zinc-500" aria-hidden="true" />
            <p>
              6686 Imperial St, Burnaby, BC V5E 1M8. Street parking is
              available. Do not knock on the front door. Go down the driveway
              and go up the stairs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SideMenu({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Close menu"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-zinc-950 px-6 py-6 shadow-2xl shadow-black">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.36em] text-zinc-500">
            SMBLENDS
          </p>
          <button
            aria-label="Close menu"
            className="inline-flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-zinc-200 transition hover:bg-white/[0.1] hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-14 flex flex-col gap-4" aria-label="Main menu">
          {MENU_LINKS.map((link) => (
            <Link
              className="text-3xl font-semibold tracking-tight text-white transition hover:text-zinc-300"
              href={link.href}
              key={link.href}
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-6">
          <Link
            className="block text-2xl font-semibold tracking-tight text-white transition hover:text-zinc-300"
            href={ADMIN_LINK.href}
            onClick={onClose}
          >
            {ADMIN_LINK.label}
          </Link>
          <p className="max-w-xs text-sm leading-6 text-zinc-500">
            Built for booking cuts without the back-and-forth.
          </p>
        </div>
      </aside>
    </div>
  );
}

function HaircutMarquee(): JSX.Element {
  const marqueeImages = [...HAIRCUT_IMAGES, ...HAIRCUT_IMAGES];

  return (
    <section
      className="home-reveal overflow-hidden py-8 sm:py-12"
      aria-label="SMBLENDS haircut examples"
    >
      <div className="mb-5 flex items-center justify-between px-5 sm:px-8">
        <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
          Recent Work
        </p>
        <p className="hidden text-sm text-zinc-500 sm:block">
          Sharp, clean, fresh.
        </p>
      </div>
      <div className="[mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="haircut-marquee-track flex gap-4 px-4">
          {marqueeImages.map((image, index) => (
            <div
              className="relative h-[23rem] w-[14rem] shrink-0 overflow-hidden rounded-[1.5rem] bg-zinc-900 sm:h-[30rem] sm:w-[18rem]"
              key={`${image.alt}-${index}`}
            >
              <Image
                alt={index >= HAIRCUT_IMAGES.length ? "" : image.alt}
                className="object-cover"
                fill
                sizes="(min-width: 640px) 18rem, 14rem"
                src={image.src}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingPage(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(".home-reveal")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        }
      },
      {
        threshold: 0.18
      }
    );

    for (const element of revealElements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsContactOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#050505_0%,#0a0a0b_48%,#050505_100%)] text-white">
      <button
        aria-label="Open menu"
        className="fixed right-5 top-5 z-30 inline-flex size-12 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        onClick={() => setIsMenuOpen(true)}
        type="button"
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>

      <section className="relative flex min-h-svh flex-col items-center justify-center px-5 pb-12 pt-20 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_62%)]" />
        <div className="home-hero-rise relative flex w-full max-w-4xl flex-col items-center">
          <div className="brand-logo-blend relative z-0 w-[min(112vw,44rem)] sm:w-[min(92vw,46rem)]">
            <Image
              alt="SMBLENDS logo"
              className="h-auto w-full select-none"
              priority
              src={logoImage}
            />
          </div>
          <h1 className="relative z-10 mt-[-4rem] text-5xl font-semibold tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] sm:mt-[-5rem] sm:text-7xl">
            Get Blessed
          </h1>
          <p className="relative z-10 mt-5 max-w-2xl text-base leading-7 text-zinc-300 drop-shadow-[0_3px_14px_rgba(0,0,0,0.85)] sm:text-lg sm:leading-8">
            My barber business is built on skill and strong customer
            connections. I take pride in delivering a sharp, clean, and fresh
            cut. It ain&apos;t about selling a cut - it&apos;s selling
            confidence.
          </p>
          <Link
            className="relative z-10 mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            href="/book"
          >
            Book Now
          </Link>
        </div>
      </section>

      <HaircutMarquee />

      <section className="home-reveal flex min-h-[70svh] flex-col items-center justify-center px-5 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.36em] text-zinc-500">
          Burnaby Cuts
        </p>
        <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Lock in your next cut without the DMs.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
          Choose a real available time, review the total, and pay in person by
          cash or e-transfer.
        </p>
        <div className="mt-9 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Link
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            href="/book"
          >
            Book Now
          </Link>
          <button
            className="inline-flex h-12 items-center justify-center rounded-full bg-white/[0.06] px-8 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            onClick={() => setIsContactOpen(true)}
            type="button"
          >
            Contact
          </button>
        </div>
      </section>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <ContactPanel
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </main>
  );
}

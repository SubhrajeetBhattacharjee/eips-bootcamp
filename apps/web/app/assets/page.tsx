"use client";

import React from "react";
import { Navbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { Logo } from "../components/ui/Logo";
import { ThemedLogoGif } from "../components/ThemedLogoGif";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Download, Copy, Check, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Badge } from "../components/ui/Badge";

const ASSETS = [
  {
    name: "EthShala Logo (Default)",
    path: "/brand/ethshala_logo.svg",
    description: "The primary brand mark for EthShala. Optimized for all backgrounds.",
    type: "SVG",
  },
  {
    name: "EthShala Logo (White)",
    path: "/brand/ethshala_logo_white.svg",
    description: "White version of the logo for dark backgrounds.",
    type: "SVG",
    background: "bg-[#121413]",
  },
  {
    name: "EthShala Logo (Black)",
    path: "/brand/ethshala_logo_black.svg",
    description: "Black version of the logo for light backgrounds.",
    type: "SVG",
    background: "bg-white",
  },
];

const COLORS = [
  { name: "Emerald Primary", hex: "#10b981", class: "bg-emerald-500" },
  { name: "Emerald Light", hex: "#34d399", class: "bg-emerald-400" },
  { name: "Dark Background", hex: "#0a0c0b", class: "bg-[#0a0c0b]" },
  { name: "Surface Dark", hex: "#121413", class: "bg-[#121413]" },
];

export default function AssetsPage() {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="mt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-24">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Brand Assets</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Download the official EthShala logos and branding materials. These assets are intended for use in partnerships, community content, and media.
          </p>
        </div>

        {/* Integrated Branding Section */}
        <section className="space-y-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold border-b border-border pb-4">Integrated Branding</h2>
            <p className="text-sm text-muted-foreground">How we combine the visual mark and typography in our navigation components.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="flex flex-col !p-0 overflow-hidden border-border bg-white">
              <div className="p-4 border-b border-border">
                <Badge variant="neutral" className="text-slate-900 border-slate-200 bg-slate-50">Light Theme Usage</Badge>
              </div>
              <div className="h-40 flex items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 scale-125 pointer-events-none">
                  <div className="relative bottom-1.5 shrink-0">
                    <ThemedLogoGif
                      alt="EthShala"
                      width={45}
                      height={45}
                      unoptimized
                      lightSrc="/brand/ethshala_logo_black.svg"
                      darkSrc="/brand/ethshala_logo_black.svg"
                    />
                  </div>
                  <Logo />
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-slate-500 leading-relaxed">
                  The black visual mark is paired with the standard EthShala wordmark for high contrast on light surfaces.
                </p>
              </div>
            </Card>

            <Card className="flex flex-col !p-0 overflow-hidden border-white/5 bg-[#0a0c0b]">
              <div className="p-4 border-b border-white/5">
                <Badge variant="neutral" className="text-white border-white/10 bg-white/5">Dark Theme Usage</Badge>
              </div>
              <div className="h-40 flex items-center justify-center bg-[#121413]">
                <div className="flex items-center gap-3 scale-125 pointer-events-none">
                  <div className="relative bottom-1.5 shrink-0">
                    <ThemedLogoGif
                      alt="EthShala"
                      width={45}
                      height={45}
                      unoptimized
                      lightSrc="/brand/ethshala_logo_white.svg"
                      darkSrc="/brand/ethshala_logo_white.svg"
                    />
                  </div>
                  <Logo />
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-muted-foreground leading-relaxed text-center">
                  The white visual mark is paired with the standard wordmark for dark mode consistency.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Logos Grid */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold border-b border-border pb-4">Logos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ASSETS.map((asset) => (
              <Card key={asset.name} className="flex flex-col h-full !p-0 overflow-hidden">
                <div className={`h-48 flex items-center justify-center p-12 ${asset.background || "bg-muted/20"}`}>
                  <img src={asset.path} alt={asset.name} className="max-h-full max-w-full drop-shadow-sm" />
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div>
                    <h3 className="font-bold text-lg">{asset.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{asset.description}</p>
                  </div>
                  <div className="pt-4 mt-auto flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      href={asset.path}
                    >
                      <Download size={14} className="mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => copyToClipboard(asset.path, asset.name)}
                    >
                      {copied === asset.name ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold border-b border-border pb-4">Brand Colors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLORS.map((color) => (
              <Card key={color.name} className="flex flex-col !p-4">
                <div className={`h-24 w-full rounded-xl mb-4 shadow-inner ${color.class}`} />
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{color.name}</h4>
                    <p className="text-xs font-mono text-muted-foreground">{color.hex}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(color.hex, color.name)}
                  >
                    {copied === color.name ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="p-8 rounded-3xl bg-muted/20 border border-border">
          <h2 className="text-2xl font-bold mb-6">Usage Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-4">
              <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-[10px]">DO'S</h3>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>Use these files to link to ethshala.com.</li>
                <li>Ensure sufficient clear space around the logo.</li>
                <li>Maintain the original aspect ratio when resizing.</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-red-400 uppercase tracking-widest text-[10px]">DON'TS</h3>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>Rotate, skew, or distort the logo.</li>
                <li>Change the colors of the brand mark.</li>
                <li>Add shadows, glows, or text effects to the logo itself.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

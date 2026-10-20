import React from 'react';
import { Heart, Sparkles, ShieldCheck, MessageCircle } from 'lucide-react';
import { StoreSettings } from '../types/catalog';
import { cleanPhone } from '../utils/whatsapp';

interface HeroBannerProps {
  settings: StoreSettings;
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ settings, onExploreClick }) => {
  const logoGreen = settings.logoDarkUrl || './assets/aistudio/Logo---fundo-verde_affc199f.jpg';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#3C4D38] via-[#364332] to-[#2D392B] border-b border-[#4A5D44] py-12 md:py-16">
      {/* Subtle organic texture dots */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#F8F1EB_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
          
          {/* Left Column: Typography & Brand Narrative */}
          <div className="max-w-2xl text-center lg:text-left space-y-4">
            {/* Subtle Devotional Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#2D392B] border border-[#4E6349] rounded-full text-xs font-semibold text-[#E4EDE3] tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#DFC38A]" />
              <span>Artigos & Cartões Católicos Artesanais</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8F1EB] tracking-tight leading-[1.15] text-balance">
              Santinhos, Orações & Artigos Católicos Artesanais
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#CBD7CA] leading-relaxed">
              Santinhos devocionais em papel 180g texturizado (branco ou marfim). Modelos em borda arredondada, borda reta e borda rendada — 100 unidades por R$ 250,00. Encomendas com antecedência de 15 dias para sacramentos.
            </p>

            {/* Trust Highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-[#E4EDE3] font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#DFC38A]" />
                Artesanato Católico
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8CE29C]" />
                Papel 180g Texturizado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                Pedidos pelo WhatsApp
              </span>
            </div>

            {/* CTA */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onExploreClick}
                className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#273224] bg-[#F8F1EB] hover:bg-[#EDE3DA] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Conhecer o Catálogo ↓
              </button>
              <a
                href={`https://wa.me/${cleanPhone(settings.whatsappNumber)}?text=${encodeURIComponent('Olá! Gostaria de encomendar lembrancinhas ou santinhos personalizados.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#F8F1EB] bg-[#3B4D37] border border-[#4E6349] hover:bg-[#455840] rounded-lg transition-colors cursor-pointer"
              >
                Encomendas Personalizadas
              </a>
            </div>
          </div>

          {/* Right Column: Visual Brand Medallion Showcase */}
          <div className="relative shrink-0 flex items-center justify-center">
            {/* Soft decorative background rings */}
            <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-[#5A7354]/40 -z-0 animate-pulse" />
            <div className="absolute w-76 h-76 sm:w-84 sm:h-84 rounded-full border border-[#5A7354]/25 -z-0" />

            <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full p-2 bg-gradient-to-b from-[#344230] to-[#283425] shadow-2xl border-4 border-[#4E6349]">
              <div className="w-full h-full rounded-full overflow-hidden border border-[#5E7859]">
                <img
                  src={logoGreen}
                  alt="Identidade Visual O Tinteiro"
                  className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

'use client';

import {
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Target,
  Shield,
  Calendar,
  Award,
  Users,
} from 'lucide-react';
import Button from '../ui/Button';
import { QuizAnswers } from '../../types/quiz.types';
import Image from "next/image";

interface ResultScreenProps {
  answers: QuizAnswers;
  isVisible: boolean;
}

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

function trackGoal(goalName: string) {
  const visitorId = getCookie('datafast_visitor_id');
  if (!visitorId) return;

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId, name: goalName }),
  }).catch(() => {});
}

export default function ResultScreen({ answers, isVisible }: ResultScreenProps) {
  const getPersonalizedHeadline = () => {
    const age = answers.age as string;
    if (age === '60+') {
      return 'Auch mit 60+ ist es nicht zu spät!';
    }
    if (age === '50-60') {
      return 'Mit 50+ endlich das Bauchfett besiegen!';
    }
    return 'Dein Weg zum flachen Bauch startet jetzt!';
  };

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 overflow-y-auto bg-background">
      <div className="min-h-full px-5 py-8">
        <div className="max-w-lg mx-auto">
          {/* Success Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Analyse abgeschlossen
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3 leading-tight">
            {getPersonalizedHeadline()}
          </h1>

          <p className="text-lg text-paragraph text-center mb-8">
            Der <span className="font-semibold text-primary">Bauchfett-Killer 40+</span> ist
            genau das Richtige für dich.
          </p>

          {/* Problem Recognition */}
          <div className="bg-white rounded-2xl border border-border p-5 mb-6">
            <h3 className="font-bold text-foreground mb-4">
              Kommt dir das bekannt vor?
            </h3>
            <ul className="space-y-3 text-paragraph">
              <li className="flex items-start gap-3">
                <span className="text-xl">👖</span>
                <span>Deine Lieblingshose kneift und der Hosenbund drückt ständig</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">😔</span>
                <span>Du isst weniger als früher, aber der Bauch wird trotzdem nicht flacher</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">😫</span>
                <span>Diäten bringen nichts mehr – was früher funktioniert hat, klappt heute einfach nicht</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🪞</span>
                <span>Der Blick in den Spiegel frustriert dich, weil du dich nicht mehr wohlfühlst</span>
              </li>
            </ul>
          </div>

          {/* Solution - 3 Week Plan */}
          <div className="bg-primary/5 rounded-2xl p-5 mb-6 border-2 border-primary/20">
            <h3 className="font-bold text-foreground text-lg mb-2 text-center">
              Dein 3-Wochen-Plan
            </h3>
            <p className="text-paragraph text-center mb-5">
              Sichtbare Veränderung in Rekordzeit – ohne Diäten oder Verzicht.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-foreground">Woche 1 – Neustart</p>
                  <p className="text-sm text-muted-foreground">Stoffwechsel aktivieren & neue Energie</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-foreground">Woche 2 – Veränderung</p>
                  <p className="text-sm text-muted-foreground">Bauchumfang reduzieren & Motivation steigern</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-foreground">Woche 3 – Stabilität</p>
                  <p className="text-sm text-muted-foreground">Erfolge halten & Kontrolle gewinnen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coach Section */}
          <div className="bg-white rounded-2xl border border-border p-5 mb-6">
            <div className="flex items-center gap-4 mb-4">
              {/* Placeholder for coach image */}
              <Image src={"/asac.png"} alt={"Angela Sackau"} width={100} height={100} />
              <div>
                <p className="font-bold text-foreground">Angela Suckau</p>
                <p className="text-sm text-muted-foreground">Deine Expertin für Fettabbau</p>
              </div>
            </div>
            <p className="text-paragraph text-sm mb-4 italic">
              &ldquo;Ich begleite dich persönlich auf deinem Weg zu einem schlankeren Bauch
              und mehr Selbstbewusstsein. Du schaffst das – ich helfe dir dabei!&rdquo;
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-paragraph">1.000+ Teilnehmer</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-paragraph">5+ Jahre Erfahrung</span>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-white rounded-2xl border border-border p-5 mb-6">
            <h3 className="font-bold text-foreground mb-4">
              Das bekommst Du alles:
            </h3>
            <ul className="space-y-3">
              {[
                { icon: Calendar, text: '3-Wochen Schritt-für-Schritt Plan' },
                { icon: Shield, text: 'Umfangreiches Material im Mitgliederbereich' },
                { icon: Target, text: 'Fast 100 Tage Zugang zu allen Materialien' },
                { icon: Zap, text: 'Sofortiger Start möglich' },
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-paragraph">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div className="bg-muted rounded-2xl p-5 mb-6">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-paragraph italic mb-3">
              &ldquo;"Ich bin mit dem Ernährungscoaching extrem zufrieden und Angela hat mich zu außerordentlichen Ergebnissen geführt. Wenn es um das Thema Ernährung geht, ist Angela für mich absolut die Nummer Eins. Ich kann sie nur wärmstens empfehlen."&rdquo;
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              — Sylke S., 52 Jahre
            </p>
          </div>

          {/* Price Box */}
          <div className="bg-accent/10 rounded-2xl p-5 mb-6 border-2 border-accent/30">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">🔥</span>
              <span className="font-bold text-accent uppercase tracking-wide">Sonderangebot</span>
            </div>
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-3xl font-bold text-foreground">149€</span>
              <span className="text-xl text-muted-foreground line-through">394€</span>
            </div>
            <p className="text-center text-primary font-semibold mb-2">
              Du sparst 245€!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-paragraph">
              <Clock className="w-4 h-4 text-accent" />
              <span>Nur für kurze Zeit verfügbar</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            variant="accent"
            size="xl"
            className="w-full flex items-center justify-center gap-2 mb-4"
            onClick={() => {
              trackGoal('click_kaufen_bauchfettkiller');
              window.open('https://www.checkout-ds24.com/product/627581?voucher=bauchfettkiller149&aff=patrickkorb&cam=CAMPAIGNKEY', '_blank');
            }}
          >
            Jetzt für 149€ starten
            <ArrowRight className="w-5 h-5" />
          </Button>

          <Button
              variant="outline"
              size="md"
              className="w-full flex items-center justify-center gap-2 mb-4"
              onClick={() => {
                window.open(' https://bauchfettkiller.com/bauchfettkiller#aff=patrickkorb&cam=CAMPAIGNKEY', '_blank');
              }}
          >
            Mehr Infos
          </Button>



          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-6">
            <span>🚀 Sofortiger Zugang</span>
            <span>💳 Sichere Zahlung</span>
          </div>

          <p className="text-xs text-muted-foreground text-center mb-8">
            Hinweis: Keine medizinische Beratung – Ergebnisse können individuell variieren.
          </p>

          {/* Downsell Section */}
          <div className="border-t border-border pt-8">
            <p className="text-center text-muted-foreground text-sm mb-3">
              Noch nicht bereit für das volle Programm?
            </p>
            <div className="bg-muted/50 rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🌾</span>
                <h4 className="font-bold text-foreground">5-Tage Hafer Challenge</h4>
              </div>
              <p className="text-paragraph text-sm text-center mb-4">
                Starte mit unserer beliebten Hafer Challenge und erlebe in nur 5 Tagen
                einen flacheren Bauch – der perfekte Einstieg!
              </p>
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => {
                  trackGoal('click_hafer_challenge');
                  window.open('https://www.checkout-ds24.com/product/547409?voucher=challenge27&aff=patrickkorb&cam=CAMPAIGNKEY', '_blank');
                }}
              >
                Zur 5-Tage Hafer Challenge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

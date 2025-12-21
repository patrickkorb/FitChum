import { Dumbbell, Users, Trophy, Calendar, Zap } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Daily Workout Feed',
    description: 'Sieh in Echtzeit, was deine Freunde heute trainieren und lass dich inspirieren',
  },
  {
    icon: <Dumbbell className="w-6 h-6" />,
    title: 'Workout Check-Ins',
    description: 'Logge deine Workouts und benachrichtige automatisch deine Freunde',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Social Motivation',
    description: 'Pushe deine Freunde zum Training und feiert eure Erfolge zusammen',
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Flex deine Erfolge',
    description: 'Teile neue PRs, Workout-Streaks und Meilensteine mit deiner Community',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Community Accountability',
    description: 'Authentisch und motivierend - BeReal für Fitness',
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Dein Fitness-Journey wird <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">sozial</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            FitChumm verbindet dich mit deinen Freunden und macht aus jedem Workout ein gemeinsames Erlebnis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 border border-transparent hover:border-primary/20"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

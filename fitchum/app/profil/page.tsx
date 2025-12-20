import ProfileHeader from '@/components/profile/ProfileHeader';
import WorkoutHeatmap from '@/components/profile/WorkoutHeatmap';

// Mock data - später durch echte Daten ersetzen
const mockUserData = {
  username: 'Patrick Korb',
  avatarUrl: 'https://i.pravatar.cc/150?img=33',
  bio: 'FitChumm Gründer der nicht fett sein will',
};

// Mock workout data für Heatmap (letzten 365 Tage)
const generateMockWorkoutData = () => {
  const data: { date: string; count: number }[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Zufällige Workouts (0-2 pro Tag für Realismus)
    const count = Math.random() > 0.6 ? Math.floor(Math.random() * 3) : 0;

    data.push({
      date: date.toISOString().split('T')[0],
      count,
    });
  }

  return data;
};

const mockWorkoutData = generateMockWorkoutData();

export default function ProfilPage() {
  return (
    <div className="min-h-screen max-w-[100vw] bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProfileHeader
          username={mockUserData.username}
          avatarUrl={mockUserData.avatarUrl}
          bio={mockUserData.bio}
        />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Workout Consistency</h2>
          <WorkoutHeatmap data={mockWorkoutData} />
        </div>
      </div>
    </div>
  );
}

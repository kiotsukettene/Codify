import Typewriter from '@/components/fancy/typewriter';
import { useAuthStore } from '@/store/authStore';

function AdminDashboard() {

  const { institution } = useAuthStore();
  return (
    <div className="lg:text-2xl sm:text-3xl text-2xl flex flex-row items-start justify-start text-foreground dark:text-muted font-normal overflow-hidden p-6">
      <p className="whitespace-pre-wrap">
        <span>{`Welcome to Codify, ${institution.institutionName}🌞 `}</span>
        <br />
        <Typewriter
          text={[
            "Welcome to Codify Admin",
            "Manage your platform easily!",
            "Let's keep things organized!",
            "Keep shining 🌟",
            "Stay on top of everything!",
          ]}
          speed={70}
          className="text-primary font-semibold"
          waitTime={1500}
          deleteSpeed={40}
          cursorChar={"_"}
        />
      </p>
    </div>
  );
}

export default AdminDashboard;

import Header from "@/components/Header";
import UserProfile from "@/components/UserProfile";

const Profile = () => {
  // Mock user data
  const currentUser = {
    id: "1",
    name: "María González",
    username: "maria_designs",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c75?w=150&h=150&fit=crop",
    bio: "Diseñadora UI/UX apasionada por crear experiencias digitales únicas. Amante del arte y la naturaleza 🎨🌿",
    followersCount: 1250,
    followingCount: 430,
    pinsCount: 89
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <UserProfile user={currentUser} isOwnProfile={true} />
      </main>
    </div>
  );
};

export default Profile;